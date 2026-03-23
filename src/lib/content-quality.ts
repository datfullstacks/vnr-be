import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  ExplorerSnapshot,
  HistoricalAdminUnitRecord,
  OverlayRecord,
  PeriodRecord,
  PlaceRecord,
  QuizRecord,
  SourceRecord,
} from '@/lib/content-types'

export type ContentQualitySeverity = 'error' | 'warning' | 'info'

export type ContentQualityIssue = {
  collection: string
  message: string
  rule: string
  scoreImpact: number
  severity: ContentQualitySeverity
  slug: string
  title: string
}

export type ContentQualityRecord = {
  collection: string
  errorCount: number
  infoCount: number
  issues: ContentQualityIssue[]
  score: number
  slug: string
  title: string
  warningCount: number
}

export type ContentQualityCollectionSummary = {
  averageScore: number
  collection: string
  count: number
  errorCount: number
  infoCount: number
  lowestScore: number
  warningCount: number
}

export type ContentQualityRuleSummary = {
  count: number
  rule: string
  severity: ContentQualitySeverity
}

export type ContentQualityReport = {
  collectionSummaries: ContentQualityCollectionSummary[]
  generatedAt: string
  overallAverageScore: number
  records: ContentQualityRecord[]
  ruleSummaries: ContentQualityRuleSummary[]
  snapshotSource: 'fallback-demo' | 'payload-public'
  totalErrors: number
  totalInfos: number
  totalIssues: number
  totalRecords: number
  totalWarnings: number
}

type RecordDraft = {
  collection: string
  issues: ContentQualityIssue[]
  score: number
  slug: string
  title: string
}

type LocationLike = {
  historicalGeometry?: Record<string, unknown>
  modernLocation?: {
    label?: string
    latitude?: number
    longitude?: number
    province?: string
  }
}

const DEFAULT_SCORE = 100
const CURRENT_YEAR = new Date().getUTCFullYear()
const DUPLICATE_TITLE_COLLECTIONS = new Set([
  'sources',
  'periods',
  'places',
  'events',
  'campaigns',
  'historical-overlays',
  'quizzes',
])

function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function hasCoordinates(location: LocationLike['modernLocation']) {
  return (
    typeof location?.longitude === 'number' &&
    Number.isFinite(location.longitude) &&
    typeof location?.latitude === 'number' &&
    Number.isFinite(location.latitude)
  )
}

function hasModernLocationText(location: LocationLike['modernLocation']) {
  return Boolean(location?.label?.trim() || location?.province?.trim())
}

function hasMeaningfulLocation(record: LocationLike) {
  return hasCoordinates(record.modernLocation) || hasModernLocationText(record.modernLocation) || Boolean(record.historicalGeometry)
}

function dateYear(value?: string) {
  if (!value) {
    return null
  }

  const year = new Date(value).getUTCFullYear()
  return Number.isFinite(year) ? year : null
}

function scoreImpactForSeverity(severity: ContentQualitySeverity) {
  switch (severity) {
    case 'error':
      return 25
    case 'warning':
      return 8
    case 'info':
      return 0
  }
}

function createRecord(collection: string, slug: string, title: string): RecordDraft {
  return {
    collection,
    issues: [],
    score: DEFAULT_SCORE,
    slug,
    title,
  }
}

function addIssue(
  record: RecordDraft,
  severity: ContentQualitySeverity,
  rule: string,
  message: string,
  scoreImpact = scoreImpactForSeverity(severity),
) {
  record.issues.push({
    collection: record.collection,
    message,
    rule,
    scoreImpact,
    severity,
    slug: record.slug,
    title: record.title,
  })
  record.score = Math.max(0, record.score - scoreImpact)
}

function checkBasicText(
  record: RecordDraft,
  values: {
    summary: string
    title: string
  },
) {
  if (!values.title.trim()) {
    addIssue(record, 'error', 'missing-title', 'Thiếu tiêu đề.')
  } else if (countWords(values.title) < 2) {
    addIssue(record, 'warning', 'short-title', 'Tiêu đề quá ngắn, khó tạo ngữ cảnh.')
  }

  if (!values.summary.trim()) {
    addIssue(record, 'error', 'missing-summary', 'Thiếu tóm tắt ngắn.')
    return
  }

  const summaryWords = countWords(values.summary)

  if (summaryWords < 10) {
    addIssue(record, 'warning', 'thin-summary', 'Tóm tắt quá ngắn, chưa đủ giá trị giới thiệu.')
  }

  if (summaryWords > 60) {
    addIssue(record, 'warning', 'dense-summary', 'Tóm tắt hơi dài, nên cô đọng hơn.')
  }

  if (normalizeValue(values.summary) === normalizeValue(values.title)) {
    addIssue(record, 'warning', 'summary-repeats-title', 'Tóm tắt đang lặp lại chính tiêu đề.')
  }
}

