import { SectionTitle } from '../components/SectionTitle';
import { DBManager } from '../data/DBManager';

interface CourseSection {
  heading: string;
  body: string;
  takeaway: string;
}

interface CourseData {
  id: string;
  level: string;
  title: string;
  summary: string;
  sections: CourseSection[];
  question: string;
  answers: string[];
  correctIndex: number;
  source: string;
}

const COURSES: CourseData[] = [
  {
    id: 'carbon-basics', level: '01 · 入门', title: '先看懂碳足迹',
    summary: '从“一个数字代表什么”开始，读懂碳排放、碳足迹和估算边界。',
    sections: [
      { heading: '碳足迹不是一团看不见的烟', body: '它是在约定的边界内，把某项活动关联的温室气体排放汇总起来。一个人的出行、用电或消费，都可能对应不同环节的排放。', takeaway: '先问清楚：算的是哪项活动、哪段时间、哪些环节。' },
      { heading: '为什么用 kgCO₂e', body: '温室气体不止二氧化碳。二氧化碳当量（CO₂e）是把不同气体按约定方法折算到同一单位，便于汇总比较。它是计量单位，不是精确到个人的实验结果。', takeaway: '同一个单位，方便比较；不代表每个数字都同样精确。' },
      { heading: '估算值要看前提', body: '活动量乘以排放因子，只是核算的一种简化。出行距离、替代方式、地区电力结构和数据年份都会改变结果；缺少可靠依据时，应记录行动而不是编造减排数字。', takeaway: '看结果时，也要看基准、因子来源、地区和年份。' }
    ],
    question: '看到一条“减排 2 kg”的记录，最应该先确认什么？',
    answers: ['它采用了什么基准和因子来源', '数字是否带了很多小数位', '页面颜色是否是绿色'],
    correctIndex: 0, source: '碳伴核算口径说明；后续因子须以可核验来源和适用边界为准。'
  },
  {
    id: 'low-carbon-travel', level: '02 · 出行', title: '把通勤方式选明白',
    summary: '步行、骑行、公交、地铁各有适用场景；先比较真实路线，再记录行动。',
    sections: [
      { heading: '先比较同一段路', body: '比较方式时，尽量使用相近的起终点和出行距离。短距离步行或骑行常常容易执行；距离较长时，可以结合公交、地铁和接驳步行。', takeaway: '比较的路线和距离要尽量一致。' },
      { heading: '替代基准会改变结果', body: '“坐公交”本身并不自动等于某个固定减排量。要估算差值，必须说明它替代了什么方式、乘坐距离、载客分摊及所用因子。', takeaway: '没有明确替代情景，就不要把活动量说成已核证减排。' },
      { heading: '让行动持续下来', body: '选一段自己愿意长期步行或骑行的短途路线。遇到天气、时间或安全不合适时，公交和地铁也是很实用的选择。', takeaway: '好的低碳习惯，首先得适合真实生活。' }
    ],
    question: '要比较公交和开车的影响，哪种做法更可靠？',
    answers: ['比较同一段路线，并写清替代方式与因子', '只记录公交乘坐次数', '把所有公交出行都记作零排放'],
    correctIndex: 0, source: '课程为生活行动建议；具体核算因子需根据地区、年份和边界核验。'
  },
  {
    id: 'home-resources', level: '03 · 居家', title: '看见家里的能源与用水',
    summary: '把“节约一点”变成可观察的行动，不要求用户猜自己省下多少度电。',
    sections: [
      { heading: '先记行动，不猜数字', body: '没有分项电表时，用户很难知道一次关灯或拔插头到底节约多少电。可以记录具体动作和次数，但不要让用户凭感觉填写 kWh。', takeaway: '不确定电量时记录行动次数，不虚构节电量。' },
      { heading: '从容易确认的习惯开始', body: '离开房间随手关灯、空调温度设定合理、减少待机、洗衣机尽量满载，都是能在日常中执行的做法。记录时选最贴近实际的一项。', takeaway: '行动可核对，比看起来精确的数字更重要。' },
      { heading: '用水也有情境', body: '缩短不必要的流水、发现漏水及时处理、重复利用合适的清水，都可以成为生活记录。若没有计量设备，不必估算节水升数。', takeaway: '能计量就按计量记录；不能计量就只记行为。' }
    ],
    question: '用户不知道节约了多少度电，最合适的记录方式是什么？',
    answers: ['记录具体节电行动，不填写猜测的 kWh', '随便填一个常见电量', '不让用户保存任何行动'],
    correctIndex: 0, source: '生活技巧：记录可验证的行动；避免无设备依据的节能量估算。'
  },
  {
    id: 'food-choice', level: '04 · 饮食', title: '从一餐减少浪费',
    summary: '光盘不是比谁吃得更多，而是按需点餐、妥善保存和减少可避免的食物浪费。',
    sections: [
      { heading: '按实际食量点餐', body: '聚餐时可以先少量点菜、吃完再加；外卖按人数和食量选份量。剩余食物及时冷藏并在安全期限内食用。', takeaway: '减少浪费从购买前的判断开始。' },
      { heading: '记录“份”要有定义', body: '一份剩餐的大小并不统一。若没有清晰称量标准，按“完成一次减少浪费行动”记录更诚实；不要把一次光盘直接换算成精确减排。', takeaway: '量纲一致，数字才有比较意义。' },
      { heading: '食品安全优先', body: '低碳不意味着勉强吃下已经变质的食物。合理规划、及时保存、按需购买，比事后硬吃更安全也更可持续。', takeaway: '不浪费与食品安全需要一起考虑。' }
    ],
    question: '一顿饭的剩余量没有称重，记录时应怎样处理？',
    answers: ['按一次行动记录，不伪装成精确重量', '默认填 100 克', '按餐费金额换算减排'],
    correctIndex: 0, source: '课程为生活建议；未建立称量口径前不提供重量或减排换算。'
  },
  {
    id: 'reuse-and-recycling', level: '05 · 循环利用', title: '旧物怎样才算真正再利用',
    summary: '把捐赠、转让、维修和正规回收分开记录，避免“旧物回收”含义太宽。',
    sections: [
      { heading: '区分不同去向', body: '衣物转赠、书籍转让、小家电维修后继续使用、废旧数码交正规回收渠道，实际含义不同。记录时写清物品类别和具体去向。', takeaway: '先写清“是什么”和“去了哪里”。' },
      { heading: '再利用不等于已减排', body: '能否替代新产品、物品是否继续使用、回收处理方式等都会影响环境结果。没有可靠情景和因子时，只记录行动，不折算减排量。', takeaway: '记录旧物去向与估算碳减排是两件事。' },
      { heading: '留意个人信息', body: '转赠手机、电脑或硬盘前，先备份并清除个人数据；电池和电子产品按当地正规渠道处理，不随意拆解或丢入普通垃圾。', takeaway: '安全交接和规范回收，比追求积分更重要。' }
    ],
    question: '为什么旧物记录默认不显示减排量？',
    answers: ['缺少物品状态、替代情景和处理路径等关键依据', '旧物行为没有意义', '应用无法保存物品类别'],
    correctIndex: 0, source: '课程为记录口径说明；旧物行为保留积分，不给出缺少依据的减排量。'
  },
  {
    id: 'policy-reading', level: '06 · 政策', title: '读懂“双碳”政策在说什么',
    summary: '先抓目标和行动框架，再读官方原文；把国家层面的政策和个人行动联系起来。',
    sections: [
      { heading: '碳达峰与碳中和不是一回事', body: '碳达峰关注二氧化碳排放在某个时间点前后达到峰值并进入下降阶段；碳中和强调一定时期内人为排放与人为移除相抵。两者目标不同，不能混用。', takeaway: '一个看排放峰值，一个看净排放平衡。' },
      { heading: '政策不只谈个人习惯', body: '国务院《2030年前碳达峰行动方案》提出能源、工业、城乡建设、交通运输等重点行动，也提出加快形成绿色生产生活方式。个人行动是整体转型的一部分，不应被夸大成单独解决方案。国家后续政策会更新，阅读时要核对发布日期和适用范围。', takeaway: '政策覆盖产业、能源、交通和生活多个层面。' },
      { heading: '怎样读原文', body: '先看发布机关、文件日期和适用范围，再看目标、重点行动和责任主体。需要了解当前政策时，优先查国务院或主管部门官网的原文及后续文件。', takeaway: '先读官方原文，再看摘要；留意发布日期与适用范围。' }
    ],
    question: '学习一项政策文件时，哪组信息最值得先核对？',
    answers: ['发布机关、日期、适用范围和行动任务', '标题长度和配图颜色', '只看社交媒体上的一句摘要'],
    correctIndex: 0, source: '国务院《2030年前碳达峰行动方案》（国发〔2021〕23号）及《“十五五”碳达峰行动方案》（国发〔2026〕22号）。生态环境部官方原文：https://www.mee.gov.cn/zcwj/gwywj/202607/t20260714_1161655.shtml'
  }
];

