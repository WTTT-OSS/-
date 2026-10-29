(() => {
  const STORAGE = 'carbonmate-preview-state-v2';
  const TYPE = { bicycle: 'BICYCLE', walk: 'WALK', bus: 'BUS', metro: 'METRO', electricity: 'ELECTRICITY_SAVE', water: 'WATER_SAVE', recycle: 'RECYCLE_PAPER', meal: 'CLEAN_PLATE', reuse: 'REUSE_ITEM' };
  const AVATAR_PRESET_IDS = ['fern', 'tide', 'sunrise', 'lavender', 'grove', 'cloud'];
  const iconAliases = {
    bicycle: 'route', walk: 'route', bus: 'transit', metro: 'transit', electricity: 'energy', water: 'water', recycle: 'recycle', meal: 'meal', reuse: 'cycle',
    '🌱': 'leaf', '🌿': 'leaf', '🚲': 'route', '🚶': 'route', '🚌': 'transit', '🚇': 'transit', '🥗': 'meal', '🍽️': 'meal', '🥬': 'meal',
    '💡': 'energy', '⚡': 'energy', '🔌': 'plug', '📆': 'calendar', '📄': 'document', '📜': 'document', '📈': 'trend', '🏙️': 'city', '🗺️': 'map',
    '🧭': 'compass', '♻️': 'recycle', '↻': 'recycle', '⌕': 'search', '☀': 'sun', '🌤️': 'sun', '❄️': 'energy', '🚿': 'water', '💧': 'water', '🛍️': 'shopping', '📦': 'cycle',
    '＋': 'add', '▤': 'history', '♧': 'family', '✦': 'spark', '✓': 'check', '🔒': 'lock', '🌍': 'globe', '↗': 'trend'
  };
  const iconShapes = {
    leaf: '<path d="M20.5 3.8C12.7 4 6.8 6.1 4 10.4c-2.2 3.5-.1 7.8 3.9 8.1 5.6.4 10-5 12.6-14.7Z"/><path d="M4.6 20c3-4.1 6.6-7.2 11.2-10.1"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.7 5-5 2.7 2.7-5z"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18c7 0 1-12 8-12"/>',
    transit: '<rect x="5" y="3.5" width="14" height="15" rx="3"/><path d="M5 9h14M8 18.5l-1.5 2M16 18.5l1.5 2M8.5 13h.1M15.5 13h.1"/><circle cx="8.5" cy="16" r=".6"/><circle cx="15.5" cy="16" r=".6"/>',
    meal: '<path d="M4 12h16l-1.5 4.1a6.8 6.8 0 0 1-13 0L4 12Z"/><path d="M3 12h18M8 5v4M6 5v3M10 5v3M17 5v4"/>',
    energy: '<path d="M13.5 2.8 5.8 13h5.7l-1 8.2L18.2 11h-5.8l1.1-8.2Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h.1M12 13h.1M16 13h.1M8 17h.1M12 17h.1"/>',
    recycle: '<path d="m7 7 1.4-2.4A2.2 2.2 0 0 1 10.3 3.5h3.2M17 7l2.2 3.8-2.2 1.3M17 7l-3.8.2M17 17l-1.4 2.4a2.2 2.2 0 0 1-1.9 1.1h-3.2M7 17l-2.2-3.8 2.2-1.3M7 17l3.8-.2M4.8 10.7l1.6-2.8M19.2 13.3l-1.6 2.8"/>',
    cycle: '<path d="M4 8h11l-2.5-2.5M20 16H9l2.5 2.5"/><path d="M18.5 7.5A7 7 0 0 1 20 12M5.5 16.5A7 7 0 0 1 4 12"/>',
    document: '<path d="M6 3.5h8l4 4V20H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"/><path d="M14 3.5v5h5M8 12h8M8 16h8"/>',
    history: '<path d="M4.5 8a8 8 0 1 1-1 5M3.5 4.5v4h4M12 7v5l3 2"/>',
    family: '<circle cx="12" cy="6" r="2.5"/><circle cx="6" cy="17.5" r="2.5"/><circle cx="18" cy="17.5" r="2.5"/><path d="m10.8 8.2-3.5 7M13.2 8.2l3.5 7M8.5 17.5h7"/>',
    book: '<path d="M3.5 5.5c3.3-1.1 6.2-.6 8.5 1.4v13c-2.3-2-5.2-2.5-8.5-1.4v-13ZM20.5 5.5c-3.3-1.1-6.2-.6-8.5 1.4v13c2.3-2 5.2-2.5 8.5-1.4v-13Z"/>',
    city: '<path d="M3.5 20.5V9l6-3v14.5M9.5 20.5V3.5l6 3v14M15.5 20.5V10l5 2v8.5M2 20.5h20"/><path d="M6 10h.1M6 13h.1M6 16h.1M12 8h.1M12 11h.1M12 14h.1M18 14h.1M18 17h.1"/>',
    map: '<path d="m3.5 6 5.7-2.5 5.6 2.5L20.5 3.5v14.8L14.8 21l-5.6-2.5-5.7 2.5V6Z"/><path d="M9.2 3.8v14.7M14.8 6v15M12 10a2 2 0 1 0 0 4c1.1 0 2-1.8 2-2s-.9-2-2-2Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M2.5 12h2M19.5 12h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"/>',
    water: '<path d="M12 3c-2.4 3.7-6.5 7.6-6.5 11.7a6.5 6.5 0 0 0 13 0C18.5 10.6 14.4 6.7 12 3Z"/><path d="M9 15.5a3.2 3.2 0 0 0 3.2 3"/>',
    plug: '<path d="M9 3.5v6M15 3.5v6M7 9.5h10v2.2a5 5 0 0 1-5 5v4M12 16.7v4"/>',
    shopping: '<path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    trend: '<path d="M4 19.5h16M5.5 16V11M10 16V7M14.5 16v-4M19 16V5"/><path d="m4.5 8 5-3 4.5 2 5-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.3 2.5 3.4 5.5 3.4 9S14.3 18.5 12 21M12 3c-2.3 2.5-3.4 5.5-3.4 9s1.1 6.5 3.4 9"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    add: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.2 4L19 7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  function lineIcon(icon, className = '') {
    const source = kinds[icon]?.emoji || icon;
    const key = iconAliases[source] || iconAliases[icon] || icon;
    const classes = ['carbon-line-icon', className].filter(Boolean).join(' ');
    return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true">${iconShapes[key] || iconShapes.leaf}</svg>`;
  }
  // 因子表与原生端 FactorRepository 保持一致，数值与等级由 record-data.js 提供。
  const FACTOR_TABLE = CarbonMateRecordData.FACTORS;
  Object.keys(FACTOR_TABLE).forEach(id => {
    if (kinds[id]) kinds[id] = { ...kinds[id], factor: FACTOR_TABLE[id][0], noEstimate: false };
  });
  kinds.electricity = { ...kinds.electricity, name: '节约用电', unit: '千瓦时', label: '节电量', help: '填写电表或智能插座给出的节电量；不确定时可勾选“只记录行为”。', placeholder: '填写节电量' };
  kinds.reuse = { ...kinds.reuse, name: '闲置物品处理', label: '处理物品件数', help: '选清物品类别和实际去向；按件估算，误差区间较大，仅用于趋势比较。' };
  const electricityActions = ['离开时随手关灯', '关闭闲置电器', '拔掉不用的充电器', '空调温度调高 1℃', '减少电器待机', '其他节电行动'];
  const reverseType = Object.fromEntries(Object.entries(TYPE).map(([key, value]) => [value, key]));
  document.querySelectorAll('#behavior option').forEach(option => { option.textContent = option.textContent.replace(/^[^\u3400-\u9fff]+/u, '').trim(); });
  const estimateCaption = document.querySelector('.estimate span:first-child');
  if (estimateCaption?.firstChild) estimateCaption.firstChild.textContent = '碳量估算（官方因子或参考值） ';
  const matchedSeedRows = new Set();
  records.forEach(row => {
    if (row.previewAdded || row.demoSeed) return;
    const seedIndex = seed.findIndex((sample, index) => !matchedSeedRows.has(index) &&
      row.kind === sample.kind && Number(row.value) === Number(sample.value) && row.note === sample.note && Number(row.points) === Number(sample.points));
    if (seedIndex < 0) return;
    matchedSeedRows.add(seedIndex);
    row.demoSeed = true;
    if (row.kind === 'electricity') { row.notEstimated = true; row.reduction = 0; row.points = 0; }
  });
  const tasks = [
    { id: 'one-action', group: 'daily', title: '记下一件今天做过的事', description: '步行、公交、节电或减少浪费都算。', icon: 'leaf', points: 8, test: rows => rows.length >= 1 },
    { id: 'two-categories', group: 'daily', title: '换个场景试试', description: '今天记录两种不同类型的行动。', icon: 'compass', points: 12, test: rows => new Set(rows.map(row => row.kind)).size >= 2 },
    { id: 'move-gently', group: 'daily', title: '短途换一种走法', description: '记录步行、骑行或公共交通。', icon: 'route', points: 8, test: rows => rows.some(row => ['walk', 'bicycle', 'bus', 'metro'].includes(row.kind)) },
    { id: 'eat-what-you-order', group: 'daily', title: '按食量点餐', description: '记录一顿按需取餐、减少浪费的行动。', icon: 'meal', points: 8, test: rows => rows.some(row => row.kind === 'meal') },
    { id: 'home-energy', group: 'daily', title: '照看家里的能源和用水', description: '记录一次节电或节水行动。', icon: 'energy', points: 8, test: rows => rows.some(row => ['electricity', 'water'].includes(row.kind)) },
    { id: 'steady-days', group: 'weekly', title: '一周里行动三天', description: '不必连续，按自己的节奏完成。', icon: 'calendar', points: 24, test: rows => new Set(rows.map(row => dayKey(row.date))).size >= 3 },
    { id: 'explore-categories', group: 'weekly', title: '试试三种不同做法', description: '一周记录覆盖至少三类低碳行动。', icon: 'leaf', points: 20, test: rows => new Set(rows.map(row => row.kind)).size >= 3 },
    { id: 'give-things-another-life', group: 'weekly', title: '让闲置物继续派上用场', description: '转赠、维修或合规回收一件闲置物。', icon: 'recycle', points: 16, test: rows => rows.some(row => row.kind === 'reuse') }
  ];
  // Retain old physical entries only so imported historical redemption records remain valid.
  const legacyPhysicalRewards = [
    { id: 'recycled-cup', title: '再生材随行杯', points: 480, physical: true },
    { id: 'canvas-tote', title: '低碳日常帆布袋', points: 360, physical: true },
    { id: 'bamboo-cutlery', title: '随行餐具收纳组', points: 300, physical: true },
    { id: 'recycled-notebook', title: '再生纸行动手账', points: 220, physical: true }
  ];
  const legacyDigitalRewards = [
    { id: 'record-certificate', title: '低碳实践成就证书', points: 80, physical: false },
    { id: 'profile-frame', title: '森屿头像边框', points: 50, physical: false },
    { id: 'green-title', title: '绿色生活称号', points: 100, physical: false },
    { id: 'collection-backdrop', title: '林间徽章背景', points: 120, physical: false }
  ];
  const rewards = [
    { id: 'record-certificate', title: '低碳实践记录证书', mark: '证', points: 80, category: 'certificate', repeatable: true, text: '按当前已保存的行动记录生成个人纪念证书，列明记录周期、类别、行动日与生成编号。' },
    { id: 'season-card', title: '四季同行纪念卡', mark: '季', points: 60, category: 'memory', repeatable: true, text: '把阶段行动整理成一张可保存、可分享的电子纪念卡。' },
    { id: 'highlight-card', title: '本月行动精选卡', mark: '月', points: 40, category: 'memory', repeatable: true, text: '将本月真实记录汇总成一张专属电子纪念卡。' },
    { id: 'green-title', title: '日常守绿者', displayTitle: '日常守绿者', mark: '守', points: 100, category: 'title', text: '为个人主页佩戴一枚温和、日常的低碳生活称号。' },
    { id: 'city-walker-title', title: '城市轻行者', displayTitle: '城市轻行者', mark: '行', points: 100, category: 'title', text: '献给愿意让短途出行更轻盈的人。' },
    { id: 'circular-life-title', title: '循环生活家', displayTitle: '循环生活家', mark: '循', points: 120, category: 'title', text: '为重复使用、维修与物尽其用的生活方式留个称号。' },
    { id: 'resource-keeper-title', title: '细水长流者', displayTitle: '细水长流者', mark: '惜', points: 120, category: 'title', text: '记录节约用水、用电等日常资源行动的数字称号。' },
    { id: 'mindful-table-title', title: '恰好生活家', displayTitle: '恰好生活家', mark: '食', points: 120, category: 'title', text: '把按需取餐、减少浪费的每个小选择变成个人标记。' },
    { id: 'knowledge-practice-title', title: '知行同行者', displayTitle: '知行同行者', mark: '知', points: 140, category: 'title', text: '献给把低碳知识带回生活、持续实践的人。' },
    { id: 'profile-frame', title: '青岚头像边框', mark: '岚', points: 80, category: 'background', theme: 'mist', text: '为个人资料头像添一圈青岚色的数字装饰。' },
    { id: 'collection-backdrop', title: '林间晨雾', mark: '林', points: 120, category: 'background', theme: 'forest', text: '以林影与晨雾为灵感的个人主页主题背景。' },
    { id: 'river-backdrop', title: '溪谷青影', mark: '溪', points: 120, category: 'background', theme: 'river', text: '以水色、石纹和留白组成的清透主题背景。' },
    { id: 'dawn-backdrop', title: '原野微光', mark: '光', points: 140, category: 'background', theme: 'dawn', text: '暖金晨光与草木色调的主页主题背景。' },
    { id: 'night-backdrop', title: '山月松风', mark: '月', points: 160, category: 'background', theme: 'night', text: '深青松影与月色层次构成的夜色主题背景。' },
    { id: 'paper-backdrop', title: '纸上青山', mark: '山', points: 140, category: 'background', theme: 'paper', text: '以手作纸感与淡墨山形呈现的雅致主题背景。' }
  ];
  const badgeSeries = [
    { id: 'everyday', name: '日常行动', color: '#4d805d', ink: '#385f43' },
    { id: 'variety', name: '多元实践', color: '#53818a', ink: '#355e68' },
    { id: 'consistency', name: '持续习惯', color: '#b27a42', ink: '#80572e' },
    { id: 'learning', name: '低碳学习', color: '#7965a1', ink: '#564678' }
  ];
  const badgeRules = [
    { id: 'first-step', name: '初见绿意', rule: '完成第 1 条低碳记录', series: 'everyday', glyph: 'seed', target: 1, metric: 'records' },
    { id: 'ten-actions', name: '十次微光', rule: '累计完成 10 条行动记录', series: 'everyday', glyph: 'spark', target: 10, metric: 'records' },
    { id: 'thirty-actions', name: '习惯成自然', rule: '累计完成 30 条行动记录', series: 'everyday', glyph: 'leaf', target: 30, metric: 'records' },
    { id: 'hundred-actions', name: '百次同行', rule: '累计完成 100 条行动记录', series: 'everyday', glyph: 'sun', target: 100, metric: 'records' },
    { id: 'many-ways', name: '多面行动派', rule: '记录至少 3 种行为类别', series: 'variety', glyph: 'compass', target: 3, metric: 'kinds' },
    { id: 'five-paths', name: '五径探索者', rule: '记录至少 5 种行为类别', series: 'variety', glyph: 'trail', target: 5, metric: 'kinds' },
    { id: 'green-commute', name: '轻行城市', rule: '记录 10 次步行、骑行或公共交通', series: 'variety', glyph: 'cycle', target: 10, metric: 'travel' },
    { id: 'mindful-meal', name: '刚刚好的餐桌', rule: '记录 10 次按需取餐或光盘行动', series: 'variety', glyph: 'bowl', target: 10, metric: 'meal' },
    { id: 'second-life', name: '物尽其用', rule: '记录 5 件闲置物的转赠、维修或回收', series: 'variety', glyph: 'reuse', target: 5, metric: 'reuse' },
    { id: 'energy-keeper', name: '随手节能', rule: '记录 10 次节电行动', series: 'variety', glyph: 'bulb', target: 10, metric: 'electricity' },
    { id: 'water-wise', name: '惜水有方', rule: '记录 10 次节水行动', series: 'variety', glyph: 'drop', target: 10, metric: 'water' },
    { id: 'paper-loop', name: '纸有回响', rule: '记录 10 次纸张回收', series: 'variety', glyph: 'paper', target: 10, metric: 'recycle' },
    { id: 'week-active', name: '七日同行', rule: '累计在 7 个不同日期行动', series: 'consistency', glyph: 'calendar', target: 7, metric: 'days' },
    { id: 'ten-days', name: '月中常青', rule: '累计在 10 个不同日期行动', series: 'consistency', glyph: 'sunrise', target: 10, metric: 'days' },
    { id: 'thirty-days', name: '常伴绿意', rule: '累计在 30 个不同日期行动', series: 'consistency', glyph: 'calendar-star', target: 30, metric: 'days' },
    { id: 'hundred-days', name: '百日有为', rule: '累计在 100 个不同日期行动', series: 'consistency', glyph: 'mountain', target: 100, metric: 'days' },
    { id: 'week-streak', name: '连续七日', rule: '连续 7 天记录低碳行动', series: 'consistency', glyph: 'flame', target: 7, metric: 'streak' },
    { id: 'month-streak', name: '一月如一', rule: '连续 30 天记录低碳行动', series: 'consistency', glyph: 'moon', target: 30, metric: 'streak' },
    { id: 'first-course', name: '求知新芽', rule: '完成 1 个低碳学习专题', series: 'learning', glyph: 'book', target: 1, metric: 'courses' },
    { id: 'course-master', name: '知行相伴', rule: '完成全部 6 个低碳学习专题', series: 'learning', glyph: 'open-book', target: 6, metric: 'courses' },
    { id: 'one-full-week', name: '一周有绿', rule: '在一周内完成 5 个不同日期的行动记录', series: 'consistency', glyph: 'calendar-star', target: 5, metric: 'weekDays' },
    { id: 'resource-steward', name: '资源守望者', rule: '累计完成 20 次节水或节电行动', series: 'variety', glyph: 'bulb', target: 20, metric: 'resource' },
    { id: 'commute-explorer', name: '绿色通勤地图', rule: '累计完成 25 次步行、骑行或公共交通', series: 'variety', glyph: 'trail', target: 25, metric: 'travel' },
    { id: 'food-wise', name: '珍惜每一餐', rule: '累计完成 25 次按需取餐或光盘行动', series: 'variety', glyph: 'bowl', target: 25, metric: 'meal' },
    { id: 'monthly-rhythm', name: '四时常新', rule: '在 3 个不同月份留下行动记录', series: 'consistency', glyph: 'sunrise', target: 3, metric: 'months' },
    { id: 'paper-cycle', name: '纸张新旅程', rule: '累计完成 25 次纸张回收', series: 'variety', glyph: 'paper', target: 25, metric: 'recycle' },
    { id: 'learn-and-do', name: '学以致用', rule: '完成一个学习专题，并留下至少一条行动记录', series: 'learning', glyph: 'book', target: 1, metric: 'learnAction' },
    { id: 'two-week-streak', name: '半月如一', rule: '连续 14 天记录低碳行动', series: 'consistency', glyph: 'flame', target: 14, metric: 'streak' },
    { id: 'ten-kilos', name: '绿色贡献者', rule: '旧版纪念徽章 · 基于演示减排估算', series: 'everyday', glyph: 'legacy', legacyOnly: true },
    { id: 'digital-supporter', name: '绿色行动纪念章', rule: '旧版积分兑换徽章', series: 'everyday', glyph: 'legacy', legacyOnly: true }
  ];
  let matureState = readState();
  let activeFilter = { year: '', month: '', start: '', end: '', kind: '' };
  const homeRanges = ['day', 'week', 'month', 'year', 'custom'];
  let activeHomeRange = homeRanges.includes(matureState.settings.homeRange) ? matureState.settings.homeRange : 'week';
  let chartMode = matureState.settings.chartMode === 'cumulative' ? 'cumulative' : 'period';
  let profileView = 'overview';
  let missionView = 'overview';
  let badgeSeriesFilter = 'all';
  let badgeStatusFilter = 'all';
  let rewardCategoryFilter = 'all';
  let modalReturnFocus = null;
  let storageWriteFailed = false;

  function normalizeLearningProgress(value) {
    const source = value && typeof value === 'object' ? value : {};
    const available = new Set(Array.isArray(source.completedLevels) ? source.completedLevels.filter(id => Number.isInteger(id) && id >= 1 && id <= 6) : []);
    const completedLevels = [];
    let unlockedLevel = 1;
    while (available.has(unlockedLevel)) { completedLevels.push(unlockedLevel); if (unlockedLevel < 6) unlockedLevel += 1; else break; }
    const quizAttempts = Number.isSafeInteger(source.quizAttempts) && source.quizAttempts >= 0 ? source.quizAttempts : 0;
    const quizCorrect = Number.isSafeInteger(source.quizCorrect) && source.quizCorrect >= 0 ? Math.min(source.quizCorrect, quizAttempts) : 0;
    const lessonCursors = {};
    if (source.lessonCursors && typeof source.lessonCursors === 'object') {
      for (let id = 1; id <= 6; id += 1) {
        const cursor = source.lessonCursors[id];
        if (Number.isInteger(cursor) && cursor >= 0 && cursor <= 8) lessonCursors[id] = cursor;
      }
    }
    const bookmarkedTips = Array.isArray(source.bookmarkedTips) ? source.bookmarkedTips.filter(id => typeof id === 'string') : [];
    const readTips = Array.isArray(source.readTips) ? source.readTips.filter(id => typeof id === 'string') : [];
    const readPolicies = Array.isArray(source.readPolicies) ? source.readPolicies.filter(id => Number.isInteger(id) && id >= 0 && id < 10) : [];
    const readTopics = Array.isArray(source.readTopics) ? source.readTopics.filter(id => typeof id === 'string') : [];
    return { unlockedLevel: Math.max(1, unlockedLevel), completedLevels, quizAttempts, quizCorrect, lessonCursors, bookmarkedTips, readTips, readPolicies, readTopics };
  }

  function readState() {
    try {
      const stored = CarbonMateRecordData.readSnapshot(localStorage)?.state ?? JSON.parse(localStorage.getItem(STORAGE) || '{}');
      return {
        taskClaims: Array.isArray(stored.taskClaims) ? stored.taskClaims : [],
        redemptions: Array.isArray(stored.redemptions) ? stored.redemptions : [],
        earnedBadges: Array.isArray(stored.earnedBadges) ? stored.earnedBadges : [],
        settings: stored.settings && typeof stored.settings === 'object' ? stored.settings : { weeklyGoalKg: 3 },
        profile: normalizeProfile(stored.profile),
        learningProgress: normalizeLearningProgress(stored.learningProgress),
        family: normalizeFamily(stored.family),
        shareSettings: stored.shareSettings && typeof stored.shareSettings === 'object' ? { hideName: stored.shareSettings.hideName !== false } : { hideName: true },
        largeText: stored.largeText === true
      };
    } catch (_) {
      return { taskClaims: [], redemptions: [], earnedBadges: [], settings: { weeklyGoalKg: 3 }, profile: normalizeProfile(), learningProgress: { unlockedLevel: 1, completedLevels: [], quizAttempts: 0, quizCorrect: 0, lessonCursors: {}, bookmarkedTips: [], readTips: [], readPolicies: [], readTopics: [] }, family: normalizeFamily(), shareSettings: { hideName: true }, largeText: false };
    }
  }

  function normalizeFamily(value) {
    const source = value && typeof value === 'object' ? value : {};
    const members = Array.isArray(source.members) ? source.members.filter(member => member && typeof member.id === 'string').slice(0, 12).map(member => ({ id: member.id.slice(0, 40), name: String(member.name || '家庭成员').trim().slice(0, 20), role: member.role === 'owner' ? 'owner' : 'member' })) : [];
    const rows = Array.isArray(source.records) ? source.records.filter(row => row && typeof row.id === 'string' && kinds[row.kind] && typeof row.memberId === 'string' && Number.isFinite(Number(row.value)) && Number.isFinite(Number(row.date))).slice(0, 2000) : [];
    return { name: String(source.name || '').trim().slice(0, 30), members, records: rows };
  }

  const AVATAR_PRESETS = [
    { id: 'fern', label: '蕨影', background: '#dce9dc', accent: '#a8c6a3', skin: '#efc3a5', hair: '#4c4038', shirt: '#6f9278', hairShape: 'M70 119c-7-46 14-79 58-79 43 0 67 31 58 82l-13 29-12-27c-17-2-38-12-53-27-8 17-20 25-37 29l-1 28Z' },
    { id: 'tide', label: '潮汐', background: '#dce9eb', accent: '#a9cbd0', skin: '#dcae91', hair: '#354b55', shirt: '#6e9297', hairShape: 'M67 121c-5-50 16-82 61-82 41 0 67 32 59 82l-7 34-13-20v-36c-13 3-28 1-44-4-13 11-30 17-53 17l-1 30Z' },
    { id: 'sunrise', label: '晨光', background: '#f1e5d3', accent: '#d8b982', skin: '#efc29e', hair: '#5b4037', shirt: '#b17d5e', hairShape: 'M68 120c-8-47 14-80 61-80 44 0 66 33 58 80l-12 28-7-33c-10-14-19-24-28-37-14 20-36 31-67 33l-3 36Z' },
    { id: 'lavender', label: '山岚', background: '#e8e0eb', accent: '#b8a7c1', skin: '#e8bfa7', hair: '#4b424f', shirt: '#82758d', hairShape: 'M69 116c-6-46 15-77 59-77 44 0 67 33 59 78l-3 35-17-15 1-42c-11-1-20-6-29-17-14 15-35 23-66 23l-2 49Z' },
    { id: 'grove', label: '林间', background: '#e2e9d6', accent: '#b3c48c', skin: '#b8795c', hair: '#332e28', shirt: '#78875f', hairShape: 'M68 122c-7-48 16-83 61-83 43 0 66 32 58 82l-8 39-15-27 2-34c-19 1-37-7-51-22-9 15-23 24-45 28l-2 45Z' },
    { id: 'cloud', label: '云朵', background: '#e4e9ee', accent: '#b3c3d1', skin: '#f0c6a8', hair: '#584943', shirt: '#718393', hairShape: 'M69 120c-7-47 15-80 60-80 43 0 66 31 59 80l-11 33-10-25v-40c-16 2-32-3-47-15-12 15-28 23-49 25l-2 49Z' }
  ];

  function avatarPresetDataUri(id) {
    const preset = AVATAR_PRESETS.find(item => item.id === id);
    if (!preset) return '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="48" fill="${preset.background}"/><circle cx="207" cy="47" r="31" fill="${preset.accent}" opacity=".62"/><circle cx="45" cy="204" r="25" fill="${preset.accent}" opacity=".32"/><path d="M31 256c8-52 44-81 97-81s89 29 97 81" fill="${preset.shirt}"/><path d="M107 153h42v40h-42z" fill="${preset.skin}"/><ellipse cx="128" cy="111" rx="49" ry="59" fill="${preset.skin}"/><path d="${preset.hairShape}" fill="${preset.hair}"/><path d="M110 117c3-3 7-3 10 0m17 0c3-3 7-3 10 0" fill="none" stroke="#4f4038" stroke-width="4" stroke-linecap="round"/><path d="M119 139c5 4 13 4 18 0" fill="none" stroke="#a76560" stroke-width="3.5" stroke-linecap="round"/><path d="M51 68c8-16 18-23 33-25-2 14-11 24-27 29m-7-10c-4-11-3-20 3-29 9 8 12 17 8 29" fill="${preset.accent}" opacity=".8"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function normalizeProfile(value) {
    const name = typeof value?.displayName === 'string' ? value.displayName.trim().slice(0, 20) : '';
    const featuredBadgeId = typeof value?.featuredBadgeId === 'string' && value.featuredBadgeId.length <= 40 ? value.featuredBadgeId : '';
    const customTitle = typeof value?.customTitle === 'string' ? value.customTitle.trim().slice(0, 20) : '';
    const activeTitleId = typeof value?.activeTitleId === 'string' && value.activeTitleId.length <= 60 ? value.activeTitleId : '';
    const activeBackgroundId = typeof value?.activeBackgroundId === 'string' && value.activeBackgroundId.length <= 60 ? value.activeBackgroundId : '';
    const avatarDataUrl = typeof value?.avatarDataUrl === 'string' && value.avatarDataUrl.length <= 350000 && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value.avatarDataUrl) ? value.avatarDataUrl : '';
    const avatarPresetId = avatarDataUrl ? '' : AVATAR_PRESET_IDS.includes(value?.avatarPresetId) ? value.avatarPresetId : '';
    return { displayName: name || '绿色生活家', featuredBadgeId, customTitle, activeTitleId, activeBackgroundId, avatarPresetId, avatarDataUrl };
  }

  function dayKey(value) {
    const date = new Date(Number(value));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  let lastRenderedDay = dayKey(Date.now());
  let calendarRefreshTimer = null;

  function refreshCalendarIfNeeded() {
    const currentDay = dayKey(Date.now());
    if (currentDay !== lastRenderedDay) {
      lastRenderedDay = currentDay;
      renderAll();
    }
    scheduleCalendarRefresh();
  }

  function scheduleCalendarRefresh() {
    clearTimeout(calendarRefreshTimer);
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 100);
    calendarRefreshTimer = setTimeout(refreshCalendarIfNeeded, Math.max(1000, nextMidnight.getTime() - Date.now()));
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function showToast(message) {
    if (storageWriteFailed) message = '本地保存失败，请导出备份；当前修改尚未可靠保存';
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  let persistenceRequested = false;
  function requestPersistentStorage() {
    if (persistenceRequested || !navigator.storage?.persist) return;
    persistenceRequested = true;
    navigator.storage.persist().catch(() => false);
  }

  function saveState() {
    try {
      requestPersistentStorage();
      CarbonMateRecordData.writeSnapshot(localStorage, records, matureState);
      storageWriteFailed = false;
      document.getElementById('storageFailureNotice')?.remove();
      return true;
    } catch (_) {
      storageWriteFailed = true;
      if (!document.getElementById('storageFailureNotice')) {
        const notice = document.createElement('div');
        notice.id = 'storageFailureNotice'; notice.className = 'storage-failure-notice'; notice.setAttribute('role', 'alert');
        notice.innerHTML = '<span>本地保存失败，请保留此页面并导出备份。</span><button type="button">导出备份</button>';
        notice.querySelector('button').addEventListener('click', downloadBackup);
        document.querySelector('main.main').prepend(notice);
      }
      showToast('本地保存失败，请立即导出备份后再关闭页面');
      return false;
    }
  }

  function realRecords(rows = records) {
    return CarbonMateRecordData.realRecords(rows);
  }

  function pointsForNewAction() {
    const today = dayKey(Date.now());
    const rewardedToday = realRecords().filter(row => dayKey(row.date) === today && Number(row.points || 0) > 0).length;
    return rewardedToday < 5 ? 5 : 0;
  }

  function todayRecords() {
    const today = dayKey(Date.now());
    return realRecords().filter(row => dayKey(row.date) === today);
  }

  function qualifyTasks(persist = true) {
    const currentDay = dayKey(Date.now());
    const today = todayRecords();
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const weekStart = dayKey(monday.getTime());
    const weekRows = realRecords().filter(row => Number(row.date) >= monday.getTime());
    const newClaims = [];
    tasks.forEach(task => {
      const periodKey = task.group === 'weekly' ? `week:${weekStart}` : currentDay;
      const claimId = `${periodKey}:${task.id}`;
      if (task.test(task.group === 'weekly' ? weekRows : today) && !matureState.taskClaims.some(claim => claim.id === claimId)) {
        matureState.taskClaims.push({ id: claimId, taskId: task.id, day: currentDay, periodKey, group: task.group, points: task.points, createdAt: Date.now() });
        newClaims.push(task);
      }
    });
    if (newClaims.length > 0 && persist) {
      if (!saveState()) return newClaims;
      showToast(`任务完成，获得 ${newClaims.reduce((sum, task) => sum + task.points, 0)} 积分`);
    }
    return newClaims;
  }

  function unlockBadges(persist = true) {
    const newBadges = [];
    badgeRules.forEach(badge => {
      if (!badge.legacyOnly && getBadgeProgress(badge)[0] >= badge.target && !matureState.earnedBadges.some(item => item.id === badge.id)) {
        matureState.earnedBadges.push({ id: badge.id, earnedAt: Date.now() });
        newBadges.push(badge);
      }
    });
    if (newBadges.length > 0 && persist) {
      if (!saveState()) return newBadges;
      showBadgeCelebration(newBadges);
    }
    return newBadges;
  }

  function showBadgeCelebration(badges) {
    const visible = badges.slice(0, 4);
    const backdrop = showDialog('新成就已收入徽章册', `<div class="badge-unlock-scene"><div class="badge-confetti" aria-hidden="true">✦　✧　✦</div><p>${badges.length > 1 ? `一次解锁 ${badges.length} 枚，` : ''}这是你真实行动留下的记录。</p><div class="badge-unlock-row">${visible.map(badge => `<div class="badge-unlock-item">${renderBadgeArtwork(badge)}<b>${esc(badge.name)}</b></div>`).join('')}</div>${badges.length > visible.length ? `<small>还有 ${badges.length - visible.length} 枚新徽章</small>` : ''}</div>`, '<button class="dialog-secondary" id="badgeCelebrateLater">继续行动</button><button class="dialog-primary" id="badgeCelebrateOpen">查看徽章册</button>');
    backdrop.querySelector('#badgeCelebrateLater').addEventListener('click', closeDialog);
    backdrop.querySelector('#badgeCelebrateOpen').addEventListener('click', () => { closeDialog(); missionView = 'badges'; navigate('missions'); renderMissions(); });
  }

  function getBalance() {
    const earned = realRecords().reduce((sum, row) => sum + Number(row.points || 0), 0) + matureState.taskClaims.reduce((sum, item) => sum + item.points, 0);
    const spent = matureState.redemptions.reduce((sum, item) => sum + item.cost, 0);
    return { earned, spent, available: earned - spent };
  }

  function allReduction(rows = records) {
    return realRecords(rows).filter(CarbonMateRecordData.isEstimated).reduce((sum, row) => sum + Number(row.reduction || 0), 0);
  }

  function isLegacyPowerRow(row) {
    return row.kind === 'electricity' && !row.actionDetail && row.notEstimated !== true;
  }

  function getFilteredRecords() {
    if (activeFilter.start && activeFilter.end && activeFilter.start > activeFilter.end) return [];
    return records.filter(row => {
      const date = new Date(Number(row.date));
      if (activeFilter.year && date.getFullYear() !== Number(activeFilter.year)) return false;
      if (activeFilter.month && date.getMonth() + 1 !== Number(activeFilter.month)) return false;
      if (activeFilter.start && dayKey(row.date) < activeFilter.start) return false;
      if (activeFilter.end && dayKey(row.date) > activeFilter.end) return false;
      if (activeFilter.kind && row.kind !== activeFilter.kind) return false;
      if (activeFilter.keyword) {
        const searchText = `${kinds[row.kind]?.name || ''} ${row.actionDetail || ''} ${row.itemCategory || ''} ${row.destination || ''} ${row.note || ''}`.toLocaleLowerCase();
        if (!searchText.includes(activeFilter.keyword)) return false;
      }
      return true;
    }).sort((a, b) => b.date - a.date);
  }

  function currentRangeLabel() {
    if (activeFilter.start || activeFilter.end) return `${activeFilter.start || '不限'} 至 ${activeFilter.end || '不限'}`;
    if (activeFilter.year && activeFilter.month) return `${activeFilter.year} 年 ${activeFilter.month} 月`;
    if (activeFilter.year) return `${activeFilter.year} 年`;
    return '全部年份';
  }

  function ensureLedgerPage() {
    const ledger = document.getElementById('page-data');
    const recordPage = document.getElementById('page-record');
    if (!ledger || !recordPage) return;
    ledger.id = 'page-ledger';
    const title = ledger.querySelector('h1');
    const subtitle = ledger.querySelector('.subtitle');
    if (title) title.textContent = '低碳记录';
    if (subtitle) subtitle.textContent = '记录低碳行动，并随时查找历史记录。';
    const form = recordPage.querySelector('.form-card');
    const behavior = form?.querySelector('#behavior');
    if (behavior) {
      behavior.querySelector('option[value="electricity"]').textContent = '节电行动';
      behavior.querySelector('option[value="reuse"]').textContent = '闲置物品处理';
    }
    const reuseDetails = form?.querySelector('#reuseDetails');
    if (reuseDetails && !form.querySelector('#electricityDetails')) {
      reuseDetails.insertAdjacentHTML('afterend', `<div id="electricityDetails" class="reuse-details" hidden><div class="field"><label for="electricityAction">具体节电行动</label><select id="electricityAction"><option value="">请选择实际做过的行动</option>${electricityActions.map(action => `<option>${action}</option>`).join('')}</select></div><p class="activity-help">按实际行动记录次数即可；如果不知道省电量，不需要填写千瓦时，也不会估算减排或发放积分。</p></div>`);
    }
    const reuseCategory = form?.querySelector('#itemCategory');
    if (reuseCategory) {
      const labels = ['衣物 / 鞋包', '书籍 / 文具', '手机 / 数码产品', '小家电', '家具 / 家居用品', '其他闲置物品'];
      [...reuseCategory.options].slice(1).forEach((option, index) => { option.textContent = labels[index] || option.textContent; });
    }
    const reuseDestination = form?.querySelector('#itemDestination');
    if (reuseDestination) {
      const labels = ['捐赠给公益机构', '转赠亲友', '送至正规回收点', '二手转卖', '维修后继续使用'];
      [...reuseDestination.options].slice(1).forEach((option, index) => { option.textContent = labels[index] || option.textContent; });
    }
    if (recordPage.querySelector('.subtitle')) recordPage.querySelector('.subtitle').textContent = '选择行动类型，按提示填写；没有可靠活动量时也可以只记行为。';
    if (form && false) {
      const activityInput = form.querySelector('#activity');
      activityInput.value = '';
      const activityField = activityInput.closest('.field');
      activityField.querySelector('label').id = 'activityLabel';
      activityField.insertAdjacentHTML('beforeend', '<small id="activityHelp" class="activity-help"></small><div id="mealStepper" class="meal-stepper" hidden><button type="button" id="mealMinus" aria-label="减少一份">−</button><span>份数</span><button type="button" id="mealPlus" aria-label="增加一份">＋</button></div>');
      activityField.insertAdjacentHTML('afterend', '<label class="unquantified-toggle"><input id="unquantified" type="checkbox"><span><b>只记录行为，不估算减排</b><small>活动量不确定时可选；行动记录仍可获得每日上限内的积分。</small></span></label>');
      form.querySelector('#note').placeholder = '补充行动细节，例如：空调调高一度';
      const footnote = form.querySelector(':scope > p');
      if (footnote) { footnote.className = 'form-footnote'; footnote.textContent = '估算仅作原型参考，不代表完整碳足迹或正式核算结果；记录量应尽量采用实测值。'; }
    }
    const unquantifiedToggle = form?.querySelector('#unquantified');
    if (unquantifiedToggle && unquantifiedToggle.dataset.bound !== 'true') {
      unquantifiedToggle.addEventListener('change', updateActivityEstimate);
      unquantifiedToggle.dataset.bound = 'true';
    }
    if (form) form.querySelector('#activity').value = '';
    const host = document.getElementById('ledgerRecordHost');
    if (form && host) {
      const panel = document.createElement('div');
      panel.className = 'panel ledger-entry-panel';
      panel.innerHTML = '<div class="panel-head"><div><div class="panel-title">记录一项行动</div><div class="panel-note">按实际行动填写；节电和闲置物品只记录事实，不推算减排</div></div></div>';
      panel.appendChild(form);
      host.replaceWith(panel);
    }
    const history = ledger.querySelector('.table-wrap')?.closest('.panel');
    if (history) history.id = 'historyPanel';
    const main = document.querySelector('main.main');
    const titleRow = ledger.querySelector('.title-row');
    const exportButton = document.getElementById('exportCsvButton');
    const entryPanel = ledger.querySelector('.ledger-entry-panel');
    titleRow?.querySelector('#exportCsvButton')?.remove();
    const family = matureState.family;
    const familySummary = familyTotals();
    ledger.innerHTML = `${titleRow?.outerHTML || '<div class="title-row"><h1 class="title">低碳记录</h1></div>'}
      <div class="ledger-hub-grid">
        <button class="ledger-hub-card ledger-hub-add" type="button" data-page="record"><span class="ledger-hub-icon">${lineIcon('add')}</span><span><b>记录一项低碳行动</b><small>手动填写，或拍照识别后核对</small></span><i>›</i></button>
        <button class="ledger-hub-card" type="button" data-page="history"><span class="ledger-hub-icon">${lineIcon('history')}</span><span><b>查看历史记录</b><small>按日期、类别和关键词查找</small></span><i>›</i></button>
        <button class="ledger-hub-card ledger-family-entry" type="button" id="ledgerFamilyEntry"><span class="ledger-hub-icon">${lineIcon('family')}</span><span><b>${family.name ? `${esc(family.name)} · 家庭账户` : '家庭碳账户'}</b><small>${family.name ? `${familySummary.rows.length} 条家庭行动 · ${familySummary.points} 积分` : '查看家庭合并统计与成员行动'}</small></span><i>›</i></button>
      </div>
      <section class="ledger-hub-note"><span>${lineIcon('globe')}</span><div><b>个人记录与家庭汇总分开</b><small>照片识别需经你授权发送到 DeepSeek 云端；家庭跨设备同步需在鸿蒙端完成设备授权。</small></div></section>`;
    ledger.querySelector('#ledgerFamilyEntry')?.addEventListener('click', () => { capabilityReturnPage = 'ledger'; navigate('capabilities'); });
    const recordView = document.createElement('section');
    recordView.className = 'page';
    recordView.id = 'page-record';
    recordView.innerHTML = `<div class="title-row"><div><button type="button" class="learning-back-link" data-page="ledger">← 返回低碳记录</button><h1 class="title">新增低碳记录</h1><p class="subtitle">拍照识别或手动填写，确认后再保存。</p></div></div>
      <section class="panel photo-record-card"><div class="panel-head"><div><div class="panel-title">拍照识别行动</div><div class="panel-note">选择照片后，点击识别并确认上传</div></div><span class="capability-icon">${lineIcon('search')}</span></div>
      <p class="photo-record-copy">选一张能说明行动的照片。确认云端识别后，只会生成待核对草稿，不会自动保存。</p>
      <div class="photo-picker-actions"><button class="photo-picker" type="button" id="openLedgerCamera">打开摄像头</button><label class="photo-picker photo-picker-secondary">系统相机拍照<input id="ledgerRecognitionPhoto" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden></label><label class="photo-picker photo-picker-secondary">从相册选择<input id="ledgerRecognitionAlbum" type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div>
      <div id="ledgerCameraStage" class="ledger-camera-stage" hidden><video id="ledgerCameraVideo" autoplay playsinline muted aria-label="摄像头实时画面"></video><div class="ledger-camera-controls"><button class="filter-button" type="button" id="captureLedgerCamera" disabled>拍摄照片</button><button class="dialog-secondary" type="button" id="closeLedgerCamera">关闭摄像头</button></div></div>
      <div id="ledgerRecognitionPreview" class="recognition-preview"><span>选择照片后可先在本机预览</span></div>
      <div class="photo-recognition-actions"><button class="filter-button" type="button" id="recognizeLedgerPhoto" disabled>识别照片</button><small><span id="ledgerRecognitionStatus" role="status" aria-live="polite"></span></small></div>
      <div class="recognition-warning">请勿上传包含身份证、住址、车牌、人脸等敏感信息的照片。图片不会作为低碳记录附件保存；识别后请检查行动类别、数量和备注。</div></section>`;
    const historyView = document.createElement('section');
    historyView.className = 'page';
    historyView.id = 'page-history';
    historyView.innerHTML = `<div class="title-row"><div><button type="button" class="learning-back-link" data-page="ledger">← 返回低碳记录</button><h1 class="title">历史记录</h1><p class="subtitle">搜索、筛选、编辑或导出已保存的行动。</p></div></div>`;
    if (entryPanel) recordView.appendChild(entryPanel);
    if (exportButton) historyView.querySelector('.title-row').appendChild(exportButton);
    if (history) historyView.appendChild(history);
    main.append(recordView, historyView);
    recordView.querySelector('.ledger-entry-panel .panel-head .panel-title').textContent = '手动填写';
    recordView.querySelector('.ledger-entry-panel .panel-head .panel-note').textContent = '按实际行动填写；不确定的活动量可选择只记录行为';
    recordPage.remove();
  }

  function ensureNewNavigation() {
    document.querySelector('main.main').insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#mainContent">跳到主要内容</a>');
    document.querySelector('main.main').id = 'mainContent';
    document.querySelector('main.main').tabIndex = -1;
    document.getElementById('exportCsvButton').addEventListener('click', exportCsv);
    const dataPanel = document.getElementById('historyPanel');
    const filterBox = document.createElement('div');
    filterBox.className = 'filter-box';
    filterBox.id = 'recordFilters';
    filterBox.innerHTML = `
      <div class="filter-field filter-keyword"><label for="filterKeyword">关键词</label><input id="filterKeyword" type="search" placeholder="搜索行为、物品类别、去向或备注" aria-label="按行为、物品类别、处理去向或备注搜索"></div>
      <div class="filter-field"><label for="filterKind">行为类别</label><select id="filterKind" aria-label="按行为类别筛选"><option value="">全部类别</option>${Object.entries(kinds).map(([id, kind]) => `<option value="${id}">${esc(kind.name)}</option>`).join('')}</select></div>
      <div class="filter-field"><label for="filterStart">开始日期</label><input id="filterStart" type="date" aria-label="筛选开始日期"></div>
      <div class="filter-field"><label for="filterEnd">结束日期</label><input id="filterEnd" type="date" aria-label="筛选结束日期"></div>
      <div class="filter-actions"><button class="filter-button" id="resetFilters">重置筛选</button><button class="filter-button" id="filterCsv">导出当前结果</button></div>`;
    const filterSummary = document.createElement('div');
    filterSummary.id = 'filterSummary';
    filterSummary.className = 'filter-summary';
    dataPanel.querySelector('.panel-head').insertAdjacentElement('afterend', filterBox);
    filterBox.insertAdjacentElement('afterend', filterSummary);
    ['filterKind', 'filterStart', 'filterEnd'].forEach(id => document.getElementById(id).addEventListener('change', updateFilters));
    document.getElementById('filterKeyword').addEventListener('input', updateFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('filterCsv').addEventListener('click', () => exportCsv(getFilteredRecords()));
    const recognitionInput = document.getElementById('ledgerRecognitionPhoto');
    const recognitionAlbum = document.getElementById('ledgerRecognitionAlbum');
    const recognitionButton = document.getElementById('recognizeLedgerPhoto');
    const cameraStage = document.getElementById('ledgerCameraStage');
    const cameraVideo = document.getElementById('ledgerCameraVideo');
    const cameraButton = document.getElementById('openLedgerCamera');
    const captureButton = document.getElementById('captureLedgerCamera');
    let cameraStream = null;
    let recognitionFile = null;
    let recognitionRequest = null;
    let cameraVersion = 0;
    const stopRecognitionCamera = () => {
      cameraVersion += 1;
      cameraStream?.getTracks().forEach(track => track.stop());
      cameraStream = null;
      if (cameraVideo) cameraVideo.srcObject = null;
      if (cameraStage) cameraStage.hidden = true;
      if (captureButton) captureButton.disabled = true;
      if (cameraButton) cameraButton.disabled = false;
    };
    const showRecognitionPhoto = (file, statusText = '照片已选中；确认后开始云端识别。') => {
      stopRecognitionCamera();
      recognitionRequest?.abort();
      recognitionRequest = null;
      if (window.ledgerRecognitionUrl) URL.revokeObjectURL(window.ledgerRecognitionUrl);
      window.ledgerRecognitionUrl = null;
      document.getElementById('ledgerRecognitionPreview').innerHTML = '<span>选择照片后可先在本机预览</span>';
      recognitionFile = file || null;
      recognitionButton.textContent = '识别照片';
      recognitionButton.disabled = !recognitionFile;
      if (!recognitionFile) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(recognitionFile.type) || recognitionFile.size > 10 * 1024 * 1024) {
        recognitionFile = null; recognitionButton.disabled = true;
        document.getElementById('ledgerRecognitionStatus').textContent = '图片格式或大小不符合要求；请使用 10 MB 以内的 JPG、PNG 或 WebP。';
        return showToast('请选择 10 MB 以内的 JPG、PNG 或 WebP 图片');
      }
      const preview = document.getElementById('ledgerRecognitionPreview');
      if (window.ledgerRecognitionUrl) URL.revokeObjectURL(window.ledgerRecognitionUrl);
      window.ledgerRecognitionUrl = URL.createObjectURL(recognitionFile);
      preview.innerHTML = `<img alt="所选照片预览" src="${window.ledgerRecognitionUrl}"><span>仅本机预览 · 尚未上传</span>`;
      document.getElementById('ledgerRecognitionStatus').textContent = statusText;
    };
    window.clearLedgerRecognitionPhoto = () => {
      stopRecognitionCamera();
      recognitionRequest?.abort();
      recognitionRequest = null;
      if (window.ledgerRecognitionUrl) URL.revokeObjectURL(window.ledgerRecognitionUrl);
      window.ledgerRecognitionUrl = null;
      recognitionFile = null;
      recognitionButton.textContent = '识别照片';
      recognitionInput.value = '';
      recognitionAlbum.value = '';
      recognitionButton.disabled = true;
      document.getElementById('ledgerRecognitionPreview').innerHTML = '<span>选择照片后可先在本机预览</span>';
      document.getElementById('ledgerRecognitionStatus').textContent = '';
    };
    const selectRecognitionPhoto = input => { if (input.files?.[0]) showRecognitionPhoto(input.files[0]); };
    recognitionInput?.addEventListener('change', () => selectRecognitionPhoto(recognitionInput));
    recognitionAlbum?.addEventListener('change', () => selectRecognitionPhoto(recognitionAlbum));
    cameraButton?.addEventListener('click', async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        document.getElementById('ledgerRecognitionStatus').textContent = '当前浏览器不能直接调用摄像头；请使用“系统相机拍照”或从相册选择。';
        return;
      }
      cameraButton.disabled = true;
      const cameraRequestVersion = ++cameraVersion;
      document.getElementById('ledgerRecognitionStatus').textContent = '正在申请摄像头权限…';
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (cameraRequestVersion !== cameraVersion) { stream.getTracks().forEach(track => track.stop()); return; }
        cameraStream = stream;
        cameraVideo.srcObject = cameraStream;
        cameraStage.hidden = false;
        await cameraVideo.play();
        if (cameraRequestVersion !== cameraVersion) return;
        captureButton.disabled = false;
        document.getElementById('ledgerRecognitionStatus').textContent = '';
      } catch (error) {
        if (cameraRequestVersion !== cameraVersion) return;
        stopRecognitionCamera();
        const reason = error?.name === 'NotAllowedError' || error?.name === 'SecurityError'
          ? '摄像头权限未开启。可在浏览器地址栏允许摄像头，或使用“系统相机拍照”。'
          : error?.name === 'NotFoundError' ? '没有检测到可用摄像头；可使用“系统相机拍照”或从相册选择。'
            : '无法启动摄像头；请检查设备或权限，也可使用“系统相机拍照”。';
        document.getElementById('ledgerRecognitionStatus').textContent = reason;
      }
    });
    captureButton?.addEventListener('click', () => {
      if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) {
        document.getElementById('ledgerRecognitionStatus').textContent = '摄像头画面尚未就绪，请稍等片刻。';
        return;
      }
      const scale = Math.min(1, 1600 / Math.max(cameraVideo.videoWidth, cameraVideo.videoHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(cameraVideo.videoWidth * scale);
      canvas.height = Math.round(cameraVideo.videoHeight * scale);
      canvas.getContext('2d')?.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (!blob) {
          document.getElementById('ledgerRecognitionStatus').textContent = '照片生成失败，请重新拍摄或手动填写。';
          return;
        }
        stopRecognitionCamera();
        showRecognitionPhoto(new File([blob], `carbon-action-${Date.now()}.jpg`, { type: 'image/jpeg' }), '照片已拍摄；可检查预览后识别。');
      }, 'image/jpeg', 0.84);
    });
    document.getElementById('closeLedgerCamera')?.addEventListener('click', () => {
      stopRecognitionCamera();
      document.getElementById('ledgerRecognitionStatus').textContent = recognitionFile ? '摄像头已关闭；照片可继续预览。' : '';
    });
    window.addEventListener('pagehide', stopRecognitionCamera, { once: true });
    recognitionButton?.addEventListener('click', async () => {
      if (!recognitionFile) return showToast('请先选择一张照片');
      if (recognitionRequest) return;
      const selectedFile = recognitionFile;
      const draftFields = ['behavior', 'activity', 'unquantified', 'note', 'itemCategory', 'itemDestination', 'electricityAction'];
      const draftSignature = () => JSON.stringify(draftFields.map(id => { const field = document.getElementById(id); return field.type === 'checkbox' ? field.checked : field.value; }));
      const consentDialog = showDialog('确认云端识别', '<p>这张照片将发送至 DeepSeek 云端进行分析。请先确认照片不包含身份证、住址、车牌、人脸等敏感信息；识别结果只会填入草稿，不会自动保存。</p>', '<button class="dialog-secondary" id="cancelPhotoUpload">取消</button><button class="dialog-primary" id="confirmPhotoUpload">同意并识别</button>');
      const consentGranted = await new Promise(resolve => {
        let settled = false;
        const finishConsent = granted => {
          if (settled) return;
          settled = true;
          document.removeEventListener('keydown', onConsentKeydown);
          if (document.contains(consentDialog)) closeDialog();
          resolve(granted);
        };
        const onConsentKeydown = event => { if (event.key === 'Escape') finishConsent(false); };
        document.addEventListener('keydown', onConsentKeydown);
        consentDialog.addEventListener('dialogclosed', () => finishConsent(false), { once: true });
        consentDialog.addEventListener('click', event => { if (event.target === consentDialog) finishConsent(false); });
        consentDialog.querySelector('#cancelPhotoUpload').addEventListener('click', () => finishConsent(false));
        consentDialog.querySelector('#confirmPhotoUpload').addEventListener('click', () => finishConsent(true));
      });
      if (!consentGranted || selectedFile !== recognitionFile) return;
      const controller = new AbortController();
      recognitionRequest = controller;
      let timedOut = false;
      const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 70000);
      recognitionButton.disabled = true;
      recognitionButton.textContent = '正在识别…';
      const originalDraft = draftSignature();
      const status = document.getElementById('ledgerRecognitionStatus');
      status.textContent = '正在调用 DeepSeek 图片识别…';
      try {
        const image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('照片读取失败'));
          reader.readAsDataURL(selectedFile);
        });
        if (controller.signal.aborted) return;
        const response = await fetch('http://127.0.0.1:4175/api/recognize-carbon-action', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, mimeType: selectedFile.type }), signal: controller.signal
        });
        const result = await response.json().catch(() => ({}));
        if (controller.signal.aborted || selectedFile !== recognitionFile) return;
        if (!response.ok) throw new Error(result.error || `识别服务返回 ${response.status}`);
        if (draftSignature() !== originalDraft) {
          status.textContent = '填写内容已修改，本次识别未覆盖你的输入。需要时可重新识别。';
          return;
        }
        if (result.kind === 'unknown' || !kinds[result.kind]) {
        status.textContent = '照片中没有足够证据确认一项低碳行动。请手动选择类别；照片不会自动写入记录。';
          showToast('未能可靠识别，请手动填写行动');
          return;
        }
        const confidenceNotice = Number(result.confidence) < 0.5 ? '识别把握较低，请重点核对。' : '';
        document.getElementById('activity').value = '';
        document.getElementById('unquantified').checked = false;
        document.getElementById('itemCategory').value = '';
        document.getElementById('itemDestination').value = '';
        document.getElementById('electricityAction').value = '';
        const behavior = document.getElementById('behavior');
        behavior.value = result.kind;
        behavior.dispatchEvent(new Event('change', { bubbles: true }));
        document.getElementById('activity').value = '';
        if (Number.isFinite(Number(result.quantity)) && Number(result.quantity) > 0) document.getElementById('activity').value = String(result.quantity);
        document.getElementById('note').value = [result.actionDetail, result.note].filter(Boolean).join('；').slice(0, 120);
        if (result.kind === 'electricity') {
          const action = electricityActions.find(item => item === result.actionDetail);
          document.getElementById('electricityAction').value = action || '';
        }
        if (result.kind === 'reuse') {
          const categories = [...document.getElementById('itemCategory').options].map(option => option.value || option.textContent);
          if (categories.includes(result.itemCategory)) document.getElementById('itemCategory').value = result.itemCategory;
          const destination = [...document.getElementById('itemDestination').options].find(option => option.value === result.destination || option.textContent === result.destination);
          if (destination) document.getElementById('itemDestination').value = destination.value;
        }
        updateActivityEstimate();
        document.querySelector('.ledger-entry-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        status.textContent = `${confidenceNotice}已生成待核对草稿：${kinds[result.kind].name}${result.quantity ? ` · ${result.quantity} ${kinds[result.kind].unit}` : ' · 数量待补充'}。核对后再点击“保存这条记录”；AI 不会自动写入。`;
      } catch (error) {
        if (controller.signal.aborted && !timedOut) return;
        status.textContent = timedOut ? '识别超时，请重试或手动填写。' : error instanceof TypeError ? '识别服务暂时无法连接，请稍后重试或手动填写。' : error.message || '识别失败，可改为手动填写';
        showToast(status.textContent);
      } finally {
        clearTimeout(timeout);
        if (recognitionRequest === controller) {
          recognitionRequest = null;
          recognitionButton.disabled = !recognitionFile;
          recognitionButton.textContent = '识别照片';
        }
      }
    });
    const fileInput = document.querySelector('#historyPanel input[type=file]');
    if (fileInput) {
      fileInput.id = 'backupFile';
      fileInput.removeAttribute('onchange');
      fileInput.addEventListener('change', handleImportFile);
    }
    document.querySelector('#historyPanel .panel-head .panel-title').textContent = '全部记录';
    const goalPanel = document.querySelector('.rightbar .right-panel');
    if (goalPanel) goalPanel.id = 'goalPanel';
    document.querySelector('#page-home .cards').insertAdjacentHTML('afterend', '<div class="panel home-goal-mobile" id="goalPanelMobile"></div>');
    renderLearningHub();
  }

  function ensureHomeLayout() {
    const home = document.getElementById('page-home');
    const ledger = document.getElementById('page-ledger');
    const toolbar = home.querySelector('.home-period-toolbar');
    const metrics = home.querySelector('.home-metric-grid');
    const chart = home.querySelector('.impact-chart-panel');
    chart.querySelector('.chart-controls')?.remove();
    const category = home.querySelector('.content-grid .panel');
    const categoryHeading = category.querySelector('.panel-title')?.textContent || '类别构成';
    const categoryNote = category.querySelector('.panel-note')?.textContent || '本期估算值 · 可追溯到记录';
    const categoryBody = category.querySelector('.category');
    const categoryInsight = category.querySelector('#categoryInsight');
    category.className = 'analysis-category-panel';
    category.innerHTML = `<div class="category-panel-title">${categoryHeading}</div><div class="panel-note" style="margin:-11px 0 14px">${categoryNote}</div>`;
    if (categoryBody) category.appendChild(categoryBody);
    if (categoryInsight) category.appendChild(categoryInsight);
    const detail = document.createElement('section');
    detail.id = 'analysisDetails';
    detail.className = 'analysis-details';
    detail.tabIndex = -1;
    detail.innerHTML = '<div class="analysis-page-header"><button class="analysis-back" id="analysisBack" type="button" aria-label="返回首页">‹ <span>返回首页</span></button><h1>行动数据分析</h1></div>';
    toolbar.innerHTML = '<div class="analysis-control-row"><div class="analysis-range-tabs" role="group" aria-label="数据分析周期"><button type="button" data-home-range="day" onclick="setAnalysisRange(\'day\')">日</button><button type="button" data-home-range="month" onclick="setAnalysisRange(\'month\')">月</button><button type="button" data-home-range="year" onclick="setAnalysisRange(\'year\')">年</button></div><div class="analysis-date-nav"><button id="analysisPrevDate" type="button" aria-label="上一周期" onclick="shiftAnalysisPeriod(-1)">‹</button><strong id="analysisDateRange"></strong><button id="analysisNextDate" type="button" aria-label="下一周期" onclick="shiftAnalysisPeriod(1)">›</button><label class="analysis-anchor"><input type="date" id="homeAnchorDate" aria-label="选择日期" onchange="setAnalysisDate(this.value)"></label></div></div>';
    const metricGrid = metrics;
    metricGrid.classList.add('analysis-overview-metrics');
    chart.querySelector('.panel-title').textContent = '本期行动估算趋势';
    chart.classList.add('analysis-trend-panel');
    const categoryPanel = category;
    const summaryCard = document.createElement('section');
    summaryCard.className = 'analysis-summary-card';
    summaryCard.innerHTML = '<div><span class="analysis-summary-label">本期碳排放估算</span><strong id="analysisTotal">暂无</strong></div><div class="analysis-summary-divider"></div><div class="analysis-summary-stats"><div><b id="analysisDailyAverage">—</b><span>日均估算</span></div><div><b id="analysisActiveDays">0天</b><span>有记录的天数</span></div><div><b id="analysisComparisonRate">—</b><span>较上一周期</span></div></div>';
    const layout = document.createElement('div');
    layout.className = 'analysis-chart-layout';
    layout.append(chart, categoryPanel);
    detail.append(toolbar, summaryCard, layout);
    document.body.querySelector('.main').appendChild(detail);
    document.getElementById('analysisBack').addEventListener('click', () => navigate('home'));
    detail.querySelectorAll('[data-home-range]').forEach(button => button.addEventListener('click', () => {
      activeHomeRange = button.dataset.homeRange;
      matureState.settings.homeRange = activeHomeRange;
      saveState();
      renderHomeDashboard();
    }));
    detail.querySelector('#analysisPrevDate').addEventListener('click', () => shiftAnalysisDate(-1));
    detail.querySelector('#analysisNextDate').addEventListener('click', () => shiftAnalysisDate(1));
    detail.querySelector('#homeAnchorDate').addEventListener('change', event => {
      if (!event.target.value || event.target.value > dayKey(Date.now())) { showToast('请选择今天或之前的日期'); return; }
      matureState.settings.homeAnchor = event.target.value;
      if (activeHomeRange === 'custom') activeHomeRange = 'day';
      matureState.settings.homeRange = activeHomeRange;
      saveState();
      renderHomeDashboard();
    });
    home.innerHTML = `<span id="totalPoints" hidden>0</span>
      <section class="home-summary-card" aria-labelledby="homeSummaryTitle"><div class="home-summary-top"><div><span class="home-kicker">今天 · ${new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date())}</span><h2 id="homeSummaryTitle">今日情况</h2></div><button class="primary home-add-action" id="homeAddAction">＋ 记录行动</button></div><div class="home-today-stats"><div class="home-today-stat"><span>今日避免排放估算</span><b id="homeTodayReduction">0.000 <small>kgCO₂e</small></b><small id="homeTodayActionCount">0 次行动</small></div><div class="home-today-stat"><span>累计避免排放估算</span><b id="homeLifetimeReduction">0.000 <small>kgCO₂e</small></b><small>根据已记录行动估算</small></div><div class="home-today-stat"><span>累计打卡天数</span><b><i id="homeCheckinDays">0</i><small>天</small></b><small id="homeStreakNote">连续行动 0 天</small></div></div><div class="home-summary-bottom"><div class="home-growth"><span class="home-growth-tree" id="homeGrowthTree" aria-hidden="true">🌱</span><span class="home-growth-copy"><b id="homeGrowthTitle">本周成长 · 0/7 天</b><small id="homeWeekActivity">本周已行动 0 天</small></span><span class="home-growth-leaves" id="homeGrowthLeaves" aria-hidden="true"></span></div><button id="homeMoreDates" onclick="openAnalysisDetails()">更多日期 <span aria-hidden="true">→</span></button></div></section>
      <div class="home-section-grid"><section class="home-card home-trend-card" aria-labelledby="homeTrendTitle"><div class="home-card-head"><div><h2 id="homeTrendTitle">本周低碳行动</h2><p>每日避免排放估算 · 周一至周日</p></div><button id="homeOpenAnalysis">查看分析 →</button></div><div id="homeWeekChart" class="home-week-chart"></div><p class="home-chart-note" id="homeWeekChartNote">点选柱子查看当天记录</p></section>
      <section class="home-card home-tasks-card" aria-labelledby="homeTasksTitle"><div class="home-card-head"><div><h2 id="homeTasksTitle">今日低碳任务</h2><p id="homeTasksProgress">今日已完成 0 / 3</p></div><button data-page="missions">全部任务 →</button></div><div id="homeTasksList"></div></section>
      <section class="home-card home-badge-card" aria-labelledby="homeBadgeTitle"><div class="home-card-head"><div><h2 id="homeBadgeTitle">徽章成就</h2><p>坚持行动，留下成长记录</p></div><button data-page="missions">全部徽章 →</button></div><div id="homeBadgeSummary"></div></section>
      <section class="home-card home-records-card" aria-labelledby="homeRecordsTitle"><div class="home-card-head"><div><h2 id="homeRecordsTitle">最近记录</h2><p>回看真实完成的行动</p></div><button data-page="history">查看全部 →</button></div><div id="recentRecords" class="record-list"></div></section></div>`;
    const growthIcon = home.querySelector('#homeGrowthTree');
    if (growthIcon) growthIcon.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M12 21v-8M12 16c0-4 3-7 8-7 0 4-2 7-8 7ZM12 13c0-4-3-7-8-7 0 4 2 7 8 7ZM7 21h10"/></svg>';
    const statLabels = home.querySelectorAll('.home-today-stat > span');
    if (statLabels[0]) statLabels[0].textContent = '今日碳排放估算';
    if (statLabels[1]) statLabels[1].textContent = '累计碳排放估算';
    const demoNotice = document.createElement('p');
    demoNotice.id = 'homeDemoNotice';
    demoNotice.className = 'home-demo-notice';
    demoNotice.hidden = true;
    demoNotice.textContent = '只有计量值与适用因子都可追溯时才显示碳量；其他低碳行动照常记录，不推算减排。';
    demoNotice.hidden = false;
    home.querySelector('.home-today-stats')?.insertAdjacentElement('afterend', demoNotice);
    const trendCaption = home.querySelector('.home-trend-card .home-card-head p');
    if (trendCaption) trendCaption.textContent = '每日行动记录 · 周一至周日；碳量只展示碳排放估算';
    const weekEmpty = document.createElement('div');
    weekEmpty.id = 'homeWeekEmpty';
    weekEmpty.className = 'home-week-empty';
    weekEmpty.hidden = true;
    weekEmpty.innerHTML = '<span id="homeWeekEmptyText">本周还没有行动记录</span><button type="button" id="homeWeekEmptyAction">记录今天的行动</button>';
    home.querySelector('.home-trend-card .home-card-head')?.insertAdjacentElement('afterend', weekEmpty);
    weekEmpty.querySelector('#homeWeekEmptyAction')?.addEventListener('click', () => navigate('record'));
    document.getElementById('homeAddAction').addEventListener('click', () => navigate('record'));
    const homeOpenAnalysis = document.getElementById('homeOpenAnalysis');
    if (homeOpenAnalysis) homeOpenAnalysis.onclick = openAnalysisDetails;
  }

  const policyArticles = [
    { icon: '🧭', theme: '顶层设计', title: '关于完整准确全面贯彻新发展理念做好碳达峰碳中和工作的意见', date: '2021-10-24', summary: '从总体要求、主要目标和重点任务建立双碳工作的顶层框架。阅读时可先看目标节点，再看保障机制与重点领域。', source: '中共中央、国务院 · 北京市政府转载', url: 'https://www.beijing.gov.cn/zhengce/zhengcefagui/202110/t20211025_2519267.html' },
    { icon: '🏙️', theme: '重点行动', title: '2030 年前碳达峰行动方案', date: '2021-10-26', summary: '把碳达峰目标拆解为能源、工业、城乡建设、交通运输、循环经济等重点行动，并提出全民绿色低碳行动。', source: '国务院 · 中国政府网', url: 'https://app.www.gov.cn/govdata/gov/202110/26/477466/article.html' },
    { icon: '⚡', theme: '阶段部署', title: '2024—2025 年节能降碳行动方案', date: '2024-05-29', summary: '聚焦近期节能降碳工作部署，涉及能源、工业、建筑、交通和公共机构等领域；注意区分阶段性任务与长期目标。', source: '国务院 · 中国政府网公报', url: 'https://big5.www.gov.cn/gate/big5/www.gov.cn/gongbao/2024/issue_11406/202406/content_6958082.html' },
    { icon: '🌿', theme: '绿色转型', title: '关于加快经济社会发展全面绿色转型的意见', date: '2024-07-31', summary: '围绕产业结构、能源、交通运输、城乡建设、消费模式等提出全面绿色转型方向，强调系统推进。', source: '中共中央、国务院 · 中国政府网', url: 'https://app.www.gov.cn/govdata/gov/202408/11/518161/articleNew.html' }
  ];
  const policyBriefs = [
    { lead: '这是一份总纲。它解释为什么要做双碳、目标怎样分阶段推进，以及能源、产业和生活方式需要如何配合。', points: ['提出碳达峰、碳中和的阶段性目标。', '把节约资源、调整能源结构、推动产业转型放在同一框架下。', '强调制度、科技和社会参与共同推进。'] },
    { lead: '这份行动方案把“2030 年前达峰”拆成可以推进的领域任务。读它时，重点是看各行业要做什么，而不是把目标误读为已完成。', points: ['围绕能源绿色低碳转型等重点领域部署行动。', '交通、建筑、工业和循环经济各有对应安排。', '全民绿色低碳行动也是方案的一部分。'] },
    { lead: '这是面向 2024—2025 年的近期工作安排。它强调当下的节能降碳任务，与长期双碳目标的时间尺度不同。', points: ['聚焦重点行业和关键用能环节。', '强调节能改造、设备更新和能效提升。', '具体指标与责任分工应在原文中逐项核对。'] },
    { lead: '这份意见讨论的不只是能源，还包括生产、流通和消费怎样一起转向更绿色的方式。', points: ['提出经济社会发展全面绿色转型的总体方向。', '统筹产业、能源、交通和城乡建设。', '鼓励形成绿色低碳的生产方式与生活方式。'] }
  ];

  const learningArticles = [
    { id: 'trip-walk', icon: '🚶', theme: '绿色出行', title: '两公里以内，先看看能不能步行', summary: '短途步行不需要额外车辆和燃料，也能融入日常活动。安全、天气和身体状态始终优先。', related: 'walk', action: '选一段熟悉、安全的短途路线，试一次步行并记下实际感受。', steps: ['确认路程、天气和人行环境', '预留比乘车更充足的时间', '不适合步行时改用公交或其他安全方式'], when: '适合路程较短、路线安全且身体状况允许的出行；不建议为了低碳冒险。', source: '行动建议为定性说明；出行影响受距离、替代方式和当地条件影响。' },
    { id: 'trip-bike', icon: '🚲', theme: '绿色出行', title: '骑行通勤，先把路线和安全安排好', summary: '把骑行变成稳定习惯，关键不是一次骑很远，而是选择安全、可重复的路线。', related: 'bicycle', action: '先从一周一次、熟悉的短程开始，规划非机动车道和停车点。', steps: ['优先选择连续、安全的骑行路线', '检查刹车、车灯与头盔', '雨天、夜间或路况不佳时切换出行方式'], when: '适合有安全骑行条件的短中距离；与公共交通接驳也可以是实际选择。', source: '行动建议为定性说明；不承诺固定减排数值。' },
    { id: 'trip-transit', icon: '🚇', theme: '绿色出行', title: '公交地铁怎么坐得更顺手', summary: '减少对单人小汽车的依赖，先从通勤路线、换乘和末端接驳入手。', related: 'metro', action: '比较出发时间、换乘次数和步行距离，保存一条可执行的公共交通路线。', steps: ['用当地交通工具查询实时线路', '给换乘和步行留出余量', '不便乘坐时考虑拼车或组合出行'], when: '适合公共交通覆盖较好且时间安排允许的行程；偏远地区选择会不同。', source: '出行方式影响需结合载客率、里程和能源结构判断。' },
    { id: 'food-portion', icon: '🍽️', theme: '饮食与食物', title: '点餐按量，不靠“光盘压力”', summary: '减少浪费的关键是按实际食量安排，不是为了打卡强迫自己吃完。', related: 'meal', action: '先少量点餐或取餐，不够再加；多人用餐可共享菜品。', steps: ['回想平时食量再下单', '留意套餐份量与可选小份', '剩余食物及时安全保存或按规则处理'], when: '适合外出点餐、食堂取餐和家庭备餐；营养需求和食品安全优先。', source: '减少浪费的建议；不据此推算个人减排量。' },
    { id: 'food-storage', icon: '🥬', theme: '饮食与食物', title: '冰箱整理好，食材更不容易被忘掉', summary: '看得见、用得上的食材更容易及时消耗，减少过期和重复购买。', related: 'meal', action: '每周整理一次冰箱，把先买、先到期的食材放在容易看见的位置。', steps: ['按储存要求分类放置', '标记开封日期或优先食用时间', '采购前先检查库存'], when: '适合家庭采购和备餐；易腐食物需遵循食品安全要求。', source: '生活管理建议；实际节约与家庭储存习惯有关。' },
    { id: 'home-light', icon: '💡', theme: '居家用能', title: '离开房间前，顺手检查照明和待机', summary: '不需要时关闭照明和闲置设备，是不改变生活质量的节能起点。', related: 'electricity', action: '选一个固定场景，比如出门前，检查灯和不需要运行的设备。', steps: ['确认设备不承担安全或必要功能', '关闭闲置照明与可安全断电的设备', '连续观察习惯，不凭感觉填报节电量'], when: '适合多数家庭日常；冰箱、医疗设备等不可随意断电。', source: '节能习惯建议；节电量需由电表或设备数据验证。' },
    { id: 'home-ac', icon: '❄️', theme: '居家用能', title: '空调设置先顾舒适和健康', summary: '合理设置温度、清洁滤网并减少门窗冷热交换，通常比一味调到极端温度更实用。', related: 'electricity', action: '按说明书设置舒适温度，清洁滤网，离开较长时间时再决定是否关闭。', steps: ['结合室外温度和家庭成员感受调节', '关好门窗并按需遮阳', '定期清洁滤网，保持设备效率'], when: '老人、儿童、病患或高温天气下优先保障健康，不以节能替代合理降温。', source: '通用使用建议；能耗因设备、房屋和天气不同而异。' },
    { id: 'home-appliance', icon: '🔌', theme: '居家用能', title: '换新家电时，看能效也看使用需求', summary: '购买更高能效产品可能降低使用阶段能耗，但不必为标签盲目提前淘汰仍可用的设备。', related: 'electricity', action: '需要换新时，比较能效标识、容量、维修和预计使用年限。', steps: ['先判断旧设备是否确需更换', '对照同类型产品的能效标识', '选择匹配家庭人数和使用场景的容量'], when: '适合计划购买或更换家电时；购买决策也应考虑耐用、维修与预算。', source: '选购建议；具体能耗以产品标识和实际使用为准。' },
    { id: 'buy-less', icon: '🛍️', theme: '理性消费', title: '下单前给自己一个短暂停顿', summary: '延迟非必需购买，能帮助分清真实需要和促销冲动，也减少闲置物品。', related: 'reuse', action: '把非必需商品放入清单，隔一天再决定是否购买。', steps: ['确认家里是否已有可用物品', '考虑耐用性、维修和真实使用频率', '不需要时取消重复或冲动订单'], when: '适合非紧急、非必需消费；必要用品无需刻意延迟。', source: '消费习惯建议；产品全生命周期影响需结合具体产品分析。' },
    { id: 'reuse-give', icon: '♻️', theme: '循环利用', title: '闲置物品先判断：转赠、维修还是回收', summary: '旧物回收不是一个统一去向。不同物品要找匹配的正规渠道，避免电子废物和隐私信息处理不当。', related: 'reuse', action: '选一件闲置物，确认是否可继续使用，再找正规转赠、维修或回收渠道。', steps: ['衣物和书籍可先考虑转赠或二手流通', '电器先判断能否维修或合规回收', '电子设备清除个人信息后再交接'], when: '按物品类别选择正规渠道；电池、电器和个人数据要特别处理。', source: '物品去向建议；本地回收规则与服务范围可能不同。' },
    { id: 'paper', icon: '📄', theme: '循环利用', title: '纸张回收前，保持干燥并按本地规则投放', summary: '干净、干燥的废纸更容易进入回收流程；受油污、覆膜或复合材料影响的纸制品规则不同。', related: 'recycle', action: '把可回收纸张简单整理，查询所在小区或城市的投放说明。', steps: ['去除明显非纸张包装物', '保持纸类干燥整洁', '覆膜、油污或复合材质按当地指引处理'], when: '适合报纸、纸箱和干净纸张等；各地分类目录可能不同。', source: '分类建议；具体以所在地最新垃圾分类目录为准。' },
    { id: 'water', icon: '🚿', theme: '节水生活', title: '节水从发现漏水和缩短无效用水开始', summary: '及时修理滴漏、洗漱时避免长时间放水，比记录一个猜测的节水数字更可靠。', related: 'water', action: '检查水龙头、马桶是否漏水；洗漱时在不需要流水的间隙关水。', steps: ['查看水表或设备是否有异常持续用水', '尽快报修明显漏水点', '按家庭实际情况调整用水习惯'], when: '适合日常用水管理；必要卫生、清洁和饮水需求不应削减。', source: '节水建议；节水量需根据水表读数或维修前后数据确认。' }
  ];
  const plainTipCopy = {
    'trip-walk': ['买个东西不远，走过去也挺方便', '去附近药店、超市或取快递，先看看步行要多久。', ['先查一下路程和天气。', '走有人行道、自己熟悉的路线。', '赶时间或路不好走，就照常坐车。'], '路上不安全、天气太差或身体不舒服时，别勉强。'],
    'trip-bike': ['骑车上班，先试一段好走的路', '不必一开始就天天骑。找一天不赶时间的时候试试。', ['先看有没有连续的非机动车道。', '出门前检查车闸、车灯，留好停车位置。', '雨天和夜路不好骑，就换一种方式。'], '没有安全的骑行条件，就不要为了打卡上路。'],
    'trip-transit': ['常走的路，存一条公交地铁路线', '提前看好换乘和步行距离，下次出门不用临时查。', ['找一条常用路线，保存站点和发车信息。', '第一次坐时多留一点换乘时间。', '末端不方便时，按实际情况组合出行。'], '线路不通、夜间不安全或时间不合适时，用更稳妥的方式。'],
    'food-portion': ['先点够吃的，不够再加', '和朋友吃饭时尤其容易点多。先少点一道，往往更自在。', ['先问问大家大概能吃多少。', '能选小份就先选小份。', '剩菜能带走的，及时打包并妥善保存。'], '不要为了“光盘”硬吃；饮食需求和食品安全更重要。'],
    'food-storage': ['买菜前，先看一眼冰箱', '有时不是买少了，而是旧菜被新买的挡在后面。', ['把快过期的食材放到容易看见的地方。', '开封的食物标一下日期。', '列购物清单前先看看家里还有什么。'], '食物变质了就不要继续吃，按食品安全要求处理。'],
    'home-light': ['出门前，看一眼灯和闲置设备', '不用的灯关掉就好；不用猜自己省了几度电。', ['离开房间时关掉不需要的照明。', '长期不用的小电器，按说明安全断电。', '想看节电量，再比较电表或设备数据。'], '冰箱、医疗设备和必要的安全设备不能随手断电。'],
    'home-ac': ['空调开着时，先把门窗关好', '先减少冷热空气交换，再按舒适程度调温度。', ['开空调前关好门窗，阳光直晒时适当遮阳。', '滤网脏了按说明清洁。', '温度以家人舒适和健康为先。'], '高温天气、老人或病人需要降温时，不要为了省电硬扛。'],
    'home-appliance': ['要换家电时，再认真看能效', '旧机器还能正常用，不必因为新标签就急着扔。', ['先确认旧家电是否能修。', '确定要买时，比较同类产品的能效和容量。', '挑家里真正用得上的功能。'], '预算和维修条件也重要，别为了“低碳”盲目换新。'],
    'buy-less': ['下单前，先看看家里有没有', '促销时最容易买重。把想买的东西放一天再决定。', ['先找找家里有没有类似物品。', '想想未来一个月会用几次。', '确定需要再买，急用品不用拖。'], '必要的生活和健康用品，该买就买。'],
    'reuse-give': ['旧衣、旧书和旧手机，别一股脑扔一起', '还能用的先考虑送人；坏了的按类别找回收渠道。', ['衣物和书籍可先问问身边人是否需要。', '小电器先问维修是否划算。', '旧手机清除账号和个人资料后再交接。'], '电池、电器和带隐私信息的设备，要按当地正规渠道处理。'],
    paper: ['纸箱攒好，别和湿垃圾混放', '干净干燥的纸箱更方便回收；油污纸要看当地分类要求。', ['拆平纸箱，放在干燥处。', '把塑料胶带等明显杂物分开。', '不确定能不能回收时，看小区的投放指引。'], '覆膜、油污或复合材质的纸制品，按所在地规则处理。'],
    water: ['水龙头滴水，先报修', '比起猜自己节约了多少水，修好漏水更实在。', ['看看水龙头和马桶有没有持续漏水。', '发现漏水尽快报修。', '刷牙、打肥皂时不需要流水就先关上。'], '饮水、清洁和卫生需求不能因此省掉。']
  };
  learningArticles.forEach(article => { const copy = plainTipCopy[article.id]; if (copy) [article.title, article.summary, article.steps, article.when] = copy; });
  const visualTopics = [
    { id: 'greenhouse', category: '气候基础', icon: '☀', title: '温室效应：地球为什么会变暖？', summary: '温室效应本来是自然过程；问题在于人类活动让大气中的温室气体不断增加。', minutes: 5, art: 'greenhouse', takeaway: '自然温室效应让地球适宜居住；额外增加的温室气体会改变地球能量收支，推动持续变暖。', sections: [
      { title: '阳光进来，热量也要出去', body: '太阳辐射到达地表后，地面会把能量以热辐射的形式释放出去。大气中的水汽、二氧化碳、甲烷等温室气体会吸收并重新释放一部分热量，因此地表和低层大气保持着适合生命存在的温度。' },
      { title: '问题是“加强”，不是“有温室效应”', body: '燃烧煤、石油和天然气，改变土地利用以及部分农业活动，会增加大气中的温室气体浓度。它们让更多热量暂时留在气候系统里。联合国政府间气候变化专门委员会指出，人类活动已明确导致全球变暖；这不是说每一次天气变化都由气候变化单独造成。' },
      { title: '一张图能说明方向，不能替代全部气候科学', body: '图里的箭头是帮助理解能量流动的简化示意。真实气候还涉及云、海洋、冰雪、植被和大气环流等相互作用。读图时要分清“解释原理”与“定量预测”——后者需要观测数据和气候模型。' }
    ], source: '联合国《气候变化的原因与影响》；IPCC 第六次评估报告综合报告', sourceUrl: 'https://www.un.org/climatechange/science/causes-effects-climate-change', extraUrl: 'https://www.ipcc.ch/report/ar6/syr/resources/spm-headline-statements/' },
    { id: 'two-goals', category: '双碳概念', icon: '↗', title: '碳达峰和碳中和，不是同一个时刻', summary: '一个看排放总量何时转降，一个看排放与清除如何达到平衡；目标有先后，也有不同含义。', minutes: 6, art: 'goals', takeaway: '达峰不等于零排放；碳中和也不等于只靠种树抵消。先持续减排，再以可靠清除处理难以避免的排放。', sections: [
      { title: '达峰，看一条曲线的转折', body: '把一个地区或国家每年的排放总量画成曲线，曲线到达最高点并开始稳定下降，才是在讨论“达峰”。达到峰值并不表示排放为零，重点是排放增长转为下降。' },
      { title: '中和，看一段时间内的收支', body: '碳中和关注一定时期内人为排放与人为清除之间的平衡。它需要先减少排放，并对仍难以避免的排放使用可信的清除方式。不同主体的核算边界、温室气体范围和时间口径都要说清楚。' },
      { title: '把目标放回政策语境', body: '中国提出 2030 年前实现碳达峰、2060 年前实现碳中和。这里描述的是国家目标，不是单个家庭的任务，也不能用个人应用里的几条行动记录证明目标已经达成。' }
    ], source: '国务院《中国2030年前碳达峰行动方案》；中共中央、国务院《关于完整准确全面贯彻新发展理念做好碳达峰碳中和工作的意见》', sourceUrl: 'https://app.www.gov.cn/govdata/gov/202110/26/477466/article.html', extraUrl: 'https://www.beijing.gov.cn/zhengce/zhengcefagui/202110/t20211025_2519267.html' },
    { id: 'electricity', category: '能源与生活', icon: '⚡', title: '插上插头之后：一度电从哪里来？', summary: '家里看见的是电表读数，背后却连着发电、输配电和用电设备；不同电力结构会影响排放。', minutes: 5, art: 'electricity', takeaway: '减少不必要的用电需求是个人能做的事；一度电对应多少排放，要用匹配地区和时间口径的电力排放因子计算。', sections: [
      { title: '用电点不一定是排放发生点', body: '电灯和家电在使用时消耗电能，但发电环节可能使用煤、天然气、水能、风能、太阳能或核能。排放发生在哪里，取决于发电来源和电力系统，而不是插头本身。' },
      { title: '同样一度电，因子不一定相同', body: '地区电源结构、年份、核算方法和使用阶段都会改变结果。全国平均因子可以用于某些平均核算，不能直接当成每座城市、每个时段的精确值。若缺少适用数据，应用应显示估算性质，而非给出看似精确的减排承诺。' },
      { title: '先把需求变得合理', body: '关掉不需要的照明、选择合适容量和能效的家电、维护设备，有助于减少不必要的用能。冰箱、医疗设备等必要设备不要为了打卡断电；节约行为也不能替代安全、健康和舒适需求。' }
    ], source: '联合国《气候变化的原因与影响》；IPCC 第六次评估报告综合报告', sourceUrl: 'https://www.un.org/climatechange/science/causes-effects-climate-change', extraUrl: 'https://www.ipcc.ch/report/ar6/syr/resources/spm-headline-statements/' },
    { id: 'food-system', category: '饮食与消费', icon: '🥬', title: '一份食物被丢掉，浪费发生在厨房以前', summary: '被扔掉的不只是盘子里的食物，还有种植、加工、运输、冷藏和烹饪投入的资源。', minutes: 6, art: 'food', takeaway: '优先避免产生浪费，再考虑安全转赠或合适处理；“光盘”不是唯一办法，营养和食品安全优先。', sections: [
      { title: '食物走过一条很长的路', body: '一份食物在端上桌之前，可能经历土地和水资源投入、种植养殖、加工包装、运输、储存和烹饪。食物没有被吃掉，这些环节已经发生的投入也随之没有发挥原本作用。' },
      { title: '怎么处理也会影响结果', body: '不同去向会带来不同环境影响。美国环保署的食物管理框架将预防浪费、捐赠和再利用列为优先方向；进入填埋等末端处理则会产生额外影响。这个排序是该框架的参考，不应不加区分地替代所在地的食品安全和废弃物规则。' },
      { title: '把改变放在最容易的环节', body: '采购前先看库存、按食量点餐、合理保存食材，通常比事后想办法处理更直接。多人用餐时可以少量先点、不够再加；特殊饮食、营养和卫生需求始终优先。' }
    ], source: '美国环保署《可持续食品管理基础》与《食物浪费阶梯》', sourceUrl: 'https://www.epa.gov/sustainable-management-food/sustainable-management-food-basics', extraUrl: 'https://www.epa.gov/sustainable-management-food/wasted-food-scale' },
    { id: 'carbon-cycle', category: '气候基础', icon: '↻', title: '碳去了哪里？认识一条看不见的循环', summary: '碳在大气、海洋、陆地生物和岩石之间移动；人为排放改变了循环的速度与平衡。', minutes: 7, art: 'cycle', takeaway: '自然碳汇确实吸收一部分二氧化碳，但这不代表排放可以不受限制；减排和清除需要分别核算。', sections: [
      { title: '碳不只在空气里', body: '碳存在于大气中的二氧化碳、海水、土壤、植物、动物和化石燃料中。植物通过光合作用吸收二氧化碳，海洋也会与大气交换碳；呼吸、分解、燃烧和海气交换则会把碳重新送回大气。' },
      { title: '化石燃料把长期储存的碳快速送回大气', body: '煤、石油和天然气中的碳在地质时期长期储存。开采并燃烧它们，会在较短时间内把大量碳释放出来。陆地和海洋能够吸收一部分，但大气中的温室气体仍会增加。' },
      { title: '“吸收”不等于永久抵消', body: '森林、土壤和海洋的储碳能力会受到火灾、土地变化、升温和生态状态影响。碳汇核算要说明时间、边界、额外性和持久性；随手种一棵树不能直接等同于抵消一笔确定的排放。' }
    ], source: 'IPCC《气候变化 2021：自然科学基础》第五章：全球碳循环与其他生物地球化学循环', sourceUrl: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/' },
    { id: 'read-claims', category: '读懂信息', icon: '⌕', title: '“减少了 50%”先别急着信：拆开一条绿色说法', summary: '看百分比和小数前，先找基准、边界、数据来源与时间范围。', minutes: 5, art: 'evidence', takeaway: '一条可靠的环境说法，应让读者知道“和什么比、算了什么、数据从哪来、误差有多大”。', sections: [
      { title: '先问：和什么情况相比？', body: '“减少”必须对应一个基准情景：与上一年、某种替代方案，还是行业平均相比？基准不同，结果就可能不同。没有比较对象，百分比本身没有可解释的含义。' },
      { title: '再问：这个数字算了哪些环节？', body: '一项产品或行为的结果会随着系统边界变化。例如只算使用阶段，和把原料、制造、运输、使用、报废都算进去，不是同一件事。要留意单位、时间段、地区和被排除的项目。' },
      { title: '最后找来源，并看它承认什么未知', body: '优先查找原始报告、政府或科研机构资料，区分实测值、模型估算、案例结果和宣传口号。IPCC 会在评估中说明证据和结论的可信度；没有不确定性说明的精确数字，不一定更可靠。' }
    ], source: 'IPCC 第六次评估报告综合报告：决策者摘要要点', sourceUrl: 'https://www.ipcc.ch/report/ar6/syr/resources/spm-headline-statements/' }
  ];
  const learningQuestions = [
    { q: '“碳中和”最接近下面哪种说法？', options: ['通过减排、吸收等措施，使人为排放与清除相平衡', '所有人都不再使用任何能源', '只靠个人种树抵消全部排放'], answer: 0, explain: '碳中和关注人为排放与清除的平衡，需要多种措施共同推进，不能简化为个人种树或停止使用能源。' },
    { q: '下面哪种做法更有助于减少食物浪费？', options: ['按需购买和取餐', '为了打折囤积容易变质的食品', '不看保质期一次买很多'], answer: 0, explain: '按需购买、合理储存和取餐，能够减少食物在消费端被丢弃。' },
    { q: '城市垃圾分类应该依据什么？', options: ['所在地最新分类规则', '网上任意城市的分类表', '只按包装颜色判断'], answer: 0, explain: '分类目录和投放要求存在地方差异，应以居住地发布的指引为准。' }
  ];
  let currentQuestion = 0;
  let activePracticeQuestions = learningQuestions;
  let activePracticeScore = 0;
  const learningLevels = [
    { id: 1, name: '基础认知', stage: 'LEVEL 01 · 建立概念', icon: '🌱', difficulty: '入门', title: '碳达峰与碳中和：先把目标说清楚', duration: '约 6 分钟', objective: '理解两个目标的区别，以及为什么它们需要社会系统共同推进。', source: '会宁县融媒体中心《什么是“碳达峰”和“碳中和”？》', sourceUrl: 'https://www.huining.gov.cn/xxgk/bmxxgk/sthjj/fdzdgknr/zcjd/art/2023/art_8b1a90726400427f81640e9b0f8bef42.html', sections: [
      { title: '先从“排放曲线”想象', body: '把一个国家每年的二氧化碳排放量画成曲线：曲线先上升，来到最高点，之后稳定下降，这个最高点就是“碳达峰”。达峰不是排放归零，而是排放增长开始转向下降。\n\n碳中和看的是另一条关系：一定时期内，人为排放了多少温室气体，又通过自然吸收、生态修复或可靠的工程措施清除了多少。两者逐步平衡，才接近碳中和。' },
      { title: '一个生活化例子', body: '可以把排放想成浴缸里的水龙头，把吸收和清除想成排水口。减少排放相当于把水龙头关小；增加可靠的清除相当于改善排水。只开大排水口却不控制水龙头，风险和成本都更高，所以减排是实现目标的重要基础。这个比喻帮助理解方向，并不是实际核算公式。' },
      { title: '为什么不是个人单独完成', body: '电力来自什么能源、工业怎样生产、城市怎样建设、交通如何运行，都会影响排放总量。个人可以通过出行、用电、消费等选择参与转型，但不能把宏观目标简化成个人种几棵树，也不能用一次打卡证明实现了碳中和。' }
    ], example: '记住一句话：达峰看排放什么时候由升转降；中和看排放与清除如何逐步平衡。', questions: [
      { q: '排放曲线达到最高点后开始稳中有降，描述的是？', options: ['碳达峰', '碳中和', '零排放'], answer: 0, explain: '碳达峰说的是排放总量达到峰值并转向下降，不代表排放已经归零。' },
      { q: '理解碳中和，重点关注什么关系？', options: ['人为排放与清除逐步平衡', '所有活动完全不产生能源消耗', '只看个人种了多少树'], answer: 0, explain: '碳中和的核心是一定时期内人为排放与清除的平衡，背后需要综合减排和可靠清除措施。' },
      { q: '个人低碳记录最合理的定位是？', options: ['参与和培养习惯，不能代替宏观核算', '证明国家已经碳中和', '准确抵消所有生活排放'], answer: 0, explain: '个人行动有价值，但其记录和演示估算不能代替组织、地区或国家层面的正式核算。' }
    ] },
    { id: 2, name: '生活影响', stage: 'LEVEL 02 · 看见日常足迹', icon: '🚲', difficulty: '进阶', title: '出行和餐桌：日常排放从哪里来？', duration: '约 8 分钟', objective: '理解出行、用电和饮食影响的来源，并识别比较中的边界条件。', sections: [
      { title: '行为本身不是排放数字', body: '日常活动通常通过消耗能源、使用产品或产生废弃物与排放相关联。例如开车会消耗燃油，乘坐电动车会用电，食物生产涉及种植、加工、冷藏和运输。要估算影响，需要先说明比较对象和系统边界，不能只看一个动作的名称。' },
      { title: '出行比较要问三个问题', body: '第一，比较的是同一段距离吗？第二，车辆坐了几个人、是否本来就会发车？第三，电力或燃料来自什么能源？公交、地铁、步行或骑行通常能减少对单人燃油车的依赖，但不同城市、线路、车型和载客率会改变具体结果。\n\n因此，应用更适合给出透明的近似估算或方向性提示，而不是把一个固定数字说成适用于所有人的精确事实。' },
      { title: '从“少一点”到“更合适”', body: '低碳选择并非追求绝对化。天气、距离、身体状况、安全条件和公共交通可达性都应考虑。对一些人，步行适合短距离；对另一些人，公交、拼车或减少不必要出行更实际。可持续的改变通常是能长期坚持、符合真实情境的改变。' }
    ], example: '通勤比较示例：把“单人燃油车通勤”与“同距离公交通勤”作比较前，要确认里程、载客率、能源因子和计算边界。缺少这些数据时，应说明只是示意，不报精确减排量。', questions: [
      { q: '比较两种出行方式的碳影响，首先应该？', options: ['明确距离、载客率和能源等边界', '只看交通工具名字', '默认每个城市数据都一样'], answer: 0, explain: '比较需要相同边界，并考虑距离、载客率和能源结构，否则结果容易失真。' },
      { q: '电动交通方式的影响会受什么因素影响？', options: ['电力来源、车辆效率和行驶场景', '只受车身颜色影响', '完全不受能源结构影响'], answer: 0, explain: '使用阶段之外，电力结构和车辆效率等都会影响完整生命周期或使用阶段估算。' },
      { q: '减少食物浪费，最先可以从哪里做起？', options: ['买前看库存、点餐按食量', '等食物坏了再想怎么处理', '为了折扣大量囤积易腐食物'], answer: 0, explain: '少买重、少点多，比食物已经变质后再处理更直接。' }
    ] },
    { id: 3, name: '双碳行动', stage: 'LEVEL 03 · 理解系统转型', icon: '🏙️', difficulty: '深入', title: '从能源到城市：双碳行动怎样协同推进', duration: '约 9 分钟', objective: '看懂能源、产业、交通、建筑与消费行动如何互相影响。', sections: [
      { title: '能源是重要基础', body: '电力、热力和燃料为生产生活提供动力。提高能源效率、发展非化石能源、完善电网和储能、推动终端电气化，常常需要协同推进。只改变某一个环节，可能会把排放转移到供应链其他位置，因此系统视角很重要。' },
      { title: '行业之间会互相牵动', body: '例如，建筑节能可以降低用电需求；清洁电力可以降低电动交通和工业用电的间接排放；产品耐用和循环利用会影响原材料开采、制造和废弃处理。一个行业的进步可能帮助其他行业，但也要关注成本、技术成熟度和公平可及性。' },
      { title: '政策目标需要变成可执行行动', body: '国家行动方案会把长期目标拆解到重点领域和阶段性工作。阅读政策时要区分目标、任务、措施和评估指标，并优先核对发布机构、发布时间、适用范围和原文。新闻摘要可以帮助快速了解，但不能替代正式政策文本。' }
    ], example: '因果链示例：建筑保温改善 → 冬夏季空调需求下降 → 用电需求降低 → 在其他条件相同的情况下，电力系统需要供应的能源减少。链条中的实际幅度仍需当地数据验证。', source: '政策延伸阅读：中国政府网《2030年前碳达峰行动方案》', sourceUrl: 'https://app.www.gov.cn/govdata/gov/202110/26/477466/article.html', questions: [
      { q: '为什么双碳转型需要系统协同？', options: ['行业与能源供应链相互影响，单点改进可能转移排放', '每个行业彼此完全独立', '只要个人改变就无需产业转型'], answer: 0, explain: '能源、建筑、交通和产业链相互关联，需要综合看待并避免简单转移排放。' },
      { q: '阅读政策摘要后，想确认具体要求应当？', options: ['核对发布机构、时间、范围并查看原文', '只看社交媒体转述', '把摘要里的愿景当成已完成结果'], answer: 0, explain: '摘要是入口，具体要求和状态应回到权威原文核查。' },
      { q: '建筑节能可能带来的直接协同效果是？', options: ['降低供暖或制冷需求，从而减少用能需求', '自动让所有电力变成零排放', '完全消除建筑材料影响'], answer: 0, explain: '建筑节能可降低使用阶段能源需求，但不意味着其他环节影响自动消失。' }
    ] },
    { id: 4, name: '实践与判断', stage: 'LEVEL 04 · 做出可信选择', icon: '🧭', difficulty: '挑战', title: '读懂一条低碳建议：数据、边界与误区', duration: '约 10 分钟', objective: '检查估算依据，分清行动价值与碳核算结论。', sections: [
      { title: '一个数字要有来处', body: '碳排放估算通常由活动数据乘以排放因子得到。活动数据回答“做了多少”，排放因子回答“每单位活动对应多少排放”。两者都需要说明单位、来源、版本和适用范围。没有可追溯依据时，精确到小数点后的数字反而可能制造不可靠的确定感。' },
      { title: '注意基准情景和替代关系', body: '声称“减少了多少”必须说明与什么情景相比。如果没有骑行，用户原本会开车、乘公交、步行，还是根本不会出行？不同基准会得出不同结果。还要避免重复计算同一项减排，也不能把抵消、避免排放和实际排放混为一谈。' },
      { title: '用一份实用核查清单', body: '看到低碳结论时，可以依次问：来源是否权威且可打开？发布时间和版本是否清楚？边界和单位是否说明？是否区分实测、估算和假设？是否披露不确定性？页面若只能提供行为方向，就应诚实标注定性建议，不制造精确减排承诺。' }
    ], example: '核查演练：“骑行 3 公里减少 0.45 kg”——先问对比的原出行方式是什么、距离是否相同、因子来自哪里、适用于哪个地区、是否只是教学参数。当前碳伴原型里的行为因子明确属于演示参数，不能作为认证减排量。', questions: [
      { q: '计算估算排放常见的基本结构是？', options: ['活动数据 × 排放因子，并说明单位和边界', '活动数据 + 用户积分', '只凭行为名称直接给精确结论'], answer: 0, explain: '常见估算要结合活动数据和适用的排放因子，且应透明呈现单位、来源及边界。' },
      { q: '“减少了多少排放”还需要明确什么？', options: ['基准情景，即与什么情况比较', '只需要写一个小数', '用户获得了多少徽章'], answer: 0, explain: '减排是相对于基准情景的比较；没有基准，就无法解释“减少”的含义。' },
      { q: '如果数据来源和适用范围不清楚，界面应该？', options: ['标注为演示估算或定性提示，不作认证承诺', '把数字显示更多位', '直接称为权威实测'], answer: 0, explain: '数据不确定时要如实说明，避免把教学估算包装成认证或实测结果。' }
    ] },
    { id: 5, name: '政策与治理', stage: 'LEVEL 05 · 读懂政策', icon: '📜', difficulty: '进阶', title: '从目标到行动：怎样读懂双碳政策', duration: '约 12 分钟', objective: '分清顶层意见、行动方案和阶段性部署，回到正式文件核对适用范围。', source: '国务院《2030年前碳达峰行动方案》；中共中央、国务院《关于加快经济社会发展全面绿色转型的意见》', sourceUrl: 'https://app.www.gov.cn/govdata/gov/202408/11/518161/articleNew.html', sections: [
      { title: '政策文件各自回答什么问题', body: '顶层意见通常说明总体方向、原则和目标；行动方案更常把方向拆成重点领域、任务和责任；阶段性工作方案则聚焦特定时期的部署。文件名称只是线索，具体效力和要求仍要看正文、发布机构与适用对象。' },
      { title: '把两类文件放在一起读', body: '《2030年前碳达峰行动方案》围绕重点领域提出行动安排；2024年绿色转型意见把绿色转型放到经济社会系统中统筹部署。它们不是“一个替代另一个”，而是时间、范围和政策层次不同的文件。阅读时应回到原文确认章节和任务。' },
      { title: '别把目标写成已经完成', body: '文件里的“到某年”“推动”“逐步”等词描述目标、方向或工作要求，不等于结果已经实现。引用政策时应保留时间、主体和语境；转载页面也要核对是否完整、是否链接到正式发布来源。' },
      { title: '三步核对政策信息', body: '先看发布主体与发布日期，再看适用范围和目标时间，最后核对正文条款及后续文件。新闻解读适合快速入门，正式要求、最新执行情况和地方细则应分别查相应主管部门原文。' }
    ], example: '阅读练习：一份文件提出“到 2030 年前实现某阶段目标”，正确表述应是“政策设定了目标”，而不是“该目标已经实现”。', questions: [
      { q: '引用政策内容时，哪种表述最稳妥？', options: ['保留发布主体、时间与适用范围，并核对原文', '把目标直接写成已经完成的事实', '只引用没有出处的短视频'], answer: 0, explain: '主体、时间和适用范围决定政策语境，正式原文是核验依据。' },
      { q: '行动方案与顶层意见的关系通常是？', options: ['层次和用途可能不同，要看具体文件内容', '名称不同但一定互相矛盾', '行动方案自动证明目标已实现'], answer: 0, explain: '文件层次、范围和时间各有不同，应依据正文判断如何衔接。' },
      { q: '文件写“到某年推动实现目标”，这首先说明？', options: ['政策目标或部署，不代表结果已达成', '目标已经实现', '所有地区目前都已完成'], answer: 0, explain: '目标性表述不能当作现状结论，成效需要新的权威数据验证。' }
    ] },
    { id: 6, name: '行动设计', stage: 'LEVEL 06 · 形成计划', icon: '🗺️', difficulty: '实践', title: '把知识变成自己的低碳行动计划', duration: '约 12 分钟', objective: '选一个真实生活场景，制定可坚持、可复盘且不夸大效果的行动方案。', sections: [
      { title: '从困扰你的场景开始', body: '先选一个你确实能影响的场景：通勤、家庭用电、饮食采购或物品处理。不要先追求最大的理论减排数，而要看行动是否安全、可行、能重复，以及是否有更合适的替代方案。' },
      { title: '设一个能检查的目标', body: '目标要具体到行为和周期，例如“本月每周两天搭乘公共交通”，而不是“以后更环保”。若有可靠数据，可以记录次数、里程或电表读数；没有数据时只记录行动，不编造节电量或减排量。' },
      { title: '提前考虑现实阻碍', body: '天气、照护责任、交通可达性、身体状况、预算和居住条件都会影响行动。计划应留出替代做法：骑行不安全时改乘公交，无法更换设备时先养成关闭闲置电器的习惯。' },
      { title: '每周复盘，不追求完美', body: '回看哪些做到了、哪些没有做到、原因是什么，再调整下一周。低碳行动的价值来自持续改进；一次未完成不等于失败，也不需要用积分或徽章替代真实成效评估。' }
    ], example: '行动计划范例：目标——未来两周每周至少一次选择公交通勤；记录——日期与出行方式；替代——天气或线路不适合时按安全和时间选择其他方式；复盘——两周后判断是否适合继续。', questions: [
      { q: '一个可执行的行动计划最应该具备什么？', options: ['具体行为、周期、记录方式和现实替代方案', '只有宏大口号', '无法核实的减排承诺'], answer: 0, explain: '清楚的行为、周期和记录让计划能够执行与复盘，也应考虑现实条件。' },
      { q: '没有可靠电表数据时，节电行动应如何记录？', options: ['记录实际完成的行为，不虚构节电量', '随便填一个估算数字', '把行动次数当成千瓦时'], answer: 0, explain: '行动记录与能源计量不是同一单位，不能用行为次数冒充电量。' },
      { q: '一周未完成计划，最合适的下一步是？', options: ['分析阻碍并调整目标或替代做法', '放弃整个计划', '声称已经完成以保持连续记录'], answer: 0, explain: '复盘阻碍并调整方案，比追求表面连续或虚假完成更有帮助。' }
    ] }
  ];
  const learningHooks = [
    '碳达峰是不是意味着“零排放”？',
    '坐地铁一定比开车更低碳吗？',
    '一栋楼少用电，为什么会影响整个能源系统？',
    '一个精确到小数点的减排数字，怎样判断靠不靠谱？',
    '怎样区分政策目标、行动部署和已经发生的成效？',
    '怎样把低碳想法变成能坚持、能复盘的计划？'
  ];
  const courseGraphics = { 1: ['two-goals', 'greenhouse'], 2: ['food-system'], 3: ['electricity', 'carbon-cycle'], 4: ['read-claims'], 5: [], 6: [] };
  let activeLessonLevel = null;
  let activeLessonStep = 0;
  let activeLessonQuestion = 0;
  let activeLessonScore = 0;

  let activeLearningView = new URLSearchParams(window.location.search).get('learnView') || 'home';
  let learningViewStack = [];
  let learningNavigationInitialized = false;
  function renderLearningHub() {
    const hub = document.getElementById('learningHub');
    const header = document.querySelector('#page-learn .title-row');
    const views = { home: ['双碳与日常生活', ''], courses: ['系统课程', ''], life: ['生活里的好办法', ''], policies: ['知识与政策', ''], tip: ['生活技巧', ''], article: ['课程学习', ''], policy: ['政策解读', ''] };
    const viewKey = activeLearningView.split(':')[0];
    if (!views[viewKey]) { setLearningView('home', false); return; }
    const [title, subtitle] = views[viewKey] || views.home;
    header.innerHTML = `${viewKey === 'home' ? '' : '<button class="learning-back-link" id="learningBack">← 返回</button>'}<div><h1 class="title" id="learnTitle">${title}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}</div>`;
    const back = document.getElementById('learningBack');
    if (back) back.addEventListener('click', goBackLearningView);
    if (viewKey === 'home') renderLearningLanding(hub);
    else if (viewKey === 'courses') renderLearningCoursePage(hub);
    else if (viewKey === 'life') renderLifeLearningPage(hub);
    else if (viewKey === 'tip') renderLifeTipPage(hub, activeLearningView.split(':')[1]);
    else if (viewKey === 'policies') renderPolicyLearningPage(hub);
    else if (viewKey === 'policy') renderPolicyDetailPage(hub, Number(activeLearningView.split(':')[1]));
    else if (viewKey === 'article') renderLearningCoursePage(hub, Number(activeLearningView.split(':')[1]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setLearningView(view, push = true) {
    if (push && activeLearningView !== view) learningViewStack.push(activeLearningView);
    activeLearningView = view;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'learn');
    if (view === 'home') url.searchParams.delete('learnView'); else url.searchParams.set('learnView', view);
    window.history[push ? 'pushState' : 'replaceState']({ page: 'learn', learnView: view, viewStack: [...learningViewStack] }, '', url);
    renderLearningHub();
  }

  function goBackLearningView() {
    if (learningViewStack.length) {
      const parent = learningViewStack.pop();
      setLearningView(parent, false);
    } else {
      const parent = ({ article: 'courses', tip: 'life', policy: 'policies' })[activeLearningView.split(':')[0]] || 'home';
      setLearningView(parent, false);
    }
  }

  window.addEventListener('popstate', event => {
    if (document.body.dataset.activePage !== 'learn') return;
    activeLearningView = event.state?.learnView || new URLSearchParams(window.location.search).get('learnView') || 'home';
    learningViewStack = event.state?.viewStack || [];
    renderLearningHub();
  });

  function renderLearningLanding(hub) {
    const progress = matureState.learningProgress;
    const level = learningLevels[Math.min(Math.max(progress.unlockedLevel || 1, 1), learningLevels.length) - 1];
    const done = progress.completedLevels.length;
    const cursor = progress.lessonCursors[level.id] || 0;
    hub.innerHTML = `<section class="learning-welcome learning-welcome-editorial"><div class="learning-welcome-copy"><h2>从一个问题开始，慢慢弄懂双碳</h2><p>六个专题，图解放在课程里，读完一课再做几道题。</p></div><div class="learning-resume"><div><b>${done === learningLevels.length ? '六个专题已完成' : esc(level.title)}</b><span>${done === learningLevels.length ? '随时可以回看课程' : `已完成 ${done} / ${learningLevels.length} 课${cursor ? ' · 可接着上次读' : ''}`}</span></div><button class="learning-enter" data-view="${done === learningLevels.length ? 'courses' : `article:${level.id}`}">${done === learningLevels.length ? '回看课程' : '继续学习'} <span>→</span></button></div></section>
      <div class="learning-entry-list" aria-label="科普分类"><button class="learning-entry" data-view="courses"><span class="learning-entry-icon">01</span><span class="learning-entry-copy"><b>系统课程</b><small>概念、生活、能源、数据、政策与行动</small></span><span class="learning-entry-count">${done}/${learningLevels.length}</span><span class="learning-entry-arrow">›</span></button><button class="learning-entry" data-view="life"><span class="learning-entry-icon">02</span><span class="learning-entry-copy"><b>生活技巧</b><small>出门、吃饭、居家和旧物处理</small></span><span class="learning-entry-count">${learningArticles.length} 条</span><span class="learning-entry-arrow">›</span></button><button class="learning-entry" data-view="policies"><span class="learning-entry-icon">03</span><span class="learning-entry-copy"><b>知识与政策</b><small>先读要点，再查看文件原文</small></span><span class="learning-entry-count">${policyArticles.length} 份</span><span class="learning-entry-arrow">›</span></button></div>`;
    hub.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setLearningView(button.dataset.view)));
  }

  function renderTopicArt(id, compact = false) {
    const label = ({ greenhouse: '温室效应：热量如何留在地球附近', 'two-goals': '达峰与中和：两条不同的目标线', electricity: '发电来源、输配电与家庭用电', 'food-system': '食物从生产、运输到餐桌', 'carbon-cycle': '大气、海洋、陆地间的碳循环', 'read-claims': '绿色说法的证据核对路径' })[id] || '图文科普示意图';
    const inner = {
      greenhouse: `<circle cx="74" cy="54" r="24" fill="#f3c868"/><path d="M74 9v15M74 84v14M29 54h16M103 54h16M43 23l11 11M95 75l11 11M105 23 94 34M54 75 43 86" stroke="#edbd56" stroke-width="4" stroke-linecap="round"/><path d="M25 130 Q260 104 495 130 L495 208H25Z" fill="#d9ead9"/><path d="M25 130 Q260 104 495 130" fill="none" stroke="#6f9a79" stroke-width="5"/><path d="M168 119C143 84 137 63 140 39M352 116c25-34 31-55 28-77" fill="none" stroke="#e39552" stroke-width="5" stroke-linecap="round"/><path d="m132 45 8-8 7 10M382 47l-8-8-7 10" fill="none" stroke="#e39552" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="185" y="52" width="150" height="38" rx="19" fill="#fff" stroke="#e3e9df"/><text x="260" y="77" text-anchor="middle" class="topic-svg-label">温室气体吸收并释放热量</text><text x="260" y="173" text-anchor="middle" class="topic-svg-small">简化示意 · 不按比例</text>`,
      'two-goals': `<path d="M46 161H472M56 157V42" stroke="#b5c2b4" stroke-width="2"/><path d="M65 145C132 130 160 102 222 77S304 65 450 42" fill="none" stroke="#6c9b73" stroke-width="5" stroke-linecap="round"/><circle cx="222" cy="77" r="7" fill="#fff" stroke="#6c9b73" stroke-width="4"/><text x="221" y="57" text-anchor="middle" class="topic-svg-label">排放达峰</text><path d="M65 55C130 65 158 90 222 99S321 113 388 113" fill="none" stroke="#7394a4" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round"/><path d="M377 105l11 8-11 8" fill="none" stroke="#7394a4" stroke-width="3"/><rect x="332" y="130" width="128" height="34" rx="17" fill="#edf3f4"/><text x="396" y="152" text-anchor="middle" class="topic-svg-small">排放与清除逐步平衡</text><text x="91" y="186" class="topic-svg-small">时间推进 →</text>`,
      electricity: `<rect x="32" y="58" width="112" height="86" rx="15" fill="#f6f0df"/><path d="M67 115 83 82h20l-13 18h20l-30 35 8-20Z" fill="#e4a544"/><text x="88" y="166" text-anchor="middle" class="topic-svg-small">发电来源</text><path d="M152 101H227M220 94l8 7-8 7M299 101h66M357 94l8 7-8 7" stroke="#90a98e" stroke-width="3" stroke-linecap="round"/><rect x="235" y="70" width="63" height="63" rx="15" fill="#e9f0e8"/><path d="M250 101h33M266 84v34" stroke="#6d9273" stroke-width="4" stroke-linecap="round"/><text x="266" y="157" text-anchor="middle" class="topic-svg-small">电网</text><path d="M389 81h69v54h-69z" fill="#eff2e9" stroke="#a2b39e" stroke-width="2"/><path d="m382 81 41-24 42 24M406 105h13v30h-13zm25 0h13v14h-13z" fill="#fff" stroke="#7d9e80" stroke-width="2"/><text x="424" y="158" text-anchor="middle" class="topic-svg-small">家庭用电</text><text x="260" y="192" text-anchor="middle" class="topic-svg-small">同样一度电，排放因子会随电源结构和口径变化</text>`,
      'food-system': `<path d="M58 106H462" stroke="#d9e2d7" stroke-width="4" stroke-linecap="round"/><g fill="#fff" stroke="#dfe8dc" stroke-width="2"><rect x="28" y="66" width="100" height="82" rx="17"/><rect x="168" y="66" width="100" height="82" rx="17"/><rect x="308" y="66" width="100" height="82" rx="17"/><rect x="428" y="66" width="64" height="82" rx="17"/></g><g fill="#6d9772"><path d="M59 116q8-24 22-17-1 16-22 17m22-2q3-23 19-20-1 15-19 20"/><path d="M201 119h34l-3-23h-28zM199 94h39l-5-9h-28z"/><path d="M333 105h50v29h-50zM345 94q13-17 26 0"/><path d="m446 116 13-26 13 26z"/></g><text x="78" y="166" text-anchor="middle" class="topic-svg-small">生产</text><text x="218" y="166" text-anchor="middle" class="topic-svg-small">加工运输</text><text x="358" y="166" text-anchor="middle" class="topic-svg-small">购买储存</text><text x="460" y="166" text-anchor="middle" class="topic-svg-small">餐桌</text><path d="M132 107h24m-5-6 7 6-7 6M272 107h24m-5-6 7 6-7 6M412 107h10m-5-6 7 6-7 6" stroke="#9aaf98" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="260" y="198" text-anchor="middle" class="topic-svg-small">未被吃掉，前面投入的资源也没有被利用</text>`,
      'carbon-cycle': `<circle cx="260" cy="106" r="28" fill="#eaf1e8" stroke="#8ba98d" stroke-width="2"/><text x="260" y="112" text-anchor="middle" class="topic-svg-label">大气</text><rect x="39" y="39" width="122" height="48" rx="18" fill="#f1f3e4" stroke="#e2e7d9"/><text x="100" y="69" text-anchor="middle" class="topic-svg-label">植物与土壤</text><rect x="359" y="39" width="122" height="48" rx="18" fill="#e6f0f0" stroke="#dce9e8"/><text x="420" y="69" text-anchor="middle" class="topic-svg-label">海洋</text><rect x="39" y="143" width="122" height="48" rx="18" fill="#f5ebdf" stroke="#ece2d7"/><text x="100" y="173" text-anchor="middle" class="topic-svg-label">化石燃料</text><rect x="359" y="143" width="122" height="48" rx="18" fill="#f3ede6" stroke="#ebe2d8"/><text x="420" y="173" text-anchor="middle" class="topic-svg-label">生产与交通</text><path d="M161 67 230 95M359 67 290 95M161 165 231 119M359 165 289 119" fill="none" stroke="#91a68e" stroke-width="3" marker-end="url(#topicArrow)"/><path d="M100 87v44M420 87v44" fill="none" stroke="#789a7d" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#topicArrow)"/><text x="260" y="207" text-anchor="middle" class="topic-svg-small">自然交换持续发生 · 人为排放改变大气中的碳平衡</text>`,
      'read-claims': `<rect x="70" y="31" width="176" height="166" rx="18" fill="#fff" stroke="#e1e8df" stroke-width="2"/><path d="M101 69h113M101 91h93M101 113h112" stroke="#c7d3c5" stroke-width="5" stroke-linecap="round"/><rect x="99" y="140" width="118" height="31" rx="15" fill="#eef3eb"/><text x="158" y="160" text-anchor="middle" class="topic-svg-small">“减少 50%”</text><path d="M270 111h40m-9-9 9 9-9 9" stroke="#8fa68f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g><circle cx="346" cy="57" r="16" fill="#eaf2e8"/><circle cx="346" cy="105" r="16" fill="#eaf2e8"/><circle cx="346" cy="153" r="16" fill="#eaf2e8"/><path d="m338 57 6 6 11-13m-17 55 6 6 11-13m-17 55 6 6 11-13" fill="none" stroke="#63916c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="377" y="62" class="topic-svg-label">比较基准</text><text x="377" y="110" class="topic-svg-label">核算边界</text><text x="377" y="158" class="topic-svg-label">数据来源</text></g><text x="260" y="211" text-anchor="middle" class="topic-svg-small">先核对问题，再接受结论</text>`
    }[id] || '<text x="260" y="110" text-anchor="middle">专题插图</text>';
    return `<svg class="topic-svg ${compact ? 'compact' : ''}" viewBox="0 0 520 220" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="topicArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8" fill="#91a68e"/></marker></defs>${inner}</svg>`;
  }

  function renderVisualTopicLibrary(hub) {
    const categories = ['气候基础','双碳概念','能源与生活','饮食与消费','读懂信息'];
      hub.innerHTML = `<div class="learning-subpage-intro"><b>一张图，讲清一个问题</b><span>从气候原理到日常选择；每篇都有示意图、分段解释和资料出处。</span></div><label class="learning-search"><span>${lineIcon('search')}</span><input id="topicSearch" type="search" placeholder="搜温室效应、碳中和、食物浪费…" aria-label="搜索图文专题"></label><div class="topic-category-row" role="tablist" aria-label="图文专题分类"><button class="learn-tab active" role="tab" aria-selected="true" data-topic-filter="all">全部 <span>${visualTopics.length}</span></button>${categories.map(category=>`<button class="learn-tab" role="tab" aria-selected="false" data-topic-filter="${esc(category)}">${esc(category)}</button>`).join('')}</div><div class="visual-topic-grid" id="visualTopicGrid"></div><p class="learn-disclaimer">专题插图为概念示意，不按比例；涉及科学结论时请查看所列原始资料。</p>`;
    const draw = () => {
      const filter = hub.querySelector('[data-topic-filter].active')?.dataset.topicFilter || 'all';
      const query = hub.querySelector('#topicSearch').value.trim().toLocaleLowerCase();
      const items = visualTopics.filter(topic => (filter === 'all' || topic.category === filter) && `${topic.category} ${topic.title} ${topic.summary}`.toLocaleLowerCase().includes(query));
      hub.querySelector('#visualTopicGrid').innerHTML = items.length ? items.map(topic=>`<button class="visual-topic-card" data-topic="${esc(topic.id)}"><span class="visual-topic-card-art">${renderTopicArt(topic.id,true)}</span><span class="visual-topic-card-copy"><span class="topic-card-meta">${esc(topic.category)} · ${topic.minutes} 分钟${matureState.learningProgress.readTopics.includes(topic.id) ? ' · 已读' : ''}</span><b>${esc(topic.title)}</b><span>${esc(topic.summary)}</span><i>阅读图解 →</i></span></button>`).join('') : '<p class="learning-empty">没有找到相关专题，换个关键词或主题试试。</p>';
      hub.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => setLearningView(`topic:${button.dataset.topic}`)));
    };
    hub.querySelectorAll('[data-topic-filter]').forEach(button=>button.addEventListener('click',()=>{hub.querySelectorAll('[data-topic-filter]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});draw();}));
    hub.querySelector('#topicSearch').addEventListener('input',draw);
    draw();
  }

  function renderVisualTopicPage(hub, id) {
    const topic = visualTopics.find(item=>item.id===id);
    if (!topic) { setLearningView('topics',false); return; }
    if (!matureState.learningProgress.readTopics.includes(id)) { matureState.learningProgress.readTopics.push(id); saveState(); }
    hub.innerHTML = `<article class="visual-topic-article"><div class="visual-topic-heading"><span class="topic-card-meta">${esc(topic.category)} · ${topic.minutes} 分钟 · 图解专题</span><h2>${esc(topic.title)}</h2><p>${esc(topic.summary)}</p></div><figure class="visual-topic-figure">${renderTopicArt(topic.id)}<figcaption>概念示意图 · 帮助理解关系，不作为比例或精确数据</figcaption></figure><aside class="visual-topic-takeaway"><span>先记住</span><b>${esc(topic.takeaway)}</b></aside><div class="visual-topic-sections">${topic.sections.map((section,index)=>`<section class="visual-topic-section"><span class="topic-section-number">0${index+1}</span><div><h3>${esc(section.title)}</h3>${section.body.split('\n\n').map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</div></section>`).join('')}</div><section class="visual-topic-sources"><h3>继续查资料</h3><p>${esc(topic.source)}</p><div><a href="${esc(topic.sourceUrl)}" target="_blank" rel="noopener noreferrer">打开资料原文 ↗</a>${topic.extraUrl ? `<a href="${esc(topic.extraUrl)}" target="_blank" rel="noopener noreferrer">另一份参考资料 ↗</a>` : ''}</div></section><button class="filter-button visual-topic-back" id="topicsBack">← 返回图文专题</button></article>`;
    document.getElementById('topicsBack').addEventListener('click',()=>setLearningView('topics'));
  }

  function renderLearningCoursePage(hub, selectedLevel = null) {
    if (selectedLevel) {
      openLearningLesson(selectedLevel);
      return;
    }
    const completedCount = matureState.learningProgress.completedLevels.length;
    hub.innerHTML = `<div class="learning-subpage-intro"><b>六个专题，按顺序来</b><span>每课有图解与文字，课后练习通过后再进入下一课。</span></div><div class="learn-levels learn-levels-v2" id="learnLevels"></div>`;
    renderLearningLevels();
  }

  function renderLifeLearningPage(hub) {
    hub.innerHTML = `<div class="learning-subpage-intro"><b>从今天遇到的事找起</b></div><label class="learning-search"><span>${lineIcon('search')}</span><input id="lifeSearch" type="search" placeholder="搜出行、空调、旧物、节水…" aria-label="搜索生活技巧"></label><div class="learning-life-categories" role="tablist" aria-label="生活技巧分类"><button class="learn-tab active" role="tab" aria-selected="true" data-life-filter="all">全部 <span>${learningArticles.length}</span></button>${['绿色出行','饮食与食物','居家用能','理性消费','循环利用','节水生活'].map(theme=>`<button class="learn-tab" role="tab" aria-selected="false" data-life-filter="${esc(theme)}">${esc(theme)}</button>`).join('')}</div><div id="lifeLearningContent"></div>`;
    hub.querySelectorAll('[data-life-filter]').forEach(button => button.addEventListener('click', () => {
      hub.querySelectorAll('[data-life-filter]').forEach(tab => { const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
      renderLearnTab('life', button.dataset.lifeFilter);
    }));
    hub.querySelector('#lifeSearch').addEventListener('input', () => renderLearnTab('life', hub.querySelector('[data-life-filter].active')?.dataset.lifeFilter || 'all'));
    renderLearnTab('life', 'all');
  }

  function renderLifeTipPage(hub, id) {
    const article = learningArticles.find(item => item.id === id);
    if (!article) { setLearningView('life', false); return; }
    const progress = matureState.learningProgress;
    const saved = progress.bookmarkedTips.includes(article.id);
    const read = progress.readTips.includes(article.id);
    hub.innerHTML = `<article class="learning-reading-page learning-tip-detail"><span class="policy-tag">${esc(article.theme)}</span><h2>${esc(article.title)}</h2><p class="learning-reading-lead">${esc(article.summary)}</p><section><h3>怎么做</h3><ol>${article.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section><section><h3>什么情况下不必勉强</h3><p>${esc(article.when)}</p></section><div class="learning-tip-actions"><button class="filter-button" id="tipBookmark">${saved ? '★ 已收藏' : '☆ 收藏'}</button><button class="primary" id="tipRecord">记录这项行动</button></div></article>`;
    if (!read) { progress.readTips.push(article.id); saveState(); }
    document.getElementById('tipBookmark').addEventListener('click', () => { const ids = progress.bookmarkedTips; const index = ids.indexOf(article.id); if (index >= 0) ids.splice(index, 1); else ids.push(article.id); saveState(); renderLifeTipPage(hub, id); });
    document.getElementById('tipRecord').addEventListener('click', () => { showPage('record'); const behavior = document.getElementById('behavior'); behavior.value = article.related; updateEstimate(); });
  }

  function renderPolicyLearningPage(hub) {
    const progress = matureState.learningProgress;
    hub.innerHTML = `<section class="policy-overview"><h2>先看清这四份文件的关系</h2><p>总纲定方向，行动方案拆任务，阶段方案抓近期工作，绿色转型意见把目光放到整个社会。点开一份，先读要点，再查看官方原文。</p></section><label class="learning-search"><span>${lineIcon('search')}</span><input id="policySearch" type="search" placeholder="搜碳达峰、节能、绿色转型…" aria-label="搜索政策资料"></label><div class="learn-card-grid" id="policyCardList"></div>`;
    const renderPolicyCards = () => {
      const query = hub.querySelector('#policySearch').value.trim().toLocaleLowerCase();
      const filtered = policyArticles.map((article,index)=>({article,index})).filter(({article})=>`${article.theme} ${article.title} ${article.summary} ${article.source}`.toLocaleLowerCase().includes(query));
      hub.querySelector('#policyCardList').innerHTML = filtered.length ? filtered.map(({article,index}) => `<button class="policy-card learning-policy-card" data-policy="${index}"><div class="policy-content"><span class="policy-tag">${esc(article.theme)}</span><h3>${esc(article.title)}</h3><p>${esc(policyBriefs[index].lead)}</p><div class="policy-meta"><span>${esc(article.date)}</span><span>${progress.readPolicies.includes(index) ? '回看要点' : '先读要点'} ›</span></div></div></button>`).join('') : '<p class="learning-empty">没有找到匹配资料，试试其他关键词。</p>';
      hub.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click', () => setLearningView(`policy:${button.dataset.policy}`)));
    };
    hub.querySelector('#policySearch').addEventListener('input', renderPolicyCards);
    renderPolicyCards();
  }

  function renderPolicyDetailPage(hub, index) {
    const article = policyArticles[index];
    if (!article) { setLearningView('policies', false); return; }
    const progress = matureState.learningProgress;
    if (!progress.readPolicies.includes(index)) { progress.readPolicies.push(index); saveState(); }
    const brief = policyBriefs[index];
    hub.innerHTML = `<article class="learning-reading-page policy-reading"><span class="policy-tag">${esc(article.theme)}</span><h2>${esc(article.title)}</h2><section><h3>这份文件讲什么</h3><p>${esc(brief.lead)}</p></section><section><h3>先记住三点</h3><ol>${brief.points.map(point => `<li>${esc(point)}</li>`).join('')}</ol></section><section class="policy-original"><h3>查看官方原文</h3><p>${esc(article.source)} · ${esc(article.date)}</p><a class="primary learning-source-button" href="${esc(article.url)}" target="_blank" rel="noopener noreferrer">打开文件原文 ↗</a></section></article>`;
  }

  function renderPracticePage(hub) {
    const completed = matureState.learningProgress.completedLevels.length;
    if (completed < learningLevels.length) {
      hub.innerHTML = `<section class="learning-practice-locked"><span class="practice-lock">🔒</span><h2>先完成六阶段课程</h2><p>综合练习会在课程都读完后开放。你目前完成了 ${completed} / ${learningLevels.length} 阶段，课程进度会自动保存。</p><button class="primary" data-view="courses">继续学习 →</button></section>`;
      hub.querySelector('[data-view]').addEventListener('click', () => setLearningView('courses'));
      return;
    }
    currentQuestion = 0;
    activePracticeScore = 0;
    activePracticeQuestions = learningLevels.flatMap(level => level.questions);
    hub.innerHTML = `<div class="quiz-panel learning-practice-panel"><div class="quiz-intro"><span class="quiz-mark">✓</span><div><span class="learn-eyebrow">课程综合练习 · ${activePracticeQuestions.length} 题</span><h3>用完整课程检验自己的理解</h3><p>覆盖双碳基础、日常生活、政策判断和行动设计。提交后可查看解析。</p></div></div><div id="quizStage"></div></div>`;
    renderQuizQuestion();
  }

  function renderLearningLevels() {
    const target = document.getElementById('learnLevels');
    if (!target) return;
    const progress = matureState.learningProgress;
    const unlocked = Math.min(Math.max(Number(progress.unlockedLevel) || 1, 1), learningLevels.length);
    target.innerHTML = learningLevels.map(level => {
      const completed = progress.completedLevels.includes(level.id);
      const locked = level.id > unlocked;
      const current = level.id === unlocked && !completed;
      const state = completed ? '已完成' : locked ? '前置课程未完成' : '当前可学';
      const cursor = progress.lessonCursors[level.id] || 0;
      return `<article class="learning-level-card learning-level-v2 ${completed ? 'completed' : ''} ${locked ? 'locked' : ''} ${current ? 'current' : ''}"><div class="learning-level-rail"><span>${completed ? '✓' : locked ? '锁' : `0${level.id}`}</span><i></i></div><div class="learning-level-main"><div class="learning-level-top"><span class="learning-level-status">${state}</span></div><h3>${esc(level.title)}</h3><p>${esc(level.objective)}</p><div class="course-card-art">${level.id === 2 ? lessonVisual(level.id) : courseGraphics[level.id]?.[0] ? renderTopicArt(courseGraphics[level.id][0], true) : lessonVisual(level.id)}</div></div><div class="learning-level-action"><button class="learning-start ${locked ? 'disabled' : ''}" data-level="${level.id}" ${locked ? 'disabled' : ''}>${completed ? '回看课程' : locked ? '尚未解锁' : cursor ? '继续学习' : '开始学习'} <span>→</span></button></div></article>`;
    }).join('');
    target.querySelectorAll('[data-level]:not(:disabled)').forEach(button => button.addEventListener('click', () => setLearningView(`article:${Number(button.dataset.level)}`)));
  }

  function openLearningLesson(levelId) {
    const level = learningLevels.find(item => item.id === levelId);
    if (!level || levelId > matureState.learningProgress.unlockedLevel) return;
    activeLessonLevel = levelId;
    activeLessonStep = Math.min(matureState.learningProgress.lessonCursors[levelId] || 0, level.sections.length + courseGraphics[levelId].length);
    activeLessonQuestion = 0;
    activeLessonScore = 0;
    renderLessonStep();
  }

  function renderLessonStep() {
    const level = learningLevels[activeLessonLevel - 1];
    if (!level) return;
    const hub = document.getElementById('learningHub');
    const sectionCount = level.sections.length;
    const graphics = courseGraphics[level.id];
    const quizStep = sectionCount + graphics.length;
    const totalSteps = quizStep + 1;
    const percent = Math.round((activeLessonStep + 1) / totalSteps * 100);
    let content;
    if (activeLessonStep < sectionCount) {
      const section = level.sections[activeLessonStep];
      content = `<section class="lesson-step-reading"><h3>${esc(section.title)}</h3>${activeLessonStep === 0 ? lessonVisual(level.id) : ''}${section.body.split('\n\n').map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`;
    } else if (activeLessonStep < quizStep) {
      const topic = visualTopics.find(item => item.id === graphics[activeLessonStep - sectionCount]);
      content = `<section class="course-graphic-reading"><h3>${esc(topic.title)}</h3><p>${esc(topic.summary)}</p><figure class="visual-topic-figure">${renderTopicArt(topic.id)}<figcaption>原理示意，未按比例绘制</figcaption></figure>${topic.sections.map(section => `<div class="course-graphic-paragraph"><h4>${esc(section.title)}</h4><p>${esc(section.body)}</p></div>`).join('')}<div class="lesson-source">资料：<a href="${esc(topic.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(topic.source)} ↗</a></div></section>`;
    } else {
      content = `<section class="course-inline-quiz"><h3>这一课，试试能否讲清楚</h3><p>${esc(level.example)}</p><div id="lessonQuizStage"></div></section>`;
    }
    hub.innerHTML = `<article class="lesson-article lesson-step-article"><div class="lesson-heading"><div><span class="policy-tag">第 ${level.id} 课 · ${esc(level.name)}</span><h2>${esc(level.title)}</h2></div></div><div class="lesson-step-progress"><div class="lesson-step-progress-copy"><b>${activeLessonStep === quizStep ? '课后练习' : '课程内容'}</b><span>${activeLessonStep + 1} / ${totalSteps}</span></div><div class="lesson-step-track"><i style="width:${percent}%"></i></div></div><div class="lesson-step-content">${content}</div>${activeLessonStep === quizStep ? '' : `<div class="lesson-step-nav"><button class="filter-button" id="lessonPrev" ${activeLessonStep === 0 ? 'disabled' : ''}>← 上一页</button><button class="learn-hero-button" id="lessonStepNext">${activeLessonStep === quizStep - 1 ? '开始练习' : '下一页'} <span>→</span></button></div>`}</article>`;
    if (activeLessonStep === quizStep) { renderLessonQuestion(); return; }
    document.getElementById('lessonPrev').addEventListener('click', () => moveLessonStep(-1));
    document.getElementById('lessonStepNext').addEventListener('click', () => moveLessonStep(1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finishLearningModule(level) {
    const progress = matureState.learningProgress;
    if (!progress.completedLevels.includes(level.id)) progress.completedLevels.push(level.id);
    progress.completedLevels.sort((a,b)=>a-b);
    progress.unlockedLevel = Math.min(learningLevels.length, Math.max(progress.unlockedLevel, level.id + 1));
    delete progress.lessonCursors[level.id];
    saveState();
    const allDone = progress.completedLevels.length === learningLevels.length;
    const next = learningLevels[level.id];
    const hub = document.getElementById('learningHub');
    hub.innerHTML = `<section class="lesson-completion"><span class="lesson-completion-mark">${allDone ? '✦' : '✓'}</span><span class="policy-tag">${esc(level.name)} · 已完成</span><h2>${allDone ? '六阶段课程完成' : '这一阶段读完了'}</h2><p>${allDone ? '课程内容已全部完成，综合练习现在开放。你也可以回到技巧和政策资料继续查阅。' : `${esc(next.name)}已经解锁。按自己的节奏继续，不需要赶进度。`}</p><div class="lesson-completion-actions"><button class="filter-button" id="lessonBackPath">返回学习路线</button><button class="primary" id="lessonContinue">${allDone ? '开始综合练习' : `继续：${esc(next.name)}`} →</button></div></section>`;
    document.getElementById('lessonBackPath').addEventListener('click', () => setLearningView('courses'));
    document.getElementById('lessonContinue').addEventListener('click', () => setLearningView(allDone ? 'practice' : `article:${next.id}`, false));
  }

  function moveLessonStep(offset) {
    const level = learningLevels[activeLessonLevel - 1];
    activeLessonStep = Math.max(0, Math.min(level.sections.length + courseGraphics[level.id].length, activeLessonStep + offset));
    matureState.learningProgress.lessonCursors[activeLessonLevel] = activeLessonStep;
    saveState();
    renderLessonStep();
  }

  function lessonScenario(levelId) {
    return [
      { icon: '📈', title: '峰值之后还有排放，算达峰了吗？', prompt: '一条排放曲线已越过最高点，之后连续几年逐步下降，但排放并没有归零。应该怎样描述？', options: ['可能已达峰并进入下降阶段，但不等于碳中和', '已经碳中和，因为排放下降了', '只要还有排放就不可能达峰'], answer: 0, explain: '达峰关注排放总量由升转降；中和还要看排放与清除是否平衡，两者不是一件事。' },
      { icon: '🚇', title: '同一段通勤，能直接比较吗？', prompt: '比较地铁和开车去同一地点，除了距离还要留意什么？', options: ['只看交通工具名称', '能源来源、乘坐人数和比较边界', '只看当天的天气'], answer: 1, explain: '交通方式的影响还受能源结构、载客情况和计算边界影响，不能把一个固定结果套给所有城市。' },
      { icon: '🏙️', title: '改好一栋楼，为什么电力系统也受影响？', prompt: '办公楼改善保温后，夏季制冷需求降低，最合理的因果链是什么？', options: ['制冷需求下降 → 用电需求可能下降 → 供电侧需求相应变化', '建筑保温会让电力自动变成零排放', '只影响外观，不影响能源需求'], answer: 0, explain: '节能先减少终端需求，进而影响电力供应需要；实际影响还需结合建筑和电网数据判断。' },
      { icon: '🧭', title: '这条减排数字可信吗？', prompt: '海报称“骑行 3 公里减少 0.45 kg CO₂e”，却没说明对比情景或数据来源。该怎么办？', options: ['数字精确到小数点后两位，直接当实测', '核查基准情景、因子来源和适用范围', '当成适用于每个人的承诺'], answer: 1, explain: '没有基准和因子来源，就无法解释“减少”的含义；应标为示意或继续查证。' }
    ][levelId - 1];
  }

  function lessonVisual(levelId) {
    return [
      `<div class="lesson-visual"><div class="lesson-visual-caption">两个目标，看的是不同关系</div><div class="lesson-curve"><span>排放上升</span><b>峰值</b><span>稳步下降</span></div><div class="lesson-balance"><span>人为排放</span><b>↔</b><span>清除吸收</span><small>逐步平衡 · 碳中和</small></div></div>`,
      `<div class="lesson-visual"><div class="lesson-visual-caption">一次出行，不止看交通工具</div><div class="lesson-flow"><span>出行距离</span><b>＋</b><span>能源来源</span><b>＋</b><span>载客情况</span><strong>共同影响比较结果</strong></div></div>`,
      `<div class="lesson-visual"><div class="lesson-visual-caption">改变一个环节，可能带动一条链</div><div class="lesson-flow"><span>建筑保温</span><b>→</b><span>制冷需求</span><b>→</b><span>用电需求</span><b>→</b><span>电力系统</span></div></div>`,
      `<div class="lesson-visual"><div class="lesson-visual-caption">估算不是猜数字</div><div class="lesson-flow"><span>活动数据</span><b>×</b><span>排放因子</span><b>=</b><strong>估算结果</strong></div><div class="lesson-evidence-tags"><span>✓ 基准情景</span><span>✓ 来源与单位</span><span>✓ 适用边界</span></div></div>`,
      `<div class="lesson-visual"><div class="lesson-visual-caption">读政策，先分清这三层</div><div class="lesson-flow"><span>总体目标</span><b>→</b><span>行动方案</span><b>→</b><strong>阶段任务</strong></div><div class="lesson-evidence-tags"><span>发布主体</span><span>时间范围</span><span>正式原文</span></div></div>`,
      `<div class="lesson-visual"><div class="lesson-visual-caption">一份可坚持的行动计划</div><div class="lesson-flow"><span>选场景</span><b>→</b><span>定目标</span><b>→</b><span>留替代</span><b>→</b><strong>定期复盘</strong></div></div>`
    ][levelId - 1];
  }

  function renderLessonQuestion() {
    const stage = document.getElementById('lessonQuizStage');
    if (!stage || !activeLessonLevel) return;
    const level = learningLevels[activeLessonLevel - 1];
    if (activeLessonQuestion >= level.questions.length) {
      const passed = activeLessonScore >= 2;
      const progress = matureState.learningProgress;
      progress.quizAttempts += level.questions.length;
      progress.quizCorrect += activeLessonScore;
      if (passed && !progress.completedLevels.includes(level.id)) progress.completedLevels.push(level.id);
      if (passed) progress.unlockedLevel = Math.min(learningLevels.length, Math.max(progress.unlockedLevel, level.id + 1));
      if (passed) delete progress.lessonCursors[level.id];
      saveState();
      stage.innerHTML = `<div class="lesson-result ${passed ? 'passed' : 'retry'}"><div><b>${passed ? '这课学完了' : '再试一次'}</b><p>答对 ${activeLessonScore} / ${level.questions.length} 题。${passed ? (level.id === learningLevels.length ? '六个专题都已完成。' : '下一课已解锁。') : '答对 2 题即可进入下一课。'}</p></div></div><div class="lesson-result-actions"><button class="filter-button" id="lessonReview">${passed ? '回看这一课' : '重新练习'}</button><button class="primary" id="lessonDone">${passed && level.id < learningLevels.length ? '继续下一课' : '返回课程'}</button></div>`;
      document.getElementById('lessonReview').addEventListener('click', () => { if (passed) { delete progress.lessonCursors[level.id]; openLearningLesson(level.id); } else { activeLessonQuestion = 0; activeLessonScore = 0; renderLessonQuestion(); } });
      document.getElementById('lessonDone').addEventListener('click', () => { if (passed && level.id < learningLevels.length) setLearningView(`article:${level.id + 1}`, false); else goBackLearningView(); });
      return;
    }
    const question = level.questions[activeLessonQuestion];
    const rotation = (activeLessonQuestion + level.id) % question.options.length;
    const answerOrder = question.options.map((_, index) => (index + rotation) % question.options.length);
    const correctIndex = answerOrder.indexOf(question.answer);
    delete stage.dataset.answered;
    stage.innerHTML = `<div class="lesson-question-progress">第 ${activeLessonQuestion + 1} / ${level.questions.length} 题</div><h4>${esc(question.q)}</h4><div class="quiz-options">${answerOrder.map((originalIndex,index)=>`<button class="quiz-option" data-lesson-answer="${index}">${esc(question.options[originalIndex])}</button>`).join('')}</div><div class="quiz-feedback" id="lessonFeedback" aria-live="polite"></div>`;
    stage.querySelectorAll('[data-lesson-answer]').forEach(button => button.addEventListener('click', () => {
      if (stage.dataset.answered === String(activeLessonQuestion)) return;
      stage.dataset.answered = String(activeLessonQuestion);
      const correct = Number(button.dataset.lessonAnswer) === correctIndex;
      if (correct) activeLessonScore += 1;
      button.classList.add(correct ? 'correct' : 'incorrect');
      stage.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
      const feedback = document.getElementById('lessonFeedback');
      feedback.innerHTML = `<b>${correct ? '答对了' : '看看原因'}</b><p>${esc(question.explain)}</p><button class="life-link" id="lessonNext">${activeLessonQuestion === level.questions.length - 1 ? '看结果' : '下一题'} →</button>`;
      document.getElementById('lessonNext').addEventListener('click', () => { activeLessonQuestion += 1; renderLessonQuestion(); });
    }));
  }

  function renderLearnTab(tab, filter = 'all') {
    if (tab === 'life') {
      const content = document.getElementById('lifeLearningContent');
      if (!content) return;
      const query = document.getElementById('lifeSearch')?.value.trim().toLocaleLowerCase() || '';
      const articles = learningArticles.filter(article => (filter === 'all' || article.theme === filter) && `${article.theme} ${article.title} ${article.summary} ${article.action}`.toLocaleLowerCase().includes(query));
      content.innerHTML = articles.length ? `<div class="life-card-grid learning-life-grid">${articles.map(article => `<button class="life-card learning-life-card learning-tip-entry" data-tip="${esc(article.id)}"><span class="life-card-top"><span class="life-icon">${lineIcon(article.icon)}</span><span class="policy-tag">${esc(article.theme)}</span></span><b>${esc(article.title)}</b><span class="learning-tip-summary">${esc(article.summary)}</span><span class="life-link">${matureState.learningProgress.readTips.includes(article.id) ? '已读 · ' : ''}${matureState.learningProgress.bookmarkedTips.includes(article.id) ? '★ 已收藏 · ' : ''}展开做法 <span>→</span></span></button>`).join('')}</div>` : '<p class="learning-empty">没有找到相关技巧，换个词或看看其他场景。</p>';
      content.querySelectorAll('[data-tip]').forEach(button => button.addEventListener('click', () => setLearningView(`tip:${button.dataset.tip}`)));
      return;
    }
    if (tab === 'quiz') {
      const content = document.getElementById('quickLearnContent');
      if (!content) return;
      currentQuestion = 0;
      content.innerHTML = `<div class="quiz-panel"><div class="quiz-intro"><span class="quiz-mark">${lineIcon('spark')}</span><div><span class="learn-eyebrow">QUICK QUIZ · 约 1 分钟</span><h3>答三道题，检验今天学到的知识</h3><p>答错也没关系，每道题都会告诉你原因。</p></div></div><div id="quizStage"></div></div>`;
      renderQuizQuestion();
    }
  }

  function renderQuizQuestion() {
    const stage = document.getElementById('quizStage');
    if (!stage) return;
    if (currentQuestion >= activePracticeQuestions.length) {
      matureState.learningProgress.quizAttempts += activePracticeQuestions.length;
      matureState.learningProgress.quizCorrect += activePracticeScore;
      saveState();
      stage.innerHTML = `<div class="quiz-result"><span>${lineIcon('leaf')}</span><h3>本轮练习完成</h3><p>课程练习帮助检查理解，不是正式考核。错题可以回到对应课程复习。</p><button class="life-link" id="quizAgain">再答一轮</button></div>`;
      document.getElementById('quizAgain').addEventListener('click', () => { currentQuestion = 0; activePracticeScore = 0; renderQuizQuestion(); });
      return;
    }
    const item = activePracticeQuestions[currentQuestion];
    stage.innerHTML = `<div class="quiz-progress"><span>第 ${currentQuestion + 1} / ${activePracticeQuestions.length} 题</span><div><i style="width:${(currentQuestion / activePracticeQuestions.length) * 100}%"></i></div></div><h4 class="quiz-question">${esc(item.q)}</h4><div class="quiz-options">${item.options.map((option, index) => `<button class="quiz-option" data-answer="${index}">${esc(option)}</button>`).join('')}</div><div class="quiz-feedback" id="quizFeedback" aria-live="polite"></div>`;
    stage.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (stage.dataset.answered) return;
      stage.dataset.answered = 'true';
      const correct = Number(button.dataset.answer) === item.answer;
      if (correct && activeLearningView === 'practice') activePracticeScore += 1;
      button.classList.add(correct ? 'correct' : 'incorrect');
      stage.querySelectorAll('.quiz-option')[item.answer].classList.add('correct');
      const feedback = document.getElementById('quizFeedback');
      feedback.innerHTML = `<b>${correct ? '回答正确' : '参考答案已标出'}</b><p>${esc(item.explain)}</p><button class="life-link" id="nextQuestion">${currentQuestion === activePracticeQuestions.length - 1 ? '完成练习' : '下一题'} →</button>`;
      document.getElementById('nextQuestion').addEventListener('click', () => { currentQuestion += 1; renderQuizQuestion(); });
    }));
  }

  function ensureMissionPage() {
    const main = document.querySelector('main.main');
    main.insertAdjacentHTML('beforeend', `<section class="page" id="page-missions" aria-labelledby="missionsTitle">
      <div class="title-row"><div><h1 class="title" id="missionsTitle">任务</h1><p class="subtitle" id="missionDate"></p></div></div>
      <div class="mission-hero"><div><span>当前可用</span><b id="pointsBalance">0 <small>积分</small></b></div><button class="filter-button" data-page="points">查看积分明细 →</button></div>
      <div class="mission-nav"><button class="active" data-mission-view="overview">行动任务</button><button data-mission-view="badges">成就徽章</button><button data-mission-view="rewards">积分兑换</button></div>
      <div id="missionContent"></div>
    </section>`);
    document.querySelectorAll('#page-missions > .mission-nav [data-mission-view]').forEach(button => button.addEventListener('click', () => { missionView = button.dataset.missionView; renderMissions(); }));
  }

  function ensurePointsPage() {
    document.querySelector('main.main').insertAdjacentHTML('beforeend', `<section class="page" id="page-points" aria-labelledby="pointsTitle"><div class="title-row"><div><button class="learning-back-link" data-page="missions">← 返回任务</button><h1 class="title" id="pointsTitle">积分明细</h1><p class="subtitle">每笔获得和兑换都可以在这里查到。</p></div></div><section class="points-balance-card"><span>当前可用积分</span><b id="pointsBalanceFull">0</b></section><div class="panel points-history-panel"><div class="panel-head"><div><div class="panel-title">全部收支记录</div></div></div><div id="pointsLedgerFull"></div></div></section>`);
  }

  function ensureProfilePage() {
    document.querySelector('main.main').insertAdjacentHTML('beforeend', `<section class="page" id="page-profile" aria-labelledby="profileTitle">
      <div class="title-row"><div><h1 class="title" id="profileTitle">我的</h1></div></div>
      <div id="profileContent"></div>
    </section>`);
  }

  let capabilityReturnPage = 'profile';
  function ensureCapabilityPage() {
    document.querySelector('main.main').insertAdjacentHTML('beforeend', `<section class="page" id="page-capabilities" aria-labelledby="capabilitiesTitle"><div class="title-row"><div><button class="learning-back-link" id="capabilitiesBack">← 返回</button><h1 class="title" id="capabilitiesTitle">家庭与智能服务</h1><p class="subtitle">家庭共享、拍照记录和成果分享都由你掌控。</p></div></div><div id="capabilitiesContent"></div></section>`);
    document.getElementById('capabilitiesBack').addEventListener('click', () => navigate(capabilityReturnPage));
  }

  function capabilityRecommendations() {
    const userRecords = realRecords();
    const travelRows = userRecords.filter(row => ['walk', 'bicycle', 'bus', 'metro'].includes(row.kind));
    const reuseRows = userRecords.filter(row => row.kind === 'reuse');
    const mealRows = userRecords.filter(row => row.kind === 'meal');
    const waterRows = userRecords.filter(row => row.kind === 'water');
    const choices = [
      { count: travelRows.length, title: '给短途出行留个选择', body: '下次距离不远时，可以看看步行、骑行或公交是否顺路。按实际行动记录，不必为了数据改变原有安排。', kind: 'walk' },
      { count: mealRows.length, title: '从一餐按需取餐开始', body: '先按自己的食量取餐；吃完后再决定是否添餐，记录真实完成的餐次即可。', kind: 'meal' },
      { count: reuseRows.length, title: '让闲置物先找到新去处', body: '从一件状态良好的衣物、书或小家电开始，转赠、维修或正规回收都可以记下去向。', kind: 'reuse' },
      { count: waterRows.length, title: '留意一个日常用水习惯', body: '例如刷牙时关水、缩短淋浴时间。若没有可靠的用量数据，只记录行为，不必估算节水量。', kind: 'water' }
    ];
    return choices.sort((a, b) => a.count - b.count).slice(0, 2);
  }

  function familyTotals() {
    const rows = matureState.family.records;
    const totalPoints = rows.reduce((sum, row) => sum + (Number(row.points) || 0), 0);
    return { rows, reduction: allReduction(rows), points: totalPoints, days: new Set(rows.map(row => dayKey(row.date))).size };
  }

  function renderCapabilities() {
    const target = document.getElementById('capabilitiesContent');
    if (!target) return;
    const family = matureState.family;
    const totals = familyTotals();
    const suggestions = capabilityRecommendations();
    const memberOptions = family.members.map(member => `<option value="${esc(member.id)}">${esc(member.name)}${member.role === 'owner' ? '（我）' : ''}</option>`).join('');
    const rows = [...totals.rows].sort((a, b) => b.date - a.date).slice(0, 4);
    target.innerHTML = `
      <section class="capability-banner"><div><span>家庭与智能服务</span><h2>让低碳行动，自然融入家庭生活</h2><p>共享成果，但个人记录和积分仍各自独立。</p></div><i>${lineIcon('family')}</i></section>
      <section class="panel capability-card"><div class="panel-head"><div><div class="panel-title">家庭碳账户</div><div class="panel-note">${family.name ? `「${esc(family.name)}」 · ${family.members.length} 位成员` : '建立家庭空间，查看共同参与的行动'}</div></div><span class="capability-status">网页本机演示</span></div>
        ${family.name ? `<div class="family-metrics"><div><small>家庭碳排放估算</small><b>${totals.reduction > 0 ? `${totals.reduction.toFixed(2)} <i>kg CO₂</i>` : '暂无'}</b></div><div><small>家庭累计积分</small><b>${totals.points} <i>分</i></b></div><div><small>家庭行动记录</small><b>${totals.rows.length} <i>条</i></b></div><div><small>参与行动天数</small><b>${totals.days} <i>天</i></b></div></div><div class="family-member-list">${family.members.map(member => { const mine = member.role === 'owner'; const ownRows = totals.rows.filter(row => row.memberId === member.id); return `<div><span class="family-avatar">${esc(member.name.slice(0, 1))}</span><b>${esc(member.name)}${mine ? ' <small>我</small>' : ''}</b><span>${ownRows.length} 条行动 · ${ownRows.reduce((sum, row) => sum + (Number(row.points) || 0), 0)} 分</span></div>`; }).join('')}</div>
          <div class="family-entry"><h3>记录一条家庭行动</h3><div class="capability-form-row"><label>记录成员<select id="familyMemberSelect">${memberOptions}</select></label><label>行动类别<select id="familyKindSelect">${Object.entries(kinds).map(([key, item]) => `<option value="${key}">${esc(item.name)}</option>`).join('')}</select></label><label>活动量<input id="familyValueInput" type="number" min="0.1" step="0.1" placeholder="按实际填写"></label><label>单位<span id="familyUnit">${esc(kinds[Object.keys(kinds)[0]].unit)}</span></label></div><button class="filter-button" id="saveFamilyRecord">保存到家庭汇总</button><small>此条仅计入家庭统计，不计入个人账本或个人积分。</small></div>
          ${rows.length ? `<div class="family-recent"><b>最近的家庭行动</b>${rows.map(row => `<div><span class="family-kind">${lineIcon(row.kind)} ${esc(kinds[row.kind]?.name || '行动记录')} · ${esc(family.members.find(member => member.id === row.memberId)?.name || '家庭成员')}</span><small>${new Date(row.date).toLocaleDateString('zh-CN')}</small></div>`).join('')}</div>` : ''}
          <button class="quiet-button" id="addFamilyMember">＋ 添加家庭成员（本机演示）</button>
        ` : `<div class="family-empty"><span>${lineIcon('family')}</span><b>一个家庭，一起记录各自的绿色行动</b><p>创建后可在本机预览家庭汇总与成员记录。当前还没有账号、邀请码或跨设备同步。</p><button class="primary" id="createFamily">创建家庭空间</button></div>`}
        <div class="capability-footnote">真实的鸿蒙超级终端同步尚未接入，网页数据只保存在当前浏览器；演示记录可随时清除。</div>
      </section>
      <div class="capability-grid"><section class="panel capability-card"><div class="panel-head"><div><div class="panel-title">拍照识别录入</div><div class="panel-note">识别草稿，核对后保存</div></div><span class="capability-icon">${lineIcon('search')}</span></div><p class="capability-copy">前往低碳记录使用拍照识别；图片是否发送到云端会在识别前明确征求同意。</p><button class="filter-button" type="button" onclick="showPage('record')">去拍照记录 →</button></section>
        <section class="panel capability-card"><div class="panel-head"><div><div class="panel-title">给你的生活建议</div><div class="panel-note">根据本机记录整理 · 规则建议</div></div><span class="capability-icon">${lineIcon('spark')}</span></div><article class="personalized-task"><span>为你推荐的今日行动</span><b>${esc(suggestions[0].title)}</b><p>${esc(suggestions[0].body)}</p><button class="text-action" data-record-kind="${suggestions[0].kind}">去记录这一项 →</button><small>按真实行动保存，不额外制造减排数据。</small></article><div class="recommendation-list">${suggestions.slice(1).map(item => `<article><span>${lineIcon(item.kind)}</span><div><b>${esc(item.title)}</b><p>${esc(item.body)}</p><button class="text-action" data-record-kind="${item.kind}">记下这类行动 →</button></div></article>`).join('')}</div></section></div>
      <section class="panel capability-card share-panel"><div class="panel-head"><div><div class="panel-title">分享一段自己的行动</div><div class="panel-note">先预览，再由你决定是否保存或分享</div></div></div><div class="share-layout"><div class="share-preview" id="sharePreview"><small>CARBONMATE · 我的低碳行动</small><b>${matureState.shareSettings.hideName ? '一位低碳行动者' : esc(matureState.profile.displayName)}</b><strong>${allReduction(records) > 0 ? `${allReduction(records).toFixed(2)} <i>kg CO₂</i>` : '持续记录中'}</strong><span>${allReduction(records) > 0 ? '碳排放估算' : '暂无碳排放估算'} · ${realRecords().length} 条行动记录</span><em>每个真实的小选择，都值得被记下</em></div><div class="share-controls"><label><input type="checkbox" id="hideShareName" ${matureState.shareSettings.hideName ? 'checked' : ''}> 隐藏昵称</label><p>卡片只包含你当前账本的汇总数字，不包含详细记录、照片或家庭成员信息。</p><button class="primary" id="shareShareCard">分享成果</button><button class="filter-button" id="downloadShareCard">下载 PNG 卡片</button><button class="quiet-button" id="copyShareText">复制分享文字</button></div></div></section>`;
    bindCapabilityEvents();
  }

  function bindCapabilityEvents() {
    const create = document.getElementById('createFamily');
    create?.addEventListener('click', () => {
      const backdrop = showDialog('创建家庭空间', '<p>为家庭账户取个名字。此预览数据保存在当前浏览器，不会同步到其他设备。</p><div class="dialog-field"><label for="familyNameInput">家庭名称</label><input id="familyNameInput" maxlength="30" value="我们的小家"></div>', '<button class="dialog-secondary" id="cancelFamilyCreate">取消</button><button class="dialog-primary" id="confirmFamilyCreate">创建</button>');
      backdrop.querySelector('#cancelFamilyCreate').addEventListener('click', closeDialog);
      backdrop.querySelector('#confirmFamilyCreate').addEventListener('click', () => {
        const name = backdrop.querySelector('#familyNameInput').value.trim();
        if (!name) return showToast('请填写家庭名称');
        const id = `member_${Date.now()}`;
        matureState.family = { name: name.slice(0, 30), members: [{ id, name: matureState.profile.displayName, role: 'owner' }], records: [] };
        closeDialog(); saveState(); renderCapabilities(); showToast('家庭空间已在本机创建');
      });
    });
    document.getElementById('addFamilyMember')?.addEventListener('click', () => {
      if (matureState.family.members.length >= 12) return showToast('演示空间最多添加 12 位成员');
      const backdrop = showDialog('添加家庭成员', '<p>仅用于本机演示家庭统计，不会给真实用户发送邀请。</p><div class="dialog-field"><label for="familyMemberNameInput">成员昵称</label><input id="familyMemberNameInput" maxlength="20" autocomplete="off"></div>', '<button class="dialog-secondary" id="cancelFamilyMember">取消</button><button class="dialog-primary" id="confirmFamilyMember">添加成员</button>');
      backdrop.querySelector('#cancelFamilyMember').addEventListener('click', closeDialog);
      backdrop.querySelector('#confirmFamilyMember').addEventListener('click', () => {
        const name = backdrop.querySelector('#familyMemberNameInput').value.trim();
        if (!name) return showToast('请填写成员昵称');
        matureState.family.members.push({ id: `member_${Date.now()}`, name: name.slice(0, 20), role: 'member' });
        closeDialog(); saveState(); renderCapabilities(); showToast('已添加本机演示成员');
      });
    });
    const kindSelect = document.getElementById('familyKindSelect');
    kindSelect?.addEventListener('change', () => { document.getElementById('familyUnit').textContent = kinds[kindSelect.value].unit; });
    document.getElementById('saveFamilyRecord')?.addEventListener('click', () => {
      const kind = kindSelect.value, value = Number(document.getElementById('familyValueInput').value);
      if (!(value > 0) || !Number.isFinite(value)) return showToast('请填写大于 0 的实际活动量');
      const reduction = kinds[kind].noEstimate ? 0 : Math.round(value * kinds[kind].factor * 1000) / 1000;
      const points = reduction > 0 ? Math.max(1, Math.floor(reduction * 10)) : 0;
      matureState.family.records.unshift({ id: `family_${Date.now()}`, kind, value, memberId: document.getElementById('familyMemberSelect').value, date: Date.now(), reduction, points });
      saveState(); renderCapabilities(); showToast('已计入家庭汇总；个人积分未变');
    });
    document.querySelectorAll('[data-record-kind]').forEach(button => button.addEventListener('click', () => {
      navigate('record');
      const behavior = document.getElementById('behavior');
      if (behavior && kinds[button.dataset.recordKind]) { behavior.value = button.dataset.recordKind; behavior.dispatchEvent(new Event('change', { bubbles: true })); }
    }));
    document.getElementById('hideShareName')?.addEventListener('change', event => { matureState.shareSettings.hideName = event.target.checked; saveState(); renderCapabilities(); });
    document.getElementById('downloadShareCard')?.addEventListener('click', async () => {
      try { const blob = await buildShareCardBlob(); downloadBlob(blob, 'CarbonMate-低碳行动卡.png'); showToast('分享卡片已下载'); }
      catch (_) { showToast('暂时无法生成分享卡片，请重试'); }
    });
    document.getElementById('shareShareCard')?.addEventListener('click', async () => {
      const estimate = allReduction(records);
      const summary = `我在 CarbonMate 记录了 ${realRecords().length} 条低碳行动，${estimate > 0 ? `碳排放估算 ${estimate.toFixed(2)} kg CO₂` : '目前暂无碳排放估算'}。每个真实的小选择，都值得被记下。`;
      try {
        const blob = await buildShareCardBlob();
        const file = new File([blob], 'CarbonMate-低碳行动卡.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) await navigator.share({ title: '我的低碳行动', text: summary, files: [file] });
        else if (navigator.share) await navigator.share({ title: '我的低碳行动', text: summary });
        else { downloadBlob(blob, 'CarbonMate-低碳行动卡.png'); showToast('当前浏览器不支持系统分享，已下载卡片供你手动分享'); }
      } catch (error) {
        if (error?.name === 'AbortError') return;
        showToast('暂时无法打开分享面板，请下载卡片后手动分享');
      }
    });
    document.getElementById('copyShareText')?.addEventListener('click', async () => {
      const estimate = allReduction(records);
      const text = `我在 CarbonMate 记录了 ${realRecords().length} 条低碳行动，${estimate > 0 ? `碳排放估算 ${estimate.toFixed(2)} kg CO₂` : '目前暂无碳排放估算'}。每个真实的小选择，都值得被记下。`;
      try { await navigator.clipboard.writeText(text); showToast('分享文字已复制'); } catch (_) { showToast('浏览器未开放剪贴板权限，请使用下载卡片分享'); }
    });
  }

  async function buildShareCardBlob() {
      const name = matureState.shareSettings.hideName ? '一位低碳行动者' : matureState.profile.displayName;
    const estimate = allReduction(records);
    const estimateLabel = estimate > 0 ? `${estimate.toFixed(2)} kg CO₂` : '持续记录中';
    const estimateCaption = estimate > 0 ? '碳排放估算' : '暂无碳排放估算';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520"><defs><linearGradient id="g"><stop stop-color="#214b35"/><stop offset="1" stop-color="#6f9470"/></linearGradient></defs><rect width="900" height="520" rx="34" fill="url(#g)"/><circle cx="790" cy="80" r="190" fill="#ffffff" opacity=".06"/><text x="62" y="78" fill="#d8e8d2" font-family="sans-serif" font-size="22">CARBONMATE · 我的低碳行动</text><text x="62" y="157" fill="#fff" font-family="sans-serif" font-size="34">${esc(name)}</text><text x="62" y="300" fill="#fff" font-family="sans-serif" font-size="70" font-weight="700">${estimateLabel}</text><text x="62" y="357" fill="#dce9d9" font-family="sans-serif" font-size="23">${estimateCaption} · ${realRecords().length} 条行动记录</text><path d="M62 414H838" stroke="#ffffff" opacity=".28"/><text x="62" y="465" fill="#e6efe2" font-family="sans-serif" font-size="22">每个真实的小选择，都值得被记下</text><text x="838" y="465" text-anchor="end" fill="#dce9d9" font-family="sans-serif" font-size="15">个人行动汇总 · 非认证减排证明</text></svg>`;
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      try {
        const image = new Image();
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url; });
        const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 520;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('canvas unavailable');
        context.drawImage(image, 0, 0);
        const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!png) throw new Error('PNG generation failed');
        return png;
      } finally { URL.revokeObjectURL(url); }
  }

  function getProfileAvatarSrc(profile = matureState.profile) {
    if (profile.avatarDataUrl) return profile.avatarDataUrl;
    return avatarPresetDataUri(profile.avatarPresetId);
  }

  function profileAvatarContents(profile = matureState.profile) {
    const src = getProfileAvatarSrc(profile);
    return src ? `<img src="${esc(src)}" alt="" draggable="false">` : `<span aria-hidden="true">${esc(profile.displayName.slice(0, 1) || '绿')}</span>`;
  }

  function renderSmallAvatar(element, profile = matureState.profile) {
    if (!element) return;
    element.innerHTML = profileAvatarContents(profile);
    element.classList.toggle('avatar-has-image', Boolean(getProfileAvatarSrc(profile)));
  }

  function openProfileAvatarDialog() {
    const profile = matureState.profile;
    let selectedPresetId = profile.avatarPresetId || '';
    let selectedDefault = !profile.avatarDataUrl && !selectedPresetId;
    let photoSource = profile.avatarDataUrl || '';
    let objectUrl = '';
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let drag = null;
    let uploadToken = 0;
    const presetChoices = AVATAR_PRESETS.map(preset => `<button type="button" class="avatar-preset-choice ${selectedPresetId === preset.id ? 'selected' : ''}" data-avatar-preset="${preset.id}" aria-pressed="${selectedPresetId === preset.id}"><img src="${esc(avatarPresetDataUri(preset.id))}" alt=""><span>${esc(preset.label)}</span></button>`).join('');
    const backdrop = showDialog('更换头像', `<div class="avatar-editor">
      <div class="avatar-editor-preview-wrap"><div class="avatar-crop-preview" id="avatarCropPreview" role="img" aria-label="头像裁剪预览"><span id="avatarCropMonogram" ${profile.avatarDataUrl || selectedPresetId ? 'hidden' : ''}>${esc(profile.displayName.slice(0, 1) || '绿')}</span><img id="avatarCropImage" alt="头像预览" draggable="false" ${profile.avatarDataUrl || selectedPresetId ? '' : 'hidden'}></div><small id="avatarPreviewHint">${profile.avatarDataUrl ? '拖动照片调整位置' : selectedPresetId ? '已选择插画头像' : '当前使用昵称首字头像'}</small></div>
      <div class="avatar-editor-controls"><button type="button" class="avatar-upload-button" id="triggerAvatarFile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h3l1.5-2h7l1.5 2h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z"/><circle cx="12" cy="13" r="3.5"/></svg>上传照片</button><input id="avatarPhotoInput" class="avatar-file-input" type="file" accept="image/jpeg,image/png,image/webp" tabindex="-1"><p>支持 JPG、PNG、WebP，最大 8 MB。</p><label class="avatar-zoom-control" id="avatarZoomControl" ${profile.avatarDataUrl ? '' : 'hidden'}><span>调整照片大小</span><input id="avatarZoom" type="range" min="1" max="3" step="0.05" value="1" aria-label="调整照片大小"><span class="avatar-zoom-value" id="avatarZoomValue">1.0×</span></label><small class="avatar-local-note">照片只保存在当前设备，不会上传。</small></div>
      <section class="avatar-preset-section"><div><b>或选一款插画头像</b><small>与碳伴的柔和配色相配</small></div><div class="avatar-preset-grid">${presetChoices}</div></section>
      <button type="button" class="avatar-reset-button ${selectedDefault ? 'selected' : ''}" id="avatarResetDefault">恢复昵称首字头像</button>
    </div>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">取消</button><button class="dialog-primary" id="saveProfileAvatar">保存头像</button>');
    const preview = backdrop.querySelector('#avatarCropPreview');
    const previewImage = backdrop.querySelector('#avatarCropImage');
    const monogram = backdrop.querySelector('#avatarCropMonogram');
    const previewHint = backdrop.querySelector('#avatarPreviewHint');
    const zoomInput = backdrop.querySelector('#avatarZoom');
    const zoomControl = backdrop.querySelector('#avatarZoomControl');
    const zoomValue = backdrop.querySelector('#avatarZoomValue');
    const fileInput = backdrop.querySelector('#avatarPhotoInput');
    backdrop.querySelector('#triggerAvatarFile').addEventListener('click', () => fileInput.click());
    const revokeObjectUrl = () => { if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = ''; } };
    backdrop.addEventListener('dialogclosed', () => { uploadToken += 1; revokeObjectUrl(); }, { once: true });
    const updatePreview = () => {
      const src = photoSource || avatarPresetDataUri(selectedPresetId);
      preview.classList.toggle('has-photo', Boolean(photoSource));
      previewImage.hidden = !src;
      monogram.hidden = Boolean(src);
      if (src && previewImage.src !== src) previewImage.src = src;
      if (src && !photoSource) previewImage.style.transform = 'none';
      if (photoSource) {
        const size = Math.min(preview.clientWidth || 220, preview.clientHeight || 220);
        const cover = previewImage.naturalWidth && previewImage.naturalHeight ? Math.max(size / previewImage.naturalWidth, size / previewImage.naturalHeight) : size / 220;
        const dx = panX * Math.max(0, previewImage.naturalWidth * cover * zoom - size) / 2;
        const dy = panY * Math.max(0, previewImage.naturalHeight * cover * zoom - size) / 2;
        previewImage.style.transform = `translate(${dx}px, ${dy}px) scale(${zoom})`;
      }
      zoomControl.hidden = !photoSource;
      zoomValue.textContent = `${zoom.toFixed(1)}×`;
      previewHint.textContent = photoSource ? '拖动照片调整位置' : selectedPresetId ? '已选择插画头像' : '当前使用昵称首字头像';
      backdrop.querySelectorAll('[data-avatar-preset]').forEach(button => {
        const chosen = button.dataset.avatarPreset === selectedPresetId;
        button.classList.toggle('selected', chosen);
        button.setAttribute('aria-pressed', String(chosen));
      });
      backdrop.querySelector('#avatarResetDefault').classList.toggle('selected', selectedDefault);
    };
    previewImage.addEventListener('load', updatePreview);
    if (photoSource) previewImage.src = photoSource;
    else if (selectedPresetId) previewImage.src = avatarPresetDataUri(selectedPresetId);
    updatePreview();
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { showToast('请选择 JPG、PNG 或 WebP 图片'); fileInput.value = ''; return; }
      if (file.size > 8 * 1024 * 1024) { showToast('图片不能超过 8 MB'); fileInput.value = ''; return; }
      const nextUrl = URL.createObjectURL(file);
      const token = ++uploadToken;
      const probe = new Image();
      probe.onload = () => {
        if (token !== uploadToken || !document.body.contains(backdrop)) { URL.revokeObjectURL(nextUrl); return; }
        if (probe.naturalWidth < 32 || probe.naturalHeight < 32) { URL.revokeObjectURL(nextUrl); showToast('图片尺寸太小，请换一张清晰图片'); return; }
        revokeObjectUrl(); objectUrl = nextUrl; photoSource = objectUrl; selectedPresetId = ''; selectedDefault = false; zoom = 1; panX = 0; panY = 0; zoomInput.value = '1'; updatePreview();
      };
      probe.onerror = () => { URL.revokeObjectURL(nextUrl); if (token === uploadToken && document.body.contains(backdrop)) showToast('无法读取这张图片，请换一种格式'); };
      probe.src = nextUrl;
      fileInput.value = '';
    });
    backdrop.querySelectorAll('[data-avatar-preset]').forEach(button => button.addEventListener('click', () => {
      uploadToken += 1; revokeObjectUrl(); photoSource = ''; selectedPresetId = button.dataset.avatarPreset; selectedDefault = false; zoom = 1; panX = 0; panY = 0; updatePreview();
    }));
    backdrop.querySelector('#avatarResetDefault').addEventListener('click', () => {
      uploadToken += 1; revokeObjectUrl(); photoSource = ''; selectedPresetId = ''; selectedDefault = true; zoom = 1; panX = 0; panY = 0; updatePreview();
    });
    zoomInput.addEventListener('input', () => { zoom = Number(zoomInput.value) || 1; updatePreview(); });
    preview.addEventListener('pointerdown', event => {
      if (!photoSource) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX, panY };
      preview.setPointerCapture(event.pointerId);
    });
    preview.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId || !previewImage.naturalWidth || !previewImage.naturalHeight) return;
      const size = Math.min(preview.clientWidth || 220, preview.clientHeight || 220);
      const cover = Math.max(size / previewImage.naturalWidth, size / previewImage.naturalHeight);
      const limitX = Math.max(0, previewImage.naturalWidth * cover * zoom - size) / 2;
      const limitY = Math.max(0, previewImage.naturalHeight * cover * zoom - size) / 2;
      panX = limitX ? Math.max(-1, Math.min(1, drag.panX + (event.clientX - drag.x) / limitX)) : 0;
      panY = limitY ? Math.max(-1, Math.min(1, drag.panY + (event.clientY - drag.y) / limitY)) : 0;
      updatePreview();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => preview.addEventListener(type, () => { drag = null; }));
    backdrop.querySelector('#saveProfileAvatar').addEventListener('click', () => {
      let avatarDataUrl = '';
      if (photoSource) {
        if (!previewImage.complete || !previewImage.naturalWidth) { showToast('照片还没准备好，请稍等再保存'); return; }
        try {
          const size = 256;
          const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('无法处理图片');
          const scale = Math.max(size / previewImage.naturalWidth, size / previewImage.naturalHeight) * zoom;
          const width = previewImage.naturalWidth * scale, height = previewImage.naturalHeight * scale;
          const x = (size - width) / 2 + panX * Math.max(0, width - size) / 2;
          const y = (size - height) / 2 + panY * Math.max(0, height - size) / 2;
          context.fillStyle = '#fff'; context.fillRect(0, 0, size, size); context.drawImage(previewImage, x, y, width, height);
          avatarDataUrl = canvas.toDataURL('image/jpeg', 0.84);
          if (avatarDataUrl.length > 350000) throw new Error('图片处理后仍然过大，请换一张照片');
        } catch (error) { showToast(error instanceof Error ? error.message : '图片处理失败，请重试'); return; }
      }
      const previousProfile = matureState.profile;
      matureState.profile = normalizeProfile({ ...previousProfile, avatarPresetId: photoSource || selectedDefault ? '' : selectedPresetId, avatarDataUrl });
      if (!saveState()) { matureState.profile = previousProfile; return; }
      closeDialog(); renderUserProfile(); renderProfileIdentity(); showToast('头像已更新，并保存在当前设备');
    });
  }

  function renderUserProfile() {
    const target = document.getElementById('profileContent');
    if (!target) return;
    const profile = matureState.profile;
    const progress = matureState.learningProgress;
    const totalReduction = allReduction(records);
    const activeDays = new Set(realRecords().map(row => dayKey(row.date))).size;
    const unlockedBadges = badgeRules.filter(badge => !badge.legacyOnly && matureState.earnedBadges.some(item => item.id === badge.id));
    const latestBadgeId = [...matureState.earnedBadges].sort((a, b) => b.earnedAt - a.earnedAt)[0]?.id;
    const latestBadge = badgeRules.find(badge => badge.id === latestBadgeId);
    const featuredBadge = badgeRules.find(badge => badge.id === profile.featuredBadgeId && matureState.earnedBadges.some(item => item.id === badge.id));
    if (profileView === 'settings') {
      target.innerHTML = `<div class="profile-settings-head"><button class="quiet-button" id="profileSettingsBack">← 返回个人中心</button><div><span class="eyebrow">PREFERENCES & DATA</span><h2>个人设置</h2><p>把显示偏好、行动目标、核算口径和数据管理集中在这里。</p></div></div>
        <div class="settings-grid"><section class="panel"><div class="panel-head"><div><div class="panel-title">显示与目标</div><div class="panel-note">仅影响当前浏览器中的体验</div></div></div><div class="profile-setting-row"><div><b>每周估算参考目标</b><span>当前 ${Number(matureState.settings.weeklyGoalKg || 3).toFixed(1)} kg CO₂ · 只跟踪碳排放估算</span></div><button class="filter-button" id="profileEditGoal">调整目标</button></div><div class="profile-setting-row"><div><b>大字显示</b><span>改善文字可读性</span></div><button class="filter-button" id="largeTextToggle" aria-pressed="${matureState.largeText}">${matureState.largeText ? '已开启 · 关闭' : '未开启 · 开启'}</button></div></section>
        <section class="panel"><div class="panel-head"><div><div class="panel-title">碳核算口径</div><div class="panel-note">没有计量与适用因子时，只记录行动，不填造碳量</div></div><span class="privacy-status">来源可追溯</span></div><div class="methodology-list"><div><b>当前估算</b><span>仅设备明确提供的节电量可按中国 2023 年全国平均电力因子估算；生活行动不自动折算。</span></div><div><b>历史数据</b><span>旧版 DEMO_V1 数字仍可查看，但不进入首页、趋势、分类汇总或导出估算列。</span></div><div><b>产品口径</b><span>估算不是个人完整碳足迹，也不等同于经第三方核证的减排量。</span></div></div><button class="filter-button" id="factorSettingsLink">查看因子来源与适用范围</button></section>
        <section class="panel"><div class="panel-head"><div><div class="panel-title">本地数据与隐私</div><div class="panel-note">无需账号 · 当前不会自动上传</div></div><span class="privacy-status">◉ 本机保存</span></div><div class="profile-data-copy">记录、头像、昵称、目标和学习进度保存在当前浏览器。使用同一设备和地址关闭后重新打开仍可读取；清除浏览器站点数据或更换设备前，请先导出备份。</div><div class="profile-data-actions"><button class="filter-button" id="profileExport">↓ 导出完整备份</button><label class="filter-button profile-import">↑ 从备份恢复<input type="file" accept=".json,application/json" id="profileImport" hidden></label><button class="filter-button" data-page="ledger">打开低碳记录 →</button></div><small class="profile-data-note">当前没有账号登录或云同步。旧版演示估算不会混入当前统计。</small></section></div>`;
      document.getElementById('profileSettingsBack').addEventListener('click', () => { profileView = 'overview'; renderUserProfile(); });
      document.getElementById('profileEditGoal').addEventListener('click', editWeeklyGoal);
      document.getElementById('largeTextToggle').addEventListener('click', toggleLargeText);
      document.getElementById('profileExport').addEventListener('click', downloadBackup);
      document.getElementById('profileImport').addEventListener('change', handleImportFile);
      document.getElementById('factorSettingsLink').addEventListener('click', openFactorDialog);
    } else {
      const activeTheme = rewards.find(reward => reward.id === getActiveRewardId('background'))?.theme || '';
      target.innerHTML = `<div class="profile-hero profile-hero-clean ${matureState.redemptions.some(item => item.rewardId === 'profile-frame') ? 'profile-frame-unlocked' : ''} ${activeTheme ? `profile-theme-${activeTheme}` : ''}"><button type="button" class="profile-avatar-large" id="editProfileAvatar" aria-label="更换头像" title="更换头像">${profileAvatarContents(profile)}<span class="profile-avatar-edit-indicator" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7.5h3l1.5-2h7l1.5 2h3A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V9A1.5 1.5 0 0 1 5 7.5Z"/><circle cx="12" cy="13" r="3.5"/></svg></span></button><div class="profile-hero-main"><h2>${esc(profile.displayName)}</h2>${profile.customTitle ? `<span class="profile-title-unlocked">${esc(profile.customTitle)}</span>` : ''}<span class="profile-level-chip"><b>${esc(learningLevels[Math.min(progress.unlockedLevel, learningLevels.length) - 1].name)}</b></span></div><button class="profile-edit-name" id="editProfileName">编辑资料</button></div>
        <div class="profile-stat-grid"><article class="profile-stat"><span>行动记录天数</span><b>${activeDays} <small>天</small></b></article><article class="profile-stat"><span>碳排放估算</span><b>${totalReduction > 0 ? `${totalReduction.toFixed(2)} <small>kg CO₂</small>` : '暂无'}</b></article><article class="profile-stat"><span>已获徽章</span><b>${unlockedBadges.length} <small>枚</small></b></article></div>
        <section class="profile-badge-showcase"><div><span>我的展示徽章</span><small>从已获得的徽章中挑一枚展示</small></div>${featuredBadge ? `<button class="profile-featured-badge" data-badge-id="${featuredBadge.id}">${renderBadgeArtwork(featuredBadge)}<span><b>${esc(featuredBadge.name)}</b><small>${esc(featuredBadge.rule)}</small></span><i>查看详情 ›</i></button>` : `<button class="profile-featured-empty" data-mission-view="badges">${latestBadge ? `最近获得：${esc(latestBadge.name)} · 去设置展示 ›` : '完成行动解锁第一枚徽章 ›'}</button>`}</section>
        <div class="profile-shortcuts"><button class="profile-shortcut" data-page="ledger"><span class="profile-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3.8h7l4 4V20H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"/><path d="M14 4v4h4M9 12h6M9 16h6"/></svg></span><span><b>我的记录</b><small>查看和筛选低碳行动</small></span><i>›</i></button><button class="profile-shortcut" data-mission-view="badges"><span class="profile-shortcut-icon badge-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg></span><span><b>我的徽章</b><small>${unlockedBadges.length ? `已收集 ${unlockedBadges.length} / ${badgeRules.filter(rule => !rule.legacyOnly).length} 枚` : '完成行动，收下第一枚勋章'}</small></span><i>›</i></button><button class="profile-shortcut" data-page="learn"><span class="profile-shortcut-icon learning-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.5 5.5c3.3-1.1 6.2-.6 8.5 1.4v13c-2.3-2-5.2-2.5-8.5-1.4v-13ZM20.5 5.5c-3.3-1.1-6.2-.6-8.5 1.4v13c2.3-2 5.2-2.5 8.5-1.4v-13Z"/></svg></span><span><b>学习进度</b><small>${progress.completedLevels.length} / ${learningLevels.length} 个专题已完成</small></span><i>›</i></button><button class="profile-shortcut" data-page="points"><span class="profile-shortcut-icon points-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 19.5h16M6.5 16V11M12 16V6.5M17.5 16v-7"/><circle cx="6.5" cy="8" r="1.3"/><circle cx="17.5" cy="5.5" r="1.3"/></svg></span><span><b>积分明细</b><small>查询积分获得与兑换记录</small></span><i>›</i></button><button class="profile-shortcut" id="openCapabilities"><span class="profile-shortcut-icon capability-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.4"/><circle cx="6" cy="17.5" r="2.4"/><circle cx="18" cy="17.5" r="2.4"/><path d="m10.8 8.2-3.5 7.1M13.2 8.2l3.5 7.1M8.4 17.5h7.2"/></svg></span><span><b>家庭与智能服务</b><small>家庭账户、拍照记录与成果分享</small></span><i>›</i></button><button class="profile-shortcut" id="openProfileSettings"><span class="profile-shortcut-icon settings-shortcut-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg></span><span><b>设置</b><small>显示、目标、数据和核算口径</small></span><i>›</i></button></div>`;
      document.getElementById('editProfileAvatar').addEventListener('click', openProfileAvatarDialog);
      document.getElementById('editProfileName').addEventListener('click', () => {
        const backdrop = showDialog('编辑昵称', `<div class="dialog-field"><label for="profileNameInput">显示昵称</label><input id="profileNameInput" maxlength="20" value="${esc(profile.displayName)}" autocomplete="nickname"></div>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">取消</button><button class="dialog-primary" id="saveProfileName">保存</button>');
        backdrop.querySelector('#saveProfileName').addEventListener('click', () => {
          const input = backdrop.querySelector('#profileNameInput');
          matureState.profile.displayName = input.value.trim().slice(0, 20) || '绿色生活家';
          closeDialog(); saveState(); renderUserProfile(); renderProfileIdentity(); showToast('昵称已保存');
        });
      });
      document.getElementById('openProfileSettings').addEventListener('click', () => { profileView = 'settings'; renderUserProfile(); });
      document.getElementById('openCapabilities').addEventListener('click', () => { capabilityReturnPage = 'profile'; navigate('capabilities'); });
      target.querySelectorAll('[data-mission-view]').forEach(button => button.addEventListener('click', () => { missionView = button.dataset.missionView; navigate('missions'); renderMissions(); }));
      target.querySelectorAll('[data-badge-id]').forEach(button => button.addEventListener('click', () => showBadgeDetail(button.dataset.badgeId)));
    }
    target.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
  }

  function renderProfileIdentity() {
    const name = matureState.profile.displayName;
    ['topProfileName', 'sideProfileName'].forEach(id => { const element = document.getElementById(id); if (element) element.textContent = name; });
    ['topAvatar', 'sideAvatar'].forEach(id => renderSmallAvatar(document.getElementById(id)));
    const greeting = document.getElementById('homeGreeting');
    const hour = new Date().getHours();
    const salutation = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
    if (greeting) greeting.textContent = `${salutation}，${name} 🌿`;
  }

  function updateFilters() {
    activeFilter = {
      year: '',
      month: '',
      kind: document.getElementById('filterKind').value,
      start: document.getElementById('filterStart').value,
      end: document.getElementById('filterEnd').value,
      keyword: document.getElementById('filterKeyword').value.trim().toLocaleLowerCase()
    };
    renderAll();
  }

  function resetFilters() {
    ['filterKind', 'filterStart', 'filterEnd', 'filterKeyword'].forEach(id => { document.getElementById(id).value = ''; });
    activeFilter = { year: '', month: '', start: '', end: '', kind: '', keyword: '' };
    renderAll();
  }

  function homeRangeBounds(range, chosenDate = matureState.settings.homeAnchor) {
    const now = new Date();
    const chosen = /^\d{4}-\d{2}-\d{2}$/.test(chosenDate || '') ? new Date(`${chosenDate}T12:00:00`) : now;
    const anchor = Number.isFinite(chosen.getTime()) && chosen <= now ? chosen : now;
    const anchorDay = new Date(anchor); anchorDay.setHours(0, 0, 0, 0);
    let start = anchorDay.getTime();
    let end = Math.min(now.getTime(), new Date(anchorDay.getFullYear(), anchorDay.getMonth(), anchorDay.getDate() + 1).getTime() - 1);
    let previousStart = null;
    let previousEnd = null;
    if (range === 'day') {
      start = new Date(anchorDay.getFullYear(), anchorDay.getMonth(), anchorDay.getDate() - 6).getTime();
      end = Math.min(now.getTime(), new Date(anchorDay.getFullYear(), anchorDay.getMonth(), anchorDay.getDate() + 1).getTime() - 1);
    } else if (range === 'week') {
      const daysSinceMonday = (anchorDay.getDay() + 6) % 7;
      start = new Date(anchorDay.getFullYear(), anchorDay.getMonth(), anchorDay.getDate() - daysSinceMonday).getTime();
      const nextMonday = new Date(start);
      nextMonday.setDate(nextMonday.getDate() + 7);
      end = Math.min(now.getTime(), nextMonday.getTime() - 1);
    } else if (range === 'custom') {
      const chosenStart = matureState.settings.homeStart;
      const chosenEnd = matureState.settings.homeEnd;
      if (chosenStart && /^\d{4}-\d{2}-\d{2}$/.test(chosenStart)) start = new Date(`${chosenStart}T00:00:00`).getTime();
      if (chosenEnd && /^\d{4}-\d{2}-\d{2}$/.test(chosenEnd)) {
        const inclusiveEnd = new Date(`${chosenEnd}T23:59:59.999`).getTime();
        if (Number.isFinite(inclusiveEnd)) end = Math.min(inclusiveEnd, now.getTime());
      }
    } else if (range === 'month') {
      start = new Date(anchorDay.getFullYear(), anchorDay.getMonth(), 1).getTime();
      end = Math.min(now.getTime(), new Date(anchorDay.getFullYear(), anchorDay.getMonth() + 1, 1).getTime() - 1);
    } else if (range === 'year') {
      start = new Date(anchorDay.getFullYear(), 0, 1).getTime();
      end = Math.min(now.getTime(), new Date(anchorDay.getFullYear() + 1, 0, 1).getTime() - 1);
    }
    if (Number.isFinite(start) && Number.isFinite(end) && start <= end) {
      const fromDay = new Date(start); fromDay.setHours(0, 0, 0, 0);
      const toDay = new Date(end); toDay.setHours(0, 0, 0, 0);
      const elapsedDays = Math.max(1, Math.round((toDay - fromDay) / 86400000) + 1);
      if (range === 'day' || range === 'week') { previousStart = new Date(fromDay); previousStart.setDate(previousStart.getDate() - 7); }
      else if (range === 'month') previousStart = new Date(fromDay.getFullYear(), fromDay.getMonth() - 1, 1);
      else if (range === 'year') previousStart = new Date(fromDay.getFullYear() - 1, 0, 1);
      else { previousStart = new Date(fromDay); previousStart.setDate(previousStart.getDate() - elapsedDays); }
      const previousLimit = range === 'day' ? new Date(fromDay.getTime() - 1) : range === 'month' ? new Date(fromDay.getFullYear(), fromDay.getMonth(), 1, 0, 0, 0, -1) : range === 'year' ? new Date(fromDay.getFullYear(), 0, 1, 0, 0, 0, -1) : new Date(fromDay.getTime() - 1);
      previousEnd = new Date(previousStart); previousEnd.setDate(previousEnd.getDate() + elapsedDays); previousEnd.setMilliseconds(-1);
      previousEnd = Math.min(previousEnd.getTime(), previousLimit.getTime());
      previousStart = previousStart.getTime();
    }
    return { start, end, previousStart, previousEnd };
  }

  function homeRangeRows(range, chosenDate) {
    const bounds = homeRangeBounds(range, chosenDate);
    const userRecords = realRecords();
    const current = userRecords.filter(row => row.date >= bounds.start && row.date <= bounds.end);
    const previous = bounds.previousStart === null ? [] : userRecords.filter(row => row.date >= bounds.previousStart && row.date <= bounds.previousEnd);
    return { ...bounds, current, previous };
  }

  function svgTrend(rows, range) {
    const bounds = homeRangeBounds(range);
    const buckets = [];
    const dayStart = new Date(bounds.start); dayStart.setHours(0, 0, 0, 0);
    const addBucket = (label, start, end) => buckets.push({ label, start, end, rows: rows.filter(row => row.date >= start && row.date <= end) });
    if (range === 'year') {
      const selectedYear = new Date(bounds.end).getFullYear();
      const firstYear = selectedYear - 4;
      for (let year = firstYear; year <= selectedYear; year++) {
        addBucket(`${year}年`, new Date(year, 0, 1).getTime(), new Date(year + 1, 0, 1).getTime() - 1);
      }
    } else if (range === 'month') {
      const selectedYear = new Date(bounds.end).getFullYear();
      for (let month = 0; month < 12; month++) {
        addBucket(`${month + 1}月`, new Date(selectedYear, month, 1).getTime(), new Date(selectedYear, month + 1, 1).getTime() - 1);
      }
    } else if (range === 'custom' && bounds.end - bounds.start > 180 * 86400000) {
      const first = new Date(dayStart.getFullYear(), dayStart.getMonth(), 1);
      for (let date = new Date(first); date <= bounds.end; date.setMonth(date.getMonth() + 1)) addBucket(`${date.getFullYear()}年${date.getMonth() + 1}月`, date.getTime(), new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1);
    } else if (range === 'custom' && bounds.end - bounds.start > 45 * 86400000) {
      const first = new Date(dayStart);
      for (let date = new Date(first); date <= bounds.end; date.setDate(date.getDate() + 1)) addBucket(`${date.getMonth() + 1}/${date.getDate()}`, date.getTime(), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime() - 1);
    } else {
      const first = new Date(dayStart);
      const limit = range === 'day' ? 7 : Math.max(1, Math.floor((bounds.end - bounds.start) / 86400000) + 1);
      for (let index = 0; index < limit; index++) {
        const date = new Date(first); date.setDate(date.getDate() + index);
        addBucket(`${date.getMonth() + 1}/${date.getDate()}`, date.getTime(), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime() - 1);
      }
    }
    const amounts = buckets.map(bucket => allReduction(bucket.rows));
    const max = Math.max(0.1, ...amounts);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    document.querySelector('#analysisDetails .impact-chart-panel .panel-title').textContent = range === 'day' ? '近 7 天碳量趋势' : range === 'month' ? `${new Date(bounds.end).getFullYear()} 年月度趋势` : '近 5 年碳量趋势';
    document.getElementById('homeChartScale').textContent = '柱状图 · kg CO₂';
    document.getElementById('homeChartLegend').textContent = '碳排放估算';
    document.getElementById('homeChartHint').textContent = '点选柱子查看该时段记录';
    document.getElementById('homeChartFootnote').textContent = total > 0 ? `本期合计 ${total.toFixed(2)} kg CO₂ · 仅纳入来源与因子版本可追溯的计量记录` : '本期暂无碳排放量；日期轴保留，行动与积分记录不受影响';
    document.getElementById('homeChart').innerHTML = `<div class="analysis-chart-selection" id="analysisChartSelection">点选柱子，查看该时段的碳排放估算和行动记录</div><div class="analysis-bars">${buckets.map((bucket, index) => `<button type="button" class="analysis-bar ${bucket.start > Date.now() ? 'future' : ''}" data-bucket="${index}" ${bucket.start > Date.now() ? 'disabled' : ''} aria-label="${esc(bucket.label)}，碳排放估算 ${amounts[index].toFixed(3)} 千克二氧化碳，${bucket.rows.length} 条记录"><span class="analysis-bar-value">${amounts[index] ? amounts[index].toFixed(2) : ''}</span><span class="analysis-bar-track"><i style="height:${amounts[index] ? Math.max(5, amounts[index] / max * 100) : 0}%"></i></span><span class="analysis-bar-label">${esc(bucket.label)}</span></button>`).join('')}</div>`;
    document.querySelectorAll('#homeChart [data-bucket]').forEach(button => button.addEventListener('click', () => {
      const bucket = buckets[Number(button.dataset.bucket)];
      const bucketReduction = allReduction(bucket.rows);
      document.getElementById('analysisChartSelection').textContent = `${bucket.label} · ${bucketReduction > 0 ? `${bucketReduction.toFixed(2)} kg CO₂` : '暂无估算'} · ${bucket.rows.length} 条行动${range === 'day' && bucket.rows.length ? `（${bucket.rows.map(row => kinds[row.kind].name).join('、')}）` : ''}`;
      document.querySelectorAll('#homeChart .analysis-bar').forEach(item => item.classList.toggle('selected', item === button));
      activeFilter = { year: '', month: '', kind: '', start: dayKey(bucket.start), end: dayKey(Math.min(bucket.end, Date.now())) };
      document.getElementById('filterKind').value = '';
      document.getElementById('filterKeyword').value = '';
      document.getElementById('filterStart').value = activeFilter.start;
      document.getElementById('filterEnd').value = activeFilter.end;
      renderHistory(getFilteredRecords());
    }));
  }

  function renderCategories(rows) {
    const totals = new Map();
    const counts = new Map();
    const estimatedRows = rows.filter(CarbonMateRecordData.isEstimated);
    estimatedRows.forEach(row => { totals.set(row.kind, (totals.get(row.kind) || 0) + Number(row.reduction)); counts.set(row.kind, (counts.get(row.kind) || 0) + 1); });
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const max = Math.max(0.01, ...sorted.map(item => item[1]));
    const total = allReduction(rows);
    const container = document.querySelector('#analysisDetails .category');
    const chartColors = ['#39865d', '#65a97b', '#8fc59a', '#b4d9ae', '#2f7664', '#76b7a0', '#a7d2c0', '#537f67'];
    const kindOrder = Object.keys(kinds);
    const segments = sorted.map(([kindId, value], index) => ({ kindId, value, share: total ? value / total * 100 : 0, color: chartColors[Math.max(0, kindOrder.indexOf(String(kindId))) % chartColors.length] }));
    let angle = 0;
    const conicStops = segments.map(segment => {
      const startAngle = angle;
      const nextAngle = angle + (total ? segment.value / total * 360 : 0);
      const stop = `${segment.color} ${angle.toFixed(2)}deg ${nextAngle.toFixed(2)}deg`;
      segment.midAngle = (startAngle + nextAngle) / 2;
      angle = nextAngle;
      return stop;
    });
    const donutLabels = segments.map(segment => {
      const radians = (segment.midAngle - 90) * Math.PI / 180;
      const x = 50 + Math.cos(radians) * 36;
      const y = 50 + Math.sin(radians) * 36;
      return `<span class="analysis-donut-percent" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%" aria-hidden="true">${Math.round(segment.share)}%</span>`;
    }).join('');
    const donutMarkup = `<div class="analysis-donut-wrap"><div class="analysis-donut" role="img" aria-label="碳排放估算构成圆环图，${segments.map(segment => `${esc(kinds[segment.kindId].name)} ${Math.round(segment.share)}%`).join('，')}" style="background:conic-gradient(${conicStops.length ? conicStops.join(',') : '#e8eee8 0deg 360deg'})"><div class="analysis-donut-center"><strong>${total.toFixed(2)}</strong><span>kg CO₂</span></div>${donutLabels}</div><div class="analysis-donut-legend">${segments.map(segment => `<span><i style="background:${segment.color}"></i>${esc(kinds[segment.kindId].name)} ${Math.round(segment.share)}%</span>`).join('') || '<span>暂无估算</span>'}</div></div>`;
    container.innerHTML = donutMarkup + (sorted.length ? sorted.map(([kindId, value]) => {
      const kind = kinds[kindId];
      const share = total ? Math.round(value / total * 100) : 0;
      return `<div class="cat-row"><div class="cat-emoji">${lineIcon(kindId)}</div><div><div class="cat-name">${esc(kind.name)} <small>${counts.get(kindId)} 次 · ${share}%</small></div><div class="bar"><i style="width:${Math.max(3, value / max * 100)}%"></i></div></div><div class="cat-value">${value.toFixed(2)}<small>kg CO₂</small></div></div>`;
    }).join('') : `<p class="panel-note">${rows.length ? `本期有 ${rows.length} 条行动记录，但暂无碳排放估算。记录和积分会保留，暂不绘制虚假的构成比例。` : '当前筛选范围没有记录。'}</p>`);
    const categoryChartTitle = container.parentElement?.querySelector('.category-panel-title');
    if (categoryChartTitle) categoryChartTitle.textContent = `碳排放估算构成 · ${sorted.length} 类`;
    const insight = document.getElementById('categoryInsight');
    if (insight) insight.textContent = sorted.length ? `贡献最高：${kinds[sorted[0][0]].name}，占本期碳排放估算值 ${total ? Math.round(sorted[0][1] / total * 100) : 0}%。` : rows.length ? '行动记录照常保存；只有适用因子与计量依据齐全时才展示碳量。' : '当前时段没有行动记录；添加一条后，这里会显示行动构成。';
  }

  function renderRecent(rows) {
    document.getElementById('recentRecords').innerHTML = [...rows].sort((a, b) => b.date - a.date).slice(0, 2).map(row => {
      const kind = kinds[row.kind];
      const detail = [row.actionDetail, row.itemCategory, row.destination, row.note, isLegacyPowerRow(row) ? '旧版电量记录' : ''].filter(Boolean).join(' · ') || '未添加备注';
      const name = isLegacyPowerRow(row) ? '节约用电（旧记录）' : kind.name;
      const demoTag = row.demoSeed ? '<span class="demo-record-tag">演示样例</span>' : '';
      const verified = CarbonMateRecordData.isEstimated(row);
      const legacyEstimate = Number(row.reduction || 0) > 0 && !verified;
      return `<div class="record"><div class="record-icon">${lineIcon(row.kind)}</div><div class="record-main"><div class="record-name">${esc(name)} ${demoTag}</div><div class="record-meta">${esc(detail)} · ${fmtDate(row.date)}</div></div><div class="record-result">${verified ? `≈ ${Number(row.reduction).toFixed(2)} kg` : legacyEstimate ? '旧版估算' : '已记录'}<small>${verified ? '来源因子估算 · kg CO₂' : legacyEstimate ? '不计入汇总' : '未估算'}</small></div></div>`;
    }).join('') || '<p class="panel-note">还没有记录。完成一项行动后，这里会显示你的真实记录。</p>';
  }

  function renderHistory(rows) {
    const body = document.getElementById('allRecords');
    const estimateHeading = body.closest('table')?.querySelector('thead th:nth-child(4)');
    if (estimateHeading) estimateHeading.textContent = '碳排放估算';
    body.innerHTML = rows.map(row => {
      const kind = kinds[row.kind];
      const unquantified = row.unquantified === true;
      const detail = [row.demoSeed ? '演示样例 · 非真实记录' : '', row.actionDetail, row.itemCategory, row.destination, row.note, isLegacyPowerRow(row) ? '旧版估算，仅供回看' : ''].filter(Boolean).join(' · ');
      const name = isLegacyPowerRow(row) ? '节约用电（旧记录）' : kind.name;
      const unit = isLegacyPowerRow(row) ? '千瓦时' : kind.unit;
      const verified = CarbonMateRecordData.isEstimated(row);
      const legacyEstimate = Number(row.reduction || 0) > 0 && !verified;
      return `<tr><td><span class="history-kind">${lineIcon(row.kind)} ${esc(name)}</span><small class="table-note">${esc(detail)}</small></td><td>${unquantified ? '仅记录行为' : `${Number(row.value)} ${esc(unit)}`}</td><td>${fmtDate(row.date)}<small class="table-note">${new Date(row.date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</small></td><td style="color:#276b4c">${verified ? `≈ ${Number(row.reduction).toFixed(2)} kg CO₂` : legacyEstimate ? '旧版演示值 · 不计汇总' : '仅记录 · 未估算'}</td><td>${Number(row.points || 0) ? `+${Number(row.points)}` : '—'}</td><td><button class="mini-action" onclick="editRecord('${encodeURIComponent(row.id)}')">编辑</button><button class="mini-action danger-action" onclick="deleteRecord('${encodeURIComponent(row.id)}')">删除</button></td></tr>`;
    }).join('') || `<tr><td colspan="6" class="empty-table">${activeFilter.start && activeFilter.end && activeFilter.start > activeFilter.end ? '开始日期不能晚于结束日期。' : '这个筛选范围内没有记录。'}</td></tr>`;
    const summary = document.getElementById('filterSummary');
    const points = rows.reduce((sum, row) => sum + row.points, 0);
    const keyword = activeFilter.keyword ? ` · 关键词“${esc(activeFilter.keyword)}”` : '';
    summary.innerHTML = `<span>当前范围：<b>${esc(currentRangeLabel())}</b>${keyword}</span><span>找到 <b>${rows.length}</b> 条记录</span>`;
  }

  function renderHomeDashboard() {
    const { start, end, current, previous } = homeRangeRows(activeHomeRange);
    const reduction = allReduction(current);
    const previousReduction = allReduction(previous);
    const rangeLabels = { day: '日', month: '月', year: '年', custom: '自选范围' };
    const periodName = rangeLabels[activeHomeRange] || '日';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateLabel = `${startDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}—${endDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}`;
    const analysisDateRange = document.getElementById('analysisDateRange');
    if (analysisDateRange) {
      if (activeHomeRange === 'day') analysisDateRange.textContent = `${startDate.getMonth() + 1}月${startDate.getDate()}日—${endDate.getMonth() + 1}月${endDate.getDate()}日`;
      else if (activeHomeRange === 'month') analysisDateRange.textContent = `${endDate.getFullYear()}年${endDate.getMonth() + 1}月`;
      else if (activeHomeRange === 'year') analysisDateRange.textContent = `${endDate.getFullYear()}年`;
      else analysisDateRange.textContent = dateLabel;
    }
    const nextDateButton = document.getElementById('analysisNextDate');
    if (nextDateButton) nextDateButton.disabled = activeHomeRange !== 'day' && end >= new Date(new Date().setHours(23, 59, 59, 999)).getTime();
    document.querySelectorAll('[data-home-range]').forEach(button => button.classList.toggle('active', button.dataset.homeRange === activeHomeRange));
    const anchorInput = document.getElementById('homeAnchorDate');
    if (anchorInput) { anchorInput.max = dayKey(Date.now()); anchorInput.value = matureState.settings.homeAnchor || dayKey(Date.now()); }
    const [periodStart, periodEnd] = [document.getElementById('homeStartDate'), document.getElementById('homeEndDate')];
    if (periodStart) periodStart.value = activeHomeRange === 'custom' ? matureState.settings.homeStart || '' : '';
    if (periodEnd) periodEnd.value = activeHomeRange === 'custom' ? matureState.settings.homeEnd || '' : '';
    const activeDays = new Set(current.map(row => dayKey(row.date))).size;
    const calendarDays = Math.max(1, Math.floor((end - start) / 86400000) + 1);
    let comparisonText = '';
    if (!current.length && !previous.length) comparisonText = '当前周期暂无记录';
    else if (!current.length) comparisonText = previous.length ? '本期暂无行动 · 上期有记录' : '当前周期暂无记录';
    else if (!previousReduction) comparisonText = reduction > 0 ? `上期无可比估算 · 本期新增 ${reduction.toFixed(2)} kg CO₂` : '本期尚无碳排放估算';
    else {
      const difference = reduction - previousReduction;
      comparisonText = `比上个同长度周期${difference >= 0 ? '多' : '少'} ${Math.abs(difference).toFixed(2)} kg CO₂`;
    }
    const analysisTotal = document.getElementById('analysisTotal');
    if (analysisTotal) analysisTotal.innerHTML = reduction > 0 ? `${reduction.toFixed(2)} <small>kg CO₂</small>` : '暂无估算';
    const analysisDailyAverage = document.getElementById('analysisDailyAverage');
    if (analysisDailyAverage) analysisDailyAverage.textContent = reduction > 0 ? `${(reduction / calendarDays).toFixed(2)} kg/天` : '暂无估算';
    const analysisActiveDays = document.getElementById('analysisActiveDays');
    if (analysisActiveDays) analysisActiveDays.textContent = `${activeDays}天`;
    const analysisComparisonRate = document.getElementById('analysisComparisonRate');
    if (analysisComparisonRate) {
      if (previousReduction > 0) analysisComparisonRate.textContent = `${reduction >= previousReduction ? '+' : ''}${((reduction - previousReduction) / previousReduction * 100).toFixed(0)}%`;
      else analysisComparisonRate.textContent = reduction > 0 ? '新增' : '—';
      analysisComparisonRate.classList.toggle('negative', previousReduction > 0 && reduction < previousReduction);
    }
    const insight = document.getElementById('categoryInsight');
    if (insight) insight.hidden = true;
    const categoryTitle = document.querySelector('#analysisDetails .category-panel-title');
    if (categoryTitle) categoryTitle.textContent = `碳排放估算构成 · ${new Set(current.filter(CarbonMateRecordData.isEstimated).map(row => row.kind)).size} 类`;
    svgTrend(activeHomeRange === 'day' || activeHomeRange === 'custom' ? current : realRecords(), activeHomeRange);
    renderCategories(current);
    if (document.body.dataset.activePage === 'analysis') return;
    renderHomeOverview();
  }

  function renderHomeOverview() {
    const now = new Date();
    const { start, current, previous } = homeRangeRows('week', dayKey(now.getTime()));
    const reduction = allReduction(current);
    const previousReduction = allReduction(previous);
    const difference = reduction - previousReduction;
    const activeDays = new Set(current.map(row => dayKey(row.date))).size;
    const monday = new Date(start);
    const sunday = new Date(start); sunday.setDate(sunday.getDate() + 6);
    const shortDate = date => `${date.getMonth() + 1}月${date.getDate()}日`;
    const today = todayRecords();
    const todayReduction = allReduction(today);
    const totalReduction = allReduction(records);
    const demoNotice = document.getElementById('homeDemoNotice');
    if (demoNotice) demoNotice.hidden = false;
    const activeDateKeys = new Set(realRecords().map(row => dayKey(row.date)));
    const checkinDays = activeDateKeys.size;
    const streakCursor = new Date(now); streakCursor.setHours(0, 0, 0, 0);
    if (!activeDateKeys.has(dayKey(streakCursor.getTime()))) streakCursor.setDate(streakCursor.getDate() - 1);
    let streak = 0;
    while (activeDateKeys.has(dayKey(streakCursor.getTime())) && streak < 3660) { streak += 1; streakCursor.setDate(streakCursor.getDate() - 1); }
    const todayEstimateCount = today.filter(CarbonMateRecordData.isEstimated).length;
    const lifetimeEstimateCount = realRecords().filter(CarbonMateRecordData.isEstimated).length;
    document.getElementById('homeTodayReduction').innerHTML = todayEstimateCount ? `${todayReduction.toFixed(2)} <small>kg CO₂</small>` : '暂无估算';
    document.getElementById('homeTodayActionCount').textContent = `${today.length} 次行动`;
    document.getElementById('homeLifetimeReduction').innerHTML = lifetimeEstimateCount ? `${totalReduction.toFixed(2)} <small>kg CO₂</small>` : '暂无估算';
    document.getElementById('homeCheckinDays').textContent = checkinDays;
    document.getElementById('homeStreakNote').textContent = `连续行动 ${streak} 天`;
    const growthStages = [
      { stage: 'seed', title: '从第一步开始' },
      { stage: 'sprout', title: '小树正在生长' },
      { stage: 'leaf', title: '新叶渐渐长出' },
      { stage: 'canopy', title: '本周坚持得很棒' }
    ];
    const growthStage = activeDays === 0 ? growthStages[0] : activeDays < 3 ? growthStages[1] : activeDays < 6 ? growthStages[2] : growthStages[3];
    document.getElementById('homeGrowthTree').dataset.stage = growthStage.stage;
    document.getElementById('homeGrowthTitle').textContent = growthStage.title;
    const weekEstimateCount = current.filter(CarbonMateRecordData.isEstimated).length;
    document.getElementById('homeWeekActivity').textContent = weekEstimateCount ? `本周行动 ${activeDays}/7 天 · 碳排放估算 ${reduction.toFixed(2)} kg CO₂` : `本周行动 ${activeDays}/7 天 · 行动记录不折算碳量`;
    document.getElementById('homeGrowthLeaves').innerHTML = Array.from({ length: 7 }, (_, index) => `<i class="${index < activeDays ? 'active' : ''}"></i>`).join('');
    const max = Math.max(0.1, ...Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday); date.setDate(date.getDate() + index);
      return allReduction(current.filter(row => dayKey(row.date) === dayKey(date.getTime())));
    }));
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
    const todayKey = dayKey(now.getTime());
    document.getElementById('homeWeekChart').innerHTML = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday); date.setDate(date.getDate() + index);
      const key = dayKey(date.getTime());
      const isToday = key === todayKey;
      const dayRows = current.filter(row => dayKey(row.date) === key);
      const amount = allReduction(dayRows);
      const future = date.setHours(0, 0, 0, 0) > new Date(now).setHours(0, 0, 0, 0);
      return `<button class="home-day-bar ${isToday ? 'today' : ''} ${future ? 'future' : ''}" type="button" data-day="${key}" ${future ? 'disabled' : ''} aria-label="${date.getMonth() + 1}月${date.getDate()}日，周${weekdays[index]}${isToday ? '，今天' : ''}，碳排放估算 ${amount.toFixed(2)} 千克二氧化碳，${dayRows.length} 条行动"><span class="home-day-value">${amount ? amount.toFixed(2) : '0'}</span><span class="home-day-track"><i style="height:${amount ? Math.max(5, amount / max * 100) : 0}%"></i></span><span class="home-day-label"><b>${date.getMonth() + 1}/${date.getDate()}</b><small>${isToday ? '今天 · ' : ''}周${weekdays[index]}</small></span></button>`;
    }).join('');
    const weekEmpty = document.getElementById('homeWeekEmpty');
    const weekHasEstimate = current.some(CarbonMateRecordData.isEstimated);
    if (weekEmpty) {
      weekEmpty.hidden = weekHasEstimate;
      const emptyText = weekEmpty.querySelector('#homeWeekEmptyText');
      const action = weekEmpty.querySelector('#homeWeekEmptyAction');
      if (!current.length) {
        if (emptyText) emptyText.textContent = '本周还没有行动记录';
        if (action) { action.textContent = '记录今天的行动'; action.onclick = () => navigate('record'); }
      } else {
        if (emptyText) emptyText.textContent = `本周已有 ${current.length} 条行动记录，但暂无碳排放估算`;
        if (action) { action.textContent = '查看历史记录'; action.onclick = () => navigate('history'); }
      }
    }
    const comparisonText = !current.length ? (previous.length ? '本周暂无行动 · 上周同期有记录' : '添加行动后可与上周同期比较') : !weekEstimateCount ? '行动次数照常记录 · 暂无碳排放量' : !previousReduction ? `上周无可比估算 · 本周新增 ${reduction.toFixed(2)} kg CO₂` : `较上周同期${difference >= 0 ? '多' : '少'} ${Math.abs(difference).toFixed(2)} kg CO₂`;
    document.getElementById('homeWeekChartNote').textContent = `${shortDate(monday)}—${shortDate(sunday)} · ${comparisonText}`;
    document.querySelectorAll('#homeWeekChart [data-day]').forEach(button => button.addEventListener('click', () => openDayDetails(button.dataset.day)));
    renderRecent(realRecords());
    const dailyTasks = tasks.filter(task => task.group === 'daily');
    const claimed = new Set(matureState.taskClaims.filter(item => item.day === dayKey(now.getTime()) && item.group !== 'weekly').map(item => item.taskId));
    const completed = dailyTasks.filter(task => claimed.has(task.id) || task.test(today)).length;
    document.getElementById('homeTasksProgress').textContent = `今日已完成 ${completed} / ${dailyTasks.length}`;
    const taskPreview = [...dailyTasks].sort((a, b) => Number(claimed.has(a.id) || a.test(today)) - Number(claimed.has(b.id) || b.test(today))).slice(0, 2);
    document.getElementById('homeTasksList').innerHTML = taskPreview.map(task => `<button class="home-task-row" type="button" data-task-id="${task.id}"><span class="home-task-check ${claimed.has(task.id) || task.test(today) ? 'done' : ''}">${claimed.has(task.id) || task.test(today) ? '✓' : ''}</span><span><b>${esc(task.title)}</b><small>${claimed.has(task.id) || task.test(today) ? '已完成' : task.description}</small></span></button>`).join('');
    document.querySelectorAll('#homeTasksList [data-task-id]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.taskId === 'one-action' && !tasks[0].test(today) ? 'record' : 'missions')));
    const earned = matureState.earnedBadges.map(item => ({ ...item, badge: badgeRules.find(rule => rule.id === item.id) })).filter(item => item.badge).sort((a, b) => b.earnedAt - a.earnedAt);
    const next = badgeRules.find(rule => !rule.legacyOnly && !earned.some(item => item.id === rule.id));
    const progress = next ? getBadgeProgress(next) : null;
    const featured = badgeRules.find(rule => rule.id === matureState.profile.featuredBadgeId && earned.some(item => item.id === rule.id));
    const highlight = featured || earned[0]?.badge || next || badgeRules[0];
    document.getElementById('homeBadgeSummary').innerHTML = `<button class="home-badge-earned" type="button" data-mission-view="badges">${renderBadgeArtwork(highlight)}<div><small>${featured ? '个人展示' : earned.length ? '最近获得' : '下一枚勋章'}</small><b>${esc(highlight.name)}</b></div><span class="home-badge-open">全部徽章 →</span></button><div class="home-badge-next"><span>${next ? `下一枚：${esc(next.name)}` : '全部成就徽章已收集'}</span>${progress ? `<b>${progress[0]} / ${progress[1]}</b>` : ''}</div>${progress ? `<div class="home-badge-progress"><i style="width:${Math.min(100, progress[0] / progress[1] * 100)}%"></i></div>` : ''}`;
    document.querySelector('#homeBadgeSummary [data-mission-view]')?.addEventListener('click', () => { missionView = 'badges'; navigate('missions'); renderMissions(); });
  }

  function syncAnalysisHistory() {
    const { start, end } = homeRangeBounds(activeHomeRange);
    activeFilter = { year: '', month: '', kind: '', start: dayKey(start), end: dayKey(end) };
    ['filterKind', 'filterKeyword'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('filterStart').value = activeFilter.start;
    document.getElementById('filterEnd').value = activeFilter.end;
    renderHistory(getFilteredRecords());
  }

  function openAnalysisDetails() {
    activeHomeRange = 'day';
    matureState.settings.homeRange = 'day';
    matureState.settings.homeAnchor = dayKey(Date.now());
    saveState();
    navigate('analysis');
  }

  function setAnalysisRange(range) {
    if (!['day', 'month', 'year'].includes(range)) return;
    activeHomeRange = range;
    matureState.settings.homeRange = range;
    saveState();
    renderHomeDashboard();
  }

  function setAnalysisDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > dayKey(Date.now())) { showToast('请选择今天或之前的日期'); return; }
    matureState.settings.homeAnchor = value;
    if (activeHomeRange === 'custom') activeHomeRange = 'day';
    matureState.settings.homeRange = activeHomeRange;
    saveState();
    renderHomeDashboard();
  }

  function shiftAnalysisPeriod(amount) {
    shiftAnalysisDate(amount);
  }

  function shiftAnalysisDate(amount) {
    const current = new Date(`${matureState.settings.homeAnchor || dayKey(Date.now())}T12:00:00`);
    if (!Number.isFinite(current.getTime())) return;
    const next = new Date(current);
    if (activeHomeRange === 'year') next.setFullYear(next.getFullYear() + amount);
    else if (activeHomeRange === 'month') next.setMonth(next.getMonth() + amount);
    else next.setDate(next.getDate() + amount);
    if (next > new Date()) next.setTime(Date.now());
    matureState.settings.homeAnchor = dayKey(next.getTime());
    saveState();
    renderHomeDashboard();
  }

  function openDayDetails(day) {
    activeHomeRange = 'day';
    matureState.settings.homeRange = 'day';
    matureState.settings.homeAnchor = day;
    saveState();
    renderHomeDashboard();
    navigate('analysis');
  }

  function renderHomeRecommendation(rows) {
    const labels = {
      bicycle: ['试试绿色出行', '如果出行距离和条件合适，下一次可以考虑步行、骑行或公共交通。'],
      meal: ['从按需点餐开始', '按需购买和取餐，减少食物浪费；不必追求一步到位。'],
      electricity: ['留意日常用电', '离开房间时检查照明和不需要运行的设备。'],
      recycle: ['让资源多一次循环', '按所在地分类要求，整理一件可回收物。'],
      water: ['试试节约用水', '从缩短不必要的用水时间开始，选择适合自己的小改变。']
    };
    const candidates = ['bicycle', 'meal', 'electricity', 'recycle', 'water'];
    const next = candidates.find(kind => !rows.some(row => row.kind === TYPE[kind])) || 'bicycle';
    const item = labels[next];
    const recommendation = document.getElementById('homeRecommendation');
    const button = document.getElementById('homeActionButton');
    if (!recommendation || !button) return;
    recommendation.textContent = rows.length ? `${item[0]}：${item[1]}` : '先记录一条真实完成的低碳行动，总览就会开始呈现你的个人趋势。';
    button.textContent = rows.length ? `记录：${item[0]} →` : '记下第一条行动 →';
    button.dataset.action = next;
    button.onclick = () => { navigate('record'); const behavior = document.getElementById('behavior'); behavior.value = next; updateActivityEstimate(); };
  }

  function renderGoal() {
    const panel = document.getElementById('goalPanel');
    const mobilePanel = document.getElementById('goalPanelMobile');
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const weekly = allReduction(realRecords().filter(row => row.date >= start.getTime() && row.date <= Date.now()));
    const goal = Math.max(0.1, Number(matureState.settings.weeklyGoalKg) || 3);
    const percentage = Math.min(100, weekly / goal * 100);
    const content = `<div class="panel-title">本周行动目标</div><div class="streakInline panel-note" style="margin-top:5px"></div><div class="goal-line"><span>估算参考目标 ${goal.toFixed(1)} kg CO₂</span><b>${Math.min(100, percentage).toFixed(0)}%</b></div><div class="progress" role="progressbar" aria-label="本周碳排放估算目标进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(percentage)}"><i style="width:${percentage}%"></i></div><div class="goal-line"><span>${weekly > 0 ? `已核验估算 ${weekly.toFixed(2)} kg CO₂` : '暂无估算；行动记录和积分照常累计'}</span></div><p class="panel-note">目标调整可在“我的 → 个人设置”中完成。</p>`;
    if (panel) panel.innerHTML = content;
    if (mobilePanel) mobilePanel.innerHTML = content;
  }

  function renderRewardArt(reward, large = false) {
    if (!reward.physical) {
      const classes = `reward-art reward-preview reward-preview-${reward.category} reward-art-${reward.id} reward-art-${reward.category} reward-theme-${reward.theme || 'default'} ${large ? 'large' : ''}`;
      const title = esc(reward.displayTitle || reward.title);
      if (reward.category === 'certificate') return `<div class="${classes}" role="img" aria-label="${esc(reward.title)}证书版式预览"><article class="reward-certificate-sheet"><header><i>CM</i><span><b>碳伴 CarbonMate</b><small>个人低碳实践纪念</small></span><em>电子纪念</em></header><div class="reward-certificate-rule"></div><small class="reward-preview-kicker">CARBONMATE · PERSONAL RECORD</small><h4>${esc(reward.title)}</h4><p>记录每一次认真选择<br>让日常行动成为自己的绿色印记</p><div class="reward-certificate-seal">✳</div><div class="reward-certificate-stats"><span><b>行动</b><small>真实记录</small></span><span><b>坚持</b><small>日常积累</small></span><span><b>成长</b><small>专属纪念</small></span></div><footer><span>为每一次改变留存</span><span>版式预览</span></footer></article></div>`;
      if (reward.category === 'memory') {
        const season = reward.id === 'season-card';
        return `<div class="${classes}" role="img" aria-label="${esc(reward.title)}电子纪念卡预览"><article class="reward-memory-sheet ${season ? 'season' : 'highlight'}"><div class="reward-memory-sun"></div><div class="reward-memory-landscape"><i></i><b></b><em></em></div><header><span>CARBONMATE · KEEP A MOMENT</span><b>${season ? '2026 · SEASON JOURNAL' : 'MONTHLY GREEN MOMENTS'}</b></header><div class="reward-memory-copy"><small>${season ? '这一季，慢慢向绿' : '把本月的改变记下来'}</small><h4>${title}</h4><p>${season ? '为持续实践的日常，留一张季节纪念卡' : '每个小选择，都值得被认真收藏'}</p></div><footer><span>${season ? '季节行动回顾' : '本月行动精选'}</span><i>数字纪念卡</i></footer></article></div>`;
      }
      if (reward.category === 'title') return `<div class="${classes}" role="img" aria-label="${esc(reward.title)}个人称号展示预览"><article class="reward-title-plaque"><div class="reward-title-stars">✦　✧　✦</div><div class="reward-title-medallion"><span>${esc(reward.mark || '绿')}</span></div><small>碳伴 · 个人称号</small><h4>${title}</h4><p>低碳生活 · 行动留念</p><div class="reward-title-ribbon">专属数字称号</div></article></div>`;
      if (reward.category === 'background') return `<div class="${classes}" role="img" aria-label="${esc(reward.title)}个人主页主题背景预览"><article class="reward-profile-preview"><header><b>个人主页</b><span>主题预览</span></header><div class="reward-profile-scene"><i class="reward-scene-sun"></i><i class="reward-scene-hill hill-one"></i><i class="reward-scene-hill hill-two"></i><span>${title}</span></div><footer><i>${esc(reward.mark || '绿')}</i><span><b>绿色生活家</b><small>让日常，也有自己的风景</small></span><em>主页主题</em></footer></article></div>`;
      return `<div class="${classes}" aria-hidden="true"><span>${esc(reward.mark || '绿')}</span></div>`;
    }
    const scenes = {
      cup: '<ellipse cx="122" cy="134" rx="47" ry="8" fill="#315642" opacity=".12"/><path d="M92 43h60l-5 73a12 12 0 0 1-12 11h-26a12 12 0 0 1-12-11z" fill="url(#metal)"/><path d="M148 58h12a13 13 0 0 1 0 26h-14" fill="none" stroke="#527561" stroke-width="7"/><path d="M96 48h52" stroke="#f9f5e9" stroke-width="5" stroke-linecap="round"/><path d="M107 78c7-10 17-14 29-13-5 11-14 18-29 18m9 14c4-8 10-13 18-16" fill="none" stroke="#f5f0df" stroke-width="3" stroke-linecap="round"/><path d="M105 38h34" stroke="#405f4a" stroke-width="7" stroke-linecap="round"/>',
      tote: '<ellipse cx="120" cy="137" rx="54" ry="7" fill="#315642" opacity=".12"/><path d="M69 61h102l-8 69H77z" fill="#c5ad7f"/><path d="M91 66c0-27 9-41 29-41s29 14 29 41" fill="none" stroke="#927b52" stroke-width="8"/><path d="M119 85c-9 11-14 21-14 31 11 0 21-6 28-17 2 10 9 15 20 17-1-17-11-27-34-31z" fill="#68896b"/><path d="M119 91v26" stroke="#f4eddc" stroke-width="2"/>',
      cutlery: '<ellipse cx="120" cy="136" rx="56" ry="7" fill="#315642" opacity=".12"/><rect x="67" y="49" width="106" height="76" rx="19" fill="#d7c4a1"/><path d="M76 61q42-20 88 0v51q-42 19-88 0z" fill="#ebe1cc"/><path d="M97 59v54M143 59v54" stroke="#b9a27a" stroke-width="6" stroke-linecap="round"/><path d="M91 48v58m-6-58v18m6-18v18m6-18v18m28-18v62m0-62c13 8 13 23 0 29" fill="none" stroke="#66856a" stroke-width="4" stroke-linecap="round"/>',
      notebook: '<ellipse cx="120" cy="136" rx="48" ry="7" fill="#315642" opacity=".12"/><path d="M79 38h82a8 8 0 0 1 8 8v77a8 8 0 0 1-8 8H79a8 8 0 0 1-8-8V46a8 8 0 0 1 8-8z" fill="#8caa83"/><path d="M83 45h72v73H83z" fill="#f2ecdc"/><path d="M83 45h15v73H83z" fill="#b6caa6"/><path d="M103 66h39m-39 13h39m-39 13h30" stroke="#bdc7ae" stroke-width="3" stroke-linecap="round"/><path d="M125 34v16m-8-8h16" stroke="#d2ad66" stroke-width="3" stroke-linecap="round"/>'
    };
    return `<div class="reward-product-art ${large ? 'large' : ''} reward-product-${reward.type}" role="img" aria-label="${esc(reward.title)}物品展示"><svg viewBox="0 0 240 160" aria-hidden="true"><defs><linearGradient id="metal" x1="0" x2="1"><stop stop-color="#9bb29c"/><stop offset=".42" stop-color="#e2e9d7"/><stop offset="1" stop-color="#819984"/></linearGradient><radialGradient id="rewardGlow"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="240" height="160" rx="16" fill="${reward.type === 'cup' ? '#e7eee4' : reward.type === 'tote' ? '#f0eadc' : reward.type === 'cutlery' ? '#e7efeb' : '#eaece1'}"/><circle cx="196" cy="36" r="54" fill="url(#rewardGlow)"/>${scenes[reward.type] || ''}<path d="M29 126c16-14 25-15 35-11m112 0c9-4 19-3 35 11" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/></svg><span class="reward-product-tag">积分可兑换</span></div>`;
  }

  function renderRewardCard(reward, balance, compact = false) {
    const owned = matureState.redemptions.some(item => item.rewardId === reward.id);
    const hasCertificateRecord = reward.category !== 'certificate' || records.some(row => !row.demoSeed);
    const unavailable = (!reward.repeatable && owned) || !hasCertificateRecord;
    const categoryLabel = { certificate: '正式版式 · 个人记录', memory: '数字纪念卡', title: '个人主页称号', background: '个人主页主题' }[reward.category] || '数字纪念';
    const active = owned && (reward.category === 'title' ? getActiveRewardId('title') === reward.id : reward.category === 'background' ? getActiveRewardId('background') === reward.id : false);
    const action = owned && ['title', 'background'].includes(reward.category)
      ? `<button class="reward-exchange-button reward-apply-button" data-reward-apply="${reward.id}" ${active ? 'disabled' : ''}>${active ? '正在使用' : '设为展示'}</button>`
      : `<button class="reward-exchange-button" data-reward-exchange="${reward.id}" ${balance < reward.points || unavailable ? 'disabled' : ''}>${!hasCertificateRecord ? '先记录一次行动' : unavailable ? '已收藏' : balance < reward.points ? `还差 ${balance >= 0 ? reward.points - balance : reward.points} 分` : '积分兑换'}</button>`;
    return `<article class="reward-card digital-reward-card ${active ? 'reward-active' : ''} ${compact ? 'compact' : ''}">${renderRewardArt(reward)}<div class="reward-card-copy"><span class="reward-type-label">${categoryLabel}${active ? ' · 正在使用' : ''}</span><h3>${esc(reward.title)}</h3><p>${esc(reward.text)}</p><div class="reward-card-bottom"><b>${reward.points}<small> 积分</small></b>${owned ? `<span class="reward-owned-tag">${reward.repeatable ? '已兑换' : '已拥有'}</span>` : ''}</div><div class="reward-card-actions"><button class="reward-detail-button" data-reward-detail="${reward.id}">查看详情</button>${action}</div></div></article>`;
  }

  function getActiveRewardId(category) {
    const profile = matureState.profile;
    const storedId = category === 'title' ? profile.activeTitleId : profile.activeBackgroundId;
    if (storedId && matureState.redemptions.some(item => item.rewardId === storedId)) return storedId;
    if (category === 'title') return rewards.find(reward => reward.category === 'title' && reward.displayTitle === profile.customTitle && matureState.redemptions.some(item => item.rewardId === reward.id))?.id || '';
    return [...matureState.redemptions].reverse().find(item => rewards.some(reward => reward.id === item.rewardId && reward.category === 'background'))?.rewardId || '';
  }

  function renderCertificateArchiveFeature(reward, balance) {
    const savedRows = records.filter(row => !row.demoSeed);
    const dates = savedRows.map(row => Number(row.date)).filter(Number.isFinite).sort((a, b) => a - b);
    const activeDays = new Set(savedRows.map(row => dayKey(row.date))).size;
    const categories = [...new Set(savedRows.map(row => kinds[row.kind]?.name).filter(Boolean))];
    const period = dates.length ? `${fmtDate(dates[0])} — ${fmtDate(dates[dates.length - 1])}` : '添加首条记录后生成';
    const displayName = esc(matureState.profile.displayName || '绿色生活家');
    const canRedeem = balance >= reward.points && savedRows.length > 0;
    return `<section class="certificate-archive-feature" aria-label="个人实践记录证书预览">
      <article class="certificate-archive-sheet"><header><span class="certificate-archive-mark">CM</span><span><b>碳伴 CarbonMate</b><small>个人低碳实践记录</small></span><em>数字纪念</em></header>
        <div class="certificate-archive-rule"></div><small class="certificate-archive-kicker">PERSONAL PRACTICE RECORD</small><h3>低碳实践记录证书</h3>
        <p class="certificate-archive-recipient">谨将此记录留予 <b>${displayName}</b></p>
        <div class="certificate-archive-stats"><span><b>${savedRows.length}</b>条行动记录</span><span><b>${activeDays}</b>个行动日</span><span><b>${categories.length}</b>类实践</span></div>
        <div class="certificate-archive-meta"><span>记录周期</span><b>${period}</b></div>
        <footer><span>依据应用内已保存记录生成</span><span>兑换后生成编号</span></footer>
      </article>
      <div class="certificate-archive-copy"><span class="certificate-archive-label">本期典藏</span><h3>让持续行动，有一份自己的留存</h3><p>${savedRows.length ? `目前汇总了 ${savedRows.length} 条非演示记录；兑换后可查看完整证书，并打印或保存为 PDF。` : '添加至少一条真实行动记录后，证书会自动汇总记录数、行动日与类别。'}</p>
        <div class="certificate-archive-trust"><span>内容来源<b>你的已保存记录</b></span><span>凭证属性<b>个人纪念 · 非第三方核证</b></span><span>演示样例<b>不计入证书统计</b></span></div>
        <div class="certificate-archive-actions"><button type="button" data-reward-detail="${reward.id}">查看版式与说明</button><button type="button" data-reward-exchange="${reward.id}" ${canRedeem ? '' : 'disabled'}>${savedRows.length ? balance < reward.points ? `还差 ${reward.points - balance} 积分` : `兑换 · ${reward.points} 积分` : '先记录一次行动'}</button></div>
      </div>
    </section>`;
  }

  function renderMissions() {
    const today = todayRecords();
    const now = new Date();
    const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const weekStart = dayKey(monday.getTime());
    const weekRows = realRecords().filter(row => Number(row.date) >= monday.getTime());
    const todayKey = dayKey(now.getTime());
    const claims = new Set(matureState.taskClaims.filter(claim => claim.group === 'weekly' ? claim.periodKey === `week:${weekStart}` : claim.day === todayKey).map(claim => claim.taskId));
    document.getElementById('missionDate').textContent = `${now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })} · 今日 ${today.length} 条记录`;
    document.getElementById('pointsBalance').innerHTML = `${getBalance().available} <small>积分</small>`;
    const content = document.getElementById('missionContent');
    if (!content) return;
    document.querySelectorAll('[data-mission-view]').forEach(button => button.classList.toggle('active', button.dataset.missionView === missionView));
    if (missionView === 'overview') {
      const daily = tasks.filter(task => task.group === 'daily');
      const weekly = tasks.filter(task => task.group === 'weekly');
      const renderTask = (task, rows) => {
        const completed = claims.has(task.id) || task.test(rows);
        return `<article class="quest-card ${completed ? 'completed' : ''}"><span class="quest-icon">${lineIcon(task.icon)}</span><div class="quest-copy"><b>${esc(task.title)}</b><p>${esc(task.description)}</p><small>${completed ? '已完成' : `完成可得 ${task.points} 积分`}</small></div><button class="quest-action" data-page="${completed ? 'history' : 'record'}" onclick="showPage('${completed ? 'history' : 'record'}')">${completed ? '查看记录' : '去行动'} <span>→</span></button></article>`;
      };
      const badgeHighlights = badgeRules.filter(rule => !rule.legacyOnly).slice(0, 3);
      const rewardsBalance = getBalance().available;
      content.innerHTML = `<section class="quest-section"><div class="quest-section-head"><div><h2>今天可以做</h2><p>${today.length ? `已记录 ${today.length} 条行动` : '从顺手的一件小事开始'}</p></div><span>${daily.filter(task => claims.has(task.id) || task.test(today)).length} / ${daily.length}</span></div><div class="quest-list">${daily.map(task => renderTask(task, today)).join('')}</div></section>
        <section class="quest-section"><div class="quest-section-head"><div><h2>本周挑战</h2><p>${weekStart} 起 · 按实际记录累计</p></div><span>${weekly.filter(task => claims.has(task.id) || task.test(weekRows)).length} / ${weekly.length}</span></div><div class="quest-list">${weekly.map(task => renderTask(task, weekRows)).join('')}</div></section>
        <section class="mission-section-card"><div class="mission-section-title"><div><h2>电子徽章</h2><p>每一枚都对应真实行动和成长记录</p></div><button class="text-arrow" data-mission-view="badges">全部徽章 →</button></div><div class="badge-strip">${badgeHighlights.map(rule => renderBadgeCard(rule, true)).join('')}</div></section>
        <section class="mission-section-card"><div class="mission-section-title"><div><h2>数字纪念</h2><p>称号、主页主题与行动记录证书，全部以数字形式收藏</p></div><button class="text-arrow" data-mission-view="rewards">浏览纪念 →</button></div><div class="reward-strip">${rewards.filter(reward => ['certificate','title','background'].includes(reward.category)).slice(0, 2).map(reward => renderRewardCard(reward, rewardsBalance, true)).join('')}</div></section>`;
    } else if (missionView === 'badges') {
      const earnedCount = matureState.earnedBadges.filter(item => badgeRules.some(rule => rule.id === item.id && !rule.legacyOnly)).length;
      const shownBadges = badgeRules.filter(rule => !rule.legacyOnly || matureState.earnedBadges.some(item => item.id === rule.id)).filter(rule => badgeSeriesFilter === 'all' || rule.series === badgeSeriesFilter).filter(rule => badgeStatusFilter === 'all' || (badgeStatusFilter === 'earned') === matureState.earnedBadges.some(item => item.id === rule.id));
      const badgeTotal = badgeRules.filter(rule => !rule.legacyOnly).length;
      content.innerHTML = `<section class="mission-section-card badge-collection ${matureState.redemptions.some(item => rewards.some(reward => reward.category === 'background' && reward.id === item.rewardId)) ? 'badge-backdrop-unlocked' : ''}"><div class="badge-collection-head"><div><span class="eyebrow">CARBONMATE · BADGE COLLECTION</span><h2>低碳成就册</h2><p>每一枚徽章，都来自你亲手完成的行动。</p></div><div class="badge-collection-count"><b>${earnedCount}</b><span>/ ${badgeTotal} 已收集</span></div></div><div class="badge-filter-row" role="group" aria-label="按徽章系列筛选">${[['all','全部系列'], ...badgeSeries.map(item => [item.id,item.name])].map(([id, name]) => `<button class="badge-filter-chip ${badgeSeriesFilter === id ? 'active' : ''}" data-badge-series="${id}">${name}</button>`).join('')}</div><div class="badge-filter-row badge-status-row" role="group" aria-label="按获得状态筛选">${[['all','全部'],['earned','已获得'],['locked','待解锁']].map(([id, name]) => `<button class="badge-filter-chip ${badgeStatusFilter === id ? 'active' : ''}" data-badge-status="${id}">${name}</button>`).join('')}</div><div class="badge-gallery">${shownBadges.map(rule => renderBadgeCard(rule, false)).join('') || '<div class="badge-empty-state">这个分类暂时没有符合条件的徽章。</div>'}</div></section>`;
    } else {
      const rewardsBalance = getBalance().available;
      const categories = [['all','全部纪念'],['certificate','记录证书'],['memory','纪念卡'],['title','称号'],['background','主页主题']];
      const visibleRewards = rewards.filter(reward => rewardCategoryFilter === 'all' || reward.category === rewardCategoryFilter);
      const certificateReward = rewards.find(reward => reward.category === 'certificate');
      const certificateFeature = certificateReward && ['all', 'certificate'].includes(rewardCategoryFilter) ? renderCertificateArchiveFeature(certificateReward, rewardsBalance) : '';
      content.innerHTML = `<section class="mission-section-card redemption-store"><div class="redemption-heading"><div><span class="eyebrow">CARBONMATE · DIGITAL KEEPSAKES</span><h2>数字纪念</h2><p>只兑换保存在个人主页与成就册里的数字内容。</p></div><div class="redemption-balance"><small>当前可用</small><b>${rewardsBalance}<i>分</i></b></div></div>${certificateFeature}<div class="reward-category-tabs" role="group" aria-label="筛选数字纪念类型">${categories.map(([id, label]) => `<button class="reward-category-tab ${rewardCategoryFilter === id ? 'active' : ''}" data-reward-category="${id}" aria-pressed="${rewardCategoryFilter === id}">${label}${id === 'all' ? `<span>${rewards.length}</span>` : `<span>${rewards.filter(reward => reward.category === id).length}</span>`}</button>`).join('')}</div><div class="reward-strip reward-strip-all digital-reward-grid">${visibleRewards.map(reward => renderRewardCard(reward, rewardsBalance)).join('')}</div><p class="reward-disclaimer">兑换仅生成应用内数字纪念，不包含实物商品、邮寄或植树捐赠。记录证书依据本应用保存的数据生成，并注明为个人记录。</p></section>`;
    }
    content.querySelectorAll('[data-badge-id]').forEach(button => button.addEventListener('click', () => showBadgeDetail(button.dataset.badgeId)));
    content.querySelectorAll('[data-badge-series]').forEach(button => button.addEventListener('click', () => { badgeSeriesFilter = button.dataset.badgeSeries; renderMissions(); }));
    content.querySelectorAll('[data-badge-status]').forEach(button => button.addEventListener('click', () => { badgeStatusFilter = button.dataset.badgeStatus; renderMissions(); }));
    content.querySelectorAll('[data-mission-view]').forEach(button => button.addEventListener('click', () => { missionView = button.dataset.missionView; renderMissions(); }));
    content.querySelectorAll('[data-reward-detail]').forEach(button => button.addEventListener('click', () => showRewardDetail(button.dataset.rewardDetail)));
    content.querySelectorAll('[data-reward-exchange]').forEach(button => button.addEventListener('click', () => redeemReward(button.dataset.rewardExchange)));
    content.querySelectorAll('[data-reward-category]').forEach(button => button.addEventListener('click', () => { rewardCategoryFilter = button.dataset.rewardCategory; renderMissions(); }));
    content.querySelectorAll('[data-reward-apply]').forEach(button => button.addEventListener('click', () => {
      const reward = rewards.find(item => item.id === button.dataset.rewardApply);
      if (!reward || !matureState.redemptions.some(item => item.rewardId === reward.id)) return;
      if (reward.category === 'title') { matureState.profile.activeTitleId = reward.id; matureState.profile.customTitle = reward.displayTitle || reward.title; }
      if (reward.category === 'background') matureState.profile.activeBackgroundId = reward.id;
      saveState(); renderAll(); showToast(reward.category === 'title' ? `已佩戴称号：${reward.title}` : `已更换主页主题：${reward.title}`);
    }));
    content.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
  }

  function getBadgeProgress(badge) {
    const userRecords = realRecords();
    const uniqueDays = new Set(userRecords.map(row => dayKey(row.date))).size;
    const uniqueKinds = new Set(userRecords.map(row => row.kind)).size;
    const metric = badge.metric;
    const travel = userRecords.filter(row => ['walk', 'bicycle', 'bus', 'metro'].includes(row.kind)).length;
    const values = {
      records: userRecords.length,
      kinds: uniqueKinds,
      travel,
      meal: userRecords.filter(row => row.kind === 'meal').length,
      reuse: userRecords.filter(row => row.kind === 'reuse').length,
      electricity: userRecords.filter(row => row.kind === 'electricity' && row.actionDetail).length,
      resource: userRecords.filter(row => ['electricity', 'water'].includes(row.kind) && row.actionDetail).length,
      water: userRecords.filter(row => row.kind === 'water').length,
      recycle: userRecords.filter(row => row.kind === 'recycle').length,
      days: uniqueDays,
      weekDays: (() => { const now = new Date(); const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); return new Set(userRecords.filter(row => Number(row.date) >= monday.getTime()).map(row => dayKey(row.date))).size; })(),
      months: new Set(userRecords.map(row => { const date = new Date(Number(row.date)); return `${date.getFullYear()}-${date.getMonth() + 1}`; })).size,
      learnAction: matureState.learningProgress.completedLevels.length > 0 && userRecords.length > 0 ? 1 : 0,
      streak: longestActiveStreak(),
      courses: matureState.learningProgress.completedLevels.length
    };
    if (badge.legacyOnly) return [matureState.earnedBadges.some(item => item.id === badge.id) ? 1 : 0, 1];
    return [Math.min(Number(values[metric]) || 0, badge.target), badge.target];
  }

  function longestActiveStreak() {
    const days = [...new Set(realRecords().map(row => dayKey(row.date)))].sort();
    let best = 0; let current = 0; let previous = null;
    days.forEach(key => {
      const [year, month, day] = key.split('-').map(Number);
      const stamp = new Date(year, month - 1, day).getTime();
      current = previous !== null && stamp - previous === 86400000 ? current + 1 : 1;
      best = Math.max(best, current); previous = stamp;
    });
    return best;
  }

  const badgeGlyphs = {
    seed: '<path d="M50 61V42m0 8c-13 0-19-7-19-17 12 0 19 5 19 17Zm0-4c0-13 7-20 19-20 0 12-6 20-19 20Z"/>',
    spark: '<path d="m50 27 5.5 15.5L71 48l-15.5 5.5L50 69l-5.5-15.5L29 48l15.5-5.5L50 27Zm20 28 2.5 7L80 64l-7.5 2.5L70 74l-2.5-7.5L60 64l7.5-2L70 55Z"/>',
    leaf: '<path d="M72 29C48 29 30 39 30 57c0 9 7 15 16 15 18 0 27-19 26-43ZM31 73c8-13 18-22 34-32"/>',
    sun: '<circle cx="50" cy="49" r="13"/><path d="M50 25v7m0 34v7M26 49h7m34 0h7M33 32l5 5m24 24 5 5m0-34-5 5m-24 24-5 5"/>',
    compass: '<circle cx="50" cy="49" r="22"/><path d="m59 39-6 15-14 6 6-15 14-6Z"/>',
    trail: '<path d="m29 67 13-17 9 9 14-24m-3 0h7v7"/><circle cx="31" cy="35" r="4"/><circle cx="69" cy="67" r="4"/>',
    cycle: '<circle cx="35" cy="59" r="11"/><circle cx="67" cy="59" r="11"/><path d="m35 59 11-19 11 19H35l8-13h17l7 13m-24-19h8"/>',
    bowl: '<path d="M28 49h44c-2 14-9 22-22 22S30 63 28 49Zm7-10h30M42 32v7m8-10v10m8-7v7"/>',
    reuse: '<path d="m38 31 7-5 8 13h-8m17-1 8 2-7 13-4-7m-20 2-3 8 15 1-4-7"/>',
    bulb: '<path d="M39 54c-5-4-8-10-8-16 0-11 8-19 19-19s19 8 19 19c0 6-3 12-8 16-3 3-4 6-4 10H43c0-4-1-7-4-10Zm5 15h12m-10 6h8"/>',
    drop: '<path d="M50 23C41 37 32 47 32 57a18 18 0 0 0 36 0c0-10-9-20-18-34Zm-8 37c1 5 4 7 8 8"/>',
    paper: '<path d="M37 27h19l9 9v38H37V27Zm19 1v10h9M43 48h16M43 56h16M43 64h11"/>',
    calendar: '<rect x="30" y="32" width="40" height="37" rx="5"/><path d="M40 25v14m20-14v14M30 43h40m-30 9h7m7 0h7m-21 8h7"/>',
    sunrise: '<path d="M28 62h44M35 56a15 15 0 0 1 30 0M50 29v8m-17 0 6 6m28-6-6 6M28 70h44"/>',
    'calendar-star': '<rect x="30" y="32" width="40" height="37" rx="5"/><path d="M40 25v14m20-14v14M30 43h40m-20 8 2.5 5 5.5.8-4 4 .9 5.7-4.9-2.8-4.9 2.8.9-5.7-4-4 5.5-.8L50 51Z"/>',
    mountain: '<path d="m27 68 16-27 9 13 7-10 15 24H27Zm16-27 5-8 4 8"/>',
    flame: '<path d="M53 24c4 14-7 16-3 27 2-5 7-7 9-12 9 8 13 16 10 25-3 9-11 14-20 14s-18-7-18-17c0-9 5-17 13-26 0 10 4 14 7 15 5-8 1-17 2-26Z"/>',
    moon: '<path d="M64 30a24 24 0 1 0 7 40A25 25 0 0 1 64 30Z"/><path d="m39 43 2 4 4 1-4 2-2 4-2-4-4-2 4-1 2-4Z"/>',
    book: '<path d="M29 34c9-4 16-2 21 3v34c-5-5-12-7-21-3V34Zm42 0c-9-4-16-2-21 3v34c5-5 12-7 21-3V34Z"/>',
    'open-book': '<path d="M27 34c10-4 18-2 23 4 5-6 13-8 23-4v33c-10-4-18-2-23 4-5-6-13-8-23-4V34Z"/><path d="M50 38v31M33 43c5-1 9 0 13 2m21-2c-5-1-9 0-13 2"/>'
  };

  function renderBadgeArtwork(badge, detail = false) {
    const series = badgeSeries.find(item => item.id === badge.series);
    const color = series?.color || '#78917d';
    const silhouette = badge.series === 'variety' ? 'M50 7 89 29v45L50 97 11 74V29Z' : badge.series === 'consistency' ? 'M50 5 83 18 94 50 83 82 50 99 17 82 6 50 17 18Z' : badge.series === 'learning' ? 'M50 6 88 26v42L50 96 12 68V26Z' : 'M50 5a44 44 0 1 0 0 88 44 44 0 0 0 0-88Z';
    return `<svg class="badge-art ${detail ? 'badge-art-large' : ''}" style="--badge-ink:${series?.ink || '#385f43'}" viewBox="0 0 100 104" role="img" aria-label="${esc(badge.name)}徽章"><path class="badge-art-shadow" d="${silhouette}" transform="translate(0 3)"/><path class="badge-art-shell" d="${silhouette}" fill="${color}"/><path class="badge-art-inset" d="M50 14 81 32v36L50 87 19 68V32Z"/><path class="badge-art-rim" d="M50 18 77 34v32L50 82 23 66V34Z"/><g class="badge-art-glyph">${badgeGlyphs[badge.glyph] || badgeGlyphs.spark}</g><path class="badge-art-glint" d="M29 28 36 24m29 53 7-4"/><circle class="badge-art-stud" cx="50" cy="93" r="2.4"/></svg>`;
  }

  function renderBadgeCard(badge, compact) {
    const earned = matureState.earnedBadges.find(item => item.id === badge.id);
    const [current, total] = getBadgeProgress(badge);
    const percent = earned ? 100 : Math.min(100, current / total * 100);
    const unit = ['records','travel','meal','reuse','electricity','water','recycle','resource'].includes(badge.metric) ? '次' : badge.metric === 'kinds' ? '类' : badge.metric === 'courses' ? '专题' : badge.metric === 'months' ? '月' : '天';
    return `<button class="digital-badge-card ${earned ? 'earned' : 'locked'} ${compact ? 'compact' : ''}" data-badge-id="${badge.id}" aria-label="${esc(badge.name)}，${earned ? '已获得' : `${current}/${total}${unit}进度`} ">${renderBadgeArtwork(badge)}<b>${esc(badge.name)}</b><span class="badge-progress-label">${earned ? `已获得 · ${fmtDate(earned.earnedAt)}` : `${current} / ${total} ${unit}`}</span><span class="badge-progress-track"><i style="width:${percent}%"></i></span></button>`;
  }

  function showBadgeDetail(id) {
    const badge = badgeRules.find(item => item.id === id);
    if (!badge) return;
    const earned = matureState.earnedBadges.find(item => item.id === id);
    const [current, total] = getBadgeProgress(badge);
    const unit = ['records','travel','meal','reuse','electricity','water','recycle','resource'].includes(badge.metric) ? '次' : badge.metric === 'kinds' ? '类' : badge.metric === 'courses' ? '专题' : badge.metric === 'months' ? '月' : '天';
    const featured = matureState.profile.featuredBadgeId === badge.id;
    const evidence = badge.legacyOnly ? '此徽章来自旧版演示规则，已保留在你的历史收藏中。' : `当前已累计 ${current} / ${total} ${unit}。${badge.metric === 'courses' ? '进度依据是已完成的课程专题。' : '进度依据是保存在本机的低碳行动记录。'}`;
    const backdrop = showDialog(earned ? '已收入徽章册' : '徽章进度', `<div class="badge-detail"><button class="badge-detail-art" type="button" id="badgeArtTurn" aria-label="徽章缓慢旋转，点击暂停或继续" aria-pressed="false">${renderBadgeArtwork(badge, true)}<span>徽章缓慢旋转 · 点击暂停</span></button><div class="badge-detail-series">${esc(badgeSeries.find(item => item.id === badge.series)?.name || '纪念收藏')}</div><h3>${esc(badge.name)}</h3><p>${esc(badge.rule)}</p><div class="badge-detail-meter"><div><span>目前进度</span><b>${earned ? '已解锁' : `${current} / ${total} ${unit}`}</b></div><span class="badge-detail-track"><i style="width:${earned ? 100 : Math.min(100, current / total * 100)}%"></i></span></div><button class="badge-evidence-toggle" id="badgeEvidenceToggle" aria-expanded="false">查看达成依据 <span>＋</span></button><div class="badge-evidence" id="badgeEvidence" hidden>${esc(evidence)}${earned ? `<br>获得日期：${fmtDate(earned.earnedAt)}` : ''}</div><button class="badge-feature-button" id="badgeFeatureButton" ${earned ? '' : 'disabled'}>${featured ? '✓ 已设为展示徽章' : earned ? '设为我的展示徽章' : '解锁后可设为展示'}</button></div>`, '<button class="dialog-primary" onclick="closeMatureDialog()">完成</button>');
    backdrop.querySelector('#badgeArtTurn').addEventListener('click', event => {
      const button = event.currentTarget;
      const paused = button.classList.toggle('paused');
      button.setAttribute('aria-pressed', String(paused));
      button.querySelector('span').textContent = paused ? '徽章已暂停 · 点击继续' : '徽章缓慢旋转 · 点击暂停';
    });
    backdrop.querySelector('#badgeEvidenceToggle').addEventListener('click', event => {
      const button = event.currentTarget; const panel = backdrop.querySelector('#badgeEvidence');
      const expanded = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(expanded)); panel.hidden = !expanded; button.querySelector('span').textContent = expanded ? '−' : '＋';
    });
    backdrop.querySelector('#badgeFeatureButton').addEventListener('click', event => {
      if (!earned) return;
      matureState.profile.featuredBadgeId = badge.id; saveState();
      event.currentTarget.textContent = '✓ 已设为展示徽章'; renderUserProfile(); showToast('已更新个人展示徽章');
    });
  }

  function buildPointsLedger() {
    const ledger = [];
    realRecords().forEach(row => ledger.push({ at: row.date, title: `${kinds[row.kind].name}记录`, detail: `${row.unquantified ? '仅记录行为' : `${Number(row.value)} ${kinds[row.kind].unit}`}${row.actionDetail ? ` · ${row.actionDetail}` : ''}${row.itemCategory ? ` · ${row.itemCategory}` : ''}${row.destination ? ` · ${row.destination}` : ''} · ${fmtDate(row.date)}`, points: Number(row.points || 0) }));
    matureState.taskClaims.forEach(claim => ledger.push({ at: claim.createdAt, title: tasks.find(task => task.id === claim.taskId)?.title || '日常任务奖励', detail: claim.group === 'weekly' ? '每周挑战' : claim.day, points: claim.points }));
    matureState.redemptions.forEach(item => ledger.push({ at: item.createdAt, title: `兑换：${item.title}`, detail: item.physical ? '实物兑换申请（原型本机记录）' : '数字纪念奖励', points: -item.cost }));
    return ledger.sort((a, b) => b.at - a.at);
  }

  function renderPointsPage() {
    const balance = document.getElementById('pointsBalanceFull');
    const ledger = document.getElementById('pointsLedgerFull');
    if (!balance || !ledger) return;
    balance.textContent = getBalance().available;
    ledger.innerHTML = buildPointsLedger().map(item => `<div class="ledger-row"><div>${esc(item.title)}<small>${esc(item.detail)}</small></div><div class="${item.points >= 0 ? 'ledger-plus' : 'ledger-minus'}">${item.points > 0 ? '+' : ''}${item.points} 分</div></div>`).join('') || '<p class="panel-note">完成低碳行动后，这里会记录积分变化。</p>';
  }

  function renderAll() {
    const filtered = getFilteredRecords();
    const overallPoints = getBalance();
    document.getElementById('totalPoints').innerHTML = `${overallPoints.available} <small>分</small>`;
    renderHomeDashboard();
    renderHistory(filtered);
    renderGoal();
    renderMissions();
    renderStreak();
    renderProfileIdentity();
    if (document.getElementById('page-profile')?.classList.contains('active')) renderUserProfile();
    if (document.getElementById('page-points')?.classList.contains('active')) renderPointsPage();
  }

  function renderStreak() {
    const card = document.querySelector('.streak-card');
    if (!card) return;
    const activeDays = new Set(realRecords().map(row => dayKey(row.date)));
    let cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    if (!activeDays.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (activeDays.has(dayKey(cursor.getTime())) && streak < 3660) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    const weekday = ['日', '一', '二', '三', '四', '五', '六'];
    const week = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(); date.setDate(date.getDate() - (6 - index));
      const done = activeDays.has(dayKey(date.getTime()));
      return `<div class="day ${done ? 'done' : ''}"><i aria-label="${done ? '已记录' : '无记录'}">${done ? '✓' : date.getDate()}</i>${weekday[date.getDay()]}</div>`;
    }).join('');
    card.innerHTML = `<div class="streak-over">连续低碳记录</div><div class="streak-num">${streak} <span style="font-size:13px;font-weight:550">天</span> ${streak ? '🔥' : '🌱'}</div><div class="streak-copy">${streak ? '坚持一点点，改变正在发生' : '记下一条行动，开启新的连续记录'}</div><div class="week">${week}</div>`;
    document.querySelectorAll('.streakInline').forEach(element => { element.textContent = `${streak ? `🔥 连续低碳 ${streak} 天` : '从今天开始积累连续行动'} · 基于实际记录`; });
  }

  function persistAll() {
    qualifyTasks(false);
    const newBadges = unlockBadges(false);
    if (!saveState()) return false;
    renderAll();
    if (newBadges.length) showBadgeCelebration(newBadges);
    return true;
  }

  function navigate(page) {
    const focusRecord = page === 'record';
    if (page === 'data') page = 'history';
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    if (page !== 'learn') url.searchParams.delete('learnView');
    window.history.replaceState({ ...(window.history.state || {}), page }, '', url);
    if (page !== 'capabilities' && window.capabilityPhotoUrl) { URL.revokeObjectURL(window.capabilityPhotoUrl); window.capabilityPhotoUrl = null; }
    if (page !== 'record') window.clearLedgerRecognitionPhoto?.();
    if (page === 'learn' && learningNavigationInitialized) {
      activeLearningView = 'home';
      learningViewStack = [];
      window.history.replaceState({ page: 'learn', learnView: 'home', viewStack: [] }, '', url);
    }
    if (page === 'profile') profileView = 'overview';
    document.body.dataset.activePage = page;
    document.querySelectorAll('.page').forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
    const analysisPage = document.getElementById('analysisDetails');
    if (analysisPage) analysisPage.classList.toggle('active', page === 'analysis');
    if (page === 'analysis') renderHomeDashboard();
    const navPage = ['record', 'history'].includes(page) ? 'ledger' : page;
    document.querySelectorAll('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === navPage));
    if (page === 'learn') renderLearningHub();
    window.scrollTo({ top: 0, behavior: document.body.classList.contains('no-motion') ? 'auto' : 'smooth' });
    if (page === 'ledger' || focusRecord) updateActivityEstimate();
    if (focusRecord) requestAnimationFrame(() => document.querySelector('.photo-record-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    if (page === 'missions') renderMissions();
    if (page === 'points') renderPointsPage();
    if (page === 'profile') renderUserProfile();
    if (page === 'capabilities') renderCapabilities();
  }

  function toggleLargeText() {
    matureState.largeText = !matureState.largeText;
    document.body.classList.toggle('large-text', matureState.largeText);
    const toggle = document.getElementById('largeTextToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(matureState.largeText));
      toggle.textContent = matureState.largeText ? '已开启 · 关闭' : '未开启 · 开启';
    }
    saveState();
    if (document.getElementById('page-profile')?.classList.contains('active')) renderUserProfile();
  }

  let lastSelectedActivityKind = 'bicycle';
  function updateActivityEstimate() {
    const kindId = document.getElementById('behavior').value;
    const kind = kinds[kindId];
    const input = document.getElementById('activity');
    const checkbox = document.getElementById('unquantified');
    if (kindId !== lastSelectedActivityKind) {
      lastSelectedActivityKind = kindId;
      input.value = kindId === 'meal' ? '1' : '';
      checkbox.checked = false;
    }
    const unquantified = false; // 所有记录都生成估算
    const noEstimate = kind.noEstimate === true;
    const value = Number(input.value) || 0;
    const reduction = Math.round(value * kind.factor * 1000) / 1000;
    document.getElementById('activityLabel').textContent = kind.label;
    document.getElementById('activityHelp').textContent = kind.help;
    document.getElementById('activityHelp').hidden = unquantified;
    document.getElementById('unit').textContent = kind.unit;
    input.placeholder = kind.placeholder;
    input.step = ['meal', 'reuse', 'electricity'].includes(kindId) ? '1' : '0.1';
    input.min = ['meal', 'reuse', 'electricity'].includes(kindId) ? '1' : '0.1';
    input.disabled = unquantified;
    input.closest('.input-unit').hidden = unquantified;
    checkbox.closest('.unquantified-toggle').hidden = true;
    document.getElementById('reuseDetails').hidden = kindId !== 'reuse';
    document.getElementById('electricityDetails').hidden = kindId !== 'electricity';
    document.getElementById('note').placeholder = kindId === 'reuse' ? '可补充物品成色或交接说明（选填）' : kindId === 'electricity' ? '可补充节电场景（选填）' : '补充行动细节（选填）';
    document.getElementById('mealStepper').hidden = unquantified || !['meal', 'reuse', 'electricity'].includes(kindId);
    document.getElementById('mealStepper').querySelector('span').textContent = kindId === 'reuse' ? '件数' : kindId === 'electricity' ? '次' : '份数';
    document.getElementById('mealMinus').onclick = () => { input.value = String(Math.max(1, Number(input.value || 1) - 1)); updateActivityEstimate(); };
    document.getElementById('mealPlus').onclick = () => { input.value = String(Number(input.value || 0) + 1); updateActivityEstimate(); };
    document.getElementById('estimateValue').textContent = unquantified || noEstimate ? '暂不估算' : `${reduction.toFixed(2)} kgCO₂e`;
    document.getElementById('estimatePoints').textContent = pointsForNewAction() ? '5 积分' : '今日已达上限';
  }

  function saveActivityRecord() {
    const kind = document.getElementById('behavior').value;
    const unquantified = false; // 所有记录都生成估算
    const value = unquantified ? 0 : Number(document.getElementById('activity').value);
    const noEstimate = kinds[kind].noEstimate === true;
    if (!unquantified && (!Number.isFinite(value) || value <= 0 || (['meal', 'reuse', 'electricity'].includes(kind) && !Number.isInteger(value)))) { showToast(kind === 'meal' ? '光盘行动请填写整数份数' : kind === 'reuse' ? '请填写处理物品的整数件数' : kind === 'electricity' ? '请填写节电行动次数' : '请填写有效活动量，或选择“只记录行为”'); return; }
    if (kind === 'reuse' && (!document.getElementById('itemCategory').value || !document.getElementById('itemDestination').value)) { showToast('请选择物品类别和具体处理去向'); return; }
    if (kind === 'electricity' && !document.getElementById('electricityAction').value) { showToast('请选择实际做过的节电行动'); return; }
    if (kind === 'electricity' && document.getElementById('electricityAction').value === '其他节电行动' && !document.getElementById('note').value.trim()) { showToast('请在备注中写明具体节电行动'); return; }
    if (kind === 'reuse' && document.getElementById('itemCategory').value === '其他' && !document.getElementById('note').value.trim()) { showToast('请在备注中写明物品类别'); return; }
    const reduction = unquantified || noEstimate ? 0 : Math.round(value * kinds[kind].factor * 1000) / 1000;
    const points = pointsForNewAction();
    const row = { id: `web_${Date.now()}_${Math.floor(Math.random() * 100000)}`, kind, value, unquantified, notEstimated: noEstimate, actionDetail: kind === 'electricity' ? document.getElementById('electricityAction').value : '', itemCategory: kind === 'reuse' ? document.getElementById('itemCategory').value : '', destination: kind === 'reuse' ? document.getElementById('itemDestination').value : '', note: document.getElementById('note').value.trim(), date: Date.now(), reduction, points, previewAdded: true };
    const previousState = JSON.stringify(matureState);
    records.unshift(row);
    ['filterKind', 'filterStart', 'filterEnd', 'filterKeyword'].forEach(id => { document.getElementById(id).value = ''; });
    activeFilter = { year: '', month: '', kind: '', start: '', end: '', keyword: '' };
    if (!persistAll()) {
      records = records.filter(item => item.id !== row.id);
      matureState = JSON.parse(previousState);
      return;
    }
    document.getElementById('note').value = '';
    document.getElementById('activity').value = '';
    document.getElementById('unquantified').checked = false;
    document.getElementById('itemCategory').value = '';
    document.getElementById('itemDestination').value = '';
    document.getElementById('electricityAction').value = '';
    updateActivityEstimate();
    navigate('history');
    showToast(row.points ? `记录已保存 · +${row.points} 积分` : '记录已保存 · 今日行动积分已达上限');
  }

  function showDialog(title, content, actions) {
    if (document.querySelector('.modal-backdrop')) closeDialog();
    modalReturnFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><h2 id="dialogTitle" tabindex="-1">${title}</h2>${content}<div class="dialog-actions">${actions}</div></section>`;
    backdrop.addEventListener('click', event => { if (event.target === backdrop) closeDialog(); });
    document.body.appendChild(backdrop);
    backdrop.querySelector('button, input, a')?.focus();
    const escHandler = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
      if (event.key !== 'Tab') return;
      const focusable = [...backdrop.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (!first) { event.preventDefault(); backdrop.querySelector('h2').focus(); }
      else if (event.shiftKey && (document.activeElement === first || !backdrop.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !backdrop.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', escHandler);
    backdrop.addEventListener('dialogclosed', () => document.removeEventListener('keydown', escHandler), { once: true });
    return backdrop;
  }

  function closeDialog() {
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
    backdrop?.dispatchEvent(new Event('dialogclosed'));
    if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
  }

  function openEditDialog(encodedId) {
    const row = records.find(item => item.id === decodeURIComponent(encodedId));
    if (!row) return;
    const itemCategories = ['衣物鞋包', '书籍文具', '数码产品', '小家电', '家具家居', '其他'];
    const destinations = [['捐赠', '捐赠给公益机构'], ['转赠亲友', '转赠亲友'], ['正规回收', '送至正规回收点'], ['二手转卖', '二手转卖'], ['维修后继续使用', '维修后继续使用']];
    const legacyPower = isLegacyPowerRow(row);
    const detailFields = row.kind === 'reuse' ? `<div class="dialog-field"><label for="editItemCategory">物品类别</label><select id="editItemCategory">${itemCategories.map(value => `<option ${row.itemCategory === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="dialog-field"><label for="editDestination">具体处理去向</label><select id="editDestination">${destinations.map(([value, label]) => `<option value="${value}" ${row.destination === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>` : row.kind === 'electricity' && !legacyPower ? `<div class="dialog-field"><label for="editActionDetail">具体节电行动</label><select id="editActionDetail">${electricityActions.map(value => `<option ${row.actionDetail === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>` : '';
    const noEstimate = kinds[row.kind].noEstimate === true && !legacyPower;
    const valueLabel = legacyPower ? '历史活动电量' : kinds[row.kind].label;
    const valueUnit = legacyPower ? '千瓦时' : kinds[row.kind].unit;
    const integerValue = ['meal', 'reuse'].includes(row.kind) || (row.kind === 'electricity' && !legacyPower);
    const backdrop = showDialog('编辑低碳记录', `<p>${legacyPower ? '这是旧版节电估算记录；新记录已改为选择具体行动。' : `${esc(kinds[row.kind].name)}${noEstimate ? ' · 此类别只记录行动和数量，不计算减排。' : ' · 修改后重新计算演示估算，原有行动积分不变。'}`}</p><label class="unquantified-toggle edit-unquantified" ${noEstimate ? 'hidden' : ''}><input id="editUnquantified" type="checkbox" ${row.unquantified ? 'checked' : ''}><span><b>只记录行为，不估算减排</b></span></label>${detailFields}<div class="dialog-field" id="editValueField"><label for="editValue">${esc(valueLabel)}（${esc(valueUnit)}）</label><input id="editValue" type="number" min="${integerValue ? '1' : '0.1'}" step="${integerValue ? '1' : '0.1'}" value="${Number(row.value) || ''}" ${row.unquantified ? 'disabled' : ''}></div><div class="dialog-field"><label for="editNote">备注</label><textarea id="editNote">${esc(row.note || '')}</textarea></div>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">取消</button><button class="dialog-primary" id="saveEditButton">保存修改</button>');
    const editUnquantified = backdrop.querySelector('#editUnquantified');
    if (editUnquantified) editUnquantified.addEventListener('change', event => { backdrop.querySelector('#editValue').disabled = event.target.checked; });
    backdrop.querySelector('#saveEditButton').addEventListener('click', () => {
      const unquantified = editUnquantified?.checked === true;
      const value = unquantified ? 0 : Number(backdrop.querySelector('#editValue').value);
      if (!unquantified && (!Number.isFinite(value) || value <= 0 || (integerValue && !Number.isInteger(value)))) { showToast(row.kind === 'meal' ? '光盘行动请填写整数份数' : row.kind === 'reuse' ? '请填写处理物品的整数件数' : row.kind === 'electricity' && !legacyPower ? '请填写节电行动次数' : '请填写有效活动量，或选择“只记录行为”'); return; }
      if (row.kind === 'reuse' && (!backdrop.querySelector('#editItemCategory').value || !backdrop.querySelector('#editDestination').value)) { showToast('请选择物品类别和处理去向'); return; }
      if (row.kind === 'electricity' && !legacyPower && !backdrop.querySelector('#editActionDetail').value) { showToast('请选择实际做过的节电行动'); return; }
      if (row.kind === 'electricity' && !legacyPower && backdrop.querySelector('#editActionDetail').value === '其他节电行动' && !backdrop.querySelector('#editNote').value.trim()) { showToast('请在备注中写明具体节电行动'); return; }
      if (row.kind === 'reuse' && backdrop.querySelector('#editItemCategory').value === '其他' && !backdrop.querySelector('#editNote').value.trim()) { showToast('请在备注中写明物品类别'); return; }
      row.unquantified = unquantified;
      row.notEstimated = noEstimate;
      row.value = value;
      if (row.kind === 'reuse') {
        row.itemCategory = backdrop.querySelector('#editItemCategory').value;
        row.destination = backdrop.querySelector('#editDestination').value;
      }
      if (row.kind === 'electricity' && !legacyPower) row.actionDetail = backdrop.querySelector('#editActionDetail').value;
      row.note = backdrop.querySelector('#editNote').value.trim();
      row.reduction = unquantified || noEstimate ? 0 : Math.round(value * (legacyPower ? 0.52 : kinds[row.kind].factor) * 1000) / 1000;
      row.previewAdded = true;
      closeDialog(); persistAll(); showToast(noEstimate ? '旧物回收记录已更新 · 原积分不变' : '记录已更新 · 原积分不变');
    });
  }

  function requestDelete(encodedId) {
    const row = records.find(item => item.id === decodeURIComponent(encodedId));
    if (!row) return;
      const activityDescription = row.unquantified ? '仅记录行为，未估算减排' : `${Number(row.value)} ${esc(kinds[row.kind].unit)}`;
    const backdrop = showDialog('确认删除这条记录？', `<p>将删除「${esc(kinds[row.kind].name)}」${activityDescription}的记录。对应记录积分会从当前余额中移除；已领取的日常任务积分不会重复发放或被追溯扣回。</p>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">保留记录</button><button class="dialog-danger" id="confirmDeleteButton">删除记录</button>');
    backdrop.querySelector('#confirmDeleteButton').addEventListener('click', () => {
      records = records.filter(item => item.id !== row.id);
      closeDialog(); persistAll(); showToast('记录已删除');
    });
  }

  function editWeeklyGoal() {
    const backdrop = showDialog('设置每周估算参考目标', `<p>这个目标只跟踪有来源和计量依据的估算值，不会把行动次数换算成碳量。</p><div class="dialog-field"><label for="weeklyGoalInput">每周参考目标（kg CO₂）</label><input id="weeklyGoalInput" type="number" min="0.1" max="10000" step="0.5" value="${Number(matureState.settings.weeklyGoalKg) || 3}"></div>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">取消</button><button class="dialog-primary" id="saveGoalButton">保存目标</button>');
    backdrop.querySelector('#saveGoalButton').addEventListener('click', () => {
      const value = Number(backdrop.querySelector('#weeklyGoalInput').value);
      if (!Number.isFinite(value) || value <= 0 || value > 10000) { showToast('请输入 0.1 至 10000 之间的目标'); return; }
      matureState.settings.weeklyGoalKg = value; closeDialog(); saveState(); renderGoal();
      if (document.getElementById('page-profile')?.classList.contains('active')) renderUserProfile();
      showToast('每周目标已更新');
    });
  }

  function renderRewards() { renderMissions(); }

  function showRewardDetail(rewardId) {
    const reward = rewards.find(item => item.id === rewardId);
    if (!reward) return;
    const balance = getBalance().available;
    const owned = matureState.redemptions.filter(item => item.rewardId === reward.id).length;
    const missingCertificateRecord = reward.category === 'certificate' && !records.some(row => !row.demoSeed);
    const details = `<p class="reward-detail-description">${esc(reward.text)}</p><p class="reward-detail-note">仅生成应用内数字内容，保存在当前个人成就中，不涉及实物或邮寄。</p>`;
    const unavailable = (!reward.repeatable && owned > 0) || missingCertificateRecord;
    const actions = `<button class="dialog-secondary" onclick="closeMatureDialog()">再看看</button>${missingCertificateRecord ? '<button class="dialog-primary" disabled>先记录一次行动</button>' : unavailable ? '<button class="dialog-primary" disabled>已收藏</button>' : balance < reward.points ? `<button class="dialog-primary" disabled>还差 ${balance >= 0 ? reward.points - balance : reward.points} 积分</button>` : `<button class="dialog-primary" id="rewardDetailRedeem">立即兑换 · ${reward.points} 分</button>`}`;
    const categoryLabel = { certificate: '个人记录证书', memory: '数字纪念卡', title: '主页称号', background: '主页主题' }[reward.category] || '数字纪念奖励';
    const backdrop = showDialog('纪念详情', `<div class="reward-detail-view">${renderRewardArt(reward, true)}<span class="reward-type-label">${categoryLabel}</span><h3>${esc(reward.title)}</h3><p class="reward-detail-description">${esc(reward.text)}</p><div class="reward-detail-price"><span>所需积分</span><b>${reward.points}<small> 分</small></b><span>你有 ${balance} 分${owned ? ` · 已收藏 ${owned} 次` : ''}</span></div>${details}</div>`, actions);
    backdrop.querySelector('.dialog').scrollTop = 0;
    backdrop.querySelector('#dialogTitle').focus({ preventScroll: true });
    backdrop.querySelector('#rewardDetailRedeem')?.addEventListener('click', () => { closeDialog(); redeemReward(reward.id); });
  }

  function redeemReward(rewardId) {
    const reward = rewards.find(item => item.id === rewardId);
    if (!reward) return;
    if (reward.category === 'certificate' && !records.some(row => !row.demoSeed)) { showToast('先保存一条真实行动记录，再来生成证书'); return; }
    if (!reward.repeatable && matureState.redemptions.some(item => item.rewardId === reward.id)) { showToast('这份数字纪念已经收藏'); return; }
    if (getBalance().available < reward.points) { showToast('积分不足'); return; }
    const notice = `<div class="reward-exchange-confirm-preview">${renderRewardArt(reward, true)}<p>${esc(reward.text)}</p></div><div class="reward-disclaimer">确认后扣除 ${reward.points} 积分，获得应用内数字纪念；不会产生实物订单或邮寄。</div>`;
    const backdrop = showDialog(`确认兑换「${reward.title}」？`, notice, '<button class="dialog-secondary" onclick="closeMatureDialog()">再想想</button><button class="dialog-primary" id="confirmRedeemButton">确认兑换</button>');
    backdrop.querySelector('#confirmRedeemButton').addEventListener('click', () => {
      if (getBalance().available < reward.points || (!reward.repeatable && matureState.redemptions.some(item => item.rewardId === reward.id))) {
        closeDialog(); renderAll(); showToast('积分或收藏状态已变化，请重新查看'); return;
      }
      const previousProfile = { ...matureState.profile };
      const createdAt = Date.now();
      const redemption = { id: `redeem_${createdAt}_${Math.floor(Math.random() * 100000)}`, rewardId, title: reward.title, cost: reward.points, createdAt, virtual: true, physical: false, status: '已领取' };
      if (['certificate', 'memory'].includes(reward.category)) redemption.snapshot = CarbonMateRecordData.certificateSnapshot(records, kinds, matureState.profile.displayName, createdAt);
      matureState.redemptions.push(redemption);
      if (reward.category === 'title') { matureState.profile.activeTitleId = reward.id; matureState.profile.customTitle = reward.displayTitle || reward.title; }
      if (reward.category === 'background') matureState.profile.activeBackgroundId = reward.id;
      if (!saveState()) {
        matureState.redemptions = matureState.redemptions.filter(item => item.id !== redemption.id);
        matureState.profile = previousProfile;
        return;
      }
      closeDialog(); renderAll(); showToast('已兑换数字纪念');
      if (['certificate', 'memory'].includes(reward.category)) showCertificate(reward, redemption);
      else showRewardUnlocked(reward, redemption);
    });
  }

  function showRewardUnlocked(reward, redemption) {
    const owned = matureState.redemptions.filter(item => item.rewardId === reward.id).length;
    showDialog('已收入数字纪念册', `<div class="reward-unlocked-card">${renderRewardArt(reward, true)}<h3>${esc(reward.title)}</h3><p>${esc(reward.text)}</p><small>已收藏 ${owned} 次 · 可在个人资料或奖励页查看</small></div>`, '<button class="dialog-primary" onclick="closeMatureDialog()">完成</button>');
  }

  function showCertificate(reward, redemption) {
    const issueDate = new Date(redemption.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    const snapshot = redemption.snapshot;
    const recordCount = snapshot ? esc(snapshot.recordCount) : '—';
    const fullDate = value => new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const period = snapshot?.periodStart ? `${fullDate(snapshot.periodStart)} 至 ${fullDate(snapshot.periodEnd)}` : '旧版证书未留存统计快照';
    const activeDays = snapshot ? esc(snapshot.activeDays) : '—';
    const categories = Array.isArray(snapshot?.categories) ? snapshot.categories.map(item => String(item).slice(0, 60)) : [];
    const serial = `CM-${new Date(redemption.createdAt).getFullYear()}-${String(redemption.id).replace(/^redeem_/, '')}`;
    const certificateTitle = reward.title;
    showDialog('个人成就记录凭证', `<article id="certificate" class="certificate-document"><header><span class="certificate-mark">CM</span><div><b>碳伴 CarbonMate</b><small>个人低碳实践记录</small></div><span class="certificate-serial">${esc(serial)}</span></header><div class="certificate-rule"></div><p class="certificate-kicker">RECORD OF LOW-CARBON PRACTICE</p><h2>${esc(certificateTitle)}</h2><p class="certificate-intro">兹记录 <strong>${esc(snapshot?.displayName || matureState.profile.displayName)}</strong> 在日常生活中持续参与低碳行动，现将本应用内保存的实践记录汇总如下：</p><div class="certificate-stats"><div><b>${recordCount}</b><span>条行动记录</span></div><div><b>${activeDays}</b><span>个行动日</span></div><div><b>${snapshot ? categories.length : '—'}</b><span>类行动</span></div></div><div class="certificate-period"><span>记录周期</span><b>${esc(period)}</b></div><p class="certificate-categories"><span>记录类别</span><b>${esc(categories.join(' · ') || '暂无记录')}</b></p><div class="certificate-signatures"><div><b>碳伴 CarbonMate</b><span>应用内记录汇总</span></div><div><b>${issueDate}</b><span>生成日期</span></div></div><footer><span>编号 ${esc(serial)}</span><span>个人成就记录 · 非第三方认证</span></footer><p class="certificate-disclaimer">本凭证根据用户在本应用中的自述记录自动生成，仅用于个人回顾与纪念，不代表第三方认证、植树捐赠或经核证的减排证明；旧版演示数据不计入证书统计。</p></article>`, '<button class="dialog-secondary" onclick="closeMatureDialog()">关闭</button><button class="dialog-primary" id="printCertificate">打印 / 保存 PDF</button>');
    document.getElementById('printCertificate').addEventListener('click', () => window.print());
  }

  function openFactorDialog() {
    const rows = Object.entries(kinds).map(([id, item]) => `<tr><td><span class="history-kind">${lineIcon(id)} ${esc(item.name)}</span></td><td>${id === 'electricity' ? '仅计量电量可估算：0.5306 kg CO₂/kWh' : '仅记录行动，不估算'}</td></tr>`).join('');
    showDialog('碳量估算依据', `<p>行动记录与碳量估算分开处理。没有可追溯的活动量或适用因子时，只保存行动和积分，不生成碳量。</p><div class="table-wrap"><table class="data-table"><thead><tr><th>行为</th><th>统计方式</th></tr></thead><tbody>${rows}</tbody></table></div><div class="reward-disclaimer">电力因子：生态环境部、国家统计局《2023年电力二氧化碳排放因子》，全国平均 0.5306 kg CO₂/kWh，2025 年发布。仅适用于用户确认的节电 kWh，不是个人完整碳足迹，也不是经第三方核证的减排量。旧版 DEMO_V1 历史值保留回看，但不计入汇总。</div>`, '<button class="dialog-primary" onclick="closeMatureDialog()">知道了</button>');
  }

  function toNativeRecord(row) {
    const kind = kinds[row.kind];
    const verified = CarbonMateRecordData.isEstimated(row);
    return { id: row.id, demoSeed: row.demoSeed === true, behaviorType: TYPE[row.kind], behaviorName: kind.name, activityValue: row.value, activityUnit: verified ? 'kWh' : kind.unit, unquantified: row.unquantified === true, notEstimated: !verified, actionDetail: row.actionDetail || '', itemCategory: row.itemCategory || '', destination: row.destination || '', factorId: verified ? row.factorId : Number(row.reduction || 0) > 0 ? (row.factorId || `${row.kind.toUpperCase()}_DEMO`) : 'NOT_ESTIMATED', factorVersion: verified ? row.factorVersion : Number(row.reduction || 0) > 0 ? (row.factorVersion || 'DEMO_V1') : 'NONE', factorSource: verified ? (row.factorSource || '生态环境部、国家统计局《2023年电力二氧化碳排放因子》') : Number(row.reduction || 0) > 0 ? '旧版演示/未核验估算' : '只记录实际行动和数量，不计算减排', reductionKg: row.reduction, points: row.points, note: row.note || '', createdAt: row.date };
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadBackup() {
    const backup = { app: 'CarbonMate', formatVersion: 1, schemaVersion: 2, createdAt: Date.now(), records: records.map(toNativeRecord), webState: matureState };
    downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' }), `CarbonMate_backup_${dayKey(Date.now())}.json`);
    showToast('完整 JSON 备份已下载');
  }

  function csvEscape(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }

  function exportCsv(rows = getFilteredRecords()) {
    if (!rows.length) { showToast('当前范围没有可导出的记录'); return; }
    const lines = [['ID', '行为', '具体行动', '物品类别', '处理去向', '活动量', '单位', '记录方式', '碳排放估算kgCO2', '积分', '备注', '时间', '因子版本']];
    rows.forEach(row => {
      const verified = CarbonMateRecordData.isEstimated(row);
      const legacyEstimate = Number(row.reduction || 0) > 0 && !verified;
      lines.push([row.id, kinds[row.kind].name, row.actionDetail || '', row.itemCategory || '', row.destination || '', row.unquantified ? '' : row.value, row.unquantified ? '' : verified ? 'kWh' : kinds[row.kind].unit, verified ? '计量电量 · 来源因子估算' : legacyEstimate ? '旧版演示值 · 不计汇总' : '记录行动，不估算', verified ? row.reduction : '', row.points, row.note, new Date(row.date).toLocaleString('zh-CN'), verified ? row.factorVersion : legacyEstimate ? (row.factorVersion || 'DEMO_V1') : 'NONE']);
    });
    const csv = '\ufeff' + lines.map(line => line.map(csvEscape).join(',')).join('\r\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `CarbonMate_${dayKey(Date.now())}.csv`);
    showToast(`CSV 已导出，共 ${rows.length} 条记录`);
  }

  function validateBackup(data) {
    return CarbonMateRecordData.validateBackup(data, kinds, reverseType, electricityActions);
  }

  function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('备份文件超过 5 MB 上限'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onerror = () => showToast('无法读取所选文件');
    reader.onload = () => {
      try {
        const parsed = validateBackup(JSON.parse(String(reader.result)));
        const existing = new Set(records.map(row => row.id));
        const fresh = parsed.accepted.filter(row => !existing.has(row.id));
        const preview = parsed.accepted.slice(0, 5).map(row => esc(`${kinds[row.kind].name} · ${row.actionDetail || row.itemCategory || (row.unquantified ? '仅记录行为' : `${Number(row.value)} ${kinds[row.kind].unit}`)} · ${fmtDate(row.date)}`)).join('<br>');
        const skipped = parsed.accepted.length - fresh.length + parsed.invalid.length;
        const content = `<p>文件记录 ${parsed.accepted.length + parsed.invalid.length} 条；准备新增 <strong>${fresh.length}</strong> 条；重复或无效 <strong>${skipped}</strong> 条。导入只添加新 ID，不覆盖、不删除现有记录。</p><div class="preview-list">${preview}${parsed.accepted.length > 5 ? '<br>…' : ''}</div><div class="reward-disclaimer">将验证版本标记、字段类型、日期、活动量、积分和重复 ID。完整备份中的偏好设置和兑换记录也会合并，积分兑换记录不会重复写入。</div>`;
        const backdrop = showDialog('导入前预览', content, '<button class="dialog-secondary" onclick="closeMatureDialog()">取消</button><button class="dialog-primary" id="applyImportButton">确认导入</button>');
        backdrop.querySelector('#applyImportButton').addEventListener('click', () => {
          records = [...fresh, ...records];
          if (parsed.webState) mergeWebState(parsed.webState);
          closeDialog(); if (!persistAll()) return;
          showToast(`导入完成：新增 ${fresh.length} 条，跳过 ${skipped} 条`);
        });
      } catch (error) {
        showToast(error instanceof Error ? error.message : '备份校验失败');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  function mergeWebState(other) {
    const taskIds = new Set(matureState.taskClaims.map(item => item.id));
    (Array.isArray(other.taskClaims) ? other.taskClaims : []).forEach(item => {
      const task = item && tasks.find(candidate => candidate.id === item.taskId);
      const periodKey = task?.group === 'weekly' ? item.periodKey : item?.day;
      const validPeriod = task?.group === 'weekly' ? /^week:\d{4}-\d{2}-\d{2}$/.test(periodKey || '') : /^\d{4}-\d{2}-\d{2}$/.test(periodKey || '');
      if (task && validPeriod && item.id === `${periodKey}:${item.taskId}` && Number.isInteger(item.points) && item.points === task.points && !taskIds.has(item.id)) {
        matureState.taskClaims.push(item); taskIds.add(item.id);
      }
    });
    const redemptionIds = new Set(matureState.redemptions.map(item => item.id));
    (Array.isArray(other.redemptions) ? other.redemptions : []).forEach(item => {
      const reward = item && (rewards.find(candidate => candidate.id === item.rewardId && candidate.title === item.title && candidate.points === item.cost) || legacyPhysicalRewards.find(candidate => candidate.id === item.rewardId) || legacyDigitalRewards.find(candidate => candidate.id === item.rewardId));
      const rewardTypeMatches = reward && (reward.physical ? item.physical === true && item.virtual === false : item.virtual === true && item.physical !== true);
      const issuedAt = Number(item?.createdAt);
      if (reward && rewardTypeMatches && item.title === reward.title && item.cost === reward.points &&
          typeof item.id === 'string' && item.id.length <= 120 && Number.isFinite(issuedAt) && issuedAt > 0 && issuedAt <= Date.now() + 300000 && !redemptionIds.has(item.id)) {
        const importedRedemption = { ...item, createdAt: issuedAt };
        if (['certificate', 'memory'].includes(reward.category)) {
          importedRedemption.snapshot = CarbonMateRecordData.normalizeCertificateSnapshot(item.snapshot, issuedAt);
        }
        matureState.redemptions.push(importedRedemption); redemptionIds.add(item.id);
      }
    });
    const badgeIds = new Set(matureState.earnedBadges.map(item => item.id));
    (Array.isArray(other.earnedBadges) ? other.earnedBadges : []).forEach(item => {
      if (item && badgeRules.some(badge => badge.id === item.id) && !badgeIds.has(item.id)) {
        matureState.earnedBadges.push(item); badgeIds.add(item.id);
      }
    });
    if (other.settings && Number.isFinite(other.settings.weeklyGoalKg) && other.settings.weeklyGoalKg > 0) matureState.settings.weeklyGoalKg = other.settings.weeklyGoalKg;
    if (other.settings && homeRanges.includes(other.settings.homeRange)) {
      matureState.settings.homeRange = other.settings.homeRange;
      activeHomeRange = other.settings.homeRange;
    }
    if (other.settings && ['period', 'cumulative'].includes(other.settings.chartMode)) chartMode = matureState.settings.chartMode = other.settings.chartMode;
    if (other.settings && typeof other.settings.homeStart === 'string' && typeof other.settings.homeEnd === 'string') {
      matureState.settings.homeStart = other.settings.homeStart;
      matureState.settings.homeEnd = other.settings.homeEnd;
    }
    if (other.profile && typeof other.profile.displayName === 'string') matureState.profile = normalizeProfile(other.profile);
    if (other.family && typeof other.family === 'object') {
      const importedFamily = normalizeFamily(other.family);
      if (!matureState.family.name && importedFamily.name) matureState.family.name = importedFamily.name;
      const familyMemberIds = new Set(matureState.family.members.map(member => member.id));
      importedFamily.members.forEach(member => { if (!familyMemberIds.has(member.id) && matureState.family.members.length < 12) { matureState.family.members.push(member); familyMemberIds.add(member.id); } });
      const familyRecordIds = new Set(matureState.family.records.map(row => row.id));
      importedFamily.records.forEach(row => { if (!familyRecordIds.has(row.id)) { matureState.family.records.push(row); familyRecordIds.add(row.id); } });
    }
    if (other.shareSettings && typeof other.shareSettings.hideName === 'boolean') matureState.shareSettings = { hideName: other.shareSettings.hideName };
    matureState.largeText = matureState.largeText || other.largeText === true;
    const importedLearning = other.learningProgress;
    if (importedLearning && Array.isArray(importedLearning.completedLevels)) {
      const validLevels = importedLearning.completedLevels.filter(id => Number.isInteger(id) && id >= 1 && id <= learningLevels.length);
      const available = new Set([...matureState.learningProgress.completedLevels, ...validLevels]);
      const merged = [];
      let unlockedLevel = 1;
      while (available.has(unlockedLevel)) { merged.push(unlockedLevel); if (unlockedLevel < learningLevels.length) unlockedLevel += 1; else break; }
      matureState.learningProgress.completedLevels = merged;
      matureState.learningProgress.unlockedLevel = Math.max(matureState.learningProgress.unlockedLevel, unlockedLevel);
      if (Number.isSafeInteger(importedLearning.quizAttempts) && importedLearning.quizAttempts >= 0) matureState.learningProgress.quizAttempts = Math.max(matureState.learningProgress.quizAttempts, importedLearning.quizAttempts);
      if (Number.isSafeInteger(importedLearning.quizCorrect) && importedLearning.quizCorrect >= 0) matureState.learningProgress.quizCorrect = Math.max(matureState.learningProgress.quizCorrect, Math.min(importedLearning.quizCorrect, matureState.learningProgress.quizAttempts));
    }
  }

  function closeMatureDialog() { closeDialog(); }

  window.render = renderAll;
  window.openAnalysisDetails = openAnalysisDetails;
  window.setAnalysisRange = setAnalysisRange;
  window.setAnalysisDate = setAnalysisDate;
  window.shiftAnalysisPeriod = shiftAnalysisPeriod;
  window.persist = persistAll;
  window.showPage = navigate;
  window.updateEstimate = updateActivityEstimate;
  window.saveRecord = saveActivityRecord;
  window.editRecord = openEditDialog;
  window.deleteRecord = requestDelete;
  window.downloadBackup = downloadBackup;
  window.restoreBackup = event => handleImportFile(event);
  window.closeMatureDialog = closeMatureDialog;
  window.editWeeklyGoal = editWeeklyGoal;
  window.redeemReward = redeemReward;

  ensureLedgerPage();
  ensureNewNavigation();
  ensureHomeLayout();
  ensureMissionPage();
  ensurePointsPage();
  ensureProfilePage();
  ensureCapabilityPage();
  document.getElementById('homeMoreDates').onclick = openAnalysisDetails;
  const homeAnalysisButton = document.getElementById('homeOpenAnalysis');
  if (homeAnalysisButton) homeAnalysisButton.onclick = openAnalysisDetails;
  document.body.dataset.activePage = 'home';
  const previewBehavior = new URLSearchParams(window.location.search).get('behavior');
  if (previewBehavior && kinds[previewBehavior]) {
    document.getElementById('behavior').value = previewBehavior;
    lastSelectedActivityKind = previewBehavior;
  }
  updateActivityEstimate();
  document.body.classList.toggle('large-text', matureState.largeText);
  document.querySelectorAll('[data-chart-mode]').forEach(button => button.addEventListener('click', () => {
    chartMode = button.dataset.chartMode;
    matureState.settings.chartMode = chartMode;
    saveState();
    renderHomeDashboard();
  }));
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
  qualifyTasks();
  unlockBadges();
  renderAll();
  const privacyNotice = document.querySelector('.privacy');
  if (privacyNotice) privacyNotice.innerHTML = '<strong>◉ 记录保存在本机</strong>记录保存在当前浏览器；只有你在识别前明确确认，照片才会发送至 DeepSeek 云端，且不会作为记录附件保存。';
  const requestedPage = new URLSearchParams(window.location.search).get('page');
  const knownPages = ['home', 'ledger', 'record', 'history', 'data', 'learn', 'profile', 'capabilities', 'missions', 'points', 'analysis'];
  navigate(knownPages.includes(requestedPage) ? requestedPage : 'home');
  learningNavigationInitialized = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshCalendarIfNeeded();
  });
  window.addEventListener('focus', refreshCalendarIfNeeded);
  scheduleCalendarRefresh();
})();
