import type { DailyTask } from '../domain/CarbonTypes';

@Component
export struct TaskRow {
  task: DailyTask = {
    id: '',
    title: '',
    description: '',
    progress: 0,
    target: 1,
    completed: false
  };

  private progressPercent(): number {
    if (this.task.target <= 0) {
      return 0;
    }
    return Math.min(100, Math.round(this.task.progress / this.task.target * 100));
  }

  build() {
    Column({ space: 8 }) {
      Row() {
        Column({ space: 3 }) {
          Text(this.task.title)
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor('#26372D')
          Text(this.task.description)
          .fontSize(12)
            .fontColor('#777D72')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Text(this.task.completed ? '已完成' : `${this.task.progress}/${this.task.target}`)
          .fontSize(12)
          .fontColor(this.task.completed ? '#315B45' : '#9B6C3E')
      }
      .width('100%')

      Stack({ alignContent: Alignment.Start }) {
        Row()
          .width('100%')
          .height(7)
          .backgroundColor('#E3E2D8')
          .borderRadius(4)
        Row()
          .width(`${this.progressPercent()}%`)
          .height(7)
          .backgroundColor(this.task.completed ? '#315B45' : '#B58157')
          .borderRadius(4)
      }
      .width('100%')
      .height(7)
    }
    .width('100%')
    .padding({ top: 10, bottom: 10 })
  }
}

