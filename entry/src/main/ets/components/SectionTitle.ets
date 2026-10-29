@Component
export struct SectionTitle {
  title: string = '';
  subtitle: string = '';

  build() {
    Column({ space: 4 }) {
      Text(this.title)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor('#26372D')
      if (this.subtitle.length > 0) {
        Text(this.subtitle)
          .fontSize(13)
          .fontColor('#73786E')
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}

