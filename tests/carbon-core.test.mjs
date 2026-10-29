import test from 'node:test';
import assert from 'node:assert/strict';

import { CarbonCalculator } from '../entry/src/main/ets/domain/CarbonCalculator.ts';
import { CarbonAnalytics } from '../entry/src/main/ets/domain/CarbonAnalytics.ts';
import { CsvExporter } from '../entry/src/main/ets/domain/CsvExporter.ts';
import { BehaviorType } from '../entry/src/main/ets/domain/CarbonTypes.ts';
import { FactorRepository } from '../entry/src/main/ets/domain/FactorRepository.ts';
import { PointsEngine } from '../entry/src/main/ets/domain/PointsEngine.ts';
import { TaskEngine } from '../entry/src/main/ets/domain/TaskEngine.ts';
import { matchesClientToken, requiresClientToken } from '../server/ai-gateway-security.mjs';
import '../web-preview/record-data.js';

const PreviewRecordData = globalThis.CarbonMateRecordData;

/** 因子标识与版本，用于构造历史记录夹具。 */
const FACTOR_REF = {
  BICYCLE: ['mobility_bicycle_car_avoided', 'CN-REF-2024-V1'],
  WALK: ['mobility_walk_car_avoided', 'CN-REF-2024-V1'],
  BUS: ['mobility_bus_per_capita', 'CN-REF-2024-V1'],
  METRO: ['mobility_metro_per_capita', 'CN-REF-2024-V1'],
  ELECTRICITY_SAVE: ['energy_electricity_cn_2023', 'CN-EF-2023-V1'],
  WATER_SAVE: ['resource_water_supply', 'CN-REF-2024-V1'],
  RECYCLE_PAPER: ['resource_paper_recycled', 'CN-REF-2024-V1'],
  CLEAN_PLATE: ['food_clean_plate_avoided', 'CN-REF-2024-V1'],
  REUSE_ITEM: ['reuse_item_secondhand', 'CN-REF-2024-V1']
};

function record(id, type, name, reductionKg, createdAt) {
  const ref = FACTOR_REF[type];
  return {
    id,
    behaviorType: type,
    behaviorName: name,
    activityValue: 1,
    activityUnit: 'km',
    factorId: ref[0],
    factorVersion: ref[1],
    factorSource: 'test fixture',
    reductionKg,
    points: 1,
    note: '',
    itemCategory: '',
    itemDestination: '',
    createdAt
  };
}

function calculate(type, value, confirmed = false) {
  return CarbonCalculator.calculate({
    behaviorType: type,
    activityValue: value,
    electricityMeasurementConfirmed: confirmed
  });
}

test('节电行动按单次节电假设生成估算', () => {
  const result = CarbonCalculator.calculate({
    behaviorType: BehaviorType.ELECTRICITY_SAVE,
    activityValue: 2,
    electricityAction: '离开时随手关灯'
  });
  // 0.05 kWh × 0.5306 = 0.02653 kg/次，2 次合计 0.0531
  assert.equal(result.reductionKg, 0.0531);
  assert.equal(result.isEstimate, true);
  assert.equal(result.factor.unit, '次');
  assert.equal(result.factor.tier, 'reference');
  assert.match(result.formulaText, /按参考值估算/);
});

test('节电行动缺省时按“其他节电行动”的保守值估算', () => {
  const result = CarbonCalculator.calculate({ behaviorType: BehaviorType.ELECTRICITY_SAVE, activityValue: 1 });
  assert.equal(result.reductionKg, 0.0265);
  assert.equal(result.isEstimate, true);
  assert.equal(result.factor.name, '其他节电行动');
});

test('六项节电行动的系数随单次节电量变化', () => {
  const cases = [
    ['离开时随手关灯', 2, 0.0531],
    ['关闭闲置电器', 3, 0.1592],
    ['拔掉不用的充电器', 10, 0.0531],
    ['空调温度调高 1℃', 2, 0.5306],
    ['减少电器待机', 1, 0.0424],
    ['其他节电行动', 1, 0.0265]
  ];
  cases.forEach((row) => {
    const factor = FactorRepository.electricityActionFactor(row[0]);
    const result = CarbonCalculator.calculateWithFactor(factor, row[1]);
    assert.equal(result.reductionKg, row[2], `${row[0]} 数值不符`);
    assert.equal(result.isEstimate, true);
  });
});

test('计量节电按官方因子估算并标注等级', () => {
  const result = calculate(BehaviorType.ELECTRICITY_SAVE, 2, true);
  assert.equal(result.reductionKg, 1.0612);
  assert.equal(result.factor.version, 'CN-EF-2023-V1');
  assert.equal(result.factor.tier, 'verified');
  assert.equal(result.isEstimate, true);
  assert.match(result.formulaText, /按官方因子估算/);
  assert.match(result.factor.sourceLabel, /生态环境部、国家统计局/);
});