@Component
export struct KnowledgePage {
  @State selectedCourse: CourseData | null = null;
  @State sectionIndex: number = 0;
  @State answerIndex: number = -1;
  @State feedback: string = '';
  @State completedIds: string[] = [];

  aboutToAppear(): void {
    void DBManager.getInstance().completedCourseIds().then((ids: string[]) => this.completedIds = ids);
  }

  private isUnlocked(course: CourseData): boolean {
    const index = COURSES.findIndex((item: CourseData) => item.id === course.id);
    return index <= 0 || this.completedIds.includes(COURSES[index - 1].id);
  }

  private openCourse(course: CourseData): void {
    if (!this.isUnlocked(course)) return;
    this.selectedCourse = course;
    this.sectionIndex = 0;
    this.answerIndex = -1;
    this.feedback = '';
  }

  private async submitAnswer(): Promise<void> {
    const course = this.selectedCourse;
    if (!course || this.answerIndex < 0) {
      this.feedback = '先选一个答案';
      return;
    }
    if (this.answerIndex !== course.correctIndex) {
      this.feedback = '再想一想，回到上面的内容找找依据。';
      return;
    }
    if (!this.completedIds.includes(course.id)) {
      await DBManager.getInstance().markCourseComplete(course.id);
      this.completedIds = this.completedIds.concat([course.id]);
    }
    this.feedback = '回答正确，专题已完成。下一专题已解锁。';
  }