function checkSources(record: RecordDraft, sources: SourceRecord[], minimumRecommended = 2) {
  if (sources.length === 0) {
    addIssue(record, 'error', 'missing-sources', 'Không có nguồn đối chiếu nào.')
    return
  }

  if (sources.length < minimumRecommended) {
    addIssue(record, 'warning', 'thin-sources', `Mới có ${sources.length} nguồn, nên có ít nhất ${minimumRecommended}.`)
  }
}

function checkDateRange(
  record: RecordDraft,
  startDate: string | undefined,
  endDate: string | undefined,
) {
  const startYear = dateYear(startDate)
  const endYear = dateYear(endDate)

  if (!startYear) {
    addIssue(record, 'error', 'missing-start-date', 'Thiếu mốc thời gian bắt đầu hợp lệ.')
    return { endYear: null, startYear: null }
  }

  if (endYear && endYear < startYear) {
    addIssue(record, 'error', 'invalid-date-range', 'Mốc kết thúc đang nhỏ hơn mốc bắt đầu.')
  }

  return { endYear, startYear }
}

function checkDisplayYear(
  record: RecordDraft,
  displayYear: number | undefined,
  startYear: number | null,
  endYear: number | null,
) {
  if (typeof displayYear !== 'number' || !Number.isFinite(displayYear)) {
    addIssue(record, 'warning', 'missing-display-year', 'Thiếu năm hiển thị cố định.')
    return
  }

  if (startYear && endYear && (displayYear < startYear || displayYear > endYear)) {
    addIssue(
      record,
      'warning',
      'display-year-outside-range',
      'Năm hiển thị nằm ngoài khoảng thời gian của bản ghi.',
    )
    return
  }

  if (startYear && !endYear && displayYear !== startYear) {
    addIssue(
      record,
      'info',
      'display-year-differs',
      'Năm hiển thị khác năm bắt đầu, nên kiểm tra chủ đích biên tập.',
    )
  }
}

function checkBodyLength(record: RecordDraft, body: string, minimumWords: number, fieldLabel: string) {
  if (!body.trim()) {
    addIssue(record, 'error', `missing-${fieldLabel}`, `Thiếu nội dung ${fieldLabel}.`)
    return
  }

  if (countWords(body) < minimumWords) {
    const label = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
    addIssue(record, 'warning', `thin-${fieldLabel}`, `${label} còn mỏng, nên mở rộng thêm.`)
  }
}

function checkDuplicateTitles(records: ContentQualityRecord[]) {
  const titleMap = new Map<string, ContentQualityRecord[]>()

  for (const record of records) {
    if (!DUPLICATE_TITLE_COLLECTIONS.has(record.collection)) {
      continue
    }

    const key = `${record.collection}:${normalizeValue(record.title)}`

    if (!titleMap.has(key)) {
      titleMap.set(key, [])
    }

    titleMap.get(key)!.push(record)
  }

  const duplicateKeys = [...titleMap.values()].filter((items) => items.length > 1)

  for (const items of duplicateKeys) {
    for (const item of items) {
      item.issues.push({
        collection: item.collection,
        message: 'Tiêu đề đang bị trùng trong cùng nhóm nội dung.',
        rule: 'duplicate-title',
        scoreImpact: 8,
        severity: 'warning',
        slug: item.slug,
        title: item.title,
      })
      item.score = Math.max(0, item.score - 8)
      item.warningCount += 1
    }
  }
}

function finalizeRecord(record: RecordDraft): ContentQualityRecord {
  const errorCount = record.issues.filter((issue) => issue.severity === 'error').length
  const warningCount = record.issues.filter((issue) => issue.severity === 'warning').length
  const infoCount = record.issues.filter((issue) => issue.severity === 'info').length

  return {
    collection: record.collection,
    errorCount,
    infoCount,
    issues: record.issues,
    score: record.score,
    slug: record.slug,
    title: record.title,
    warningCount,
  }
}

