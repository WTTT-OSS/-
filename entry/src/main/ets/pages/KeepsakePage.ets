import { common } from '@kit.AbilityKit';
import { fileIo, fileUri } from '@kit.CoreFileKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { CarbonRecord, CarbonSummary } from '../domain/CarbonTypes';
import { CarbonRecordService } from '../services/CarbonRecordService';
import { DBManager } from '../data/DBManager';
import type { DigitalRedemption } from '../data/DBManager';
import { TaskEngine } from '../domain/TaskEngine';
import type { DailyTask } from '../domain/CarbonTypes';
import { TaskRow } from '../components/TaskRow';
import { AIRecognitionService } from '../services/AIRecognitionService';
import { FamilySyncService } from '../services/FamilySyncService';
import type { FamilyMemberSummary, FamilySnapshot } from '../services/FamilySyncService';

interface BadgeRule {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  target: number;
}

interface DigitalReward {
  id: string;
  title: string;
  description: string;
  category: string;
  cost: number;
  accent: string;
}

const BADGES: BadgeRule[] = [
  { id: 'first-note', title: '落下第一笔', subtitle: '完成第一条低碳行动记录', metric: 'records', target: 1 },
  { id: 'seven-days', title: '一周有绿意', subtitle: '在 7 个不同日期留下行动', metric: 'days', target: 7 },
  { id: 'three-ways', title: '生活多面手', subtitle: '尝试 3 类不同的低碳行动', metric: 'types', target: 3 },
  { id: 'ten-trips', title: '绿色出发', subtitle: '记录 10 次步行、骑行或公共交通', metric: 'travel', target: 10 },
  { id: 'reuse-five', title: '旧物新生', subtitle: '记录 5 次旧物再利用或规范回收', metric: 'reuse', target: 5 },
  { id: 'twenty-notes', title: '日常观察者', subtitle: '累计完成 20 条行动记录', metric: 'records', target: 20 },
  { id: 'food-five', title: '惜食行动派', subtitle: '记录 5 次减少食物浪费行动', metric: 'food', target: 5 },
  { id: 'course-half', title: '循序求知', subtitle: '完成 3 个双碳学习专题', metric: 'courses', target: 3 },
  { id: 'three-days', title: '三日新绿', subtitle: '在 3 个不同日期留下行动', metric: 'days', target: 3 },
  { id: 'thirty-days', title: '长久有约', subtitle: '累计 30 个行动日', metric: 'days', target: 30 },
  { id: 'five-ways', title: '多元践行者', subtitle: '尝试 5 类不同的低碳行动', metric: 'types', target: 5 },
  { id: 'fifty-notes', title: '认真记录者', subtitle: '累计完成 50 条行动记录', metric: 'records', target: 50 },
  { id: 'thirty-trips', title: '绿色常行', subtitle: '记录 30 次步行、骑行或公共交通', metric: 'travel', target: 30 },
  { id: 'reuse-twenty', title: '循环生活家', subtitle: '记录 20 次旧物再利用或规范回收', metric: 'reuse', target: 20 },
  { id: 'food-twenty', title: '惜食有方', subtitle: '记录 20 次减少食物浪费行动', metric: 'food', target: 20 },
  { id: 'course-finish', title: '知行同行', subtitle: '完成全部双碳学习专题', metric: 'courses', target: 6 }
];

const REWARDS: DigitalReward[] = [
  { id: 'certificate-tree', title: '植树证书', description: '记录本期累计减碳量，以数字证书形式留存；标注为纪念性质，不代表真实植树或碳汇核证。', category: '数字证书', cost: 100, accent: '#5E7B4F' },
  { id: 'certificate-practice', title: '低碳实践记录证书', description: '汇总本机保存的行动条数、行动日与类别，作为个人回顾纪念。', category: '数字证书', cost: 80, accent: '#A88A4E' },
  { id: 'certificate-month', title: '连续行动纪念证书', description: '记录持续参与的时间与行动成果，不代表第三方认证。', category: '数字证书', cost: 120, accent: '#658067' },
  { id: 'memory-river', title: '溪流同行纪念卡', description: '一张可收藏的数字纪念卡，留住你的行动节点。', category: '数字纪念卡', cost: 35, accent: '#568277' },
  { id: 'title-seedling', title: '微光践行者', description: '点亮个人页的数字称号，记录持续行动的心意。', category: '数字称号', cost: 50, accent: '#73875D' },
  { id: 'title-keeper', title: '绿色生活记录官', description: '属于认真记录者的个人数字称号。', category: '数字称号', cost: 90, accent: '#94764E' },
  { id: 'theme-paper', title: '山野手札主题', description: '为个人成就页换上一份纸感自然主题。', category: '数字主题', cost: 65, accent: '#6F8065' }
];

@Component
struct MedalBadge {
  @Prop title: string = '';
  @Prop subtitle: string = '';
  @Prop progress: number = 0;
  @Prop target: number = 1;
  @Prop unlocked: boolean = false;
  @State angle: number = 0;

