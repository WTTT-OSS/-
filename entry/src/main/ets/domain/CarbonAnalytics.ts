import type { CarbonRecord, CategoryReduction, DailyReduction, TrendPeriod } from './CarbonTypes';
import { FactorRepository } from './FactorRepository';

function estimatedReduction(record: CarbonRecord): number {
  return FactorRepository.isEstimated(record.factorId, record.factorVersion)
    ? Math.max(0, record.reductionKg)
    : 0;
}

export class CarbonAnalytics {
  static buildDailyTrend(records: CarbonRecord[], now: number = Date.now(), days: number = 7): DailyReduction[] {
    const safeDays = Math.max(1, Math.floor(days));
    const endDate = new Date(now);
    endDate.setHours(0, 0, 0, 0);
    const rows: DailyReduction[] = [];

    for (let offset = safeDays - 1; offset >= 0; offset -= 1) {
      const bucketDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - offset);
      const nextDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - offset + 1);
      const dayStart = bucketDate.getTime();
      const dayEnd = nextDate.getTime();
      let reductionKg = 0;
      records.forEach((record: CarbonRecord) => {
        if (record.createdAt >= dayStart && record.createdAt < dayEnd) {
          reductionKg += estimatedReduction(record);
        }
      });
      rows.push({
        dayStart,
        label: `${bucketDate.getMonth() + 1}/${bucketDate.getDate()}`,
        reductionKg: Math.round(reductionKg * 1000) / 1000
      });
    }
    return rows;
  }

  static buildCategoryTotals(records: CarbonRecord[]): CategoryReduction[] {
    const rows: CategoryReduction[] = [];
    records.forEach((record: CarbonRecord) => {
      const existing = rows.find((row: CategoryReduction) => row.behaviorType === record.behaviorType);
      if (existing) {
        existing.reductionKg += estimatedReduction(record);
        existing.recordCount += 1;
      } else {
        rows.push({
          behaviorType: record.behaviorType,
          behaviorName: record.behaviorName,
          reductionKg: estimatedReduction(record),
          recordCount: 1
        });
      }
    });
    rows.forEach((row: CategoryReduction) => {
      row.reductionKg = Math.round(row.reductionKg * 1000) / 1000;
    });
    rows.sort((left: CategoryReduction, right: CategoryReduction) => right.reductionKg - left.reductionKg);
    return rows;
  }

  /** 按自然周（周一起）汇总最近若干周，标签为周一日期。 */
  static buildWeeklyTrend(records: CarbonRecord[], now: number = Date.now(), weeks: number = 8): DailyReduction[] {
    const safeWeeks = Math.max(1, Math.floor(weeks));
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const mondayOffset = (today.getDay() + 6) % 7;
    const thisMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
    const rows: DailyReduction[] = [];
    for (let offset = safeWeeks - 1; offset >= 0; offset -= 1) {
      const weekStart = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() - offset * 7);
      const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7);
      let reductionKg = 0;
      records.forEach((record: CarbonRecord) => {
        if (record.createdAt >= weekStart.getTime() && record.createdAt < weekEnd.getTime()) {
          reductionKg += estimatedReduction(record);
        }
      });
      rows.push({
        dayStart: weekStart.getTime(),
        label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        reductionKg: Math.round(reductionKg * 1000) / 1000
      });
    }
    return rows;
  }

  static buildTrend(records: CarbonRecord[], now: number, period: TrendPeriod): DailyReduction[] {
    if (period === 'day') {
      return this.buildDailyTrend(records, now, 7);
    }
    if (period === 'week') {
      return this.buildWeeklyTrend(records, now, 8);
    }
    const current = new Date(now);
    const rows: DailyReduction[] = [];
    const count = period === 'month' ? 6 : 5;
    for (let offset = count - 1; offset >= 0; offset -= 1) {
      const bucketStart = period === 'month'
        ? new Date(current.getFullYear(), current.getMonth() - offset, 1).getTime()
        : new Date(current.getFullYear() - offset, 0, 1).getTime();
      const bucketEnd = period === 'month'
        ? new Date(current.getFullYear(), current.getMonth() - offset + 1, 1).getTime()
        : new Date(current.getFullYear() - offset + 1, 0, 1).getTime();
      const total = records.reduce((sum: number, record: CarbonRecord) => {
        return sum + (record.createdAt >= bucketStart && record.createdAt < bucketEnd ? estimatedReduction(record) : 0);
      }, 0);
      const date = new Date(bucketStart);
      rows.push({
        dayStart: bucketStart,
        label: period === 'month' ? `${date.getMonth() + 1}月` : `${date.getFullYear()}`,
        reductionKg: Math.round(total * 1000) / 1000
      });
    }
    return rows;
  }
}

