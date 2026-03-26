import type { DemoPeriod } from './demo-content.js'

export type DemoLeader = {
  endYear: number
  isFeaturedChairmanHighlight?: boolean
  name: string
  officeLabel: string
  officeType: 'general-secretary' | 'party-chairman'
  overview: string
  portraitUrl?: string
  slug: string
  sources: string[]
  startYear: number
  summary: string
}

export type PeriodMetadata = {
  displayOrder: number
  featuredLeaderSlug?: string
  leadershipLabel?: string
  officialLeaderSlugs?: string[]
  periodType: 'formation' | 'party-era'
}

export type LeaderContentReferenceSet = {
  campaignSlugs?: string[]
  eventSlugs?: string[]
  placeSlugs?: string[]
  quizSlugs?: string[]
}

export const demoLeaders: DemoLeader[] = [
  {
    endYear: 1931,
    name: 'Trần Phú',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Trần Phú gắn với quá trình xác lập cương lĩnh, kỷ luật tổ chức và nhịp hoạt động đầu tiên của Đảng trong bối cảnh thực dân đàn áp gay gắt.',
    portraitUrl: '/images/leaders/tran-phu.jpg',
    slug: 'tran-phu',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam', 'van-kien-dang-toan-tap'],
    startYear: 1930,
    summary: 'Tổng Bí thư đầu tiên, đại diện cho chặng xác lập hệ thống lãnh đạo ban đầu của Đảng.',
  },
  {
    endYear: 1936,
    name: 'Lê Hồng Phong',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Lê Hồng Phong góp phần khôi phục hệ thống tổ chức của Đảng, kết nối phong trào trong nước với mạng lưới cách mạng quốc tế sau những tổn thất đầu thập niên 1930.',
    portraitUrl: '/images/leaders/le-hong-phong.jpg',
    slug: 'le-hong-phong',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1935,
    summary: 'Gương mặt khôi phục tổ chức và củng cố mạch liên lạc của Đảng trong giai đoạn khó khăn.',
  },
  {
    endYear: 1938,
    name: 'Hà Huy Tập',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Hà Huy Tập để lại dấu ấn ở năng lực lý luận và tổ chức trong lúc phong trào dân chủ phát triển, giúp Đảng mở rộng ảnh hưởng chính trị trong quần chúng.',
    portraitUrl: '/images/leaders/ha-huy-tap.jpg',
    slug: 'ha-huy-tap',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1936,
    summary: 'Người gắn với giai đoạn phát triển đường lối và mở rộng sức ảnh hưởng trong phong trào dân chủ.',
  },
  {
    endYear: 1940,
    name: 'Nguyễn Văn Cừ',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Nguyễn Văn Cừ nhấn mạnh yêu cầu chỉnh đốn tổ chức, nâng chất lượng công tác vận động quần chúng và đặt lại nhiều vấn đề lý luận của phong trào cách mạng.',
    portraitUrl: '/images/leaders/nguyen-van-cu.jpg',
    slug: 'nguyen-van-cu',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1938,
    summary: 'Một Tổng Bí thư tiêu biểu của thời kỳ tự chỉnh đốn và chuẩn bị cho bước chuyển chiến lược mới.',
  },
  {
    endYear: 1956,
    name: 'Trường Chinh',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Trường Chinh là nhà lý luận và tổ chức then chốt trong giai đoạn cao trào giải phóng dân tộc, kháng chiến kiến quốc và bước đầu xây dựng đường lối mới sau Cách mạng tháng Tám.',
    portraitUrl: '/images/leaders/truong-chinh.jpg',
    slug: 'truong-chinh',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam', 'van-kien-dang-toan-tap'],
    startYear: 1941,
    summary: 'Tổng Bí thư gắn với cao trào giải phóng dân tộc, kháng chiến kiến quốc và xây dựng nền tảng lý luận của Đảng.',
  },
  {
    endYear: 1969,
    isFeaturedChairmanHighlight: true,
    name: 'Hồ Chí Minh',
    officeLabel: 'Chủ tịch Đảng',
    officeType: 'party-chairman',
    overview:
      'Hồ Chí Minh là điểm quy tụ chiến lược của cách mạng Việt Nam, từ giành chính quyền, giữ vững chính quyền non trẻ đến kháng chiến, kiến quốc và định hình tầm nhìn độc lập dân tộc gắn với chủ nghĩa xã hội.',
    portraitUrl: '/images/leaders/ho-chi-minh.jpg',
    slug: 'ho-chi-minh',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam', 'van-kien-dang-toan-tap'],
    startYear: 1951,
    summary: 'Điểm nhấn đặc biệt của trục lãnh đạo, được hiển thị riêng với chức danh Chủ tịch Đảng.',
  },
  {
    endYear: 1986,
    name: 'Lê Duẩn',
    officeLabel: 'Bí thư thứ nhất, sau là Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Lê Duẩn gắn với giai đoạn chiến tranh cách mạng quy mô lớn, quyết tâm giải phóng miền Nam và những thử thách đầu tiên của đất nước sau thống nhất.',
    portraitUrl: '/images/leaders/le-duan.jpg',
    slug: 'le-duan',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam', 'van-kien-dang-toan-tap'],
    startYear: 1960,
    summary: 'Lãnh đạo trung tâm của giai đoạn chiến tranh chống Mỹ, thống nhất đất nước và hậu chiến ban đầu.',
  },
  {
    endYear: 1991,
    name: 'Nguyễn Văn Linh',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Nguyễn Văn Linh gắn với bước mở đầu của công cuộc đổi mới, nhấn mạnh yêu cầu nhìn thẳng vào thực tiễn và điều chỉnh tư duy phát triển đất nước sau khủng hoảng.',
    portraitUrl: '/images/leaders/nguyen-van-linh.jpg',
    slug: 'nguyen-van-linh',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1986,
    summary: 'Tổng Bí thư của giai đoạn mở đầu đổi mới và điều chỉnh mạnh về tư duy phát triển.',
  },
  {
    endYear: 1997,
    name: 'Đỗ Mười',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Đỗ Mười gắn với chặng ổn định đường lối đổi mới, củng cố bộ máy và mở rộng hội nhập trong bối cảnh biến động của trật tự quốc tế sau Chiến tranh lạnh.',
    portraitUrl: '/images/leaders/do-muoi.jpg',
    slug: 'do-muoi',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1991,
    summary: 'Tổng Bí thư của giai đoạn củng cố đổi mới và ổn định chiến lược phát triển sau bước mở đầu.',
  },
  {
    endYear: 2001,
    name: 'Lê Khả Phiêu',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Lê Khả Phiêu nhấn mạnh yêu cầu xây dựng, chỉnh đốn Đảng và giữ vững định hướng chính trị trong quá trình phát triển và hội nhập cuối thế kỷ XX.',
    portraitUrl: '/images/leaders/le-kha-phieu.jpg',
    slug: 'le-kha-phieu',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 1997,
    summary: 'Gắn với yêu cầu chỉnh đốn Đảng và giữ vững định hướng chính trị trong giai đoạn chuyển tiếp.',
  },
  {
    endYear: 2011,
    name: 'Nông Đức Mạnh',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Nông Đức Mạnh gắn với thời kỳ tăng tốc hội nhập quốc tế, phát triển kinh tế và đồng thời đặt ra yêu cầu lớn về nâng chất lượng quản trị và xây dựng Đảng.',
    portraitUrl: '/images/leaders/nong-duc-manh.jpg',
    slug: 'nong-duc-manh',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 2001,
    summary: 'Tổng Bí thư của giai đoạn mở rộng hội nhập, tăng trưởng và tái đặt vấn đề chất lượng quản trị.',
  },
  {
    endYear: 2024,
    name: 'Nguyễn Phú Trọng',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Nguyễn Phú Trọng gắn với nhấn mạnh xây dựng, chỉnh đốn Đảng, đấu tranh phòng chống tham nhũng và định hình nhiều luận điểm chiến lược trong bối cảnh phát triển mới.',
    portraitUrl: '/images/leaders/nguyen-phu-trong.jpg',
    slug: 'nguyen-phu-trong',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startYear: 2011,
    summary: 'Một giai đoạn dài nhấn mạnh xây dựng Đảng, chỉnh đốn hệ thống và ổn định chiến lược quốc gia.',
  },
  {
    endYear: 2026,
    name: 'Tô Lâm',
    officeLabel: 'Tổng Bí thư',
    officeType: 'general-secretary',
    overview:
      'Tô Lâm là Tổng Bí thư đương nhiệm trong giai đoạn dữ liệu hiện tại, đại diện cho lớp lãnh đạo mới của Đảng trong bối cảnh chuyển đổi số, cải cách bộ máy và hội nhập sâu hơn.',
    portraitUrl: '/images/leaders/to-lam.jpg',
    slug: 'to-lam',
    sources: ['dang-cong-san-viet-nam', 'tu-lieu-van-kien-dang'],
    startYear: 2024,
    summary: 'Tổng Bí thư đương nhiệm tại thời điểm nhập dữ liệu, nối tiếp trục lãnh đạo của giai đoạn hiện nay.',
  },
]

