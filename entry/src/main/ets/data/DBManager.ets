import { relationalStore } from '@kit.ArkData';
import { BehaviorType, CarbonRecord, CarbonSummary } from '../domain/CarbonTypes';
import { FactorRepository } from '../domain/FactorRepository';

const DATABASE_NAME = 'carbonmate.db';
const RECORD_TABLE = 'carbon_records';
const LEDGER_TABLE = 'point_ledger';
const COURSE_TABLE = 'course_progress';
const REDEMPTION_TABLE = 'digital_redemptions';
const SETTINGS_TABLE = 'app_settings';

export interface DigitalRedemption {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  createdAt: number;
  recordCount: number;
  activeDays: number;
  categoryCount: number;
  estimatedKg: number;
  completedCourses: number;
}

export class DBManager {
  private static instance: DBManager;
  private store: relationalStore.RdbStore | null = null;

  private constructor() {}

  static getInstance(): DBManager {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager();
    }
    return DBManager.instance;
  }

  async init(context: Context): Promise<void> {
    if (this.store) {
      return;
    }

    const config: relationalStore.StoreConfig = {
      name: DATABASE_NAME,
      securityLevel: relationalStore.SecurityLevel.S1
    };

    this.store = await relationalStore.getRdbStore(context, config);
    await this.store.executeSql(`CREATE TABLE IF NOT EXISTS ${RECORD_TABLE} (
      id TEXT PRIMARY KEY,
      behavior_type TEXT NOT NULL,
      behavior_name TEXT NOT NULL,
      activity_value REAL NOT NULL,
      activity_unit TEXT NOT NULL,
      factor_id TEXT NOT NULL,
      factor_version TEXT NOT NULL,
      factor_source TEXT NOT NULL,
      reduction_kg REAL NOT NULL,
      points INTEGER NOT NULL,
      note TEXT NOT NULL,
      item_category TEXT NOT NULL DEFAULT '',
      item_destination TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL
    )`);
    await this.store.executeSql(`CREATE TABLE IF NOT EXISTS ${LEDGER_TABLE} (
      id TEXT PRIMARY KEY,
      ref_id TEXT NOT NULL UNIQUE,
      delta INTEGER NOT NULL,
      source_type TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`);
    await this.store.executeSql(`CREATE TABLE IF NOT EXISTS ${COURSE_TABLE} (
      course_id TEXT PRIMARY KEY,
      completed_at INTEGER NOT NULL
    )`);
    await this.store.executeSql(`CREATE TABLE IF NOT EXISTS ${REDEMPTION_TABLE} (
      id TEXT PRIMARY KEY,
      reward_id TEXT NOT NULL,
      title TEXT NOT NULL,
      cost INTEGER NOT NULL,
      record_count INTEGER NOT NULL DEFAULT 0,
      active_days INTEGER NOT NULL DEFAULT 0,
      estimated_kg REAL NOT NULL DEFAULT 0,
      completed_courses INTEGER NOT NULL DEFAULT 0,
      category_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )`);
    await this.store.executeSql(`CREATE TABLE IF NOT EXISTS ${SETTINGS_TABLE} (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL
    )`);
    await this.store.executeSql(`CREATE INDEX IF NOT EXISTS idx_carbon_records_created_at
      ON ${RECORD_TABLE}(created_at DESC)`);
    await this.store.executeSql(`CREATE INDEX IF NOT EXISTS idx_carbon_records_behavior
      ON ${RECORD_TABLE}(behavior_type)`);
    // Older local databases are upgraded in place; duplicate-column errors are expected after first launch.
    try { await this.store.executeSql(`ALTER TABLE ${RECORD_TABLE} ADD COLUMN item_category TEXT NOT NULL DEFAULT ''`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${RECORD_TABLE} ADD COLUMN item_destination TEXT NOT NULL DEFAULT ''`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${REDEMPTION_TABLE} ADD COLUMN record_count INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${REDEMPTION_TABLE} ADD COLUMN active_days INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${REDEMPTION_TABLE} ADD COLUMN estimated_kg REAL NOT NULL DEFAULT 0`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${REDEMPTION_TABLE} ADD COLUMN completed_courses INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await this.store.executeSql(`ALTER TABLE ${REDEMPTION_TABLE} ADD COLUMN category_count INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
  }

  async insertRecord(record: CarbonRecord): Promise<void> {
    const store = this.requireStore();
    const txId = await store.beginTrans();
    try {
    const recordBucket: relationalStore.ValuesBucket = {
      id: record.id,
      behavior_type: record.behaviorType,
      behavior_name: record.behaviorName,
      activity_value: record.activityValue,
      activity_unit: record.activityUnit,
      factor_id: record.factorId,
      factor_version: record.factorVersion,
      factor_source: record.factorSource,
      reduction_kg: record.reductionKg,
      points: record.points,
      note: record.note,
      item_category: record.itemCategory ?? '',
      item_destination: record.itemDestination ?? '',
      created_at: record.createdAt
    };
    await store.insert(RECORD_TABLE, recordBucket);

    const ledgerBucket: relationalStore.ValuesBucket = {
      id: `ledger_${record.id}`,
      ref_id: record.id,
      delta: record.points,
      source_type: 'carbon_record',
      created_at: record.createdAt
    };
    await store.insert(LEDGER_TABLE, ledgerBucket);
      await store.commit(txId);
    } catch (_) {
      await store.rollback(txId);
      throw new Error('保存记录失败');
    }
  }

  async updateRecord(record: CarbonRecord): Promise<void> {
    const store = this.requireStore();
    const txId = await store.beginTrans();
    try {
      const values: relationalStore.ValuesBucket = {
        behavior_type: record.behaviorType,
        behavior_name: record.behaviorName,
        activity_value: record.activityValue,
        activity_unit: record.activityUnit,
        factor_id: record.factorId,
        factor_version: record.factorVersion,
        factor_source: record.factorSource,
        reduction_kg: record.reductionKg,
        points: record.points,
        note: record.note,
        item_category: record.itemCategory ?? '',
        item_destination: record.itemDestination ?? ''
      };
      const predicates = new relationalStore.RdbPredicates(RECORD_TABLE).equalTo('id', record.id);
      await store.update(values, predicates);
      const ledgerValues: relationalStore.ValuesBucket = { delta: record.points };
      const ledgerPredicates = new relationalStore.RdbPredicates(LEDGER_TABLE).equalTo('ref_id', record.id);
      await store.update(ledgerValues, ledgerPredicates);
      await store.commit(txId);
    } catch (_) {
      await store.rollback(txId);
      throw new Error('更新记录失败');
    }
  }

  async deleteRecord(recordId: string): Promise<void> {
    const store = this.requireStore();
    const txId = await store.beginTrans();
    try {
      await store.delete(new relationalStore.RdbPredicates(LEDGER_TABLE).equalTo('ref_id', recordId));
      await store.delete(new relationalStore.RdbPredicates(RECORD_TABLE).equalTo('id', recordId));
      await store.commit(txId);
    } catch (_) {
      await store.rollback(txId);
      throw new Error('删除记录失败');
    }
  }

  async importRecords(records: CarbonRecord[]): Promise<number> {
    let imported = 0;
    for (const record of records) {
      const predicates = new relationalStore.RdbPredicates(RECORD_TABLE).equalTo('id', record.id);
      const resultSet = await this.requireStore().query(predicates);
      let exists = false;
      try {
        exists = resultSet.goToNextRow();
      } finally {
        resultSet.close();
      }
      if (!exists) {
        await this.insertRecord(record);
        imported += 1;
      }
    }
    return imported;
  }

  async queryRecent(limit: number = 30): Promise<CarbonRecord[]> {
    const store = this.requireStore();
    const predicates = new relationalStore.RdbPredicates(RECORD_TABLE);
    predicates.orderByDesc('created_at');
    const resultSet = await store.query(predicates);
    const records: CarbonRecord[] = [];
    try {
      while (resultSet.goToNextRow() && records.length < limit) {
        records.push(this.readRecord(resultSet));
      }
    } finally {
      resultSet.close();
    }
    return records;
  }

  async getSummary(): Promise<CarbonSummary> {
    const records = await this.queryRecent(100000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    let totalReductionKg = 0;
    let totalPoints = await this.getPointsBalance();
    let todayReductionKg = 0;
    let estimatedRecordCount = 0;
    let verifiedRecordCount = 0;
    let unestimatedRecordCount = 0;
    let todayEstimateCount = 0;

    records.forEach((record: CarbonRecord) => {
      const hasEstimate = FactorRepository.isEstimated(record.factorId, record.factorVersion);
      const reduction = hasEstimate ? Math.max(0, record.reductionKg) : 0;
      if (hasEstimate && reduction > 0) {
        estimatedRecordCount += 1;
        if (FactorRepository.isVerified(record.factorId, record.factorVersion)) verifiedRecordCount += 1;
      } else {
        unestimatedRecordCount += 1;
      }
      totalReductionKg += reduction;
      if (record.createdAt >= todayStart) {
        todayReductionKg += reduction;
        if (hasEstimate && reduction > 0) todayEstimateCount += 1;
      }
    });

    return {
      totalReductionKg: Math.round(totalReductionKg * 1000) / 1000,
      totalPoints,
      recordCount: records.length,
      todayReductionKg: Math.round(todayReductionKg * 1000) / 1000,
      estimatedRecordCount,
      verifiedRecordCount,
      unestimatedRecordCount,
      todayEstimateCount
    };
  }

  async getPointsBalance(): Promise<number> {
    const resultSet = await this.requireStore().query(new relationalStore.RdbPredicates(LEDGER_TABLE));
    let balance = 0;
    try {
      while (resultSet.goToNextRow()) {
        balance += resultSet.getLong(resultSet.getColumnIndex('delta'));
      }
    } finally {
      resultSet.close();
    }
    return Math.max(0, balance);
  }

  async redeemDigitalReward(
    rewardId: string,
    title: string,
    cost: number,
    recordCount: number = 0,
    activeDays: number = 0,
    estimatedKg: number = 0,
    completedCourses: number = 0,
    categoryCount: number = 0
  ): Promise<DigitalRedemption> {
    if (!Number.isInteger(cost) || cost <= 0) throw new Error('兑换积分无效');
    const store = this.requireStore();
    const txId = await store.beginTrans();
    try {
      let balance = 0;
      const ledger = await store.query(new relationalStore.RdbPredicates(LEDGER_TABLE));
      try {
        while (ledger.goToNextRow()) balance += ledger.getLong(ledger.getColumnIndex('delta'));
      } finally {
        ledger.close();
      }
      if (balance < cost) throw new Error('积分不足');
      const redemption: DigitalRedemption = {
        id: `redeem_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        rewardId,
        title,
        cost,
        createdAt: Date.now(),
        recordCount,
        activeDays,
        categoryCount,
        estimatedKg,
        completedCourses
      };
      await store.insert(REDEMPTION_TABLE, {
        id: redemption.id,
        reward_id: rewardId,
        title,
        cost,
        record_count: recordCount,
        active_days: activeDays,
        estimated_kg: estimatedKg,
        completed_courses: completedCourses,
        category_count: categoryCount,
        created_at: redemption.createdAt
      });
      await store.insert(LEDGER_TABLE, {
        id: `ledger_${redemption.id}`,
        ref_id: redemption.id,
        delta: -cost,
        source_type: 'digital_redemption',
        created_at: redemption.createdAt
      });
      await store.commit(txId);
      return redemption;
    } catch (error) {
      await store.rollback(txId);
      throw new Error(error instanceof Error ? error.message : '兑换失败，请重试');
    }
  }

  async listDigitalRedemptions(): Promise<DigitalRedemption[]> {
    const predicates = new relationalStore.RdbPredicates(REDEMPTION_TABLE);
    predicates.orderByDesc('created_at');
    const resultSet = await this.requireStore().query(predicates);
    const rows: DigitalRedemption[] = [];
    try {
      while (resultSet.goToNextRow()) {
        rows.push({
          id: resultSet.getString(resultSet.getColumnIndex('id')),
          rewardId: resultSet.getString(resultSet.getColumnIndex('reward_id')),
          title: resultSet.getString(resultSet.getColumnIndex('title')),
          cost: resultSet.getLong(resultSet.getColumnIndex('cost')),
          createdAt: resultSet.getLong(resultSet.getColumnIndex('created_at')),
          recordCount: resultSet.getLong(resultSet.getColumnIndex('record_count')),
          activeDays: resultSet.getLong(resultSet.getColumnIndex('active_days')),
          categoryCount: resultSet.getLong(resultSet.getColumnIndex('category_count')),
          estimatedKg: resultSet.getDouble(resultSet.getColumnIndex('estimated_kg')),
          completedCourses: resultSet.getLong(resultSet.getColumnIndex('completed_courses'))
        });
      }
    } finally {
      resultSet.close();
    }
    return rows;
  }

  async completedCourseIds(): Promise<string[]> {
    const resultSet = await this.requireStore().query(new relationalStore.RdbPredicates(COURSE_TABLE));
    const ids: string[] = [];
    try {
      while (resultSet.goToNextRow()) ids.push(resultSet.getString(resultSet.getColumnIndex('course_id')));
    } finally {
      resultSet.close();
    }
    return ids;
  }

  async getSetting(key: string): Promise<string> {
    const resultSet = await this.requireStore().query(
      new relationalStore.RdbPredicates(SETTINGS_TABLE).equalTo('setting_key', key)
    );
    try {
      return resultSet.goToNextRow() ? resultSet.getString(resultSet.getColumnIndex('setting_value')) : '';
    } finally {
      resultSet.close();
    }
  }

  async setSetting(key: string, value: string): Promise<void> {
    const store = this.requireStore();
    const predicates = new relationalStore.RdbPredicates(SETTINGS_TABLE).equalTo('setting_key', key);
    const resultSet = await store.query(predicates);
    let exists = false;
    try { exists = resultSet.goToNextRow(); } finally { resultSet.close(); }
    const values: relationalStore.ValuesBucket = { setting_value: value };
    if (exists) await store.update(values, predicates);
    else await store.insert(SETTINGS_TABLE, { setting_key: key, setting_value: value });
  }

  async markCourseComplete(courseId: string): Promise<void> {
    const store = this.requireStore();
    const predicates = new relationalStore.RdbPredicates(COURSE_TABLE).equalTo('course_id', courseId);
    const resultSet = await store.query(predicates);
    let exists = false;
    try { exists = resultSet.goToNextRow(); } finally { resultSet.close(); }
    const values: relationalStore.ValuesBucket = { completed_at: Date.now() };
    if (exists) await store.update(values, predicates);
    else await store.insert(COURSE_TABLE, { course_id: courseId, completed_at: Date.now() });
  }

  private requireStore(): relationalStore.RdbStore {
    if (!this.store) {
      throw new Error('CarbonMate database has not been initialized');
    }
    return this.store;
  }

  private readRecord(resultSet: relationalStore.ResultSet): CarbonRecord {
    return {
      id: resultSet.getString(resultSet.getColumnIndex('id')),
      behaviorType: resultSet.getString(resultSet.getColumnIndex('behavior_type')) as BehaviorType,
      behaviorName: resultSet.getString(resultSet.getColumnIndex('behavior_name')),
      activityValue: resultSet.getDouble(resultSet.getColumnIndex('activity_value')),
      activityUnit: resultSet.getString(resultSet.getColumnIndex('activity_unit')),
      factorId: resultSet.getString(resultSet.getColumnIndex('factor_id')),
      factorVersion: resultSet.getString(resultSet.getColumnIndex('factor_version')),
      factorSource: resultSet.getString(resultSet.getColumnIndex('factor_source')),
      reductionKg: resultSet.getDouble(resultSet.getColumnIndex('reduction_kg')),
      points: resultSet.getLong(resultSet.getColumnIndex('points')),
      note: resultSet.getString(resultSet.getColumnIndex('note')),
      itemCategory: resultSet.getString(resultSet.getColumnIndex('item_category')),
      itemDestination: resultSet.getString(resultSet.getColumnIndex('item_destination')),
      createdAt: resultSet.getLong(resultSet.getColumnIndex('created_at'))
    };
  }
}

