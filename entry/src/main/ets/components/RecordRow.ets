import { BehaviorType, CarbonRecord } from '../domain/CarbonTypes';
import { FactorRepository } from '../domain/FactorRepository';

@Component
export struct RecordRow {
  record: CarbonRecord = {
    id: '',
    behaviorType: BehaviorType.BICYCLE,
    behaviorName: '',
    activityValue: 0,
    activityUnit: '',
    factorId: '',
    factorVersion: '',
    factorSource: '',
    reductionKg: 0,
    points: 0,
    note: '',
    itemCategory: '',
    itemDestination: '',
    createdAt: 0
  };

  private timeText(): string {
    const date = new Date(this.record.createdAt);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  }

  build() {
    Row() {
      Column({ space: 5 }) {
        Text(this.record.behaviorName)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#26372D')
        Text(`${this.record.activityValue} ${this.record.activityUnit} · ${this.timeText()}`)
          .fontSize(12)
          .fontColor('#777D72')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Column({ space: 3 }) {
        Text(FactorRepository.isEstimated(this.record.factorId, this.record.factorVersion)
          ? `${this.record.reductionKg.toFixed(3)} kg CO₂ · ${FactorRepository.tierLabel(this.record.factorId, this.record.factorVersion)}`
          : this.record.factorVersion === 'DEMO_V1' ? '旧版演示值 · 不计入汇总' : '仅记录 · 未估算')
          .fontSize(15)
          .fontWeight(FontWeight.Bold)
        .fontColor(FactorRepository.isEstimated(this.record.factorId, this.record.factorVersion) ? '#315B45' : '#69766C')
        Text(`+${this.record.points} 积分`)
          .fontSize(11)
          .fontColor('#C87816')
      }
      .alignItems(HorizontalAlign.End)
      if (this.record.behaviorType === BehaviorType.REUSE_ITEM) {
        Text(`${this.record.itemCategory ?? '未填写类别'} · ${this.record.itemDestination ?? '未填写去向'}`)
          .fontSize(11)
          .fontColor('#536257')
      }
    }
    .width('100%')
    .padding(14)
    .backgroundColor('#FFFDF8')
    .borderRadius(16)
  }
}