function evaluateSource(source: SourceRecord) {
  const record = createRecord('sources', source.slug, source.title)

  checkBasicText(record, { summary: source.summary, title: source.title })

  if (source.year < 1800 || source.year > CURRENT_YEAR + 1) {
    addIssue(record, 'warning', 'suspicious-year', 'Năm xuất bản nằm ngoài khoảng hợp lý.')
  }

  if (!source.author?.trim() && !source.publisher?.trim()) {
    addIssue(record, 'warning', 'missing-author-and-publisher', 'Thiếu cả tác giả lẫn đơn vị phát hành.')
  }

  if (countWords(source.bibliography) < 12) {
    addIssue(record, 'warning', 'thin-bibliography', 'Mục thư mục quá ngắn, khó truy vết nguồn.')
  }

  if (source.sourceType === 'website' && !source.url?.trim()) {
    addIssue(record, 'warning', 'missing-url', 'Nguồn website nhưng chưa có liên kết.')
  }

  if (!source.license.trim()) {
    addIssue(record, 'warning', 'missing-license', 'Thiếu ghi chú quyền sử dụng hoặc cách trích dẫn.')
  }

  return finalizeRecord(record)
}

function evaluatePeriod(period: PeriodRecord) {
  const record = createRecord('periods', period.slug, period.title)

  checkBasicText(record, { summary: period.summary, title: period.title })
  checkBodyLength(record, period.overview, 50, 'tổng quan')

  if (period.startYear > period.endYear) {
    addIssue(record, 'error', 'invalid-year-span', 'Năm bắt đầu lớn hơn năm kết thúc.')
  }

  if (period.keyThemes.length < 2) {
    addIssue(record, 'warning', 'thin-key-themes', 'Nên có ít nhất 2 chủ đề chính để định hướng giai đoạn.')
  }

  return finalizeRecord(record)
}

function evaluatePlace(place: PlaceRecord) {
  const record = createRecord('places', place.slug, place.title)

  checkBasicText(record, { summary: place.summary, title: place.title })
  checkBodyLength(record, place.body, 70, 'thân bài')
  checkSources(record, place.sources)

  if (!hasMeaningfulLocation(place)) {
    addIssue(record, 'warning', 'missing-location-context', 'Thiếu dữ liệu định vị hiện đại hoặc hình học lịch sử.')
  }

  if (!place.modernLocation?.province?.trim()) {
    addIssue(record, 'info', 'missing-province', 'Chưa có tên tỉnh hiện đại để tra cứu nhanh.')
  }

  return finalizeRecord(record)
}

function evaluateEvent(event: EventRecord) {
  const record = createRecord('events', event.slug, event.title)

  checkBasicText(record, { summary: event.summary, title: event.title })
  checkBodyLength(record, event.content, 90, 'nội dung')
  checkSources(record, event.sources)

  const { endYear, startYear } = checkDateRange(record, event.startDate, event.endDate)
  checkDisplayYear(record, event.displayYear, startYear, endYear)

  if (!hasMeaningfulLocation(event) && event.places.length === 0) {
    addIssue(record, 'warning', 'missing-location-context', 'Thiếu dữ liệu không gian hoặc địa danh liên kết.')
  }

  if (event.topics.length === 0) {
    addIssue(record, 'info', 'missing-topics', 'Chưa gán chủ đề để hỗ trợ lọc và biên tập.')
  }

  return finalizeRecord(record)
}

function evaluateCampaign(campaign: CampaignRecord) {
  const record = createRecord('campaigns', campaign.slug, campaign.title)

  checkBasicText(record, { summary: campaign.summary, title: campaign.title })
  checkBodyLength(record, campaign.body, 110, 'thân bài')
  checkSources(record, campaign.sources)

  const { endYear, startYear } = checkDateRange(record, campaign.startDate, campaign.endDate)
  checkDisplayYear(record, campaign.displayYear, startYear, endYear)

  if (countWords(campaign.outcome) < 8) {
    addIssue(record, 'warning', 'thin-outcome', 'Phần kết quả chiến dịch còn quá ngắn.')
  }

  if (!hasMeaningfulLocation(campaign) && campaign.relatedPlaces.length === 0) {
    addIssue(record, 'warning', 'missing-location-context', 'Thiếu ngữ cảnh không gian của chiến dịch.')
  }

  if (campaign.relatedEvents.length + campaign.relatedPlaces.length === 0) {
    addIssue(record, 'info', 'missing-links', 'Chưa liên kết sự kiện hoặc địa danh liên quan.')
  }

  return finalizeRecord(record)
}

