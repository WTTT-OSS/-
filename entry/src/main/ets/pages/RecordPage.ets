import { common } from '@kit.AbilityKit';
import { camera, cameraPicker } from '@kit.CameraKit';
import { fileIo, fileUri } from '@kit.CoreFileKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { SectionTitle } from '../components/SectionTitle';
import { CarbonCalculator } from '../domain/CarbonCalculator';
import { BehaviorType, CarbonFactor } from '../domain/CarbonTypes';
import { FactorRepository } from '../domain/FactorRepository';
import { DBManager } from '../data/DBManager';
import { CarbonRecordService } from '../services/CarbonRecordService';
import { AIRecognitionService, RecognitionDraft } from '../services/AIRecognitionService';

@Component
export struct RecordPage {
  @StorageLink('recordRevision') recordRevision: number = 0;
  @State selectedType: BehaviorType = BehaviorType.BICYCLE;
  @State activityText: string = '';
  @State note: string = '';
  @State itemCategory: string = '';
  @State itemDestination: string = '';
  @State electricityMode: string = 'action';
  @State electricityAction: string = '';
  @State previewText: string = '输入活动量后查看计算过程';
  @State statusMessage: string = '';
  @State isSaving: boolean = false;
  @State photoUri: string = '';
  @State photoMessage: string = '可拍照或从相册选择，照片仅用于本次核对';
  @State isChoosingPhoto: boolean = false;
  @State isRecognizing: boolean = false;
  @State draftNeedsReview: boolean = false;
  @State gatewayUrl: string = '';
  @State clientToken: string = '';
  private factors: CarbonFactor[] = FactorRepository.list();

  aboutToAppear(): void {
    void this.loadAISettings();
  }

  private async loadAISettings(): Promise<void> {
    try {
      this.gatewayUrl = await DBManager.getInstance().getSetting('aiGatewayUrl');
      this.clientToken = await DBManager.getInstance().getSetting('aiClientToken');
    } catch (_) {
      this.photoMessage = 'AI 设置暂时无法读取；你仍可手动填写并保存行动';
    }
  }

  private typeForAIKind(kind: string): BehaviorType | null {
    if (kind === 'bicycle') return BehaviorType.BICYCLE;
    if (kind === 'walk') return BehaviorType.WALK;
    if (kind === 'bus') return BehaviorType.BUS;
    if (kind === 'metro') return BehaviorType.METRO;
    if (kind === 'electricity') return BehaviorType.ELECTRICITY_SAVE;
    if (kind === 'water') return BehaviorType.WATER_SAVE;
    if (kind === 'recycle') return BehaviorType.RECYCLE_PAPER;
    if (kind === 'meal') return BehaviorType.CLEAN_PLATE;
    if (kind === 'reuse') return BehaviorType.REUSE_ITEM;
    return null;
  }

  private requestPhotoRecognition(): void {
    if (this.photoUri.length === 0 || this.isRecognizing) return;
    if (!this.gatewayUrl.trim() || !this.clientToken.trim()) {
      this.statusMessage = '请先到“我的 → 设置”填写识别网关地址和客户端令牌';
      return;
    }
    this.getUIContext().showAlertDialog({
      title: '将照片发送到 DeepSeek？',
      message: '照片会发送到你配置的识别网关，再转交 DeepSeek 云端分析。识别结果只填入待核对草稿，不会自动保存；请勿上传包含隐私或他人信息的照片。',
      primaryButton: {
        value: '同意并识别',
        action: () => { void this.recognizePhoto(); }
      },
      secondaryButton: { value: '取消', action: () => {} }
    });
  }

