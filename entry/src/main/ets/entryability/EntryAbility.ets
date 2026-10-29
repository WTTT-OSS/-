import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { DBManager } from '../data/DBManager';
import { FamilySyncService } from '../services/FamilySyncService';

const DOMAIN = 0x434D;

export default class EntryAbility extends UIAbility {
  async onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): Promise<void> {
    this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    try {
      await DBManager.getInstance().init(this.context);
      FamilySyncService.getInstance().initialize(this.context);
      hilog.info(DOMAIN, 'CarbonMate', 'Database initialized');
    } catch (error) {
      hilog.error(DOMAIN, 'CarbonMate', 'Database initialization failed: %{public}s', JSON.stringify(error));
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (error) => {
      if (error.code) {
        hilog.error(DOMAIN, 'CarbonMate', 'Failed to load main page: %{public}s', JSON.stringify(error));
      }
    });
  }
}

