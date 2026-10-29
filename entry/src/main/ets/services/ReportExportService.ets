import { common } from '@kit.AbilityKit';
import { fileIo as fs, picker } from '@kit.CoreFileKit';
import type { CarbonRecord } from '../domain/CarbonTypes';
import { CsvExporter } from '../domain/CsvExporter';

export class ReportExportService {
  static async exportCsv(context: common.UIAbilityContext, records: CarbonRecord[]): Promise<boolean> {
    if (records.length === 0) {
      return false;
    }

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const options = new picker.DocumentSaveOptions();
    options.newFileNames = [`CarbonMate_${now.getFullYear()}${month}${day}.csv`];
    options.fileSuffixChoices = ['CSV 报表|.csv'];

    const documentPicker = new picker.DocumentViewPicker(context);
    const uris: string[] = await documentPicker.save(options);
    if (!uris || uris.length === 0) {
      return false;
    }

    const file = fs.openSync(uris[0], fs.OpenMode.READ_WRITE | fs.OpenMode.TRUNC);
    try {
      fs.writeSync(file.fd, CsvExporter.build(records));
    } finally {
      fs.closeSync(file.fd);
    }
    return true;
  }

  static async exportBackup(context: common.UIAbilityContext, records: CarbonRecord[]): Promise<boolean> {
    const now = new Date();
    const options = new picker.DocumentSaveOptions();
    options.newFileNames = [`CarbonMate_backup_${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${now.getDate()}`.padStart(2, '0')}.json`];
    options.fileSuffixChoices = ['CarbonMate 数据备份|.json'];
    const documentPicker = new picker.DocumentViewPicker(context);
    const uris: string[] = await documentPicker.save(options);
    if (!uris || uris.length === 0) {
      return false;
    }
    const payload = JSON.stringify({ app: 'CarbonMate', formatVersion: 1, createdAt: Date.now(), records });
    const file = fs.openSync(uris[0], fs.OpenMode.READ_WRITE | fs.OpenMode.TRUNC);
    try {
      fs.writeSync(file.fd, payload);
    } finally {
      fs.closeSync(file.fd);
    }
    return true;
  }

  static async importBackup(context: common.UIAbilityContext): Promise<CarbonRecord[] | null> {
    const options = new picker.DocumentSelectOptions();
    options.fileSuffixFilters = ['CarbonMate 数据备份|.json'];
    const documentPicker = new picker.DocumentViewPicker(context);
    const uris: string[] = await documentPicker.select(options);
    if (!uris || uris.length === 0) {
      return null;
    }
    const payload: Object = JSON.parse(fs.readTextSync(uris[0]));
    const data = payload as Record<string, Object>;
    if (data['app'] !== 'CarbonMate' || data['formatVersion'] !== 1 || !Array.isArray(data['records'])) {
      throw new Error('备份文件格式不正确');
    }
    const records = data['records'] as CarbonRecord[];
    if (records.length > 100000) {
      throw new Error('备份记录无效或数量超出限制');
    }
    for (const record of records) {
      if (!ReportExportService.isValidRecord(record)) {
        throw new Error('备份记录无效或数量超出限制');
      }
    }
    return records;
  }

  private static isValidRecord(record: CarbonRecord): boolean {
    return !!record && typeof record.id === 'string' && record.id.length > 0 &&
      typeof record.behaviorType === 'string' && typeof record.behaviorName === 'string' &&
      Number.isFinite(record.activityValue) && Number.isFinite(record.reductionKg) &&
      Number.isFinite(record.points) && typeof record.note === 'string' && Number.isFinite(record.createdAt) &&
      typeof record.activityUnit === 'string' && typeof record.factorId === 'string' &&
      typeof record.factorVersion === 'string' && typeof record.factorSource === 'string';
  }
}
