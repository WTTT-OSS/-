import { DBManager } from '../data/DBManager';
import { CarbonCalculator } from '../domain/CarbonCalculator';
import { FactorRepository } from '../domain/FactorRepository';
import { BehaviorType, CarbonRecord, CarbonSummary } from '../domain/CarbonTypes';
import { PointsEngine } from '../domain/PointsEngine';
import { FamilySyncService } from './FamilySyncService';

export class CarbonRecordService {
  private static instance: CarbonRecordService;
  private database: DBManager = DBManager.getInstance();

  static getInstance(): CarbonRecordService {
    if (!CarbonRecordService.instance) {
      CarbonRecordService.instance = new CarbonRecordService();
    }
    return CarbonRecordService.instance;
  }

  async saveManualRecord(
    type: BehaviorType,
    activityValue: number,
    note: string,
    itemCategory: string = '',
    itemDestination: string = '',
    electricityMeasurementConfirmed: boolean = false,
    electricityAction: string = ''
  ): Promise<CarbonRecord> {
    const calculation = CarbonCalculator.calculate({
      behaviorType: type,
      activityValue,
      electricityMeasurementConfirmed,
      electricityAction
    });
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayRecords = await this.database.queryRecent(100000);
    const rewardedActionsToday = todayRecords.filter((row: CarbonRecord) => row.createdAt >= todayStart && row.points > 0).length;
    const record: CarbonRecord = {
      id: `record_${now}_${Math.floor(Math.random() * 100000)}`,
      behaviorType: type,
      behaviorName: calculation.factor.name,
      activityValue,
      activityUnit: calculation.factor.unit,
      factorId: calculation.factor.id,
      factorVersion: calculation.factor.version,
      factorSource: calculation.factor.sourceLabel,
      reductionKg: calculation.reductionKg,
      points: PointsEngine.pointsForAction(rewardedActionsToday),
      note: note.trim(),
      itemCategory,
      itemDestination,
      createdAt: now
    };
    await this.database.insertRecord(record);
    void FamilySyncService.getInstance().publishRecord(record);
    return record;
  }

  async recentRecords(limit: number = 30): Promise<CarbonRecord[]> {
    return this.database.queryRecent(limit);
  }

  async updateManualRecord(original: CarbonRecord, activityValue: number, note: string): Promise<CarbonRecord> {
    const existing = FactorRepository.findById(original.factorId, original.factorVersion);
    const calculation = existing !== null && existing.estimateAvailable
      ? CarbonCalculator.calculateWithFactor(existing, activityValue)
      : CarbonCalculator.calculate({ behaviorType: original.behaviorType, activityValue });
    const updated: CarbonRecord = {
      id: original.id,
      behaviorType: original.behaviorType,
      behaviorName: calculation.factor.name,
      activityValue,
      activityUnit: calculation.factor.unit,
      factorId: calculation.factor.id,
      factorVersion: calculation.factor.version,
      factorSource: calculation.factor.sourceLabel,
      reductionKg: calculation.reductionKg,
      points: original.points,
      note: note.trim(),
      itemCategory: original.itemCategory,
      itemDestination: original.itemDestination,
      createdAt: original.createdAt
    };
    await this.database.updateRecord(updated);
    void FamilySyncService.getInstance().publishRecord(updated);
    return updated;
  }

  async deleteRecord(recordId: string): Promise<void> {
    await this.database.deleteRecord(recordId);
    void FamilySyncService.getInstance().publishRecordDeletion(recordId);
  }

  async importRecords(records: CarbonRecord[]): Promise<number> {
    const imported = await this.database.importRecords(records);
    if (imported > 0) records.forEach((record: CarbonRecord) => void FamilySyncService.getInstance().publishRecord(record));
    return imported;
  }

  async summary(): Promise<CarbonSummary> {
    return this.database.getSummary();
  }
}
