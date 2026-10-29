import { MetricCard } from '../components/MetricCard';
import { SectionTitle } from '../components/SectionTitle';
import { TaskRow } from '../components/TaskRow';
import { CarbonRecord, CarbonSummary, DailyTask } from '../domain/CarbonTypes';
import { TaskEngine } from '../domain/TaskEngine';
import { CarbonRecordService } from '../services/CarbonRecordService';

@Component
export struct HomePage {
  @StorageLink('recordRevision') @Watch('onRecordRevisionChanged') recordRevision: number = 0;
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
  @State tasks: DailyTask[] = [];
  private nextDayTimer: number = -1;
  onStartRecord: () => void = () => {};
  onViewAchievements: () => void = () => {};

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
      this.summary = await service.summary();
      const records: CarbonRecord[] = await service.recentRecords(1000);
      this.tasks = TaskEngine.buildTodayTasks(records);
    } catch (_) {
      this.summary = { totalReductionKg: 0, totalPoints: 0, recordCount: 0, todayReductionKg: 0, estimatedRecordCount: 0, verifiedRecordCount: 0, unestimatedRecordCount: 0, todayEstimateCount: 0 };
      this.tasks = TaskEngine.buildTodayTasks([]);
    }
  }

  build() {
    Scroll() {
      Column({ space: 18 }) {
        SectionTitle({
          title: '今日情况',
          subtitle: '今天的行动和阶段变化，一眼看清'
        })

        Column({ space: 8 }) {
          Text('今日避免排放估算')
            .fontSize(14)
            .fontColor('#60745F')
          Text(this.summary.todayEstimateCount > 0 ? `${this.summary.todayReductionKg.toFixed(3)} kg CO₂` : '暂无估算')
            .fontSize(34)
            .fontWeight(FontWeight.Bold)
            .fontColor('#315B45')
          Text(this.summary.todayEstimateCount > 0 ? '按因子估算；参考值仅用于趋势比较，不作核证' : '行动记录与积分已保存；当日没有可估算的排放量')
            .fontSize(12)
            .fontColor('#73786E')
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(22)
        .backgroundColor('#E8EBDD')
        .borderRadius(14)

        Row({ space: 12 }) {
          MetricCard({ label: '累计减碳量（估算）', value: this.summary.estimatedRecordCount > 0 ? this.summary.totalReductionKg.toFixed(2) : '—', unit: 'kg CO₂' })
          MetricCard({ label: '碳积分', value: `${this.summary.totalPoints}`, unit: '分', accent: '#C87816' })
        }

        Button('记录低碳行为')
          .width('100%')
          .height(52)
          .fontSize(17)
          .fontWeight(FontWeight.Bold)
          .backgroundColor('#315B45')
          .borderRadius(10)
          .onClick(() => this.onStartRecord())

        Column({ space: 2 }) {
          Row() {
            Text('今日任务')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#26372D')
            Blank()
            Text(`${this.tasks.filter((task: DailyTask) => task.completed).length}/${this.tasks.length}`)
              .fontSize(13)
              .fontColor('#73786E')
          }
          .width('100%')
          ForEach(this.tasks.slice(0, 3), (task: DailyTask) => {
            TaskRow({ task })
          }, (task: DailyTask) => task.id)
          if (this.tasks.length > 3) {
            Button('查看全部任务与成就 →')
              .width('100%')
              .fontSize(13)
              .fontColor('#315B45')
              .backgroundColor('#E9EEE4')
              .onClick(() => this.onViewAchievements())
          }
        }
        .width('100%')
        .padding(18)
        .backgroundColor('#FFFDF8')
        .borderRadius(12)

        Column({ space: 12 }) {
          Text('本周建议')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
          Text(this.summary.recordCount === 0
            ? '从一次步行、骑行或公交出行开始，完成第一条可追溯记录。'
            : '保持记录习惯。下一步可以尝试补充不同类型的低碳行为。')
            .fontSize(14)
            .fontColor('#536257')
            .lineHeight(22)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(18)
        .backgroundColor('#E9EEE4')
        .borderRadius(12)
      }
      .width('100%')
      .padding({ left: 18, right: 18, top: 20, bottom: 96 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F0E7')
  }
}