test('八类参考行为均可生成碳量并标注参考值', () => {
  const cases = [
    [BehaviorType.BICYCLE, 10, 1.71],
    [BehaviorType.WALK, 10, 1.71],
    [BehaviorType.BUS, 10, 0.52],
    [BehaviorType.METRO, 10, 0.41],
    [BehaviorType.WATER_SAVE, 100, 0.03],
    [BehaviorType.RECYCLE_PAPER, 2, 2.2],
    [BehaviorType.CLEAN_PLATE, 2, 0.3],
    [BehaviorType.REUSE_ITEM, 2, 6]
  ];
  cases.forEach((item) => {
    const type = item[0];
    const result = calculate(type, item[1]);
    assert.equal(result.isEstimate, true, `${type} 应生成估算`);
    assert.equal(result.reductionKg, item[2], `${type} 数值不符`);
    assert.match(result.formulaText, /按参考值估算/, `${type} 应标注参考值`);
    assert.equal(result.factor.tier, 'reference');
  });
});

test('拒绝无效活动量', () => {
  assert.throws(() => calculate(BehaviorType.BUS, 0), /大于 0/);
  assert.throws(() => calculate(BehaviorType.BUS, Number.NaN), /大于 0/);
});

test('积分与碳量脱钩并受每日条数限制', () => {
  assert.equal(PointsEngine.pointsForAction(0), 5);
  assert.equal(PointsEngine.pointsForAction(4), 5);
  assert.equal(PointsEngine.pointsForAction(5), 0);
  assert.equal(PointsEngine.pointsForAction(100), 0);
});

test('因子仓库为九条完整定义，仅电力属于官方因子', () => {
  const factors = FactorRepository.list();
  assert.equal(factors.length, 9);
  const types = new Set(factors.map((item) => item.behaviorType));
  assert.equal(types.size, 9);
  factors.forEach((factor) => {
    assert.ok(factor.id.length > 0);
    assert.equal(factor.estimateAvailable, true);
    assert.equal(factor.demoOnly, false);
    assert.ok(factor.factorKg > 0, `${factor.name} 因子应大于 0`);
    assert.ok(factor.sourceLabel.length > 10, `${factor.name} 缺少来源说明`);
    if (factor.behaviorType === BehaviorType.ELECTRICITY_SAVE) {
      assert.equal(factor.tier, 'verified');
    } else {
      assert.equal(factor.tier, 'reference');
    }
  });
});

test('估算等级标签区分官方因子、参考估算与未估算', () => {
  assert.equal(FactorRepository.tierLabel('energy_electricity_cn_2023', 'CN-EF-2023-V1'), '官方因子');
  assert.equal(FactorRepository.tierLabel('resource_water_supply', 'CN-REF-2024-V1'), '参考估算');
  assert.equal(FactorRepository.tierLabel('energy_electricity_action_1', 'CN-REF-2024-V1'), '参考估算');
  assert.equal(FactorRepository.tierLabel('unknown_factor', 'V0'), '未估算');
  assert.equal(FactorRepository.tierLabel('mobility_bicycle_demo', 'DEMO_V1'), '旧版演示值');
  assert.equal(FactorRepository.isVerified('resource_water_supply', 'CN-REF-2024-V1'), false);
  assert.equal(FactorRepository.isEstimated('resource_water_supply', 'CN-REF-2024-V1'), true);
});

test('七日趋势按日期分桶并包含空日期', () => {
  const now = new Date(2026, 9, 2, 12, 0, 0).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const records = [
    record('r1', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.8, now - oneDay),
    record('r2', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.2, now)
  ];
  const trend = CarbonAnalytics.buildDailyTrend(records, now, 3);
  assert.equal(trend.length, 3);
  assert.deepEqual(trend.map((item) => item.reductionKg), [0, 0.8, 0.2]);
});

test('类别合计同时纳入官方因子与参考估算', () => {
  const now = Date.now();
  const totals = CarbonAnalytics.buildCategoryTotals([
    record('r1', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.2, now),
    record('r2', BehaviorType.BICYCLE, '骑行替代小汽车', 0.8, now),
    record('r3', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.3, now)
  ]);
  const electricity = totals.find((item) => item.behaviorType === BehaviorType.ELECTRICITY_SAVE);
  const bicycle = totals.find((item) => item.behaviorType === BehaviorType.BICYCLE);
  assert.equal(electricity.reductionKg, 0.5);
  assert.equal(electricity.recordCount, 2);
  assert.equal(bicycle.reductionKg, 0.8);
  assert.equal(bicycle.recordCount, 1);
});

test('周桶按周一起算，跨周记录落入正确区间', () => {
  const now = new Date(2026, 9, 7, 12, 0, 0).getTime(); // 2026-10-07 周三
  const records = [
    record('this-week', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.5, new Date(2026, 9, 5, 9).getTime()),
    record('last-week', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.3, new Date(2026, 8, 29, 9).getTime())
  ];
  const weeks = CarbonAnalytics.buildTrend(records, now, 'week');
  assert.equal(weeks.length, 8);
  assert.equal(weeks[7].reductionKg, 0.5);
  assert.equal(weeks[6].reductionKg, 0.3);
  assert.equal(weeks[7].label, '10/5');
});

