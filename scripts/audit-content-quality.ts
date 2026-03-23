import fs from 'node:fs'
import path from 'node:path'

import { getExplorerSnapshot } from '../src/lib/content-service'
import {
  evaluateContentQuality,
  type ContentQualityIssue,
  type ContentQualityReport,
} from '../src/lib/content-quality'

function loadEnvFile(fileName: string, override = false) {
  const filePath = path.resolve(process.cwd(), fileName)

  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (!override && key in process.env) {
      continue
    }

    process.env[key] = value
  }
}

function parseArgs(argv: string[]) {
  const args = new Set(argv)
  const maxIssuesArg = argv.find((value) => value.startsWith('--max-issues='))
  const maxRulesArg = argv.find((value) => value.startsWith('--max-rules='))

  return {
    failOnError: args.has('--fail-on-error'),
    fallbackOnly: args.has('--fallback-only'),
    json: args.has('--json'),
    maxIssues: maxIssuesArg ? Number(maxIssuesArg.split('=')[1]) : 15,
    maxRules: maxRulesArg ? Number(maxRulesArg.split('=')[1]) : 8,
  }
}

function formatScore(value: number) {
  return value.toFixed(1)
}

function severityRank(issue: ContentQualityIssue) {
  switch (issue.severity) {
    case 'error':
      return 0
    case 'warning':
      return 1
    case 'info':
      return 2
  }
}

function sourceLabel(report: ContentQualityReport) {
  return report.snapshotSource === 'payload-public'
    ? 'Payload public hiện tại'
    : 'Dữ liệu demo fallback'
}

function printReport(report: ContentQualityReport, options: { maxIssues: number; maxRules: number }) {
  const topIssues = report.records
    .flatMap((record) => record.issues)
    .sort(
      (left, right) =>
        severityRank(left) - severityRank(right) ||
        right.scoreImpact - left.scoreImpact ||
        left.collection.localeCompare(right.collection) ||
        left.slug.localeCompare(right.slug),
    )
    .slice(0, options.maxIssues)

  console.log('Đánh giá chất lượng nội dung')
  console.log(`Nguồn dữ liệu: ${sourceLabel(report)}`)
  console.log(
    `Tổng bản ghi: ${report.totalRecords} | Điểm trung bình: ${formatScore(report.overallAverageScore)}/100 | Lỗi: ${report.totalErrors} | Cảnh báo: ${report.totalWarnings} | Ghi chú: ${report.totalInfos}`,
  )
  console.log('')
  console.log('Theo nhóm nội dung')

  for (const summary of report.collectionSummaries) {
    console.log(
      `- ${summary.collection}: ${summary.count} bản ghi | điểm TB ${formatScore(summary.averageScore)} | thấp nhất ${summary.lowestScore} | lỗi ${summary.errorCount} | cảnh báo ${summary.warningCount}`,
    )
  }

  if (report.ruleSummaries.length > 0) {
    console.log('')
    console.log('Mẫu vấn đề lặp lại nhiều nhất')

    for (const rule of report.ruleSummaries.slice(0, options.maxRules)) {
      console.log(`- [${rule.severity}] ${rule.rule}: ${rule.count}`)
    }
  }

  if (topIssues.length > 0) {
    console.log('')
    console.log('Vấn đề cần xử lý trước')

    for (const issue of topIssues) {
      console.log(
        `- [${issue.severity}] ${issue.collection}/${issue.slug}: ${issue.message} (${issue.rule})`,
      )
    }
  } else {
    console.log('')
    console.log('Không phát hiện vấn đề đáng chú ý theo bộ quy tắc hiện tại.')
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  loadEnvFile('.env')
  loadEnvFile('.env.local', true)

  if (options.fallbackOnly) {
    delete process.env.MONGODB_URI
    delete process.env.DATABASE_URL
    delete process.env.DATABASE_URI
    process.env.ENABLE_DEMO_FALLBACK = 'true'
  }

  const snapshot = await getExplorerSnapshot()
  const report = evaluateContentQuality(snapshot)

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printReport(report, { maxIssues: options.maxIssues, maxRules: options.maxRules })
  }

  if (options.failOnError && report.totalErrors > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
