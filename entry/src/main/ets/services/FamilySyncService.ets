import { abilityAccessCtrl, common } from '@kit.AbilityKit';
import { distributedKVStore } from '@kit.ArkData';
import { distributedDeviceManager } from '@kit.DistributedServiceKit';
import { DBManager } from '../data/DBManager';
import { CarbonRecord } from '../domain/CarbonTypes';
import { FactorRepository } from '../domain/FactorRepository';

const BUNDLE_NAME = 'com.carbonmate.openharmony';
const FAMILY_CODE_SETTING = 'familySyncCode';
const FAMILY_MEMBER_ID_SETTING = 'familySyncMemberId';
const FAMILY_MEMBER_NAME_SETTING = 'familySyncMemberName';
const FAMILY_STATUS_SETTING = 'familySyncStatus';
const PERMISSION = 'ohos.permission.DISTRIBUTED_DATASYNC';
const EVENT_PREFIX = 'evt_';

export interface SharedFamilyEvent {
  id: string;
  memberId: string;
  memberName: string;
  type: 'record' | 'points';
  behaviorType: string;
  behaviorName: string;
  activityValue: number;
  activityUnit: string;
  factorId: string;
  factorVersion: string;
  factorSource: string;
  reductionKg: number;
  pointsDelta: number;
  createdAt: number;
  deleted: boolean;
}

export interface FamilyMemberSummary {
  id: string;
  name: string;
  recordCount: number;
  points: number;
}

export interface FamilySnapshot {
  code: string;
  memberName: string;
  totalRecords: number;
  estimatedReductionKg: number;
  pointsBalance: number;
  members: FamilyMemberSummary[];
}

export interface FamilyDevice {
  id: string;
  name: string;
}

export interface FamilySyncResult {
  message: string;
  deviceCount: number;
}

interface FamilyConfig {
  code: string;
  memberId: string;
  memberName: string;
}

export class FamilySyncService {
  private static instance: FamilySyncService;
  private context: common.UIAbilityContext | null = null;
  private manager: distributedKVStore.KVManager | null = null;
  private activeStore: distributedKVStore.SingleKVStore | null = null;
  private activeStoreCode: string = '';
  private syncListeners: Array<(message: string) => void> = [];
  private syncHandler: (results: Array<[string, number]>) => void = (results: Array<[string, number]>) => {
    const message = `系统已返回 ${results.length} 台设备的同步结果；可刷新家庭汇总查看最新数据。`;
    void this.setStatus(message).catch(() => {});
    this.syncListeners.forEach((listener: (message: string) => void) => listener(message));
  };

  private constructor() {}

  static getInstance(): FamilySyncService {
    if (!FamilySyncService.instance) FamilySyncService.instance = new FamilySyncService();
    return FamilySyncService.instance;
  }

  initialize(context: common.UIAbilityContext): void {
    this.context = context;
  }

