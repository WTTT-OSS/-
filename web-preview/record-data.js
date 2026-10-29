/* Shared data rules for the browser preview and its regression tests.
 *
 * 因子表与原生端 FactorRepository 保持一致：kind → [kg CO2/单位, 等级]。
 * 网页端据此校验记录中的数值是否与因子和活动量一致，避免演示数据与设备数据脱节。
 */
(() => {
  const SNAPSHOT_KEY = 'carbonmate-preview-snapshot-v1';

  const FACTORS = {
    bicycle: [0.171, 'reference'],
    walk: [0.171, 'reference'],
    bus: [0.052, 'reference'],
    metro: [0.041, 'reference'],
    electricity: [0.5306, 'verified'],
    water: [0.0003, 'reference'],
    recycle: [1.1, 'reference'],
    meal: [0.15, 'reference'],
    reuse: [3, 'reference']
  };

  const realRecords = rows => rows.filter(row => row.demoSeed !== true && !String(row.id || '').startsWith('demo_'));

  const isEstimated = row => {
    if (!row || !FACTORS[row.kind]) return false;
    if (row.notEstimated === true || row.unquantified === true) return false;
    const value = Number(row.value ?? row.activityValue);
    const reduction = Number(row.reduction ?? row.reductionKg);
    if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(reduction) || reduction < 0) return false;
    const expected = Math.round(value * FACTORS[row.kind][0] * 10000) / 10000;
    return Math.abs(reduction - expected) < 0.0005;
  };

  const isVerifiedEstimate = row => isEstimated(row) && FACTORS[row.kind][1] === 'verified' &&
    row.factorId === 'energy_electricity_cn_2023' && row.factorVersion === 'CN-EF-2023-V1';

  const tierLabel = row => {
    if (isVerifiedEstimate(row)) return '官方因子';
    if (isEstimated(row)) return '参考估算';
    if (row && row.factorVersion === 'DEMO_V1') return '旧版演示值';
    return '未估算';
  };

  const dayKey = value => {
    const date = new Date(Number(value));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  function certificateSnapshot(rows, kinds, displayName, issuedAt = Date.now()) {
    const saved = realRecords(rows).filter(row => Number.isFinite(Number(row.date)) && Number(row.date) <= issuedAt);
    const dates = saved.map(row => Number(row.date)).sort((a, b) => a - b);
    return {
      displayName: String(displayName || '绿色生活家'), recordCount: saved.length,
      activeDays: new Set(saved.map(row => dayKey(row.date))).size,
      categories: [...new Set(saved.map(row => kinds[row.kind]?.name).filter(Boolean))],
      periodStart: dates[0] || null, periodEnd: dates.at(-1) || null
    };
  }

  function normalizeCertificateSnapshot(value, issuedAt) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const recordCount = Number(value.recordCount), activeDays = Number(value.activeDays);
    const start = value.periodStart == null ? null : Number(value.periodStart);
    const end = value.periodEnd == null ? null : Number(value.periodEnd);
    const validDate = date => date == null || (Number.isFinite(date) && date > 0 && date <= issuedAt);
    if (!Number.isSafeInteger(recordCount) || recordCount < 0 || recordCount > 1000000 ||
        !Number.isSafeInteger(activeDays) || activeDays < 0 || activeDays > recordCount ||
        !validDate(start) || !validDate(end) || ((start == null) !== (end == null)) || (start != null && end != null && start > end) ||
        !Array.isArray(value.categories) || value.categories.length > 20) return null;
    const categories = value.categories.filter(item => typeof item === 'string').slice(0, 20).map(item => item.slice(0, 60));
    return {
      displayName: typeof value.displayName === 'string' ? value.displayName.slice(0, 40) : '绿色生活家',
      recordCount, activeDays, categories, periodStart: start, periodEnd: end
    };
  }

  function readSnapshot(storage) {
    const raw = storage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !Array.isArray(value.records) || !value.state || typeof value.state !== 'object') throw new Error('本地数据格式不正确');
    return value;
  }

  function writeSnapshot(storage, records, state) {
    const serialized = JSON.stringify({ version: 1, records, state });
    // A single localStorage write commits the records and their points together.
    storage.setItem(SNAPSHOT_KEY, serialized);
    if (storage.getItem(SNAPSHOT_KEY) !== serialized) throw new Error('本地保存校验失败');
  }

  function validateBackup(data, kinds, reverseType, electricityActions, now = Date.now()) {
    if (!data || data.app !== 'CarbonMate' || data.formatVersion !== 1 || !Array.isArray(data.records)) throw new Error('不是受支持的 CarbonMate 备份格式');
    if (data.records.length > 100000) throw new Error('记录数量超过 100000 条的安全上限');
    const accepted = [], invalid = [], seen = new Set();
    data.records.forEach((raw, index) => {
      if (!raw || typeof raw !== 'object') { invalid.push(index + 1); return; }
      const kind = raw.kind || reverseType[raw.behaviorType];
      const id = String(raw.id || `import_${index}_${raw.createdAt || raw.date || ''}`);
      const value = Number(raw.activityValue ?? raw.value), date = Number(raw.createdAt ?? raw.date);
      const reduction = Number(raw.reductionKg ?? raw.reduction), points = Number(raw.points);
      const note = String(raw.note || ''), actionDetail = String(raw.actionDetail || '');
      const itemCategory = String(raw.itemCategory || ''), destination = String(raw.destination || raw.itemDestination || '');
      const demoSeed = raw.demoSeed === true || id.startsWith('demo_');
      const unquantified = raw.unquantified === true;
      const notEstimated = raw.notEstimated === true || raw.factorVersion === 'NO_ESTIMATE_V1';
      const integerQuantity = ['meal', 'reuse'].includes(kind) || (kind === 'electricity' && !notEstimated);
      const invalidQuantity = unquantified ? value !== 0 : value <= 0 || (!demoSeed && integerQuantity && !Number.isInteger(value));
      if (!id || id.length > 200 || !kinds[kind] || !Number.isFinite(value) || invalidQuantity ||
          !Number.isFinite(date) || date <= 0 || date > now + 300000 ||
          !Number.isFinite(reduction) || reduction < 0 || !Number.isSafeInteger(points) || points < 0 || note.length > 2000 ||
          ((notEstimated || unquantified) && reduction !== 0) ||
          (!demoSeed && kind === 'reuse' && (!notEstimated || !itemCategory || !destination)) ||
          (!demoSeed && kind === 'electricity' && notEstimated && !electricityActions.includes(actionDetail)) || seen.has(id)) {
        invalid.push(index + 1); return;
      }
      seen.add(id);
      accepted.push({ id, kind, value, date, reduction, points, note, actionDetail, itemCategory, destination, unquantified, notEstimated, demoSeed, factorId: raw.factorId || '', factorVersion: raw.factorVersion || '', factorSource: raw.factorSource || '', previewAdded: true });
    });
    if (data.records.length && !accepted.length) throw new Error('备份中没有有效记录');
    return { accepted, invalid, webState: data.webState || null };
  }

  globalThis.CarbonMateRecordData = Object.freeze({
    FACTORS, realRecords, isEstimated, isVerifiedEstimate, tierLabel,
    certificateSnapshot, normalizeCertificateSnapshot,
    readSnapshot, writeSnapshot, validateBackup
  });
})();