export const supplementalPeriods: DemoPeriod[] = [
  {
    accentColor: '#7d5433',
    endYear: 1991,
    keyThemes: [{ label: 'Mở đầu đổi mới' }, { label: 'Điều chỉnh tư duy phát triển' }],
    overview:
      'Sau Đại hội VI, đất nước bước vào chặng mở đầu đổi mới với những điều chỉnh lớn về tư duy kinh tế, tổ chức bộ máy và cách tiếp cận thực tiễn.',
    slug: '1986-1991',
    startYear: 1986,
    summary: 'Giai đoạn mở đầu đổi mới và tái xác lập nhịp phát triển mới của đất nước.',
    title: '1986-1991: Mở đầu đổi mới',
  },
  {
    accentColor: '#8b5f3a',
    endYear: 1997,
    keyThemes: [{ label: 'Ổn định chiến lược' }, { label: 'Mở rộng hội nhập' }],
    overview:
      'Đổi mới đi vào chiều sâu hơn với yêu cầu giữ ổn định chiến lược, tái cấu trúc bộ máy và thích ứng với bối cảnh khu vực, quốc tế đổi nhanh sau Chiến tranh lạnh.',
    slug: '1991-1997',
    startYear: 1991,
    summary: 'Củng cố đổi mới và ổn định định hướng phát triển trong bối cảnh quốc tế mới.',
    title: '1991-1997: Củng cố đổi mới',
  },
  {
    accentColor: '#946740',
    endYear: 2001,
    keyThemes: [{ label: 'Chỉnh đốn Đảng' }, { label: 'Chuẩn bị hội nhập mới' }],
    overview:
      'Đây là chặng nhấn mạnh yêu cầu chỉnh đốn Đảng, giữ vững định hướng chính trị và chuẩn bị cho các bước hội nhập sâu hơn ở đầu thế kỷ XXI.',
    slug: '1997-2001',
    startYear: 1997,
    summary: 'Giai đoạn điều chỉnh nội lực và chuẩn bị cho một nhịp hội nhập mới.',
    title: '1997-2001: Chỉnh đốn và chuyển tiếp',
  },
  {
    accentColor: '#9f7646',
    endYear: 2011,
    keyThemes: [{ label: 'Hội nhập quốc tế' }, { label: 'Tăng trưởng và quản trị' }],
    overview:
      'Đất nước đi sâu hơn vào quỹ đạo hội nhập quốc tế, phát triển kinh tế và hiện đại hóa, đồng thời bộc lộ rõ hơn những yêu cầu đổi mới quản trị.',
    slug: '2001-2011',
    startYear: 2001,
    summary: 'Mười năm mở rộng hội nhập, phát triển và đặt lại câu hỏi về chất lượng quản trị.',
    title: '2001-2011: Hội nhập và tăng trưởng',
  },
  {
    accentColor: '#aa844f',
    endYear: 2024,
    keyThemes: [{ label: 'Xây dựng Đảng' }, { label: 'Ổn định chiến lược quốc gia' }],
    overview:
      'Giai đoạn này nhấn mạnh xây dựng, chỉnh đốn Đảng, phòng chống tham nhũng và điều chỉnh chiến lược phát triển trong bối cảnh mới của khu vực và thế giới.',
    slug: '2011-2024',
    startYear: 2011,
    summary: 'Một chặng dài tập trung mạnh vào xây dựng Đảng và tái định hình chiến lược phát triển.',
    title: '2011-2024: Xây dựng Đảng trong bối cảnh mới',
  },
  {
    accentColor: '#b58f58',
    endYear: 2026,
    keyThemes: [{ label: 'Cải cách bộ máy' }, { label: 'Chuyển đổi số' }],
    overview:
      'Chặng hiện thời của dữ liệu nhấn vào cải cách bộ máy, chuyển đổi số, điều hành linh hoạt và yêu cầu thích ứng nhanh trong môi trường quốc tế biến đổi mạnh.',
    slug: '2024-2026',
    startYear: 2024,
    summary: 'Giai đoạn đương nhiệm của Tổng Bí thư hiện nay trong dữ liệu công khai của site.',
    title: '2024-nay: Chuyển động của giai đoạn hiện nay',
  },
]