  private nextSection(): void {
    const course = this.selectedCourse;
    if (course) this.sectionIndex = Math.min(course.sections.length, this.sectionIndex + 1);
  }

  private previousSection(): void {
    this.sectionIndex = Math.max(0, this.sectionIndex - 1);
  }

  private returnToLastSection(): void {
    const course = this.selectedCourse;
    if (course) this.sectionIndex = Math.max(0, course.sections.length - 1);
  }

  build() {
    Scroll() {
      Column({ space: 15 }) {
        if (this.selectedCourse === null) {
          SectionTitle({ title: '双碳科普', subtitle: '从生活行动到政策理解，按顺序学，也能随时回看' })
          Column({ space: 5 }) {
            Text('循序渐进的学习路径')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#26372D')
            Text(`${this.completedIds.length} / ${COURSES.length} 个专题完成`)
              .fontSize(14)
              .fontColor('#617064')
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .padding(17)
          .backgroundColor('#E7EBDD')
          .borderRadius(14)

          ForEach(COURSES, (course: CourseData, index: number) => {
            Column({ space: 8 }) {
              Row() {
                Text(course.level)
                  .fontSize(12)
                  .fontColor('#557054')
                Blank()
                Text(this.completedIds.includes(course.id) ? '已完成' : this.isUnlocked(course) ? '开始学习 →' : '完成上一专题后解锁')
                  .fontSize(12)
                  .fontColor(this.isUnlocked(course) ? '#315B45' : '#8D9389')
              }
              .width('100%')
              Text(course.title)
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor('#26372D')
                .width('100%')
                .textAlign(TextAlign.Start)
              Text(course.summary)
                .fontSize(14)
                .fontColor('#536257')
                .lineHeight(21)
                .width('100%')
                .textAlign(TextAlign.Start)
            }
            .width('100%')
            .alignItems(HorizontalAlign.Start)
            .padding(17)
            .backgroundColor(this.isUnlocked(course) ? '#FFFDF8' : '#F0EFE8')
            .borderRadius(12)
            .onClick(() => this.openCourse(course))
          }, (course: CourseData) => course.id)
        } else {
          Button('‹ 返回专题目录')
            .fontSize(14)
            .fontColor('#315B45')
            .backgroundColor('#E9EEE4')
            .onClick(() => this.selectedCourse = null)
          Text(this.selectedCourse.level)
            .fontSize(13)
            .fontColor('#648064')
            .width('100%')
          Text(this.selectedCourse.title)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#26372D')
            .width('100%')
            .textAlign(TextAlign.Start)
          Text(this.selectedCourse.summary)
            .fontSize(15)
            .fontColor('#536257')
            .lineHeight(23)
            .width('100%')
          if (this.sectionIndex < this.selectedCourse.sections.length) {
            Column({ space: 12 }) {
              Text(`阅读 ${this.sectionIndex + 1} / ${this.selectedCourse.sections.length}`)
                .fontSize(12)
                .fontColor('#758074')
              Text(this.selectedCourse.sections[this.sectionIndex].heading)
                .fontSize(19)
                .fontWeight(FontWeight.Bold)
                .fontColor('#26372D')
                .width('100%')
                .textAlign(TextAlign.Start)
              Text(this.selectedCourse.sections[this.sectionIndex].body)
                .fontSize(16)
                .fontColor('#435349')
                .lineHeight(27)
                .width('100%')
                .textAlign(TextAlign.Start)
              Text(this.selectedCourse.sections[this.sectionIndex].takeaway)
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#315B45')
                .lineHeight(22)
                .width('100%')
                .padding(12)
                .backgroundColor('#EAF0E6')
                .borderRadius(9)
              Text(`参考：${this.selectedCourse.source}`)
                .fontSize(12)
                .fontColor('#767C70')
                .lineHeight(18)
                .width('100%')
            }
            .width('100%')
            .alignItems(HorizontalAlign.Start)
            .padding(18)
            .backgroundColor('#FFFDF8')
            .borderRadius(14)
            Row({ space: 10 }) {
              Button('上一节')
                .layoutWeight(1)
                .enabled(this.sectionIndex > 0)
                .onClick(() => this.previousSection())
              Button(this.sectionIndex === this.selectedCourse.sections.length - 1 ? '读完，进入练习' : '下一节')
                .layoutWeight(2)
                .fontColor('#FFFFFF')
                .backgroundColor('#315B45')
                .onClick(() => this.nextSection())
            }
            .width('100%')
          } else {
            Column({ space: 12 }) {
              Text('专题练习')
                .fontSize(19)
                .fontWeight(FontWeight.Bold)
                .fontColor('#26372D')
              Text(this.selectedCourse.question)
                .fontSize(16)
                .fontColor('#35483B')
                .lineHeight(23)
              ForEach(this.selectedCourse.answers, (answer: string, index: number) => {
                Button(`${this.answerIndex === index ? '✓ ' : ''}${answer}`)
                  .width('100%')
                  .fontSize(14)
                  .fontColor(this.answerIndex === index ? '#FFFFFF' : '#35483B')
                  .backgroundColor(this.answerIndex === index ? '#315B45' : '#F3F0E7')
                  .onClick(() => {
                    this.answerIndex = index;
                    this.feedback = '';
                  })
              }, (answer: string) => answer)
              if (this.feedback.length > 0) {
                Text(this.feedback)
                  .fontSize(14)
                  .fontColor(this.feedback.includes('正确') ? '#315B45' : '#A26723')
              }
              Button('提交答案')
                .width('100%')
                .fontColor('#FFFFFF')
                .backgroundColor('#315B45')
                .onClick(() => this.submitAnswer())
              Button('返回最后一节')
                .width('100%')
                .fontColor('#315B45')
                .backgroundColor('#E9EEE4')
                .onClick(() => this.returnToLastSection())
            }
            .width('100%')
            .alignItems(HorizontalAlign.Start)
            .padding(18)
            .backgroundColor('#FFFDF8')
            .borderRadius(14)
          }
        }
      }
      .width('100%')
      .padding({ left: 18, right: 18, top: 20, bottom: 96 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F0E7')
  }
}
