import { common } from '@kit.AbilityKit';
import { RecordRow } from '../components/RecordRow';
import { SectionTitle } from '../components/SectionTitle';
import { CarbonAnalytics } from '../domain/CarbonAnalytics';
import { CarbonRecord, CarbonSummary, CategoryReduction, DailyReduction, TrendPeriod } from '../domain/CarbonTypes';
import { CarbonRecordService } from '../services/CarbonRecordService';
import { ReportExportService } from '../services/ReportExportService';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { TrendChart } from '../components/TrendChart';

interface TrendOption {
  key: TrendPeriod;
  label: string;
}

const TREND_OPTIONS: TrendOption[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' }
];

@Component
export struct DataPage {
  @StorageLink('recordRevision') @Watch('onRecordRevisionChanged') recordRevision: number = 0;
  @State records: CarbonRecord[] = [];
  @State allRecords: CarbonRecord[] = [];
  @State summary: CarbonSummary = {
    totalReductionKg: 0,
    totalPoints: 0,
    recordCount: 0,
    todayReductionKg: 0,
    estimatedRecordCount: 0,
    verifiedRecordCount: 0,
    unestimatedRecordCount: 0,
    todayEstimateCount: 0
  };
  @State dailyTrend: DailyReduction[] = [];
  @State categoryTotals: CategoryReduction[] = [];
  @State exportMessage: string = '';
  @State isExporting: boolean = false;
  @State editingRecord: CarbonRecord | null = null;
  @State editActivityValue: string = '';
  @State editNote: string = '';
  @State trendPeriod: TrendPeriod = 'day';
  @State chartMode: string = 'bar';
  @State historyCategory: string = '全部';
  private nextDayTimer: number = -1;
  onStartRecord: () => void = () => {};

  aboutToAppear(): void {
    this.refresh();
    this.scheduleDayRefresh();
  }

  aboutToDisappear(): void {
    if (this.nextDayTimer >= 0) clearTimeout(this.nextDayTimer);
  }

  private scheduleDayRefresh(): void {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    this.nextDayTimer = setTimeout(() => {
      this.refresh();
      this.scheduleDayRefresh();
    }, tomorrow - now.getTime() + 1000);
  }

  onRecordRevisionChanged(): void {
    this.refresh();
  }

  private async refresh(): Promise<void> {
    try {
      const service = CarbonRecordService.getInstance();
      const allRecords = await service.recentRecords(100000);
      this.allRecords = allRecords;
      this.records = allRecords;
      this.summary = await service.summary();
      this.dailyTrend = CarbonAnalytics.buildTrend(allRecords, Date.now(), this.trendPeriod);
      this.categoryTotals = CarbonAnalytics.buildCategoryTotals(this.periodRecords());
    } catch (_) {
      this.records = [];
    }
  }

  private trendMax(): number {
    let max = 0;
    this.dailyTrend.forEach((item: DailyReduction) => {
      max = Math.max(max, item.reductionKg);
    });
    return max <= 0 ? 1 : max;
  }

  private estimatedCategories(): CategoryReduction[] {
    return this.categoryTotals.filter((item: CategoryReduction) => item.reductionKg > 0);
  }

  private actionOnlyCategories(): CategoryReduction[] {
    return this.categoryTotals.filter((item: CategoryReduction) => item.reductionKg <= 0);
  }

  private selectTrendPeriod(period: TrendPeriod): void {
    this.trendPeriod = period;
    this.dailyTrend = CarbonAnalytics.buildTrend(this.allRecords, Date.now(), period);
    this.categoryTotals = CarbonAnalytics.buildCategoryTotals(this.periodRecords());
  }