  subscribeSyncStatus(listener: (message: string) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((item: (message: string) => void) => item !== listener);
    };
  }

  async currentCode(): Promise<string> {
    return DBManager.getInstance().getSetting(FAMILY_CODE_SETTING);
  }

  async currentMemberName(): Promise<string> {
    return DBManager.getInstance().getSetting(FAMILY_MEMBER_NAME_SETTING);
  }

  async currentStatus(): Promise<string> {
    return DBManager.getInstance().getSetting(FAMILY_STATUS_SETTING);
  }

  async createFamily(memberName: string): Promise<string> {
    const code = this.makeInviteCode();
    await this.configureFamily(code, memberName);
    return code;
  }

  async joinFamily(inviteCode: string, memberName: string): Promise<string> {
    const code = inviteCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[A-Z0-9]{10}$/.test(code)) throw new Error('邀请码应为 10 位字母或数字');
    await this.configureFamily(code, memberName);
    return code;
  }

  private async configureFamily(code: string, memberName: string): Promise<void> {
    const context = this.requireContext();
    const cleanName = memberName.trim().slice(0, 20);
    if (!cleanName) throw new Error('请先设置家庭成员昵称');
    await this.ensurePermission(context);

    const db = DBManager.getInstance();
    const existingCode = await db.getSetting(FAMILY_CODE_SETTING);
    if (existingCode && existingCode !== code) throw new Error('此设备已加入其他家庭空间，请先退出后再加入');

    let memberId = await db.getSetting(FAMILY_MEMBER_ID_SETTING);
    if (!memberId || existingCode !== code) memberId = `member_${this.makeInviteCode()}`;
    await db.setSetting(FAMILY_CODE_SETTING, code);
    await db.setSetting(FAMILY_MEMBER_ID_SETTING, memberId);
    await db.setSetting(FAMILY_MEMBER_NAME_SETTING, cleanName);
    await db.setSetting(FAMILY_STATUS_SETTING, '家庭共享已开启；正在准备本机记录。');

    const store = await this.openStore(code);
    const records = await db.queryRecent(10000);
    for (const record of records) {
      await store.put(this.recordKey(record.id), JSON.stringify(this.toRecordEvent(record, memberId, cleanName)));
    }
    const redemptions = await db.listDigitalRedemptions();
    for (const redemption of redemptions) {
      const event: SharedFamilyEvent = {
        id: redemption.id,
        memberId,
        memberName: cleanName,
        type: 'points',
        behaviorType: '',
        behaviorName: '积分兑换',
        activityValue: 0,
        activityUnit: '',
        factorId: '',
        factorVersion: '',
        factorSource: '',
        reductionKg: 0,
        pointsDelta: -redemption.cost,
        createdAt: redemption.createdAt,
        deleted: false
      };
      await store.put(`${EVENT_PREFIX}points_${redemption.id}`, JSON.stringify(event));
    }
    await this.syncTrustedDevices(code, store);
  }

  async disableFamily(): Promise<void> {
    const db = DBManager.getInstance();
    await db.setSetting(FAMILY_CODE_SETTING, '');
    await db.setSetting(FAMILY_MEMBER_ID_SETTING, '');
    await db.setSetting(FAMILY_STATUS_SETTING, '已在本机关闭家庭同步；此前已同步到其他设备的记录不会被远程删除。');
  }

  async syncNow(): Promise<FamilySyncResult> {
    const context = this.requireContext();
    const code = await this.currentCode();
    if (!code) throw new Error('请先创建或加入家庭空间');
    await this.ensurePermission(context);
    const store = await this.openStore(code);
    return this.syncTrustedDevices(code, store);
  }

  async snapshot(): Promise<FamilySnapshot | null> {
    const code = await this.currentCode();
    if (!code) return null;
    const store = await this.openStore(code);
    const entries = await store.getEntries(EVENT_PREFIX);
    const events: SharedFamilyEvent[] = [];
    for (const entry of entries) {
      if (typeof entry.value !== 'string') continue;
      try {
        const event = JSON.parse(entry.value) as SharedFamilyEvent;
        if (event && typeof event.id === 'string' && typeof event.memberId === 'string' &&
          typeof event.memberName === 'string' && (event.type === 'record' || event.type === 'points') &&
          typeof event.pointsDelta === 'number' && typeof event.createdAt === 'number' && !event.deleted) {
          events.push(event);
        }
      } catch (_) {}
    }

    const members: FamilyMemberSummary[] = [];
    let estimatedReductionKg = 0;
    let pointsBalance = 0;
    let totalRecords = 0;
    events.forEach((event: SharedFamilyEvent) => {
      let member = members.find((item: FamilyMemberSummary) => item.id === event.memberId);
      if (!member) {
        const newMember: FamilyMemberSummary = {
          id: event.memberId,
          name: event.memberName,
          recordCount: 0,
          points: 0
        };
        member = newMember;
        members.push(member);
      }
      member.points += event.pointsDelta;
      pointsBalance += event.pointsDelta;
      if (event.type === 'record') {
        totalRecords += 1;
        member.recordCount += 1;
        if (FactorRepository.isEstimated(event.factorId, event.factorVersion)) {
          estimatedReductionKg += Math.max(0, event.reductionKg);
        }
      }
    });

    return {
      code,
      memberName: await this.currentMemberName(),
      totalRecords,
      estimatedReductionKg: Math.round(estimatedReductionKg * 1000) / 1000,
      pointsBalance: Math.max(0, pointsBalance),
      members: members.sort((a: FamilyMemberSummary, b: FamilyMemberSummary) => b.points - a.points)
    };
  }

  async publishRecord(record: CarbonRecord): Promise<void> {
    const config = await this.currentConfig();
    if (!config.code || !config.memberId || !config.memberName) return;
    try {
      const store = await this.openStore(config.code);
      await store.put(this.recordKey(record.id), JSON.stringify(this.toRecordEvent(record, config.memberId, config.memberName)));
      void this.syncTrustedDevices(config.code, store).catch(() => {});
    } catch (_) {
      await this.setStatus('行动已保存在本机；家庭同步暂未成功，可稍后手动重试。');
    }
  }

  async publishRecordDeletion(recordId: string): Promise<void> {
    const config = await this.currentConfig();
    if (!config.code || !config.memberId || !config.memberName) return;
    try {
      const store = await this.openStore(config.code);
      const tombstone: SharedFamilyEvent = {
        id: recordId,
        memberId: config.memberId,
        memberName: config.memberName,
        type: 'record',
        behaviorType: '',
        behaviorName: '',
        activityValue: 0,
        activityUnit: '',
        factorId: '',
        factorVersion: '',
        factorSource: '',
        reductionKg: 0,
        pointsDelta: 0,
        createdAt: Date.now(),
        deleted: true
      };
      await store.put(this.recordKey(recordId), JSON.stringify(tombstone));
      void this.syncTrustedDevices(config.code, store).catch(() => {});
    } catch (_) {
      await this.setStatus('删除已在本机完成；家庭设备暂未收到更新，可稍后手动同步。');
    }
  }

  async publishPointsAdjustment(redemptionId: string, pointsDelta: number): Promise<void> {
    const config = await this.currentConfig();
    if (!config.code || !config.memberId || !config.memberName || !Number.isFinite(pointsDelta)) return;
    try {
      const store = await this.openStore(config.code);
      const event: SharedFamilyEvent = {
        id: redemptionId,
        memberId: config.memberId,
        memberName: config.memberName,
        type: 'points',
        behaviorType: '',
        behaviorName: '积分兑换',
        activityValue: 0,
        activityUnit: '',
        factorId: '',
        factorVersion: '',
        factorSource: '',
        reductionKg: 0,
        pointsDelta,
        createdAt: Date.now(),
        deleted: false
      };
      await store.put(`${EVENT_PREFIX}points_${redemptionId}`, JSON.stringify(event));
      void this.syncTrustedDevices(config.code, store).catch(() => {});
    } catch (_) {
      await this.setStatus('积分已在本机更新；家庭同步暂未成功，可稍后手动重试。');
    }
  }

  private async currentConfig(): Promise<FamilyConfig> {
    const db = DBManager.getInstance();
    return {
      code: await db.getSetting(FAMILY_CODE_SETTING),
      memberId: await db.getSetting(FAMILY_MEMBER_ID_SETTING),
      memberName: await db.getSetting(FAMILY_MEMBER_NAME_SETTING)
    };
  }

  private async syncTrustedDevices(
    code: string,
    store: distributedKVStore.SingleKVStore
  ): Promise<FamilySyncResult> {
    const context = this.requireContext();
    if (!(await this.hasPermission(context))) {
      const message = '家庭记录已保存到本机；同步权限不可用，请在系统设置中重新授权。';
      await this.setStatus(message);
      return { message, deviceCount: 0 };
    }
    const deviceManager = distributedDeviceManager.createDeviceManager(BUNDLE_NAME);
    let devices: Array<distributedDeviceManager.DeviceBasicInfo> = [];
    try {
      devices = await deviceManager.getAvailableDeviceList();
    } finally {
      distributedDeviceManager.releaseDeviceManager(deviceManager);
    }
    const networkIds = devices.filter((device: distributedDeviceManager.DeviceBasicInfo) => !!device.networkId)
      .map((device: distributedDeviceManager.DeviceBasicInfo) => device.networkId as string);
    if (networkIds.length === 0) {
      const message = '家庭数据已安全保存在本机；还没有发现可信设备，请先在鸿蒙系统中连接另一台设备。';
      await this.setStatus(message);
      return { message, deviceCount: 0 };
    }
    this.attachSyncListener(code, store);
    store.sync(networkIds, distributedKVStore.SyncMode.PUSH_PULL);
    const message = `已向 ${networkIds.length} 台可信设备发起家庭同步；传输完成后可刷新汇总。`;
    await this.setStatus(message);
    return { message, deviceCount: networkIds.length };
  }

  private attachSyncListener(code: string, store: distributedKVStore.SingleKVStore): void {
    if (this.activeStoreCode === code && this.activeStore === store) return;
    store.on('syncComplete', this.syncHandler);
    this.activeStoreCode = code;
    this.activeStore = store;
  }

  private async ensurePermission(context: common.UIAbilityContext): Promise<void> {
    const accessManager = abilityAccessCtrl.createAtManager();
    const accessTokenId = context.applicationInfo.accessTokenId;
    if (accessManager.checkAccessTokenSync(accessTokenId, PERMISSION) === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) return;
    const result = await accessManager.requestPermissionsFromUser(context, [PERMISSION]);
    if (result.authResults.length === 0 || result.authResults[0] !== abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
      throw new Error('未获得家庭同步授权；未开启同步，也未向可信设备发送记录');
    }
  }

  private async hasPermission(context: common.UIAbilityContext): Promise<boolean> {
    try {
      return abilityAccessCtrl.createAtManager().checkAccessTokenSync(
        context.applicationInfo.accessTokenId,
        PERMISSION
      ) === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
    } catch (_) {
      return false;
    }
  }

  private async openStore(code: string): Promise<distributedKVStore.SingleKVStore> {
    const context = this.requireContext();
    if (!this.manager) {
      const managerConfig: distributedKVStore.KVManagerConfig = { bundleName: BUNDLE_NAME, context };
      this.manager = distributedKVStore.createKVManager(managerConfig);
    }
    const storeId = `family_${code}`;
    const options: distributedKVStore.Options = {
      createIfMissing: true,
      encrypt: true,
      backup: false,
      autoSync: false,
      kvStoreType: distributedKVStore.KVStoreType.DEVICE_COLLABORATION,
      securityLevel: distributedKVStore.SecurityLevel.S2
    };
    return this.manager.getKVStore<distributedKVStore.SingleKVStore>(storeId, options);
  }

  private toRecordEvent(record: CarbonRecord, memberId: string, memberName: string): SharedFamilyEvent {
    return {
      id: record.id,
      memberId,
      memberName,
      type: 'record',
      behaviorType: record.behaviorType,
      behaviorName: record.behaviorName,
      activityValue: record.activityValue,
      activityUnit: record.activityUnit,
      factorId: record.factorId,
      factorVersion: record.factorVersion,
      factorSource: record.factorSource,
      reductionKg: record.reductionKg,
      pointsDelta: record.points,
      createdAt: record.createdAt,
      deleted: false
    };
  }

  private recordKey(recordId: string): string {
    return `${EVENT_PREFIX}record_${recordId}`;
  }

  private makeInviteCode(): string {
    const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9'];
    let code = '';
    for (let i = 0; i < 10; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    return code;
  }

  private async setStatus(message: string): Promise<void> {
    await DBManager.getInstance().setSetting(FAMILY_STATUS_SETTING, message);
  }

  private requireContext(): common.UIAbilityContext {
    if (!this.context) throw new Error('家庭同步服务尚未初始化，请重新打开应用后重试');
    return this.context;
  }
}
