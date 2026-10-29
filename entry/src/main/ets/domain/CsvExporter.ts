import type { CarbonRecord } from './CarbonTypes';
import { FactorRepository } from './FactorRepository';

export class CsvExporter {
  static build(records: CarbonRecord[]): string {
    const headers: string[] = [
      '记录ID',
      '行为',
      '活动量',
      '单位',
      '碳排放估算kgCO2（未估算则为空）',
      '估算等级',
      '积分',
      '因子ID',
      '因子版本',
      '因子来源',
      '物品类别',
      '处理去向',
      '备注',
      '记录时间'
    ];
    const lines: string[] = [headers.map((value: string) => this.escape(value)).join(',')];

    records.forEach((record: CarbonRecord) => {
      const estimated = FactorRepository.isEstimated(record.factorId, record.factorVersion);
      const values: string[] = [
        record.id,
        record.behaviorName,
        `${record.activityValue}`,
        record.activityUnit,
        estimated ? `${record.reductionKg}` : '',
        FactorRepository.tierLabel(record.factorId, record.factorVersion),
        `${record.points}`,
        record.factorId,
        record.factorVersion,
        record.factorSource,
        record.itemCategory ?? '',
        record.itemDestination ?? '',
        record.note,
        new Date(record.createdAt).toISOString()
      ];
      lines.push(values.map((value: string) => this.escape(value)).join(','));
    });

    return `\uFEFF${lines.join('\r\n')}`;
  }

  private static escape(value: string): string {
    const escaped = value.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
      return `"${escaped}"`;
    }
    return escaped;
  }
}
