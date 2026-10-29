import { DailyReduction } from '../domain/CarbonTypes';

/**
 * 趋势图组件：柱状与折线两种呈现，共用同一组时间桶数据。
 * 无数据时柱状保留 5 像素下限、折线保留基线，避免把“没有数”画成“为零”。
 */
@Component
export struct TrendChart {
  @Prop @Watch('onItemsChanged') items: DailyReduction[] = [];
  @Prop @Watch('onItemsChanged') mode: string = 'bar';
  @State ready: boolean = false;
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));

  private maxValue(): number {
    let max = 0;
    this.items.forEach((item: DailyReduction) => {
      if (item.reductionKg > max) max = item.reductionKg;
    });
    return max <= 0 ? 1 : max;
  }

  onItemsChanged(): void {
    if (this.ready) this.draw();
  }

  private draw(): void {
    const width = this.context.width;
    const height = this.context.height;
    if (width <= 0 || height <= 0) return;
    this.context.clearRect(0, 0, width, height);
    if (this.items.length === 0) return;

    const max = this.maxValue();
    const padX = 12;
    const padTop = 16;
    const padBottom = 10;
    const usableW = width - padX * 2;
    const usableH = height - padTop - padBottom;
    const stepX = this.items.length > 1 ? usableW / (this.items.length - 1) : usableW;

    // 基线
    this.context.beginPath();
    this.context.moveTo(padX, padTop + usableH);
    this.context.lineTo(padX + usableW, padTop + usableH);
    this.context.strokeStyle = '#E3E2D8';
    this.context.lineWidth = 1;
    this.context.stroke();

    // 折线
    this.context.beginPath();
    for (let i = 0; i < this.items.length; i += 1) {
      const value = this.items[i].reductionKg;
      const x = padX + i * stepX;
      const y = padTop + usableH - (value > 0 ? value / max * usableH : 0);
      if (i === 0) this.context.moveTo(x, y);
      else this.context.lineTo(x, y);
    }
    this.context.strokeStyle = '#315B45';
    this.context.lineWidth = 2;
    this.context.stroke();

    // 数据点与数值
    this.context.font = '9px sans-serif';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'bottom';
    for (let i = 0; i < this.items.length; i += 1) {
      const value = this.items[i].reductionKg;
      const x = padX + i * stepX;
      const y = padTop + usableH - (value > 0 ? value / max * usableH : 0);
      this.context.beginPath();
      this.context.arc(x, y, value > 0 ? 3 : 2, 0, Math.PI * 2, false);
      this.context.fillStyle = value > 0 ? '#315B45' : '#C9CDC5';
      this.context.fill();
      if (value > 0) {
        this.context.fillStyle = '#4A5A50';
        this.context.fillText(value.toFixed(2), x, y - 5);
      }
    }
  }

  build() {
    Column({ space: 6 }) {
      if (this.mode === 'line') {
        Canvas(this.context)
          .width('100%')
          .height(150)
          .onReady(() => {
            this.ready = true;
            this.draw();
          })
      } else {
        Row({ space: 8 }) {
          ForEach(this.items, (item: DailyReduction) => {
            Column({ space: 5 }) {
              Text(item.reductionKg > 0 ? item.reductionKg.toFixed(2) : '0')
                .fontSize(9)
                .fontColor('#73786E')
              Row()
                .width(22)
                .height(Math.max(5, Math.round(item.reductionKg / this.maxValue() * 72)))
                .backgroundColor(item.reductionKg > 0 ? '#6E8969' : '#E3E2D8')
                .borderRadius({ topLeft: 5, topRight: 5 })
              Text(item.label)
                .fontSize(10)
                .fontColor('#748078')
            }
            .height(108)
            .justifyContent(FlexAlign.End)
            .layoutWeight(1)
          }, (item: DailyReduction) => `${item.dayStart}`)
        }
        .width('100%')
        .alignItems(VerticalAlign.Bottom)
      }
    }
    .width('100%')
  }
}