function evaluateOverlay(overlay: OverlayRecord) {
  const record = createRecord('historical-overlays', overlay.slug, overlay.title)

  checkBasicText(record, { summary: overlay.summary, title: overlay.title })
  checkSources(record, overlay.sources, 1)

  if (!overlay.historicalGeometry || typeof overlay.historicalGeometry !== 'object') {
    addIssue(record, 'error', 'missing-geometry', 'Thiếu hình học lịch sử của lớp phủ.')
  }

  const { endYear, startYear } = checkDateRange(record, overlay.validFrom, overlay.validTo)

  if (startYear && endYear && endYear < startYear) {
    addIssue(record, 'error', 'invalid-validity-range', 'Khoảng hiệu lực của lớp phủ không hợp lệ.')
  }

  return finalizeRecord(record)
}

function evaluateQuiz(quiz: QuizRecord) {
  const record = createRecord('quizzes', quiz.slug, quiz.title)

  checkBasicText(record, { summary: quiz.summary, title: quiz.title })
  checkSources(record, quiz.sources)

  if (quiz.questions.length < 3) {
    addIssue(record, 'warning', 'thin-question-set', 'Bộ câu hỏi còn ít, nên có ít nhất 3 câu.')
  }

  for (const [index, question] of quiz.questions.entries()) {
    if (countWords(question.prompt) < 6) {
      addIssue(
        record,
        'warning',
        'thin-question-prompt',
        `Câu hỏi ${index + 1} quá ngắn, dễ thiếu ngữ cảnh.`,
        4,
      )
    }

    if (!question.explanation?.trim()) {
      addIssue(
        record,
        'warning',
        'missing-question-explanation',
        `Câu hỏi ${index + 1} chưa có phần giải thích.`,
        4,
      )
    }

    if (question.options.length < 3) {
      addIssue(
        record,
        'warning',
        'thin-question-options',
        `Câu hỏi ${index + 1} nên có ít nhất 3 lựa chọn.`,
        4,
      )
    }

    const correctCount = question.options.filter((option) => option.isCorrect).length

    if (correctCount !== 1) {
      addIssue(
        record,
        'error',
        'invalid-correct-answer-count',
        `Câu hỏi ${index + 1} phải có đúng 1 đáp án đúng.`,
        20,
      )
    }
  }

  return finalizeRecord(record)
}

function evaluateHistoricalAdminUnit(unit: HistoricalAdminUnitRecord) {
  const record = createRecord('historical-admin-units', unit.slug, unit.title)

  checkBasicText(record, { summary: unit.summary, title: unit.title })
  checkSources(record, unit.sources, 1)

  if (unit.validFromYear > unit.validToYear) {
    addIssue(record, 'error', 'invalid-year-span', 'Khoảng hiệu lực của đơn vị hành chính không hợp lệ.')
  }

  if (unit.memberProvinceSlugs.length === 0) {
    addIssue(record, 'error', 'missing-members', 'Không có tỉnh thành thành viên nào.')
  }

  if (
    typeof unit.labelPoint?.longitude !== 'number' ||
    typeof unit.labelPoint?.latitude !== 'number'
  ) {
    addIssue(record, 'warning', 'missing-label-point', 'Thiếu tọa độ gắn nhãn cho đơn vị hành chính.')
  }

  return finalizeRecord(record)
}

function evaluateBoundaryEpoch(epoch: BoundaryEpochRecord) {
  const record = createRecord('boundary-epochs', epoch.slug, epoch.title)

  checkBasicText(record, { summary: epoch.summary, title: epoch.title })
  checkSources(record, epoch.sources, 1)

  if (epoch.validFromYear > epoch.validToYear) {
    addIssue(record, 'error', 'invalid-year-span', 'Khoảng năm hiệu lực của mốc ranh giới không hợp lệ.')
  }

  const boundaryCount = Array.isArray(epoch.boundaryFeatures?.features)
    ? epoch.boundaryFeatures.features.length
    : 0
  const labelCount = Array.isArray(epoch.labelFeatures?.features)
    ? epoch.labelFeatures.features.length
    : 0

  if (epoch.units.length === 0) {
    addIssue(record, 'error', 'missing-units', 'Không có đơn vị hành chính nào gắn với mốc ranh giới.')
  }

  if (boundaryCount === 0) {
    addIssue(record, 'error', 'missing-boundary-features', 'Không có polygon ranh giới.')
  }

  if (labelCount === 0) {
    addIssue(record, 'warning', 'missing-label-features', 'Không có dữ liệu nhãn hiển thị.')
  }

  if (boundaryCount > 0 && epoch.units.length > 0 && boundaryCount !== epoch.units.length) {
    addIssue(
      record,
      'warning',
      'boundary-unit-count-mismatch',
      'Số feature ranh giới không khớp số đơn vị hành chính.',
    )
  }

  return finalizeRecord(record)
}