export const periodMetadataBySlug: Record<string, PeriodMetadata> = {
  '1858-1918': {
    displayOrder: 1,
    periodType: 'formation',
  },
  '1919-1930': {
    displayOrder: 2,
    periodType: 'formation',
  },
  '1930-1945': {
    displayOrder: 3,
    leadershipLabel: 'Chuỗi Tổng Bí thư đầu tiên',
    officialLeaderSlugs: ['tran-phu', 'le-hong-phong', 'ha-huy-tap', 'nguyen-van-cu', 'truong-chinh'],
    periodType: 'party-era',
  },
  '1945-1954': {
    displayOrder: 4,
    featuredLeaderSlug: 'ho-chi-minh',
    leadershipLabel: 'Hồ Chí Minh được nhấn nổi bật; Trường Chinh và Hồ Chí Minh là hai điểm tựa lãnh đạo của giai đoạn',
    officialLeaderSlugs: ['truong-chinh', 'ho-chi-minh'],
    periodType: 'party-era',
  },
  '1954-1965': {
    displayOrder: 5,
    featuredLeaderSlug: 'ho-chi-minh',
    leadershipLabel: 'Hồ Chí Minh là Chủ tịch Đảng; Lê Duẩn giữ vai trò Bí thư thứ nhất từ 1960',
    officialLeaderSlugs: ['ho-chi-minh', 'le-duan'],
    periodType: 'party-era',
  },
  '1965-1973': {
    displayOrder: 6,
    featuredLeaderSlug: 'le-duan',
    leadershipLabel: 'Lê Duẩn giữ vai trò Bí thư thứ nhất; Hồ Chí Minh vẫn là điểm quy tụ đến năm 1969',
    officialLeaderSlugs: ['ho-chi-minh', 'le-duan'],
    periodType: 'party-era',
  },
  '1973-1975': {
    displayOrder: 7,
    featuredLeaderSlug: 'le-duan',
    leadershipLabel: 'Bí thư thứ nhất',
    officialLeaderSlugs: ['le-duan'],
    periodType: 'party-era',
  },
  '1975-1986': {
    displayOrder: 8,
    featuredLeaderSlug: 'le-duan',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['le-duan'],
    periodType: 'party-era',
  },
  '1986-1991': {
    displayOrder: 9,
    featuredLeaderSlug: 'nguyen-van-linh',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['truong-chinh', 'nguyen-van-linh'],
    periodType: 'party-era',
  },
  '1991-1997': {
    displayOrder: 10,
    featuredLeaderSlug: 'do-muoi',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['do-muoi'],
    periodType: 'party-era',
  },
  '1997-2001': {
    displayOrder: 11,
    featuredLeaderSlug: 'le-kha-phieu',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['le-kha-phieu'],
    periodType: 'party-era',
  },
  '2001-2011': {
    displayOrder: 12,
    featuredLeaderSlug: 'nong-duc-manh',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['nong-duc-manh'],
    periodType: 'party-era',
  },
  '2011-2024': {
    displayOrder: 13,
    featuredLeaderSlug: 'nguyen-phu-trong',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['nguyen-phu-trong'],
    periodType: 'party-era',
  },
  '2024-2026': {
    displayOrder: 14,
    featuredLeaderSlug: 'to-lam',
    leadershipLabel: 'Tổng Bí thư',
    officialLeaderSlugs: ['to-lam'],
    periodType: 'party-era',
  },
}

