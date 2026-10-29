import { BehaviorType } from './CarbonTypes';
import type { CarbonFactor } from './CarbonTypes';

/**
 * 因子仓库。
 *
 * 两类来源，界面上分别标注：
 * - verified：主管部门公开发布，数值可直接追溯到原文（当前为电力一项）；
 * - reference：由公开参数可复算的参考值，用于横向比较与行为激励，不作核证依据。
 *
 * 每条因子都写明单位、边界与复算方式；新增因子须同步补充黄金样例测试。
 */
/** 节电具体行动的单次节电量假设，用于按次数记录的估算。 */
export interface ElectricityActionAssumption {
  action: string;
  kwh: number;
  note: string;
}

export const ELECTRICITY_ACTIONS: ElectricityActionAssumption[] = [
  { action: '离开时随手关灯', kwh: 0.05, note: '按 10 W 灯具少开 5 小时计' },
  { action: '关闭闲置电器', kwh: 0.1, note: '按 10 W 待机功率少运行 10 小时计' },
  { action: '拔掉不用的充电器', kwh: 0.01, note: '按空载 0.4 W 少运行 24 小时计' },
  { action: '空调温度调高 1℃', kwh: 0.5, note: '按一晚 8 小时、调高 1℃ 约省 5%–8% 计' },
  { action: '减少电器待机', kwh: 0.08, note: '按 8 W 待机功率少运行 10 小时计' },
  { action: '其他节电行动', kwh: 0.05, note: '无具体场景时按保守值 0.05 kWh 计' }
];

const FACTORS: CarbonFactor[] = [
  {
    id: 'mobility_bicycle_car_avoided',
    behaviorType: BehaviorType.BICYCLE,
    name: '骑行替代小汽车',
    unit: 'km',
    factorKg: 0.171,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.171 kg CO₂/km：按汽油乘用车百公里油耗 7.3 L、汽油燃烧排放 2.33 kg CO₂/L 折算，未计入车辆制造与道路维护',
    baselineLabel: '仅对确实替代机动车出行的里程估算；骑行自身排放按 0 计，结果用于趋势比较',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'mobility_walk_car_avoided',
    behaviorType: BehaviorType.WALK,
    name: '步行替代小汽车',
    unit: 'km',
    factorKg: 0.171,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.171 kg CO₂/km：与骑行共用同一乘用车替代基准，未计入车辆制造与道路维护',
    baselineLabel: '仅统计替代机动车出行的步行距离；非替代行程按 0 计',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'mobility_bus_per_capita',
    behaviorType: BehaviorType.BUS,
    name: '公交出行替代小汽车',
    unit: 'km',
    factorKg: 0.052,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.052 kg CO₂/人·km：按公共汽电车人均能耗与柴油、天然气混合排放强度折算',
    baselineLabel: '按人均公里计算，已包含载客分摊；未计入线路绕行与空驶',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'mobility_metro_per_capita',
    behaviorType: BehaviorType.METRO,
    name: '地铁出行替代小汽车',
    unit: 'km',
    factorKg: 0.041,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.041 kg CO₂/人·km：按轨道交通人均牵引电耗与全国平均电力因子 0.5306 折算',
    baselineLabel: '按人均公里计算；未计入车站建设与设备运行的摊销',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'energy_electricity_cn_2023',
    behaviorType: BehaviorType.ELECTRICITY_SAVE,
    name: '节约用电',
    unit: 'kWh',
    factorKg: 0.5306,
    version: 'CN-EF-2023-V1',
    tier: 'verified',
    sourceLabel: '生态环境部、国家统计局《2023年电力二氧化碳排放因子》全国平均值 0.5306 kg CO₂/kWh（2025年发布）',
    baselineLabel: '仅对用户确认的节电量估算避免排放；按全国平均电网因子计算，不等于个人完整碳足迹',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'resource_water_supply',
    behaviorType: BehaviorType.WATER_SAVE,
    name: '节约用水',
    unit: 'L',
    factorKg: 0.0003,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.0003 kg CO₂/L（即 0.3 kg CO₂/m³）：按自来水制水、输配与污水处理三段平均电耗折算',
    baselineLabel: '仅对可核对的节水量估算；地区水源与处理工艺差异较大，结果用于趋势比较',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'resource_paper_recycled',
    behaviorType: BehaviorType.RECYCLE_PAPER,
    name: '纸类回收',
    unit: 'kg',
    factorKg: 1.1,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 1.1 kg CO₂/kg：按再生纸相比原生浆造纸的能耗与化学品投入差额折算',
    baselineLabel: '按实际回收并进入再生流程的纸类质量估算；混合垃圾中的纸类不计入',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'food_clean_plate_avoided',
    behaviorType: BehaviorType.CLEAN_PLATE,
    name: '光盘行动',
    unit: '次',
    factorKg: 0.15,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 0.15 kg CO₂/次：按每餐次避免浪费食物约 0.06 kg、食物系统平均排放强度 2.5 kg CO₂e/kg 折算',
    baselineLabel: '按完成光盘的用餐次数估算；剩余食物未称量时存在误差',
    demoOnly: false,
    estimateAvailable: true
  },
  {
    id: 'reuse_item_secondhand',
    behaviorType: BehaviorType.REUSE_ITEM,
    name: '旧物再利用',
    unit: '件',
    factorKg: 3,
    version: 'CN-REF-2024-V1',
    tier: 'reference',
    sourceLabel: '参考值 3 kg CO₂/件：按衣物、书籍、小家电等常见闲置物的平均生产阶段排放取保守估计',
    baselineLabel: '按件估算，未区分物品类别、成色与运输距离，误差区间较大，仅用于趋势比较',
    demoOnly: false,
    estimateAvailable: true
  }
];