function detectSnapshotSource(snapshot: ExplorerSnapshot): ContentQualityReport['snapshotSource'] {
  const allIds = [
    ...snapshot.sources.map((item) => item.id),
    ...snapshot.periods.map((item) => item.id),
    ...snapshot.events.map((item) => item.id),
    ...snapshot.campaigns.map((item) => item.id),
    ...snapshot.places.map((item) => item.id),
    ...snapshot.quizzes.map((item) => item.id),
    ...snapshot.adminUnits.map((item) => item.id),
  ]

  return allIds.every((id) => id.includes(':')) ? 'fallback-demo' : 'payload-public'
}

export function evaluateContentQuality(snapshot: ExplorerSnapshot): ContentQualityReport {
  const records = [
    ...snapshot.sources.map(evaluateSource),
    ...snapshot.periods.map(evaluatePeriod),
    ...snapshot.places.map(evaluatePlace),
    ...snapshot.events.map(evaluateEvent),
    ...snapshot.campaigns.map(evaluateCampaign),
    ...snapshot.overlays.map(evaluateOverlay),
    ...snapshot.quizzes.map(evaluateQuiz),
    ...snapshot.adminUnits.map(evaluateHistoricalAdminUnit),
    ...snapshot.boundaryEpochs.map(evaluateBoundaryEpoch),
  ]

  checkDuplicateTitles(records)

  const collectionMap = new Map<string, ContentQualityRecord[]>()

  for (const record of records) {
    if (!collectionMap.has(record.collection)) {
      collectionMap.set(record.collection, [])
    }

    collectionMap.get(record.collection)!.push(record)
  }

  const collectionSummaries = [...collectionMap.entries()]
    .map(([collection, items]) => ({
      averageScore: items.reduce((sum, item) => sum + item.score, 0) / items.length,
      collection,
      count: items.length,
      errorCount: items.reduce((sum, item) => sum + item.errorCount, 0),
      infoCount: items.reduce((sum, item) => sum + item.infoCount, 0),
      lowestScore: Math.min(...items.map((item) => item.score)),
      warningCount: items.reduce((sum, item) => sum + item.warningCount, 0),
    }))
    .sort((left, right) => left.averageScore - right.averageScore || left.collection.localeCompare(right.collection))

  const issues = records.flatMap((record) => record.issues)
  const totalErrors = issues.filter((issue) => issue.severity === 'error').length
  const totalWarnings = issues.filter((issue) => issue.severity === 'warning').length
  const totalInfos = issues.filter((issue) => issue.severity === 'info').length

  const ruleMap = new Map<string, ContentQualityRuleSummary>()

  for (const issue of issues) {
    const key = `${issue.severity}:${issue.rule}`

    if (!ruleMap.has(key)) {
      ruleMap.set(key, {
        count: 0,
        rule: issue.rule,
        severity: issue.severity,
      })
    }

    ruleMap.get(key)!.count += 1
  }

  const ruleSummaries = [...ruleMap.values()].sort(
    (left, right) =>
      right.count - left.count ||
      (left.severity === right.severity ? left.rule.localeCompare(right.rule) : left.severity.localeCompare(right.severity)),
  )

  return {
    collectionSummaries,
    generatedAt: new Date().toISOString(),
    overallAverageScore:
      records.length > 0 ? records.reduce((sum, record) => sum + record.score, 0) / records.length : DEFAULT_SCORE,
    records: records.sort((left, right) => left.score - right.score || left.collection.localeCompare(right.collection)),
    ruleSummaries,
    snapshotSource: detectSnapshotSource(snapshot),
    totalErrors,
    totalInfos,
    totalIssues: issues.length,
    totalRecords: records.length,
    totalWarnings,
  }
}