  build() {
    Row({ space: 12 }) {
      Stack({ alignContent: Alignment.Center }) {
        Row()
          .width(54)
          .height(54)
          .backgroundColor(this.unlocked ? '#E8E1C7' : '#E9E9E1')
          .borderRadius(27)
          .border({ width: 2, color: this.unlocked ? '#A88A4E' : '#B8BDB4' })
        Row()
          .width(40)
          .height(40)
          .backgroundColor(this.unlocked ? '#F7F3E6' : '#F4F3EE')
          .borderRadius(20)
          .border({ width: 1, color: this.unlocked ? '#D0BD83' : '#D4D7D0' })
        Text(this.unlocked ? this.title.substring(0, 1) : '·')
          .fontSize(this.unlocked ? 13 : 23)
          .fontWeight(FontWeight.Bold)
          .fontColor(this.unlocked ? '#78643A' : '#91978E')
      }
      .width(56)
      .height(56)
      .rotate({ angle: this.angle })
      .animation({ duration: 5000, curve: Curve.Linear })
      .onClick(() => this.angle = this.angle === 0 ? 360 : 0)

      Column({ space: 4 }) {
        Row() {
          Text(this.title)
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
            .layoutWeight(1)
          Text(this.unlocked ? '已收入' : `${Math.min(this.progress, this.target)}/${this.target}`)
            .fontSize(12)
            .fontColor(this.unlocked ? '#8A7544' : '#69766C')
        }
        .width('100%')
        Text(this.subtitle)
          .fontSize(12)
          .fontColor('#677368')
          .width('100%')
        Progress({ value: Math.min(this.progress, this.target), total: this.target, type: ProgressType.Linear })
          .width('100%')
          .height(5)
          .color(this.unlocked ? '#A88A4E' : '#71866C')
          .backgroundColor('#E6E6DC')
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(13)
    .backgroundColor('#FFFDF8')
    .borderRadius(12)
  }
}

@Component
export struct KeepsakePage {
  @StorageLink('recordRevision') @Watch('onRecordRevisionChanged') recordRevision: number = 0;
  @State records: CarbonRecord[] = [];
  @State summary: CarbonSummary = { totalReductionKg: 0, totalPoints: 0, recordCount: 0, todayReductionKg: 0, estimatedRecordCount: 0, verifiedRecordCount: 0, unestimatedRecordCount: 0, todayEstimateCount: 0 };
  @State completedCourses: string[] = [];
  @State tasks: DailyTask[] = [];
  @State redemptions: DigitalRedemption[] = [];
  @State message: string = '';
  @State selectedCertificate: DigitalRedemption | null = null;
  @State profileName: string = '碳伴用户';
  @State profileNameDraft: string = '碳伴用户';
  @State avatarPath: string = '';
  @State settingsOpen: boolean = false;
  @State settingsMessage: string = '';
  @State aiGatewayUrl: string = '';
  @State aiClientToken: string = '';
  @State isSavingSettings: boolean = false;
  @State isCheckingGateway: boolean = false;
  @State familyOpen: boolean = false;
  @State familyCode: string = '';
  @State familyCodeDraft: string = '';
  @State familyMemberNameDraft: string = '';
  @State familyStatus: string = '';
  @State familyRecords: number = 0;
  @State familyReductionKg: number = 0;
  @State familyPoints: number = 0;
  @State familyMembers: FamilyMemberSummary[] = [];
  @State isFamilyBusy: boolean = false;
  private removeFamilySyncListener: (() => void) | null = null;

  aboutToAppear(): void {
    this.removeFamilySyncListener = FamilySyncService.getInstance().subscribeSyncStatus((message: string) => {
      this.familyStatus = message;
      void this.refreshFamilySnapshot();
    });
    this.refresh();
  }

  aboutToDisappear(): void {
    if (this.removeFamilySyncListener) this.removeFamilySyncListener();
    this.removeFamilySyncListener = null;
  }

  onRecordRevisionChanged(): void { this.refresh(); }

  private async refresh(): Promise<void> {
    try {
      const service = CarbonRecordService.getInstance();
      this.records = await service.recentRecords(100000);
      this.tasks = TaskEngine.buildTodayTasks(this.records);
      this.summary = await service.summary();
      this.completedCourses = await DBManager.getInstance().completedCourseIds();
      this.redemptions = await DBManager.getInstance().listDigitalRedemptions();
      const db = DBManager.getInstance();
      this.profileName = await db.getSetting('profileName') || '碳伴用户';
      this.profileNameDraft = this.profileName;
      this.avatarPath = await db.getSetting('profileAvatarPath');
      this.aiGatewayUrl = await db.getSetting('aiGatewayUrl');
      this.aiClientToken = await db.getSetting('aiClientToken');
      this.familyMemberNameDraft = this.profileName;
    } catch (_) {
      this.message = '成就数据暂时无法读取，请稍后重试';
    }
    try {
      await this.refreshFamilySnapshot();
    } catch (_) {
      this.familyStatus = '家庭汇总暂时无法读取；本机低碳记录不受影响。';
    }
  }

  private async refreshFamilySnapshot(): Promise<void> {
    const family = FamilySyncService.getInstance();
    this.familyCode = await family.currentCode();
    if (!this.familyCode) {
      this.familyRecords = 0;
      this.familyReductionKg = 0;
      this.familyPoints = 0;
      this.familyMembers = [];
      this.familyStatus = await family.currentStatus();
      return;
    }
    this.familyCodeDraft = this.familyCode;
    this.familyMemberNameDraft = await family.currentMemberName() || this.profileName;
    this.familyStatus = await family.currentStatus();
    const snapshot: FamilySnapshot | null = await family.snapshot();
    if (!snapshot) return;
    this.familyRecords = snapshot.totalRecords;
    this.familyReductionKg = snapshot.estimatedReductionKg;
    this.familyPoints = snapshot.pointsBalance;
    this.familyMembers = snapshot.members;
  }

  private prepareFamilySetup(createNew: boolean): void {
    if (this.isFamilyBusy) return;
    const memberName = this.familyMemberNameDraft.trim();
    if (!memberName) {
      this.familyStatus = '请填写本机在家庭空间中显示的昵称';
      return;
    }
    if (!createNew && !/^[A-Za-z0-9\s-]{10,20}$/.test(this.familyCodeDraft.trim())) {
      this.familyStatus = '请输入家庭成员分享给你的 10 位邀请码';
      return;
    }
    this.getUIContext().showAlertDialog({
      title: createNew ? '创建家庭共享空间' : '加入家庭共享空间',
      message: '继续后，本机现有和今后的低碳记录会同步到当前系统中可用的鸿蒙可信设备，供家庭统计。共享内容包括行动类别、活动量、估算口径、积分、日期和本机昵称；不会同步照片、备注、AI 识别草稿或 DeepSeek 密钥。家庭邀请码用于区分应用内的共享空间；请确认当前系统可信设备均可接收这些数据。数据不上传到 CarbonMate 云端。',
      primaryButton: {
        value: '同意并继续',
        action: () => { void this.setupFamily(createNew); }
      },
      secondaryButton: { value: '暂不加入', action: () => {} }
    });
  }

  private async setupFamily(createNew: boolean): Promise<void> {
    if (this.isFamilyBusy) return;
    this.isFamilyBusy = true;
    this.familyStatus = '正在申请系统授权并准备家庭空间…';
    try {
      const family = FamilySyncService.getInstance();
      const code = createNew
        ? await family.createFamily(this.familyMemberNameDraft)
        : await family.joinFamily(this.familyCodeDraft, this.familyMemberNameDraft);
      this.familyCode = code;
      this.familyCodeDraft = code;
      await this.refreshFamilySnapshot();
      if (createNew) this.familyStatus = `家庭邀请码：${code}。请只分享给希望加入的家庭设备。`;
      else this.familyStatus = '已加入家庭空间；本机历史记录正在同步。';
    } catch (error) {
      this.familyStatus = error instanceof Error ? error.message : '家庭空间设置失败，请重试';
    } finally {
      this.isFamilyBusy = false;
    }
  }

  private async syncFamily(): Promise<void> {
    if (this.isFamilyBusy) return;
    this.isFamilyBusy = true;
    this.familyStatus = '正在查找可信设备…';
    try {
      const result = await FamilySyncService.getInstance().syncNow();
      this.familyStatus = result.message;
      await this.refreshFamilySnapshot();
      this.familyStatus = result.message;
    } catch (error) {
      this.familyStatus = error instanceof Error ? error.message : '同步未完成，请检查设备连接与授权';
    } finally {
      this.isFamilyBusy = false;
    }
  }

  private confirmDisableFamily(): void {
    this.getUIContext().showAlertDialog({
      title: '关闭本机家庭同步？',
      message: '关闭后本机不再发送新记录。已经同步到其他设备的数据不会被远程撤回，本机家庭数据副本也会保留；如需删除，请在各设备分别管理。',
      primaryButton: {
        value: '关闭同步',
        action: () => {
          void FamilySyncService.getInstance().disableFamily().then(() => this.refreshFamilySnapshot())
            .catch(() => this.familyStatus = '关闭失败，请稍后重试');
        }
      },
      secondaryButton: { value: '继续同步', action: () => {} }
    });
  }

  private async chooseAvatar(): Promise<void> {
    try {
      const options = new photoAccessHelper.PhotoSelectOptions();
      options.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      options.maxSelectNumber = 1;
      const selected = await new photoAccessHelper.PhotoViewPicker().select(options);
      if (selected.photoUris.length === 0) return;
      const source = fileIo.openSync(selected.photoUris[0], fileIo.OpenMode.READ_ONLY);
      const suffix = selected.photoUris[0].toLowerCase().split('?')[0].split('.').pop() || 'jpg';
      const extension = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(suffix) ? suffix : 'jpg';
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const destination = `${context.filesDir}/profile_avatar_${Date.now()}.${extension}`;
      try { fileIo.copyFileSync(source.fd, destination); } finally { fileIo.closeSync(source); }
      this.avatarPath = destination;
      await DBManager.getInstance().setSetting('profileAvatarPath', destination);
      this.settingsMessage = '头像已更换并保存在本机';
    } catch (_) {
      this.settingsMessage = '头像更换失败；请重新选择一张本机照片';
    }
  }

  private async saveSettings(): Promise<void> {
    const name = this.profileNameDraft.trim();
    if (name.length === 0 || name.length > 20) {
      this.settingsMessage = '昵称请填写 1–20 个字符';
      return;
    }
    if ((this.aiGatewayUrl.trim().length > 0) !== (this.aiClientToken.trim().length > 0)) {
      this.settingsMessage = '网关地址和客户端令牌需要同时填写，或同时留空';
      return;
    }
    this.isSavingSettings = true;
    try {
      const db = DBManager.getInstance();
      await db.setSetting('profileName', name);
      await db.setSetting('aiGatewayUrl', this.aiGatewayUrl.trim());
      await db.setSetting('aiClientToken', this.aiClientToken.trim());
      this.profileName = name;
      this.settingsMessage = '设置已保存到本机；DeepSeek API Key 仍只保存在网关电脑上';
    } catch (_) {
      this.settingsMessage = '设置保存失败，请重试';
    } finally {
      this.isSavingSettings = false;
    }
  }

  private async testGateway(): Promise<void> {
    if (this.isCheckingGateway) return;
    this.isCheckingGateway = true;
    this.settingsMessage = '正在检查识别网关…';
    try {
      this.settingsMessage = await AIRecognitionService.checkGateway(this.aiGatewayUrl, this.aiClientToken);
    } catch (error) {
      this.settingsMessage = error instanceof Error ? error.message : '连接失败，请检查地址、令牌和网络';
    } finally {
      this.isCheckingGateway = false;
    }
  }

  private badgeProgress(badge: BadgeRule): number {
    if (badge.metric === 'records') return this.records.length;
    if (badge.metric === 'days') {
      const days: string[] = [];
      this.records.forEach((record: CarbonRecord) => {
        const date = new Date(record.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!days.includes(key)) days.push(key);
      });
      return days.length;
    }
    if (badge.metric === 'types') {
      const types: string[] = [];
      this.records.forEach((record: CarbonRecord) => { if (!types.includes(record.behaviorType)) types.push(record.behaviorType); });
      return types.length;
    }
    if (badge.metric === 'travel') return this.records.filter((row: CarbonRecord) => ['BICYCLE', 'WALK', 'BUS', 'METRO'].includes(row.behaviorType)).length;
    if (badge.metric === 'reuse') return this.records.filter((row: CarbonRecord) => row.behaviorType === 'REUSE_ITEM').length;
    if (badge.metric === 'food') return this.records.filter((row: CarbonRecord) => row.behaviorType === 'CLEAN_PLATE').length;
    return this.completedCourses.length;
  }

  private hasRealRecord(): boolean {
    return this.records.some((row: CarbonRecord) => !row.id.startsWith('demo_'));
  }

  private practiceRecords(): CarbonRecord[] {
    return this.records.filter((row: CarbonRecord) => !row.id.startsWith('demo_'));
  }

  private activeDayCount(): number {
    const days: string[] = [];
    this.practiceRecords().forEach((record: CarbonRecord) => {
      const date = new Date(record.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!days.includes(key)) days.push(key);
    });
    return days.length;
  }

  private actionCategoryCount(): number {
    const categories: string[] = [];
    this.practiceRecords().forEach((record: CarbonRecord) => {
      if (!categories.includes(record.behaviorType)) categories.push(record.behaviorType);
    });
    return categories.length;
  }

  private certificateRedemptions(): DigitalRedemption[] {
    return this.redemptions.filter((item: DigitalRedemption) => item.rewardId.startsWith('certificate-'));
  }

  private certificateSerial(item: DigitalRedemption): string {
    const parts = item.id.split('_');
    const stamp = parts.length > 1 ? parts[1] : `${item.createdAt}`;
    const suffix = parts.length > 2 ? parts[2].padStart(5, '0') : '00000';
    return `CM-${new Date(item.createdAt).getFullYear()}-${stamp.slice(-6)}-${suffix}`;
  }

  private redeem(reward: DigitalReward): void {
    const alreadyOwned = this.redemptions.some((item: DigitalRedemption) => item.rewardId === reward.id);
    if (alreadyOwned) {
      this.message = '这份数字纪念已在收藏中';
      return;
    }
    if (reward.category === '数字证书' && !this.hasRealRecord()) {
      this.message = '先完成一条真实行动记录，再来生成个人记录证书';
      return;
    }
    if (this.summary.totalPoints < reward.cost) {
      this.message = `积分不足，还差 ${reward.cost - this.summary.totalPoints} 分`;
      return;
    }
    this.getUIContext().showAlertDialog({
      title: `兑换「${reward.title}」？`,
      message: `确认扣除 ${reward.cost} 积分，收入数字纪念册？仅生成应用内数字内容，不含实物或邮寄。`,
      primaryButton: {
        value: '确认兑换',
        action: () => {
          void DBManager.getInstance().redeemDigitalReward(
            reward.id,
            reward.title,
            reward.cost,
            this.practiceRecords().length,
            this.activeDayCount(),
            this.summary.totalReductionKg,
            this.completedCourses.length,
            this.actionCategoryCount()
          ).then((row: DigitalRedemption) => {
            this.message = `已兑换「${reward.title}」，已收入数字纪念册`;
            void FamilySyncService.getInstance().publishPointsAdjustment(row.id, -row.cost);
            if (reward.category === '数字证书') this.selectedCertificate = row;
            void this.refresh();
          }).catch(() => this.message = '兑换未完成，请检查积分后重试');
        }
      },
      secondaryButton: { value: '再看看', action: () => {} }
    });
  }

  private rewardOwned(rewardId: string): boolean {
    return this.redemptions.some((item: DigitalRedemption) => item.rewardId === rewardId);
  }

  private issueDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  @Builder
  private rewardArtwork(reward: DigitalReward) {
    if (reward.category === '数字证书') {
      Column({ space: 5 }) {
        Row() {
          Text('CM').fontSize(9).fontWeight(FontWeight.Bold).fontColor(reward.accent)
          Blank()
          Text('个人纪念').fontSize(7).fontColor('#8C846F')
        }.width('100%')
        Divider().color('#D8CBA8')
        Text('实践记录').fontSize(11).fontWeight(FontWeight.Bold).fontColor('#405842')
        Text('CARBONMATE').fontSize(7).fontColor('#9B8B62')
        Divider().color('#E7DFC9')
        Text('记录留存').fontSize(8).fontColor('#7B8577')
      }
      .width(86)
      .height(92)
      .justifyContent(FlexAlign.Center)
      .padding(8)
      .backgroundColor('#FAF8F0')
      .border({ width: 1, color: '#C8B77E' })
      .borderRadius(4)
    } else if (reward.category === '数字纪念卡') {
      Stack({ alignContent: Alignment.Center }) {
        Column({ space: 5 }) {
          Text('—  CM  —').fontSize(9).fontColor('#F2EEE3')
          Text('溪流同行').fontSize(11).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
          Text('LOW-CARBON · MEMORY').fontSize(6).fontColor('#E4EEE4')
        }.alignItems(HorizontalAlign.Center)
      }
      .width(86)
      .height(92)
      .backgroundColor(reward.accent)
      .borderRadius(7)
    } else if (reward.category === '数字称号') {
      Column({ space: 6 }) {
        Text('称号铭牌').fontSize(8).fontColor('#81734F')
        Text(reward.title).fontSize(11).fontWeight(FontWeight.Bold).fontColor('#405842')
        Divider().color('#CFC39E')
        Text('碳伴 · 个人成就').fontSize(8).fontColor('#7B8577')
      }
      .width(86)
      .height(92)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .padding(7)
      .backgroundColor('#F2EFE3')
      .border({ width: 1, color: reward.accent })
      .borderRadius(7)
    } else {
      Column({ space: 5 }) {
        Row({ space: 4 }) {
          Row().width(6).height(6).backgroundColor('#73875D').borderRadius(3)
          Row().width(6).height(6).backgroundColor('#B49B63').borderRadius(3)
          Row().width(6).height(6).backgroundColor('#92A08A').borderRadius(3)
        }
        Text('山野手札').fontSize(9).fontWeight(FontWeight.Bold).fontColor('#465846')
        Column({ space: 3 }) {
          Row().width('100%').height(4).backgroundColor('#B7C3AA').borderRadius(2)
          Row().width('70%').height(4).backgroundColor('#D7D4C3').borderRadius(2)
        }.width('100%')
      }
      .width(86)
      .height(92)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .padding(10)
      .backgroundColor('#E8ECDF')
      .borderRadius(7)
    }
  }

  build() {
    Scroll() {
      Column({ space: 16 }) {
        Row({ space: 14 }) {
          Stack({ alignContent: Alignment.Center }) {
            if (this.avatarPath.length > 0) {
              Image(fileUri.getUriFromPath(this.avatarPath))
                .width(64).height(64).objectFit(ImageFit.Cover).borderRadius(32)
            } else {
              Row().width(64).height(64).backgroundColor('#D8E1D0').borderRadius(32)
              Text(this.profileName.slice(0, 1)).fontSize(26).fontWeight(FontWeight.Bold).fontColor('#496447')
            }
          }.width(64).height(64).onClick(() => this.chooseAvatar())
          Column({ space: 4 }) {
            Text(this.profileName).fontSize(21).fontWeight(FontWeight.Bold).fontColor('#26372D')
            Text('每条行动，都留下一份自己的绿意')
              .fontSize(13).fontColor('#69766C')
          }.layoutWeight(1).alignItems(HorizontalAlign.Start)
          Button('设置')
            .fontSize(13).fontColor('#315B45').backgroundColor('#E9EEE4')
            .onClick(() => { this.settingsOpen = !this.settingsOpen; this.settingsMessage = ''; })
        }
        .width('100%').padding(16).backgroundColor('#FFFDF8').borderRadius(14)

        if (this.settingsOpen) {
          Column({ space: 11 }) {
            Text('个人与识别设置').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#26372D')
            Text('更换头像').fontSize(13).fontColor('#536257')
            Button('从相册选择头像').fontSize(13).fontColor('#315B45').backgroundColor('#E9EEE4')
              .onClick(() => this.chooseAvatar())
            Text('昵称').fontSize(13).fontColor('#536257')
            TextInput({ text: this.profileNameDraft, placeholder: '1–20 个字符' })
              .height(44).backgroundColor('#F3F0E7').borderRadius(9)
              .onChange((value: string) => this.profileNameDraft = value)
            Divider().color('#E5E2D8')
            Text('DeepSeek 图片识别网关').fontSize(15).fontWeight(FontWeight.Medium).fontColor('#26372D')
            Text('填网关电脑的局域网地址和客户端令牌；不要把 DeepSeek API Key 填到这里。')
              .fontSize(12).fontColor('#69766C').lineHeight(18)
            TextInput({ text: this.aiGatewayUrl, placeholder: '例如 http://192.168.1.20:4175' })
              .height(44).backgroundColor('#F3F0E7').borderRadius(9)
              .onChange((value: string) => this.aiGatewayUrl = value)
            TextInput({ text: this.aiClientToken, placeholder: '网关客户端令牌（至少 24 位）' })
              .height(44).backgroundColor('#F3F0E7').borderRadius(9)
              .onChange((value: string) => this.aiClientToken = value)
            Row({ space: 8 }) {
              Button(this.isSavingSettings ? '保存中…' : '保存设置')
                .layoutWeight(1).fontColor('#FFFFFF').backgroundColor('#315B45')
                .enabled(!this.isSavingSettings).onClick(() => this.saveSettings())
              Button(this.isCheckingGateway ? '检查中…' : '测试连接')
                .layoutWeight(1).fontColor('#315B45').backgroundColor('#E9EEE4')
                .enabled(!this.isCheckingGateway).onClick(() => this.testGateway())
            }
            if (this.settingsMessage.length > 0) {
              Text(this.settingsMessage).fontSize(12).fontColor('#536257').lineHeight(18)
            }
          }
          .width('100%').alignItems(HorizontalAlign.Start).padding(16)
          .backgroundColor('#FFFDF8').borderRadius(13)
        }

        Row() {
          Column({ space: 4 }) {
            Text('可用积分').fontSize(13).fontColor('#E7E9DB')
            Text(`${this.summary.totalPoints}`).fontSize(28).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
          }.layoutWeight(1).alignItems(HorizontalAlign.Start)
          Column({ space: 4 }) {
            Text('已解锁徽章').fontSize(13).fontColor('#E7E9DB')
            Text(`${BADGES.filter((badge: BadgeRule) => this.badgeProgress(badge) >= badge.target).length} / ${BADGES.length}`)
              .fontSize(24).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
          }.alignItems(HorizontalAlign.End)
        }
        .width('100%')
        .padding(18)
        .backgroundColor('#365A43')
        .borderRadius(14)

        Column({ space: 10 }) {
          Row() {
            Column({ space: 4 }) {
              Text('家庭碳账户').fontSize(17).fontWeight(FontWeight.Bold).fontColor('#26372D')
              Text(this.familyCode ? `已加入共享空间 · ${this.familyMembers.length} 位参与者` : '把家人的低碳行动合并统计')
                .fontSize(12).fontColor('#69766C')
            }.layoutWeight(1).alignItems(HorizontalAlign.Start)
            Button(this.familyOpen ? '收起' : (this.familyCode ? '查看' : '设置'))
              .fontSize(12).fontColor('#315B45').backgroundColor('#E9EEE4')
              .onClick(() => this.familyOpen = !this.familyOpen)
          }.width('100%')

          if (this.familyOpen) {
            if (!this.familyCode) {
              Text('同步范围为当前系统中可用的鸿蒙可信设备。另一台设备输入同一邀请码后，可在应用内加入并查看这个家庭空间。')
                .fontSize(13).fontColor('#536257').lineHeight(20).width('100%')
              Text('家庭成员昵称').fontSize(13).fontColor('#536257')
              TextInput({ text: this.familyMemberNameDraft, placeholder: '在家庭统计中显示的昵称' })
                .height(44).backgroundColor('#F3F0E7').borderRadius(9)
                .onChange((value: string) => this.familyMemberNameDraft = value)
              Button(this.isFamilyBusy ? '正在准备…' : '创建家庭并生成邀请码')
                .width('100%').fontSize(14).fontColor('#FFFFFF').backgroundColor('#315B45')
                .enabled(!this.isFamilyBusy).onClick(() => this.prepareFamilySetup(true))
              Text('已有家庭邀请码？')
                .fontSize(13).fontWeight(FontWeight.Medium).fontColor('#405842').margin({ top: 5 })
              TextInput({ text: this.familyCodeDraft, placeholder: '输入 10 位邀请码' })
                .height(44).backgroundColor('#F3F0E7').borderRadius(9)
                .onChange((value: string) => this.familyCodeDraft = value.toUpperCase())
              Button(this.isFamilyBusy ? '正在加入…' : '加入家庭空间')
                .width('100%').fontSize(14).fontColor('#315B45').backgroundColor('#E9EEE4')
                .enabled(!this.isFamilyBusy).onClick(() => this.prepareFamilySetup(false))
              Text('只有在你同意并通过系统授权后，才会写入家庭共享空间。')
                .fontSize(12).fontColor('#778174').lineHeight(18).width('100%')
            } else {
              Row() {
                Text('家庭邀请码').fontSize(13).fontColor('#69766C').layoutWeight(1)
                Text(this.familyCode).fontSize(16).fontWeight(FontWeight.Bold).fontColor('#315B45')
              }.width('100%')
              Text(`本机成员：${this.familyMemberNameDraft}。请只把邀请码分享给希望加入的家庭设备。`)
                .fontSize(13).fontColor('#536257').lineHeight(20).width('100%')
              Row({ space: 8 }) {
                Column({ space: 5 }) {
                  Text('行动记录').fontSize(11).fontColor('#69766C')
                  Text(`${this.familyRecords}`).fontSize(20).fontWeight(FontWeight.Bold).fontColor('#315B45')
                }.layoutWeight(1).alignItems(HorizontalAlign.Start)
                Column({ space: 5 }) {
                  Text('累计估算').fontSize(11).fontColor('#69766C')
                  Text(this.familyReductionKg > 0 ? `${this.familyReductionKg.toFixed(2)} kg` : '暂无')
                    .fontSize(16).fontWeight(FontWeight.Bold).fontColor('#315B45')
                }.layoutWeight(1).alignItems(HorizontalAlign.Start)
                Column({ space: 5 }) {
                  Text('家庭积分余额').fontSize(11).fontColor('#69766C')
                  Text(`${this.familyPoints}`).fontSize(20).fontWeight(FontWeight.Bold).fontColor('#315B45')
                }.layoutWeight(1).alignItems(HorizontalAlign.Start)
              }
              .width('100%').padding(12).backgroundColor('#F3F5EE').borderRadius(10)
              if (this.familyMembers.length > 0) {
                Column({ space: 7 }) {
                  ForEach(this.familyMembers, (member: FamilyMemberSummary) => {
                    Row() {
                      Text(member.name).fontSize(13).fontColor('#405842').layoutWeight(1)
                      Text(`${member.recordCount} 条 · ${member.points} 分`)
                        .fontSize(12).fontColor('#69766C')
                    }.width('100%')
                  }, (member: FamilyMemberSummary) => member.id)
                }.width('100%').padding({ left: 4, right: 4 })
              }
              Button(this.isFamilyBusy ? '正在同步…' : '同步并刷新家庭汇总')
                .width('100%').fontSize(14).fontColor('#FFFFFF').backgroundColor('#315B45')
                .enabled(!this.isFamilyBusy).onClick(() => this.syncFamily())
              Button('关闭本机家庭同步')
                .width('100%').fontSize(13).fontColor('#536257').backgroundColor('#F3F0E7')
                .enabled(!this.isFamilyBusy).onClick(() => this.confirmDisableFamily())
              Text('同步范围：此设备的低碳行动类别、活动量、核算版本、积分、日期与昵称。不含照片、备注、AI 草稿或密钥；积分兑换也计入家庭余额。')
                .fontSize(12).fontColor('#69766C').lineHeight(18).width('100%')
            }
            if (this.familyStatus.length > 0) {
              Text(this.familyStatus).fontSize(13).fontColor('#536257').lineHeight(19).width('100%')
            }
          }
        }
        .width('100%').alignItems(HorizontalAlign.Start).padding(15)
        .backgroundColor('#FFFDF8').borderRadius(13)

        Column({ space: 8 }) {
          Row() {
            Text('今日任务').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#26372D').layoutWeight(1)
            Text(`${this.tasks.filter((task: DailyTask) => task.completed).length}/${this.tasks.length} 完成`)
              .fontSize(12).fontColor('#778174')
          }.width('100%')
          ForEach(this.tasks, (task: DailyTask) => TaskRow({ task }), (task: DailyTask) => task.id)
        }
        .width('100%')
        .padding(15)
        .backgroundColor('#FFFDF8')
        .borderRadius(13)

        Column({ space: 10 }) {
          Text('徽章册').fontSize(19).fontWeight(FontWeight.Bold).fontColor('#26372D')
          Text('点按徽章图案，可慢速旋转约 5 秒。徽章按已保存记录自动解锁。')
            .fontSize(13).fontColor('#69766C').lineHeight(19)
          ForEach(BADGES, (badge: BadgeRule) => {
            MedalBadge({
              title: badge.title,
              subtitle: badge.subtitle,
              progress: this.badgeProgress(badge),
              target: badge.target,
              unlocked: this.badgeProgress(badge) >= badge.target
            })
          }, (badge: BadgeRule) => badge.id)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)

        Column({ space: 10 }) {
          Text('数字纪念兑换').fontSize(19).fontWeight(FontWeight.Bold).fontColor('#26372D')
          Text('兑换后保存在应用内，不涉及实物、邮寄或植树承诺。')
            .fontSize(13).fontColor('#69766C').lineHeight(19)
          ForEach(REWARDS, (reward: DigitalReward) => {
            Row({ space: 12 }) {
              this.rewardArtwork(reward)
              Column({ space: 5 }) {
                Text(reward.category).fontSize(11).fontColor(reward.accent)
                Text(reward.title).fontSize(15).fontWeight(FontWeight.Bold).fontColor('#26372D')
                Text(reward.description).fontSize(12).fontColor('#677368').lineHeight(18)
              }
              .layoutWeight(1)
              .alignItems(HorizontalAlign.Start)
              Button(this.rewardOwned(reward.id) ? '已收藏' : `${reward.cost} 分`)
                .fontSize(12)
                .fontColor(this.rewardOwned(reward.id) ? '#69766C' : '#FFFFFF')
                .backgroundColor(this.rewardOwned(reward.id) ? '#E6E8E0' : '#315B45')
                .enabled(!this.rewardOwned(reward.id))
                .onClick(() => this.redeem(reward))
            }
            .width('100%')
            .padding(14)
            .backgroundColor('#FFFDF8')
            .borderRadius(12)
          }, (reward: DigitalReward) => reward.id)
          if (this.message.length > 0) {
            Text(this.message).fontSize(13).fontColor('#315B45').width('100%')
          }
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)

        Column({ space: 10 }) {
          Row() {
            Text('证书典藏').fontSize(19).fontWeight(FontWeight.Bold).fontColor('#26372D').layoutWeight(1)
            Text(`${this.certificateRedemptions().length} 份`).fontSize(12).fontColor('#778174')
          }.width('100%')
          Text('记录生成时的真实行动统计，作为个人纪念；不代表第三方认证或核证减排。')
            .fontSize(13).fontColor('#69766C').lineHeight(19)
          if (this.certificateRedemptions().length === 0) {
            Column({ space: 7 }) {
              Text('你的第一份证书还在等一条真实记录')
                .fontSize(15).fontWeight(FontWeight.Medium).fontColor('#405842')
              Text('完成一条真实行动记录后，即可用积分兑换并收入这里。')
                .fontSize(13).fontColor('#778174').lineHeight(19)
            }
            .width('100%').padding(18).backgroundColor('#FAF8F0')
            .border({ width: 1, color: '#E4DDC8' }).borderRadius(10)
          } else {
            ForEach(this.certificateRedemptions(), (item: DigitalRedemption) => {
              Row({ space: 12 }) {
                Column({ space: 5 }) {
                  Row() {
                    Text('CM').fontSize(9).fontWeight(FontWeight.Bold).fontColor('#8B7545')
                    Blank()
                    Text('数字纪念').fontSize(8).fontColor('#8C846F')
                  }.width('100%')
                  Divider().color('#D8CBA8')
                  Text(item.title).fontSize(11).fontWeight(FontWeight.Bold).fontColor('#405842')
                  Text(`${item.recordCount} 条记录 · ${item.activeDays} 个行动日`)
                    .fontSize(8).fontColor('#778174')
                  Text(this.certificateSerial(item)).fontSize(8).fontColor('#9A8A62')
                }
                .width(136).height(92).justifyContent(FlexAlign.Center)
                .padding(10).backgroundColor('#FAF8F0')
                .border({ width: 1, color: '#C8B77E' }).borderRadius(4)
                Column({ space: 5 }) {
                  Text(item.title).fontSize(14).fontWeight(FontWeight.Bold).fontColor('#26372D')
                  Text(`生成于 ${this.issueDate(item.createdAt)}`).fontSize(12).fontColor('#778174')
                  Text(`${item.categoryCount > 0 ? `${item.categoryCount} 类实践` : '类别数未留存'} · 完成专题 ${item.completedCourses} 个`)
                    .fontSize(12).fontColor('#69766C')
                  Button(this.selectedCertificate?.id === item.id ? '正在查看' : '查看证书')
                    .fontSize(12).fontColor('#315B45').backgroundColor('#E9EEE4')
                    .onClick(() => this.selectedCertificate = item)
                }
                .layoutWeight(1).alignItems(HorizontalAlign.Start)
              }
              .width('100%').padding(12).backgroundColor('#FFFDF8').borderRadius(12)
            }, (item: DigitalRedemption) => item.id)
          }

          if (this.selectedCertificate !== null) {
            Column({ space: 12 }) {
              Row() {
                Text('证书详情').fontSize(17).fontWeight(FontWeight.Bold).fontColor('#26372D').layoutWeight(1)
                Button('收起').fontSize(12).fontColor('#315B45').backgroundColor('#E9EEE4')
                  .onClick(() => this.selectedCertificate = null)
              }.width('100%')
              Column({ space: 13 }) {
                Row() {
                  Column() {
                    Text('CM').fontSize(11).fontWeight(FontWeight.Bold).fontColor('#8B7545')
                    Text('CARBONMATE').fontSize(6).fontColor('#8B7545')
                  }.alignItems(HorizontalAlign.Center).padding(8)
                  .border({ width: 1, color: '#B7A36D' }).borderRadius(24)
                  Blank()
                  Text('个人实践记录 · 数字纪念').fontSize(10).fontColor('#8B7545')
                }.width('100%')
                Divider().color('#C8B985')
                Text(this.selectedCertificate.title)
                  .fontSize(24).fontWeight(FontWeight.Bold).fontColor('#334C39')
                  .width('100%').textAlign(TextAlign.Center)
                Text('谨将此记录留予持续参与日常低碳行动的你。以下内容根据本机在兑换时已保存的记录生成。')
                  .fontSize(13).fontColor('#617064').lineHeight(21)
                  .width('100%').textAlign(TextAlign.Center)
                Row({ space: 4 }) {
                  Column({ space: 4 }) {
                    Text(`${this.selectedCertificate.recordCount}`).fontSize(23).fontWeight(FontWeight.Bold).fontColor('#496C4C')
                    Text('条行动记录').fontSize(11).fontColor('#778174')
                  }.layoutWeight(1).alignItems(HorizontalAlign.Center)
                  Column({ space: 4 }) {
                    Text(`${this.selectedCertificate.activeDays}`).fontSize(23).fontWeight(FontWeight.Bold).fontColor('#496C4C')
                    Text('个行动日').fontSize(11).fontColor('#778174')
                  }.layoutWeight(1).alignItems(HorizontalAlign.Center)
                  Column({ space: 4 }) {
                    Text(this.selectedCertificate.categoryCount > 0 ? `${this.selectedCertificate.categoryCount}` : '—')
                      .fontSize(23).fontWeight(FontWeight.Bold).fontColor('#496C4C')
                    Text('类实践').fontSize(11).fontColor('#778174')
                  }.layoutWeight(1).alignItems(HorizontalAlign.Center)
                }.width('100%').padding({ top: 8, bottom: 8 })
                Divider().color('#E8E1CE')
                Row() {
                  Text('生成日期').fontSize(11).fontColor('#899184').layoutWeight(1)
                  Text(this.issueDate(this.selectedCertificate.createdAt)).fontSize(12).fontColor('#586A5A')
                }.width('100%')
                Row() {
                  Text('典藏编号').fontSize(11).fontColor('#899184').layoutWeight(1)
                  Text(this.certificateSerial(this.selectedCertificate)).fontSize(11).fontColor('#586A5A')
                }.width('100%')
                Text(`生成时已完成专题 ${this.selectedCertificate.completedCourses} 个。此证书仅用于个人回顾与纪念，不代表官方证明、第三方核证或经核证减排。`)
                  .fontSize(11).fontColor('#8B887D').lineHeight(18).width('100%').textAlign(TextAlign.Center)
              }
              .width('100%').padding(18).backgroundColor('#FBF9F1')
              .border({ width: 2, color: '#C8B77E' }).borderRadius(5)
            }
            .width('100%').padding(15).backgroundColor('#FFFDF8').borderRadius(13)
          }
        }
        .width('100%').alignItems(HorizontalAlign.Start)

        if (this.redemptions.some((item: DigitalRedemption) => !item.rewardId.startsWith('certificate-'))) {
          Column({ space: 8 }) {
            Text('其他数字纪念').fontSize(18).fontWeight(FontWeight.Bold).fontColor('#26372D')
            ForEach(this.redemptions.filter((item: DigitalRedemption) => !item.rewardId.startsWith('certificate-')), (item: DigitalRedemption) => {
              Row() {
                Text(item.title).fontSize(14).fontColor('#35483B').layoutWeight(1)
                Text(this.issueDate(item.createdAt)).fontSize(12).fontColor('#778174')
              }
              .width('100%').padding(12).backgroundColor('#FFFDF8').borderRadius(10)
            }, (item: DigitalRedemption) => item.id)
          }
          .width('100%').alignItems(HorizontalAlign.Start)
        }
      }
      .width('100%')
      .padding({ left: 18, right: 18, top: 20, bottom: 96 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F0E7')
  }
}