  private periodRecords(): CarbonRecord[] {
    const now = new Date();
    let start = 0;
    if (this.trendPeriod === 'day') {
      now.setHours(0, 0, 0, 0);
      start = now.getTime() - 6 * 24 * 60 * 60 * 1000;
    } else if (this.trendPeriod === 'week') {
      const mondayOffset = (now.getDay() + 6) % 7;
      const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
      start = new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() - 49).getTime();
    } else if (this.trendPeriod === 'month') {
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime();
    } else {
      start = new Date(now.getFullYear() - 4, 0, 1).getTime();
    }
    return this.allRecords.filter((record: CarbonRecord) => record.createdAt >= start && record.createdAt <= Date.now());
  }

  private trendTitle(): string {
    if (this.trendPeriod === 'day') return '近 7 天碳排放估算';
    if (this.trendPeriod === 'week') return '近 8 周碳排放估算';
    if (this.trendPeriod === 'month') return '近 6 个月碳排放估算';
    return '近 5 年碳排放估算';
  }

  private trendHasData(): boolean {
    return this.dailyTrend.some((item: DailyReduction) => item.reductionKg > 0);
  }

  private trendHasRecords(): boolean {
    if (this.dailyTrend.length === 0) return false;
    const start = this.dailyTrend[0].dayStart;
    return this.allRecords.some((record: CarbonRecord) => record.createdAt >= start && record.createdAt <= Date.now());
  }

  private categoryShare(item: CategoryReduction): number {
    const estimated = this.categoryTotals.reduce((sum: number, row: CategoryReduction) => sum + row.reductionKg, 0);
    return estimated > 0 ? Math.round(item.reductionKg / estimated * 100) : 0;
  }

  private recordCategories(): string[] {
    const labels: string[] = ['全部'];
    this.allRecords.forEach((record: CarbonRecord) => {
      if (!labels.includes(record.behaviorName)) labels.push(record.behaviorName);
    });
    return labels;
  }

  private filteredHistory(): CarbonRecord[] {
    return this.periodRecords().filter((record: CarbonRecord) => {
      return this.historyCategory === '全部' || record.behaviorName === this.historyCategory;
    });
  }

  private async exportCsv(): Promise<void> {
    if (this.records.length === 0 || this.isExporting) {
      return;
    }
    this.isExporting = true;
    this.exportMessage = '';
    try {
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const allRecords = await CarbonRecordService.getInstance().recentRecords(10000);
      const saved = await ReportExportService.exportCsv(context, allRecords);
      this.exportMessage = saved ? 'CSV 报表已保存' : '未保存报表';
    } catch (_) {
      this.exportMessage = '导出失败，请重新选择保存位置';
    } finally {
      this.isExporting = false;
    }
  }

  private async exportBackup(): Promise<void> {
    if (this.isExporting) return;
    this.isExporting = true;
    this.exportMessage = '';
    try {
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const allRecords = await CarbonRecordService.getInstance().recentRecords(100000);
      const saved = await ReportExportService.exportBackup(context, allRecords);
      this.exportMessage = saved ? `已备份 ${allRecords.length} 条记录` : '未保存备份';
    } catch (_) {
      this.exportMessage = '备份失败，请重试';
    } finally {
      this.isExporting = false;
    }
  }

  private async importBackup(): Promise<void> {
    if (this.isExporting) return;
    this.isExporting = true;
    this.exportMessage = '';
    try {
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const records = await ReportExportService.importBackup(context);
      if (records === null) {
        this.exportMessage = '未选择备份文件';
        return;
      }
      const imported = await CarbonRecordService.getInstance().importRecords(records);
      this.exportMessage = `导入完成：新增 ${imported} 条，跳过重复 ${records.length - imported} 条`;
      AppStorage.setOrCreate<number>('recordRevision', this.recordRevision + 1);
      await this.refresh();
    } catch (_) {
      this.exportMessage = '导入失败：文件格式无效或无法读取';
    } finally {
      this.isExporting = false;
    }
  }

  private beginEdit(record: CarbonRecord): void {
    this.editingRecord = record;
    this.editActivityValue = `${record.activityValue}`;
    this.editNote = record.note;
  }

  private saveEdit(): void {
    const record = this.editingRecord;
    const value = Number(this.editActivityValue);
    if (!record || !Number.isFinite(value) || value <= 0) {
      this.exportMessage = '活动量需填写大于 0 的数字';
      return;
    }
    void CarbonRecordService.getInstance().updateManualRecord(record, value, this.editNote).then(() => {
      this.editingRecord = null;
      AppStorage.setOrCreate<number>('recordRevision', this.recordRevision + 1);
      void this.refresh();
    }).catch(() => {
      this.exportMessage = '修改失败，请重试';
    });
  }

  private confirmDelete(record: CarbonRecord): void {
    this.getUIContext().showAlertDialog({
      title: '删除这条记录？',
      message: '删除后将同步撤回对应积分，且无法从应用内恢复。',
      primaryButton: {
        value: '删除',
        action: () => {
          void CarbonRecordService.getInstance().deleteRecord(record.id).then(() => {
            AppStorage.setOrCreate<number>('recordRevision', this.recordRevision + 1);
            void this.refresh();
          }).catch(() => {
            this.exportMessage = '删除失败，请重试';
          });
        }
      },
      secondaryButton: { value: '取消', action: () => {} }
    });
  }

  build() {
    Scroll() {
      Column({ space: 16 }) {
      SectionTitle({ title: '数据与记录', subtitle: '汇总数据可以追溯到每一条原始记录' })

      Row() {
        Column({ space: 4 }) {
          Text('累计减碳量（估算）'
            .fontSize(12)
            .fontColor('#73786E')
          Text(this.summary.estimatedRecordCount > 0 ? `${this.summary.totalReductionKg.toFixed(3)} kg CO₂` : '暂无估算')
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#315B45')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)

        Column({ space: 4 }) {
          Text('记录数')
            .fontSize(12)
            .fontColor('#73786E')
          Text(`${this.summary.recordCount}`)
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .padding(18)
      .backgroundColor('#E9EEE4')
      .borderRadius(18)

      Row({ space: 10 }) {
        Button(this.isExporting ? '正在导出…' : '导出 CSV 报表')
          .layoutWeight(1)
          .height(44)
          .fontColor('#315B45')
          .backgroundColor('#E9EEE4')
          .borderRadius(14)
          .enabled(this.records.length > 0 && !this.isExporting)
          .onClick(() => this.exportCsv())
        Button(this.isExporting ? '处理中…' : '备份数据')
          .height(44)
          .fontColor('#315B45')
          .backgroundColor('#E9EEE4')
          .borderRadius(14)
          .enabled(!this.isExporting)
          .onClick(() => this.exportBackup())
        Button('导入备份')
          .height(44)
          .fontColor('#315B45')
          .backgroundColor('#E9EEE4')
          .borderRadius(14)
          .enabled(!this.isExporting)
          .onClick(() => this.importBackup())
        if (this.exportMessage.length > 0) {
          Text(this.exportMessage)
            .fontSize(12)
            .fontColor('#73786E')
        }
      }
      .width('100%')

      Column({ space: 12 }) {
        Row() {
          Text(this.trendTitle())
            .fontSize(17)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
            .layoutWeight(1)
          ForEach(TREND_OPTIONS, (option: TrendOption) => {
            Button(option.label)
              .fontSize(12)
              .fontColor(this.trendPeriod === option.key ? '#FFFFFF' : '#315B45')
              .backgroundColor(this.trendPeriod === option.key ? '#315B45' : '#E9EEE4')
              .borderRadius(12)
              .onClick(() => this.selectTrendPeriod(option.key as TrendPeriod))
          }, (option: TrendOption) => option.key)
        }
        .width('100%')
        Row({ space: 8 }) {
          Button('柱状图')
            .fontSize(11)
            .fontColor(this.chartMode === 'bar' ? '#FFFFFF' : '#315B45')
            .backgroundColor(this.chartMode === 'bar' ? '#315B45' : '#E9EEE4')
            .borderRadius(10)
            .onClick(() => this.chartMode = 'bar')
          Button('折线图')
            .fontSize(11)
            .fontColor(this.chartMode === 'line' ? '#FFFFFF' : '#315B45')
            .backgroundColor(this.chartMode === 'line' ? '#315B45' : '#E9EEE4')
            .borderRadius(10)
            .onClick(() => this.chartMode = 'line')
        }
        .width('100%')
        .justifyContent(FlexAlign.End)
        TrendChart({ items: this.dailyTrend, mode: this.chartMode })
        if (!this.trendHasData()) {
          Column({ space: 8 }) {
            Text(this.trendHasRecords() ? '有行动记录，但暂无可展示的减排估算' : this.trendPeriod === 'day' ? '近 7 天还没有行动记录' : '这个时间范围还没有行动记录')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#536257')
            if (!this.trendHasRecords()) {
              Button('记录今天的行动')
                .fontSize(13)
                .fontColor('#315B45')
                .backgroundColor('#E9EEE4')
                .onClick(() => this.onStartRecord())
            }
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
          .padding({ top: 12, bottom: 2 })
        }
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFFDF8')
      .borderRadius(18)

      if (this.estimatedCategories().length > 0 || this.actionOnlyCategories().length > 0) {
        Column({ space: 12 }) {
          Text('行动估算构成')
            .fontSize(17)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
          if (this.estimatedCategories().length > 0) {
            CategoryPieChart({ items: this.estimatedCategories() })
            Text('按因子等级分别标注：官方因子可直接追溯，参考值用于趋势比较，均不代表核证减排。')
              .fontSize(12)
              .fontColor('#8A5A24')
              .lineHeight(18)
          } else {
            Text('当前记录均未生成碳量，暂无可绘制的构成。')
              .fontSize(13)
              .fontColor('#69766C')
          }
          if (this.actionOnlyCategories().length > 0) {
            Text('未生成估算')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#26372D')
            ForEach(this.actionOnlyCategories(), (item: CategoryReduction) => {
              Row() {
                Text(item.behaviorName)
                  .fontSize(13)
                  .fontColor('#35483B')
                  .layoutWeight(1)
                Text(`${item.recordCount} 条 · 未生成估算`)
                  .fontSize(12)
                  .fontColor('#73786E')
              }
              .width('100%')
            }, (item: CategoryReduction) => `action_${item.behaviorType}`)
          }
          ForEach(this.estimatedCategories(), (item: CategoryReduction) => {
            Row({ space: 8 }) {
              Row()
                .width(8)
                .height(8)
                .backgroundColor('#78936C')
                .borderRadius(4)
              Column({ space: 3 }) {
                Text(item.behaviorName)
                  .fontSize(13)
                  .fontColor('#35483B')
                Text(`${item.recordCount} 条记录`)
                  .fontSize(12)
                  .fontColor('#73786E')
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              Text(`${item.reductionKg.toFixed(3)} kg · ${this.categoryShare(item)}%`)
                .fontSize(12)
                .fontColor('#536257')
            }
            .width('100%')
          }, (item: CategoryReduction) => item.behaviorType)
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFDF8')
        .borderRadius(18)
      }

      Column({ space: 10 }) {
        Row() {
          Text('记录明细')
            .fontSize(17)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
            .layoutWeight(1)
          Text(this.trendPeriod === 'day' ? '近 7 天' : this.trendPeriod === 'week' ? '近 8 周' : this.trendPeriod === 'month' ? '近 6 个月' : '近 5 年')
            .fontSize(12)
            .fontColor('#778174')
        }
        .width('100%')
        Scroll() {
          Row({ space: 7 }) {
            ForEach(this.recordCategories(), (category: string) => {
              Button(category)
                .fontSize(12)
                .fontColor(this.historyCategory === category ? '#FFFFFF' : '#315B45')
                .backgroundColor(this.historyCategory === category ? '#315B45' : '#E9EEE4')
                .onClick(() => this.historyCategory = category)
            }, (category: string) => category)
          }
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
        .width('100%')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)

      if (this.filteredHistory().length === 0) {
        Column({ space: 10 }) {
          Text(this.allRecords.length === 0 ? '暂无行动记录' : '当前筛选范围没有记录')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#536257')
          Text(this.allRecords.length === 0 ? '从记录一条真实行动开始，数据会保存在本机。' : '试试切换时间范围或行为类别。')
            .fontSize(14)
            .fontColor('#777D72')
        }
        .width('100%')
        .padding(32)
      } else {
        ForEach(this.filteredHistory(), (record: CarbonRecord) => {
          Column({ space: 6 }) {
            RecordRow({ record })
            Row({ space: 8 }) {
              Button('编辑记录')
                .layoutWeight(1)
                .height(34)
                .fontSize(12)
                .fontColor('#315B45')
                .backgroundColor('#E9EEE4')
                .onClick(() => this.beginEdit(record))
              Button('删除')
                .height(34)
                .fontSize(12)
                .fontColor('#A53A32')
                .backgroundColor('#FCEDEA')
                .onClick(() => this.confirmDelete(record))
              }
              .width('100%')
          }
          .width('100%')
        }, (record: CarbonRecord) => record.id)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F0E7')
    .padding({ left: 18, right: 18, top: 20, bottom: 96 })
    .bindSheet(this.editingRecord !== null, this.editSheet(), { height: 360, dragBar: true })
  }
  }

  @Builder
  private editSheet() {
    Column({ space: 14 }) {
      Text('编辑低碳记录')
        .fontSize(19)
        .fontWeight(FontWeight.Bold)
        .fontColor('#26372D')
      if (this.editingRecord !== null) {
        Text(`${this.editingRecord.behaviorName}（${this.editingRecord.activityUnit}）`)
          .fontSize(13)
          .fontColor('#73786E')
      }
      TextInput({ text: this.editActivityValue, placeholder: '活动量' })
        .type(InputType.Number)
        .onChange((value: string) => this.editActivityValue = value)
      TextInput({ text: this.editNote, placeholder: '备注（可选）' })
        .onChange((value: string) => this.editNote = value)
      Text('仅具备适用来源的计量记录才会重新估算；其他行动只保存记录，积分独立计算。')
        .fontSize(12)
        .fontColor('#748078')
      Row({ space: 10 }) {
        Button('取消')
          .layoutWeight(1)
          .onClick(() => this.editingRecord = null)
        Button('保存修改')
          .layoutWeight(1)
          .fontColor('#FFFFFF')
          .backgroundColor('#315B45')
          .onClick(() => this.saveEdit())
      }
      .width('100%')
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#F3F0E7')
  }
}