  private async recognizePhoto(): Promise<void> {
    if (this.isRecognizing || !this.photoUri) return;
    this.isRecognizing = true;
    this.draftNeedsReview = false;
    this.statusMessage = '';
    this.photoMessage = '正在识别；照片会发送至你配置的网关和 DeepSeek 云端';
    try {
      const draft: RecognitionDraft = await AIRecognitionService.recognize(this.photoUri, this.gatewayUrl, this.clientToken);
      const selected = this.typeForAIKind(draft.kind);
      if (selected !== null) {
        this.selectedType = selected;
        if (selected === BehaviorType.ELECTRICITY_SAVE) {
          this.electricityMode = 'action';
          const actions: string[] = ['离开时随手关灯', '关闭闲置电器', '拔掉不用的充电器', '空调温度调高 1℃', '减少电器待机', '其他节电行动'];
          this.electricityAction = actions.includes(draft.actionDetail) ? draft.actionDetail : '其他节电行动';
        }
        if (draft.quantity !== null) this.activityText = `${draft.quantity}`;
        if (selected === BehaviorType.REUSE_ITEM) {
          const categories: string[] = ['衣物', '书籍', '小家电', '数码产品', '家具', '其他'];
          const destinations: string[] = ['转赠', '二手转让', '正规回收', '维修后再用'];
          this.itemCategory = categories.includes(draft.itemCategory) ? draft.itemCategory : '';
          this.itemDestination = destinations.includes(draft.destination) ? draft.destination : '';
        }
      }
      const detail = draft.actionDetail || draft.note;
      if (detail.length > 0) this.note = detail;
      this.updatePreview();
      this.draftNeedsReview = true;
      const quantityHint = draft.quantity === null ? '数量未能从照片确认，请自己补填' : '请核对识别出的数量';
      this.statusMessage = selected === null
        ? `未能可靠判断具体行动（${quantityHint}）；照片不会被保存，请手动选择行为`
        : `已生成待核对草稿（置信度 ${Math.round(draft.confidence * 100)}%）；${quantityHint}后再手动点击“确认记录”`;
      this.photoMessage = '识别完成 · 请检查行为、数量和备注';
    } catch (error) {
      this.statusMessage = error instanceof Error ? error.message : '识别失败，请检查网关设置或改为手动记录';
      this.photoMessage = '识别未完成；照片仍只保留在当前设备，可继续手动填写';
    } finally {
      this.isRecognizing = false;
    }
  }

  private selectedFactor(): CarbonFactor {
    if (this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action') {
      return FactorRepository.findRecordOnlyByBehavior(this.selectedType);
    }
    return FactorRepository.findByBehavior(this.selectedType);
  }

  private updatePreview(): void {
    if (this.selectedType === BehaviorType.REUSE_ITEM) {
      this.previewText = '旧物类别与处理去向会保存到记录；本行为不估算减排量';
      return;
    }
    const value = Number.parseFloat(this.activityText);
    if (!Number.isFinite(value) || value <= 0) {
      this.previewText = '输入活动量后查看计算过程';
      return;
    }
    try {
      this.previewText = CarbonCalculator.calculate({
        behaviorType: this.selectedType,
        activityValue: value,
        electricityMeasurementConfirmed: this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'measured'
      }).formulaText;
    } catch (_) {
      this.previewText = '请输入有效活动量';
    }
  }

  private async save(): Promise<void> {
    if (this.isSaving) {
      return;
    }
    const value = Number.parseFloat(this.activityText);
    if (!Number.isFinite(value) || value <= 0) {
      this.statusMessage = '请输入大于 0 的活动量';
      return;
    }
    if (this.selectedType === BehaviorType.REUSE_ITEM) {
      if (!Number.isInteger(value)) {
        this.statusMessage = '旧物件数请填写整数';
        return;
      }
      if (!this.itemCategory || !this.itemDestination) {
        this.statusMessage = '请补全物品类别和处理去向';
        return;
      }
      if (this.itemCategory === '其他' && this.note.trim().length === 0) {
        this.statusMessage = '物品类别选“其他”时，请在备注里写明是什么';
        return;
      }
    }
    if (this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action') {
      if (!Number.isInteger(value)) {
        this.statusMessage = '节电行动次数请填写整数';
        return;
      }
      if (!this.electricityAction) {
        this.statusMessage = '请选择实际做过的节电行动';
        return;
      }
      if (this.electricityAction === '其他节电行动' && !this.note.trim()) {
        this.statusMessage = '请在备注里写明具体节电行动';
        return;
      }
    }
    try {
      this.isSaving = true;
      const savedNote = this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action'
        ? `节电行动：${this.electricityAction}${this.note.trim() ? `；${this.note.trim()}` : ''}`
        : this.note;
      const record = await CarbonRecordService.getInstance().saveManualRecord(
        this.selectedType,
        value,
        savedNote,
        this.itemCategory,
        this.itemDestination,
        this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'measured',
        this.electricityMode === 'action' ? this.electricityAction : ''
      );
      const tier = FactorRepository.tierLabel(record.factorId, record.factorVersion);
      const carbonMessage = record.reductionKg > 0
        ? `按${tier}估算 ${record.reductionKg.toFixed(3)} kg CO₂`
        : '本条未生成估算';
      this.statusMessage = `行动已保存；${carbonMessage}；${record.points > 0 ? `获得 ${record.points} 积分` : '今日积分已达上限'}`;
      this.activityText = '';
      this.note = '';
      this.itemCategory = '';
      this.itemDestination = '';
      this.electricityAction = '';
      this.previewText = '输入活动量后查看计算过程';
      this.recordRevision += 1;
    } catch (_) {
      this.statusMessage = '保存失败，请检查数据库状态后重试';
    } finally {
      this.isSaving = false;
    }
  }