export class FactorRepository {
  static list(): CarbonFactor[] {
    return FACTORS.slice();
  }

  static findByBehavior(type: BehaviorType): CarbonFactor {
    const factor = FACTORS.find((item: CarbonFactor) => item.behaviorType === type);
    if (!factor) {
      throw new Error(`Unsupported behavior type: ${type}`);
    }
    return factor;
  }

  /**
   * 节电“记录具体行动”口径：按次数记录，用单次节电量假设换算。
   * 系数 = 单次节电 kWh × 官方电力因子，等级为参考估算。
   */
  static electricityActionFactor(action: string): CarbonFactor {
    const matched = ELECTRICITY_ACTIONS.find((item: ElectricityActionAssumption) => item.action === action)
      || ELECTRICITY_ACTIONS[ELECTRICITY_ACTIONS.length - 1];
    const index = ELECTRICITY_ACTIONS.indexOf(matched) + 1;
    const electricity = this.findByBehavior(BehaviorType.ELECTRICITY_SAVE);
    return {
      ...electricity,
      id: `energy_electricity_action_${index}`,
      name: matched.action,
      unit: '次',
      factorKg: matched.kwh * electricity.factorKg,
      version: 'CN-REF-2024-V1',
      tier: 'reference',
      sourceLabel: `参考值 ${(matched.kwh * electricity.factorKg).toFixed(4)} kg CO₂/次：`
        + `单次节电约 ${matched.kwh} kWh（${matched.note}）× ${electricity.factorKg} kg CO₂/kWh`,
      baselineLabel: '按行动次数与单次节电假设估算；有电表读数时改用计量模式更准确',
      estimateAvailable: true
    };
  }

  /** 按标识与版本精确查找因子，用于编辑历史记录时沿用原口径。 */
  static findById(factorId: string, version: string): CarbonFactor | null {
    const direct = FACTORS.find((item: CarbonFactor) => item.id === factorId && item.version === version);
    if (direct) return direct;
    if (version !== 'CN-REF-2024-V1') return null;
    const matched = /^energy_electricity_action_(\d+)$/.exec(factorId);
    if (matched === null) return null;
    const index = Number(matched[1]) - 1;
    if (index < 0 || index >= ELECTRICITY_ACTIONS.length) return null;
    return this.electricityActionFactor(ELECTRICITY_ACTIONS[index].action);
  }

  /** 该记录是否可生成碳量估算，含参考值。 */
  static isEstimated(factorId: string, version: string): boolean {
    const factor = this.findById(factorId, version);
    return factor !== null && factor.estimateAvailable && !factor.demoOnly;
  }

  /** 该记录是否采用主管部门发布的因子。 */
  static isVerified(factorId: string, version: string): boolean {
    const factor = this.findById(factorId, version);
    return factor !== null && factor.estimateAvailable && !factor.demoOnly && factor.tier === 'verified';
  }

  /** 记录的估算等级标签，用于列表、导出与汇总说明。 */
  static tierLabel(factorId: string, version: string): string {
    if (this.isVerified(factorId, version)) return '官方因子';
    if (this.isEstimated(factorId, version)) return '参考估算';
    if (version === 'DEMO_V1') return '旧版演示值';
    return '未估算';
  }
}
