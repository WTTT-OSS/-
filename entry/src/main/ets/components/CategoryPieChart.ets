import { CategoryReduction } from '../domain/CarbonTypes';

const SLICE_COLORS: string[] = ['#315B45', '#78936C', '#C28C43', '#628A91', '#A36D62', '#89906A'];

@Component
export struct CategoryPieChart {
  @Prop @Watch('onItemsChanged') items: CategoryReduction[] = [];
  @State ready: boolean = false;
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));

  private total(): number {
    return this.items.reduce((sum: number, item: CategoryReduction) => sum + item.reductionKg, 0);
  }

  private color(index: number): string {
    return SLICE_COLORS[index % SLICE_COLORS.length];
  }

  onItemsChanged(): void {
    if (this.ready) this.draw();
  }

  private draw(): void {
    const total = this.total();
    const width = this.context.width;
    const height = this.context.height;
    this.context.clearRect(0, 0, width, height);
    if (total <= 0 || width <= 0 || height <= 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.39;
    let start = -Math.PI / 2;
    this.items.forEach((item: CategoryReduction, index: number) => {
      const share = item.reductionKg / total;
      const end = start + share * 2 * Math.PI;
      this.context.beginPath();
      this.context.moveTo(centerX, centerY);
      this.context.arc(centerX, centerY, radius, start, end, false);
      this.context.closePath();
      this.context.fillStyle = this.color(index);
      this.context.fill();

      if (share >= 0.075) {
        const middle = (start + end) / 2;
        const labelRadius = radius * 0.68;
        this.context.fillStyle = '#FFFFFF';
        this.context.font = 'bold 12px sans-serif';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(`${Math.round(share * 100)}%`, centerX + Math.cos(middle) * labelRadius,
          centerY + Math.sin(middle) * labelRadius);
      }
      start = end;
    });

    this.context.beginPath();
    this.context.arc(centerX, centerY, radius * 0.52, 0, Math.PI * 2, false);
    this.context.fillStyle = '#FFFDF8';
    this.context.fill();
    this.context.fillStyle = '#26372D';
    this.context.font = 'bold 14px sans-serif';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(`${total.toFixed(2)} kg`, centerX, centerY - 5);
    this.context.fillStyle = '#73786E';
    this.context.font = '11px sans-serif';
    this.context.fillText('估算 kg CO₂', centerX, centerY + 14);
  }

  build() {
    Column({ space: 12 }) {
      Canvas(this.context)
        .width('100%')
        .height(210)
        .onReady(() => {
          this.ready = true;
          this.draw();
        })
      ForEach(this.items, (item: CategoryReduction, index: number) => {
        Row({ space: 8 }) {
          Row()
            .width(10)
            .height(10)
            .backgroundColor(this.color(index))
            .borderRadius(5)
          Text(item.behaviorName)
            .fontSize(13)
            .fontColor('#35483B')
            .layoutWeight(1)
          Text(`${item.reductionKg.toFixed(3)} kg · ${this.total() > 0 ? Math.round(item.reductionKg / this.total() * 100) : 0}%`)
            .fontSize(12)
            .fontColor('#69766C')
        }
        .width('100%')
      }, (item: CategoryReduction) => item.behaviorType)
    }
    .width('100%')
  }
}