  private async takePhoto(): Promise<void> {
    if (this.isChoosingPhoto) return;
    this.isChoosingPhoto = true;
    try {
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const path = `${context.filesDir}/carbon_action_${Date.now()}.jpg`;
      fileIo.createRandomAccessFileSync(path, fileIo.OpenMode.CREATE);
      const result = await cameraPicker.pick(
        context,
        [cameraPicker.PickerMediaType.PHOTO],
        {
          cameraPosition: camera.CameraPosition.CAMERA_POSITION_BACK,
          saveUri: fileUri.getUriFromPath(path)
        }
      );
      if (result.resultCode === 0) {
        this.photoUri = result.resultUri;
        this.photoMessage = '照片已就绪；确认行动与数量后再手动填写保存';
      }
    } catch (_) {
      this.photoMessage = '未能打开相机，请检查设备支持情况或改从相册选择';
    } finally {
      this.isChoosingPhoto = false;
    }
  }

  private async choosePhoto(): Promise<void> {
    if (this.isChoosingPhoto) return;
    this.isChoosingPhoto = true;
    try {
      const options = new photoAccessHelper.PhotoSelectOptions();
      options.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      options.maxSelectNumber = 1;
      const result = await new photoAccessHelper.PhotoViewPicker().select(options);
      if (result.photoUris.length > 0) {
        this.photoUri = result.photoUris[0];
        this.photoMessage = '照片已就绪；确认行动与数量后再手动填写保存';
      }
    } catch (_) {
      this.photoMessage = '未能打开相册，请稍后重试';
    } finally {
      this.isChoosingPhoto = false;
    }
  }

