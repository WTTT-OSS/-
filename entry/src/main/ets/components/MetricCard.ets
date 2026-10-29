@Component
export struct MetricCard {
  label: string = '';
  value: string = '';
  unit: string = '';
  accent: string = '#315B45';

  build() {
    Column({ space: 8 }) {
      Text(this.label)
        .fontSize(13)
        .fontColor('#73786E')
      Row({ space: 4 }) {
        Text(this.value)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor(this.accent)
        Text(this.unit)
          .fontSize(12)
          .fontColor('#73786E')
          .margin({ top: 8 })
      }
    }
    .alignItems(HorizontalAlign.Start)
    .padding(16)
    .backgroundColor('#FFFDF8')
    .borderRadius(12)
    .layoutWeight(1)
  }
}

