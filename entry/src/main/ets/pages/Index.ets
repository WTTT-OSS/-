import { DataPage } from './DataPage';
import { HomePage } from './HomePage';
import { KnowledgePage } from './KnowledgePage';
import { KeepsakePage } from './KeepsakePage';
import { RecordPage } from './RecordPage';

@Entry
@Component
struct Index {
  @State selectedIndex: number = 0;
  @StorageLink('recordRevision') recordRevision: number = 0;

  @Builder
  tabBar(title: string, index: number) {
    Column({ space: 3 }) {
      Text(index === 0 ? '⌂' : index === 1 ? '＋' : index === 2 ? '▥' : index === 3 ? '▤' : '◎')
        .fontSize(18)
        .fontColor(this.selectedIndex === index ? '#315B45' : '#829089')
      Text(title)
        .fontSize(11)
        .fontColor(this.selectedIndex === index ? '#315B45' : '#829089')
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
  }

  build() {
    Tabs({ barPosition: BarPosition.End, index: this.selectedIndex }) {
      TabContent() {
        HomePage({
          onStartRecord: () => this.selectedIndex = 1,
          onViewAchievements: () => this.selectedIndex = 4
        })
      }
      .tabBar(this.tabBar('首页', 0))

      TabContent() {
        RecordPage()
      }
      .tabBar(this.tabBar('记录', 1))

      TabContent() {
        DataPage({ onStartRecord: () => this.selectedIndex = 1 })
      }
      .tabBar(this.tabBar('数据', 2))

      TabContent() {
        KnowledgePage()
      }
      .tabBar(this.tabBar('科普', 3))

      TabContent() {
        KeepsakePage()
      }
      .tabBar(this.tabBar('我的', 4))
    }
    .barHeight(66)
    .barBackgroundColor('#FFFDF8')
    .animationDuration(220)
    .onChange((index: number) => this.selectedIndex = index)
    .width('100%')
    .height('100%')
  }
}