  build() {
    Scroll() {
      Column({ space: 18 }) {
        SectionTitle({ title: '记录低碳行为', subtitle: '照片只作参考；核对行动与数量后再保存' })

        Column({ space: 12 }) {
          Text('拍照辅助记录')
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#26372D')
          Row({ space: 10 }) {
            Button(this.isChoosingPhoto ? '正在打开…' : '拍照')
              .layoutWeight(1)
              .height(44)
              .fontSize(14)
              .fontColor('#FFFFFF')
              .backgroundColor('#315B45')
              .borderRadius(9)
              .enabled(!this.isChoosingPhoto)
              .onClick(() => this.takePhoto())
            Button('从相册选择')
              .layoutWeight(1)
              .height(44)
              .fontSize(14)
              .fontColor('#315B45')
              .backgroundColor('#E9EEE4')
              .borderRadius(9)
              .enabled(!this.isChoosingPhoto)
              .onClick(() => this.choosePhoto())
          }
          if (this.photoUri.length > 0) {
            Image(this.photoUri)
              .width('100%')
              .height(190)
              .objectFit(ImageFit.Contain)
              .borderRadius(14)
              .backgroundColor('#F3F0E7')
          }
          Text(this.photoMessage)
            .fontSize(12)
            .fontColor('#738177')
          if (this.photoUri.length > 0) {
            Button(this.isRecognizing ? '正在识别…' : '识别照片并填入草稿')
              .width('100%')
              .height(44)
              .fontColor('#FFFFFF')
              .backgroundColor('#536C55')
              .enabled(!this.isRecognizing)
              .onClick(() => this.requestPhotoRecognition())
          }
          Text('未经你逐次同意，不会上传。识别结果始终是草稿；照片本身不会写入记录。')
            .fontSize(12)
            .fontColor('#69766C')
            .lineHeight(18)
          Text('每条行动记录 5 分；每天最多前 5 条记录获得积分，积分不与碳量估算挂钩。')
            .fontSize(12)
            .fontColor('#69766C')
            .lineHeight(18)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(16)
        .backgroundColor('#FFFDF8')
        .borderRadius(12)

        if (this.selectedType === BehaviorType.REUSE_ITEM) {
          Column({ space: 10 }) {
            Text('旧物信息')
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#26372D')
            Text('记录具体物品和去向；这里只记行为与积分，不折算减排量。')
              .fontSize(13)
              .fontColor('#69766C')
            Text('物品类别')
              .fontSize(13)
              .fontColor('#536257')
            Scroll() {
              Row({ space: 7 }) {
                ForEach(['衣物', '书籍', '小家电', '数码产品', '家具', '其他'], (item: string) => {
                  Button(item)
                    .fontSize(12)
                    .fontColor(this.itemCategory === item ? '#FFFFFF' : '#315B45')
                    .backgroundColor(this.itemCategory === item ? '#315B45' : '#E9EEE4')
                    .onClick(() => this.itemCategory = item)
                }, (item: string) => item)
              }
            }
            .scrollable(ScrollDirection.Horizontal)
            .scrollBar(BarState.Off)
            .width('100%')
            Text('处理去向')
              .fontSize(13)
              .fontColor('#536257')
            Scroll() {
              Row({ space: 7 }) {
                ForEach(['转赠', '二手转让', '正规回收', '维修后再用'], (item: string) => {
                  Button(item)
                    .fontSize(12)
                    .fontColor(this.itemDestination === item ? '#FFFFFF' : '#315B45')
                    .backgroundColor(this.itemDestination === item ? '#315B45' : '#E9EEE4')
                    .onClick(() => this.itemDestination = item)
                }, (item: string) => item)
              }
            }
            .scrollable(ScrollDirection.Horizontal)
            .scrollBar(BarState.Off)
            .width('100%')
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .padding(16)
          .backgroundColor('#FFFDF8')
          .borderRadius(12)
        }

        Column({ space: 10 }) {
          Text('选择行为')
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#26372D')
          Scroll() {
            Row({ space: 8 }) {
              ForEach(this.factors, (factor: CarbonFactor) => {
                Button(factor.name)
                  .fontSize(13)
                  .fontColor(this.selectedType === factor.behaviorType ? '#FFFFFF' : '#315B45')
                  .backgroundColor(this.selectedType === factor.behaviorType ? '#315B45' : '#E9EEE4')
                  .borderRadius(14)
                  .onClick(() => {
                    this.selectedType = factor.behaviorType;
                    if (factor.behaviorType === BehaviorType.ELECTRICITY_SAVE) this.electricityMode = 'action';
                    this.statusMessage = '';
                    this.updatePreview();
                  })
              }, (factor: CarbonFactor) => factor.id)
            }
          }
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(BarState.Off)
          .width('100%')
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)

        if (this.selectedType === BehaviorType.ELECTRICITY_SAVE) {
          Column({ space: 10 }) {
            Text('记录节电时，按你掌握的信息选择一种方式')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#26372D')
            Row({ space: 8 }) {
              Button('记录具体行动')
                .layoutWeight(1)
                .fontSize(13)
                .fontColor(this.electricityMode === 'action' ? '#FFFFFF' : '#315B45')
                .backgroundColor(this.electricityMode === 'action' ? '#315B45' : '#E9EEE4')
                .onClick(() => { this.electricityMode = 'action'; this.activityText = ''; this.updatePreview(); })
              Button('我有电量数据')
                .layoutWeight(1)
                .fontSize(13)
                .fontColor(this.electricityMode === 'measured' ? '#FFFFFF' : '#315B45')
                .backgroundColor(this.electricityMode === 'measured' ? '#315B45' : '#E9EEE4')
                .onClick(() => { this.electricityMode = 'measured'; this.activityText = ''; this.updatePreview(); })
            }
            if (this.electricityMode === 'action') {
              Text('不知道省了几度电也没关系：选一项你实际做过的事并记录次数，只保存行动与积分。')
                .fontSize(13)
                .fontColor('#536257')
                .lineHeight(19)
              Scroll() {
                Row({ space: 7 }) {
                  ForEach(['离开时随手关灯', '关闭闲置电器', '拔掉不用的充电器', '空调温度调高 1℃', '减少电器待机', '其他节电行动'], (item: string) => {
                    Button(item)
                      .fontSize(12)
                      .fontColor(this.electricityAction === item ? '#FFFFFF' : '#315B45')
                      .backgroundColor(this.electricityAction === item ? '#315B45' : '#E9EEE4')
                      .onClick(() => { this.electricityAction = item; this.updatePreview(); })
                  }, (item: string) => item)
                }
              }
              .scrollable(ScrollDirection.Horizontal)
              .scrollBar(BarState.Off)
              .width('100%')
            } else {
              Text('只有电表、智能插座或设备给出明确节电量时才选此项；按全国 2023 年平均电力因子估算。')
                .fontSize(13)
                .fontColor('#536257')
                .lineHeight(19)
            }
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .padding(16)
          .backgroundColor('#FFFDF8')
          .borderRadius(12)
        }

        Column({ space: 12 }) {
          Text(this.selectedType === BehaviorType.REUSE_ITEM ? '处理件数' : this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action' ? '行动次数' : this.selectedType === BehaviorType.ELECTRICITY_SAVE ? '设备记录的节电量（kWh）' : `活动量（${this.selectedFactor().unit}）`)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#26372D')
          TextInput({ text: this.activityText, placeholder: this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action' ? '例如：1 次' : this.selectedType === BehaviorType.REUSE_ITEM ? '填写本次处理的件数' : `请输入${this.selectedFactor().unit}` })
            .type(InputType.Number)
            .height(50)
            .backgroundColor('#F3F0E7')
            .borderRadius(9)
            .onChange((value: string) => {
              this.activityText = value;
              this.statusMessage = '';
              this.updatePreview();
            })

          Text(this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action' && this.electricityAction === '其他节电行动' ? '补充具体行动（必填）' : '备注（可选）')
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#26372D')
          TextInput({ text: this.note, placeholder: this.selectedType === BehaviorType.ELECTRICITY_SAVE && this.electricityMode === 'action' ? '例如：电视待机时切断电源' : '例如：骑行去图书馆' })
            .height(50)
            .backgroundColor('#F3F0E7')
            .borderRadius(9)
            .onChange((value: string) => this.note = value)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(18)
        .backgroundColor('#FFFDF8')
        .borderRadius(12)

        Column({ space: 8 }) {
          Text('核算预览')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#315B45')
          Text(this.previewText)
            .fontSize(13)
            .fontColor('#3E5148')
            .lineHeight(21)
          Text(this.selectedFactor().sourceLabel)
            .fontSize(12)
            .fontColor('#9B651D')
            .lineHeight(19)
          if (this.selectedFactor().estimateAvailable) {
            Text('仅当电表、智能插座或设备明确报告节电量时填写；按 2023 年全国电力平均因子估算，单位为 CO₂，不是个人碳足迹认证。')
              .fontSize(12)
              .fontColor('#536257')
              .lineHeight(19)
          } else {
            Text('此类行动照常保存并计入积分；当前缺少适用的权威核算因子，因此不显示排放估算。')
              .fontSize(12)
              .fontColor('#536257')
              .lineHeight(19)
          }
          if (this.draftNeedsReview) {
            Text('AI 待核对草稿 · 检查行为和活动量后，再点击“确认记录”保存')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor('#7A5B23')
              .lineHeight(19)
          }
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(16)
        .backgroundColor('#F5EEE2')
        .borderRadius(10)

        Button(this.isSaving ? '正在保存…' : '确认记录')
          .width('100%')
          .height(52)
          .fontSize(17)
          .fontWeight(FontWeight.Bold)
          .backgroundColor('#315B45')
          .borderRadius(9)
          .enabled(!this.isSaving)
          .onClick(() => this.save())

        if (this.statusMessage.length > 0) {
          Text(this.statusMessage)
            .width('100%')
            .textAlign(TextAlign.Center)
            .fontSize(14)
            .fontColor('#315B45')
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

