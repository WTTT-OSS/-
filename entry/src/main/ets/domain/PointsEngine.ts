export class PointsEngine {
  static readonly POINTS_PER_ACTION: number = 5;
  static readonly DAILY_ACTION_LIMIT: number = 5;

  // Points reward recorded actions, never their estimated carbon value.
  // Limiting rewarded entries per day also discourages splitting one action
  // into many records to farm points.
  static pointsForAction(rewardedActionsToday: number): number {
    if (!Number.isFinite(rewardedActionsToday) || rewardedActionsToday < 0) return 0;
    return rewardedActionsToday < this.DAILY_ACTION_LIMIT ? this.POINTS_PER_ACTION : 0;
  }
}
