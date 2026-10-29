import { BehaviorType } from './CarbonTypes';
import type { CalculationInput, CalculationResult, CarbonFactor } from './CarbonTypes';
import { FactorRepository } from './FactorRepository';

export class CarbonCalculator {
  static calculate(input: CalculationInput): CalculationResult {
    if (!Number.isFinite(input.activityValue) || input.activityValue <= 0) {
      throw new Error('活动量必须是大于 0 的数字');
    }

    let factor: CarbonFactor;
    if (input.behaviorType === BehaviorType.ELECTRICITY_SAVE && input.electricityMeasurementConfirmed !== true) {
      // 没有电表读数时，按用户选择的具体行动与单次节电假设换算，仍生成估算。
      factor = FactorRepository.electricityActionFactor(input.electricityAction ?? '其他节电行动');
    } else {
      factor = FactorRepository.findByBehavior(input.behaviorType);
    }
    return this.calculateWithFactor(factor, input.activityValue);
  }

  /** 按已确定的因子计算，供编辑历史记录时沿用原口径。 */
  static calculateWithFactor(factor: CarbonFactor, activityValue: number): CalculationResult {
    if (!Number.isFinite(activityValue) || activityValue <= 0) {
      throw new Error('活动量必须是大于 0 的数字');
    }
    if (!factor.estimateAvailable) {
      return {
        factor,
        reductionKg: 0,
        formulaText: '仅记录该项行动与积分；该模式不生成碳量',
        isEstimate: false
      };
    }
    const reductionKg = Math.round(activityValue * factor.factorKg * 10000) / 10000;
    const tierText = factor.tier === 'verified' ? '按官方因子估算' : '按参考值估算';

    return {
      factor,
      reductionKg,
      formulaText: `${tierText}：${activityValue} ${factor.unit} × ${factor.factorKg} kg CO₂/${factor.unit} = ${reductionKg} kg CO₂`,
      isEstimate: true
    };
  }
}
