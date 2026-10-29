export enum BehaviorType {
  BICYCLE = 'BICYCLE',
  WALK = 'WALK',
  BUS = 'BUS',
  METRO = 'METRO',
  ELECTRICITY_SAVE = 'ELECTRICITY_SAVE',
  WATER_SAVE = 'WATER_SAVE',
  RECYCLE_PAPER = 'RECYCLE_PAPER',
  CLEAN_PLATE = 'CLEAN_PLATE',
  REUSE_ITEM = 'REUSE_ITEM'
}

/**
 * 估算等级。
 * verified：采用主管部门公开发布的因子，数值可直接追溯到原文；
 * reference：采用可由公开参数复算的参考值，用于横向比较与行为激励，不作核证依据。
 */
export type EstimationTier = 'verified' | 'reference';

export interface CarbonFactor {
  id: string;
  behaviorType: BehaviorType;
  name: string;
  unit: string;
  factorKg: number;
  version: string;
  tier: EstimationTier;
  /** 因子数值与来源的一句话说明，写入记录与导出文件，便于事后核对。 */
  sourceLabel: string;
  /** 核算边界与适用前提，用于界面提示。 */
  baselineLabel: string;
  demoOnly: boolean;
  estimateAvailable: boolean;
}

export interface CalculationInput {
  behaviorType: BehaviorType;
  activityValue: number;
  /** 节电是否已确认电表或设备读数；为真时按 kWh 计量，否则按行动次数与单次假设估算。 */
  electricityMeasurementConfirmed?: boolean;
  /** 节电“记录具体行动”模式下选择的具体行动名称。 */
  electricityAction?: string;
}

export interface CalculationResult {
  factor: CarbonFactor;
  reductionKg: number;
  formulaText: string;
  isEstimate: boolean;
}

export interface CarbonRecord {
  id: string;
  behaviorType: BehaviorType;
  behaviorName: string;
  activityValue: number;
  activityUnit: string;
  factorId: string;
  factorVersion: string;
  factorSource: string;
  reductionKg: number;
  points: number;
  note: string;
  itemCategory?: string;
  itemDestination?: string;
  createdAt: number;
}

export interface CarbonSummary {
  totalReductionKg: number;
  totalPoints: number;
  recordCount: number;
  todayReductionKg: number;
  /** 生成估算的记录数，含官方因子与参考值两类。 */
  estimatedRecordCount: number;
  /** 其中采用主管部门发布因子的记录数。 */
  verifiedRecordCount: number;
  /** 未生成估算的记录数，仅保存行动事实。 */
  unestimatedRecordCount: number;
  todayEstimateCount: number;
}

export interface DailyReduction {
  dayStart: number;
  label: string;
  reductionKg: number;
}

export type TrendPeriod = 'day' | 'week' | 'month' | 'year';

export interface CategoryReduction {
  behaviorType: BehaviorType;
  behaviorName: string;
  reductionKg: number;
  recordCount: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
}
