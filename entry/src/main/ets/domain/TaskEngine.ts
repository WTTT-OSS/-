import { BehaviorType } from './CarbonTypes';
import type { CarbonRecord, DailyTask } from './CarbonTypes';

export class TaskEngine {
  static buildTodayTasks(records: CarbonRecord[], now: number = Date.now()): DailyTask[] {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayRecords = records.filter((record: CarbonRecord) => record.createdAt >= todayStart && record.createdAt <= now);
    const behaviorCodes: string[] = [];
    let travelCount = 0;
    let reuseCount = 0;
    let foodCount = 0;

    todayRecords.forEach((record: CarbonRecord) => {
      if (!behaviorCodes.includes(record.behaviorType)) {
        behaviorCodes.push(record.behaviorType);
      }
      if ([BehaviorType.BICYCLE, BehaviorType.WALK, BehaviorType.BUS, BehaviorType.METRO].includes(record.behaviorType)) travelCount += 1;
      if (record.behaviorType === BehaviorType.REUSE_ITEM) reuseCount += 1;
      if (record.behaviorType === BehaviorType.CLEAN_PLATE) foodCount += 1;
    });

    const firstProgress = Math.min(1, todayRecords.length);
    const diversityProgress = Math.min(3, behaviorCodes.length);

    return [
      {
        id: 'daily_first_record',
        title: '完成今日第一笔记录',
        description: '从最容易的一件低碳行为开始',
        progress: firstProgress,
        target: 1,
        completed: firstProgress >= 1
      },
      {
        id: 'daily_diversity',
        title: '尝试 3 类低碳行为',
        description: '鼓励行为多样性，不只追求单一数值',
        progress: diversityProgress,
        target: 3,
        completed: diversityProgress >= 3
      },
      {
        id: 'daily_multi_actions',
        title: '记录 2 项真实行动',
        description: '按行动记录进度，不依赖碳估算数值',
        progress: Math.min(2, todayRecords.length),
        target: 2,
        completed: todayRecords.length >= 2
      },
      {
        id: 'daily_green_trip',
        title: '完成一次绿色出行',
        description: '步行、骑行、公交或地铁均可',
        progress: Math.min(1, travelCount),
        target: 1,
        completed: travelCount >= 1
      },
      {
        id: 'daily_food_care',
        title: '完成一次惜食行动',
        description: '按需点餐或妥善保存食物',
        progress: Math.min(1, foodCount),
        target: 1,
        completed: foodCount >= 1
      },
      {
        id: 'daily_reuse',
        title: '给旧物找到新去向',
        description: '转赠、维修再用或正规回收',
        progress: Math.min(1, reuseCount),
        target: 1,
        completed: reuseCount >= 1
      }
    ];
  }
}