export const leaderContentReferencesBySlug: Record<string, LeaderContentReferenceSet> = {
  'tran-phu': {
    eventSlugs: [
      'thanh-lap-dang-cong-san-viet-nam',
      'luan-cuong-chinh-tri-1930',
      'hoi-nghi-trung-uong-thang-10-1930',
      'tran-phu-bi-bat-va-hy-sinh-1931',
    ],
    placeSlugs: ['nghe-tinh-xo-viet', 'huong-cang', 'nha-thuong-cho-quan'],
  },
  'le-hong-phong': {
    eventSlugs: [
      'dai-hoi-lan-thu-nhat-1935',
      'phong-trao-dan-chu-1936-1939',
      'dai-hoi-vii-quoc-te-cong-san-1935',
      'hoi-nghi-thuong-hai-1936',
    ],
    placeSlugs: ['ma-cao', 'matxcova', 'thuong-hai'],
    quizSlugs: ['quiz-le-hong-phong-1935-1936'],
  },
  'ha-huy-tap': {
    eventSlugs: [
      'phong-trao-dan-chu-1936-1939',
      'hoi-nghi-thuong-hai-1936',
      'hoi-nghi-can-bo-trung-uong-thang-10-1936',
      'hoi-nghi-hoc-mon-thang-3-1937',
      'ha-huy-tap-bi-xu-ban-1941',
    ],
    placeSlugs: ['thuong-hai', 'hoc-mon-gia-dinh', 'ba-diem-hoc-mon', 'nga-tu-gieng-nuoc'],
    quizSlugs: ['quiz-ha-huy-tap-1936-1938'],
  },
  'nguyen-van-cu': {
    eventSlugs: [
      'hoi-nghi-ba-diem-thang-3-1938',
      'tu-chi-trich-1939',
      'hoi-nghi-trung-uong-6-1939',
      'nguyen-van-cu-bi-xu-ban-1941',
    ],
    placeSlugs: ['ba-diem-hoc-mon', 'nga-tu-gieng-nuoc'],
    quizSlugs: ['quiz-nguyen-van-cu-1938-1940'],
  },
  'truong-chinh': {
    campaignSlugs: ['chien-dich-dien-bien-phu'],
    eventSlugs: [
      'hoi-nghi-trung-uong-8-1941',
      'tong-khoi-nghia-thang-tam-1945',
      'toan-quoc-khang-chien',
      'dai-hoi-ii-1951',
      'dai-hoi-vi-1986',
    ],
    placeSlugs: ['pac-bo', 'viet-bac', 'hoi-truong-ba-dinh'],
    quizSlugs: ['quiz-truong-chinh-1941-1956', 'quiz-truong-chinh-1986'],
  },
  'ho-chi-minh': {
    campaignSlugs: ['chien-dich-dien-bien-phu'],
    eventSlugs: [
      'hoi-nghi-trung-uong-8-1941',
      'tong-khoi-nghia-thang-tam-1945',
      'tuyen-ngon-doc-lap',
      'toan-quoc-khang-chien',
      'dai-hoi-ii-1951',
      'dai-hoi-iii-1960',
    ],
    placeSlugs: ['ben-nha-rong', 'pac-bo', 'quang-truong-ba-dinh', 'viet-bac', 'hoi-truong-ba-dinh'],
    quizSlugs: ['quiz-ho-chi-minh-1941-1960'],
  },
  'le-duan': {
    campaignSlugs: ['van-tai-chien-luoc-truong-son', 'chien-dich-ho-chi-minh'],
    eventSlugs: [
      'dai-hoi-iii-1960',
      'dong-khoi-ben-tre',
      'tet-mau-than-1968',
      'hiep-dinh-paris-1973',
      'dai-thang-mua-xuan-1975',
      'tong-tuyen-cu-1976',
    ],
    placeSlugs: ['hien-luong-ben-hai', 'duong-truong-son', 'dinh-doc-lap', 'paris'],
    quizSlugs: ['quiz-le-duan-1960-1986'],
  },
  'nguyen-van-linh': {
    eventSlugs: [
      'dai-hoi-vi-1986',
      'nhung-viec-can-lam-ngay-1987',
      'nghi-quyet-10-1988',
      'dai-hoi-vii-1991',
    ],
    placeSlugs: ['hoi-truong-ba-dinh', 'tru-so-trung-uong-dang'],
    quizSlugs: ['quiz-nguyen-van-linh-1986-1991'],
  },
  'do-muoi': {
    eventSlugs: ['dai-hoi-vii-1991', 'viet-nam-gia-nhap-asean-1995', 'dai-hoi-viii-1996'],
    placeSlugs: ['hoi-truong-ba-dinh', 'tru-so-trung-uong-dang', 'bandar-seri-begawan'],
    quizSlugs: ['quiz-do-muoi-1991-1997'],
  },
  'le-kha-phieu': {
    eventSlugs: [
      'hoi-nghi-trung-uong-4-khoa-viii-1997',
      'nghi-quyet-trung-uong-6-lan-2-1999',
      'hiep-dinh-thuong-mai-viet-my-2000',
    ],
    placeSlugs: ['tru-so-trung-uong-dang', 'washington-dc'],
    quizSlugs: ['quiz-le-kha-phieu-1997-2001'],
  },
  'nong-duc-manh': {
    eventSlugs: ['dai-hoi-ix-2001', 'dai-hoi-x-2006', 'viet-nam-gia-nhap-wto-2007'],
    placeSlugs: ['trung-tam-hoi-nghi-quoc-gia', 'geneva'],
    quizSlugs: ['quiz-nong-duc-manh-2001-2011'],
  },
  'nguyen-phu-trong': {
    eventSlugs: [
      'dai-hoi-xi-2011',
      'nghi-quyet-trung-uong-4-khoa-xi-2012',
      'dai-hoi-xii-2016',
      'dai-hoi-xiii-2021',
      'chien-dich-phong-chong-tham-nhung-2023',
    ],
    placeSlugs: ['tru-so-trung-uong-dang', 'trung-tam-hoi-nghi-quoc-gia'],
    quizSlugs: ['quiz-nguyen-phu-trong-2011-2024'],
  },
  'to-lam': {
    eventSlugs: ['to-lam-duoc-bau-tong-bi-thu-2024', 'chu-truong-tinh-gon-bo-may-2025'],
    placeSlugs: ['toa-nha-quoc-hoi'],
  },
}