test('月桶与年桶按真实日历切分', () => {
  const now = new Date(2026, 9, 7, 12, 0, 0).getTime();
  const records = [
    record('sep', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.4, new Date(2026, 8, 30, 12).getTime()),
    record('oct', BehaviorType.ELECTRICITY_SAVE, '节约用电', 0.8, new Date(2026, 9, 3, 12).getTime()),
    record('prev-year', BehaviorType.ELECTRICITY_SAVE, '节约用电', 1.2, new Date(2025, 9, 3, 12).getTime())
  ];
  const months = CarbonAnalytics.buildTrend(records, now, 'month');
  assert.deepEqual(months.map((item) => item.label), ['5月', '6月', '7月', '8月', '9月', '10月']);
  assert.equal(months[4].reductionKg, 0.4);
  assert.equal(months[5].reductionKg, 0.8);
  const years = CarbonAnalytics.buildTrend(records, now, 'year');
  assert.deepEqual(years.map((item) => item.label), ['2022', '2023', '2024', '2025', '2026']);
  assert.equal(years[3].reductionKg, 1.2);
  assert.equal(years[4].reductionKg, 1.2);
});

test('旧版演示来源的数值不进入趋势与构成', () => {
  const now = new Date(2026, 9, 7, 12, 0, 0).getTime();
  const oldDemo = record('legacy-demo', BehaviorType.BICYCLE, '骑行', 9.99, now);
  oldDemo.factorId = 'mobility_bicycle_demo';
  oldDemo.factorVersion = 'DEMO_V1';
  const verified = record('verified-electricity', BehaviorType.ELECTRICITY_SAVE, '节约用电', 1.2, now);
  const trend = CarbonAnalytics.buildDailyTrend([oldDemo, verified], now, 1);
  assert.equal(trend[0].reductionKg, 1.2);
  const totals = CarbonAnalytics.buildCategoryTotals([oldDemo, verified]);
  assert.equal(totals.find((item) => item.behaviorType === BehaviorType.BICYCLE).reductionKg, 0);
});

test('网页端仅接受数值与因子一致的估算记录', () => {
  const water = { kind: 'water', value: 100, reduction: 0.03 };
  assert.equal(PreviewRecordData.isEstimated(water), true);
  assert.equal(PreviewRecordData.isEstimated({ ...water, reduction: 5 }), false);
  assert.equal(PreviewRecordData.isEstimated({ ...water, notEstimated: true }), false);
  const official = { kind: 'electricity', value: 2, reduction: 1.061, factorId: 'energy_electricity_cn_2023', factorVersion: 'CN-EF-2023-V1' };
  assert.equal(PreviewRecordData.isVerifiedEstimate(official), true);
  assert.equal(PreviewRecordData.isVerifiedEstimate({ ...official, kind: 'bicycle' }), false);
});

test('每日任务按行动事实判定', () => {
  const now = new Date(2026, 9, 2, 12, 0, 0).getTime();
  const tasks = TaskEngine.buildTodayTasks([
    record('r1', BehaviorType.BICYCLE, '骑行', 0.8, now - 1000),
    record('r2', BehaviorType.WALK, '步行', 0.3, now - 500)
  ], now);
  assert.equal(tasks[0].completed, true);
  assert.equal(tasks[1].progress, 2);
  assert.equal(tasks[1].completed, false);
  assert.equal(tasks[2].completed, true);
  assert.equal(tasks.length, 6);
});

test('CSV 导出包含估算列、等级列并正确转义', () => {
  const now = new Date(2026, 9, 2, 12, 0, 0).getTime();
  const item = record('r1', BehaviorType.BICYCLE, '骑行替代小汽车', 1.71, now);
  item.note = '路线包含,逗号和"引号"';
  item.factorSource = '参考值来源';
  const csv = CsvExporter.build([item]);
  assert.equal(csv.charCodeAt(0), 0xFEFF);
  assert.match(csv, /估算等级/);
  assert.match(csv, /参考估算/);
  assert.match(csv, /因子版本/);
  assert.match(csv, /"路线包含,逗号和""引号"""/);
  assert.match(csv, /参考值来源/);
});

test('局域网网关要求长令牌并拒绝不匹配', () => {
  assert.equal(requiresClientToken('127.0.0.1'), false);
  assert.equal(requiresClientToken('0.0.0.0'), true);
  assert.equal(matchesClientToken('Bearer carbonmate-test-token-123456789', 'carbonmate-test-token-123456789'), true);
  assert.equal(matchesClientToken('Bearer wrong-token', 'carbonmate-test-token-123456789'), false);
  assert.equal(matchesClientToken(undefined, 'carbonmate-test-token-123456789'), false);
});
