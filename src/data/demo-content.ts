export type DemoSource = {
  slug: string
  title: string
  summary: string
  author: string
  year: number
  publisher: string
  url?: string
  sourceType: 'archive' | 'article' | 'book' | 'museum' | 'website'
  bibliography: string
  license: string
  reliability: 'primary' | 'reference' | 'secondary'
}

export type DemoPeriod = {
  slug: string
  title: string
  summary: string
  startYear: number
  endYear: number
  accentColor: string
  overview: string
  keyThemes: { label: string }[]
}

export type DemoPlace = {
  slug: string
  title: string
  summary: string
  body: string
  period: string
  region: 'central' | 'interregional' | 'international' | 'north' | 'south'
  modernLocation: {
    label: string
    latitude: number
    longitude: number
    province: string
  }
  historicalGeometry?: Record<string, unknown>
  sources: string[]
}

export type DemoEvent = {
  slug: string
  title: string
  summary: string
  content: string
  displayYear: number
  period: string
  region: 'central' | 'interregional' | 'international' | 'north' | 'south'
  startDate: string
  endDate?: string
  datePrecision: 'approximate' | 'day' | 'month' | 'range' | 'year'
  modernLocation?: DemoPlace['modernLocation']
  historicalGeometry?: Record<string, unknown>
  places: string[]
  sources: string[]
  topics: string[]
}

export type DemoCampaign = {
  slug: string
  title: string
  summary: string
  body: string
  outcome: string
  displayYear: number
  period: string
  region: 'central' | 'interregional' | 'international' | 'north' | 'south'
  startDate: string
  endDate?: string
  datePrecision: 'approximate' | 'day' | 'month' | 'range' | 'year'
  modernLocation?: DemoPlace['modernLocation']
  historicalGeometry?: Record<string, unknown>
  relatedEvents: string[]
  relatedPlaces: string[]
  sources: string[]
}

export type DemoHistoricalOverlay = {
  slug: string
  title: string
  summary: string
  period: string
  region: 'central' | 'interregional' | 'international' | 'north' | 'south'
  layerGroup: 'historical_overlays'
  layerKind: 'base' | 'front' | 'point' | 'region' | 'route'
  validFrom: string
  validTo?: string
  color: string
  opacity: number
  historicalGeometry: Record<string, unknown>
  sources: string[]
  relatedEvent?: string
  relatedCampaign?: string
}

export type DemoBoundaryUnitChange = {
  slug: string
  title: string
  memberProvinceSlugs: string[]
  displayColor?: string
  summary?: string
  unitType?: 'historical_region' | 'merged_province' | 'municipality' | 'province'
}

export type DemoBoundaryTransition = {
  slug: string
  title: string
  summary: string
  validFromYear: number
  changes: DemoBoundaryUnitChange[]
  restoreAllProvinces?: boolean
  restoreProvinceSlugs?: string[]
  sources: string[]
}

export type DemoQuiz = {
  slug: string
  title: string
  summary: string
  period: string
  relatedEvents: string[]
  relatedCampaigns: string[]
  questions: {
    prompt: string
    explanation: string
    options: { isCorrect: boolean; label: string }[]
  }[]
  sources: string[]
}

export const demoSources: DemoSource[] = [
  {
    author: 'Bộ Quốc phòng',
    bibliography: 'Bộ Quốc phòng. Lịch sử kháng chiến chống thực dân Pháp. Hà Nội.',
    license: 'Trích dẫn học thuật',
    publisher: 'Nhà xuất bản Quân đội Nhân dân',
    reliability: 'secondary',
    slug: 'lich-su-khang-chien-chong-phap',
    sourceType: 'book',
    summary: 'Tổng thuật lớn về các chiến dịch và chuyển biến chính trị 1945-1954.',
    title: 'Lịch sử kháng chiến chống thực dân Pháp',
    year: 2004,
  },
  {
    author: 'Văn kiện Đảng Toàn tập',
    bibliography: 'Văn kiện Đảng Toàn tập, các tập 1-15.',
    license: 'Trích dẫn học thuật',
    publisher: 'Nhà xuất bản Chính trị quốc gia',
    reliability: 'primary',
    slug: 'van-kien-dang-toan-tap',
    sourceType: 'book',
    summary: 'Nguồn gốc để đối chiếu chủ trương, nghị quyết và diễn biến tổ chức.',
    title: 'Văn kiện Đảng Toàn tập',
    year: 2000,
  },
  {
    author: 'Bảo tàng Lịch sử Quốc gia',
    bibliography: 'Hồ sơ trưng bày và chú giải hiện vật thời kỳ Cách mạng tháng Tám.',
    license: 'Theo điều kiện sử dụng của bảo tàng',
    publisher: 'Bảo tàng Lịch sử Quốc gia',
    reliability: 'primary',
    slug: 'bao-tang-lich-su-quoc-gia',
    sourceType: 'museum',
    summary: 'Nguồn hiện vật và ảnh tư liệu phục vụ bối cảnh hóa sự kiện 1945.',
    title: 'Bảo tàng Lịch sử Quốc gia',
    url: 'https://baotanglichsu.vn',
    year: 2024,
  },
  {
    author: 'Viện Sử học',
    bibliography: 'Lịch sử Việt Nam cận hiện đại, nhiều tập.',
    license: 'Trích dẫn học thuật',
    publisher: 'Nhà xuất bản Khoa học Xã hội',
    reliability: 'secondary',
    slug: 'vien-su-hoc-can-hien-dai',
    sourceType: 'book',
    summary: 'Khung diễn giải dài hạn cho giai đoạn 1858-1930.',
    title: 'Lịch sử Việt Nam cận hiện đại',
    year: 2017,
  },
  {
    author: 'Lưu trữ quốc gia',
    bibliography: 'Tuyển tập châu bản, sắc lệnh và hồ sơ hành chính thời kỳ 1945-1946.',
    license: 'Theo điều kiện sử dụng của trung tâm lưu trữ',
    publisher: 'Trung tâm Lưu trữ quốc gia',
    reliability: 'primary',
    slug: 'luu-tru-quoc-gia-1945',
    sourceType: 'archive',
    summary: 'Bổ sung chứng cứ cho giai đoạn thiết lập chính quyền mới.',
    title: 'Hồ sơ lưu trữ quốc gia 1945-1946',
    year: 2023,
  },
  {
    author: 'Nhà xuất bản Chính trị quốc gia',
    bibliography: 'Biên niên sự kiện lịch sử Việt Nam 1930-1975.',
    license: 'Trích dẫn học thuật',
    publisher: 'Nhà xuất bản Chính trị quốc gia',
    reliability: 'reference',
    slug: 'bien-nien-su-kien-1930-1975',
    sourceType: 'book',
    summary: 'Tư liệu niên biểu nhanh cho dòng thời gian tổng thể.',
    title: 'Biên niên sự kiện lịch sử Việt Nam 1930-1975',
    year: 2015,
  },
  {
    author: 'Bộ Ngoại giao',
    bibliography: 'Hồ sơ Hội nghị Genève và Hiệp định Paris.',
    license: 'Trích dẫn học thuật',
    publisher: 'Bộ Ngoại giao',
    reliability: 'primary',
    slug: 'ho-so-geneve-paris',
    sourceType: 'archive',
    summary: 'Nguồn đối chiếu cho trục ngoại giao 1954 và 1973.',
    title: 'Hồ sơ Hội nghị Genève và Hiệp định Paris',
    year: 2018,
  },
  {
    author: 'Bách khoa toàn thư quân sự',
    bibliography: 'Các mục từ Điện Biên Phủ, Đường Trường Sơn, Tổng tiến công 1975.',
    license: 'Trích dẫn học thuật',
    publisher: 'Nhà xuất bản Quân đội Nhân dân',
    reliability: 'reference',
    slug: 'bach-khoa-quan-su',
    sourceType: 'book',
    summary: 'Tư liệu đối chiếu thuật ngữ, địa danh và quy mô chiến dịch.',
    title: 'Bách khoa toàn thư quân sự Việt Nam',
    year: 2007,
  },
]

export const demoPeriods: DemoPeriod[] = [
  {
    accentColor: '#7a2f20',
    endYear: 1918,
    keyThemes: [{ label: 'Kháng chiến chống xâm lược' }, { label: 'Biến chuyển xã hội thuộc địa' }],
    overview:
      'Giai đoạn mở đầu của Việt Nam cận hiện đại với sự xâm lược của thực dân Pháp, các phong trào kháng chiến triều đình và văn thân, và những chuyển động xã hội làm tiền đề cho các xu hướng cứu nước mới.',
    slug: '1858-1918',
    startYear: 1858,
    summary: 'Từ cuộc xâm lược của Pháp đến những tiền đề đầu tiên của phong trào giải phóng dân tộc hiện đại.',
    title: '1858-1918: Khủng hoảng quốc gia và tìm đường cứu nước',
  },
  {
    accentColor: '#9a3024',
    endYear: 1930,
    keyThemes: [{ label: 'Phong trào yêu nước mới' }, { label: 'Hình thành lực lượng chính trị cách mạng' }],
    overview:
      'Chiến tranh thế giới thứ nhất làm thay đổi cấu trúc kinh tế - xã hội thuộc địa. Phong trào công nhân và các tổ chức tiền thân của Đảng hình thành, tạo nên bước chuyển từ các khuynh hướng yêu nước cũ sang xu hướng cách mạng vô sản.',
    slug: '1919-1930',
    startYear: 1919,
    summary: 'Thời kỳ xuất hiện các tổ chức cách mạng mới và sự chuyển hóa của phong trào yêu nước.',
    title: '1919-1930: Từ yêu nước đến tổ chức cách mạng',
  },
  {
    accentColor: '#ab2f24',
    endYear: 1945,
    keyThemes: [{ label: 'Đảng lãnh đạo' }, { label: 'Mặt trận dân tộc thống nhất' }],
    overview:
      'Từ khi Đảng Cộng sản Việt Nam ra đời đến Cách mạng tháng Tám, phong trào cách mạng trải qua nhiều cao trào, khôi phục lực lượng sau khủng bố và tận dụng thời cơ chiến tranh thế giới để giành chính quyền.',
    slug: '1930-1945',
    startYear: 1930,
    summary: 'Giai đoạn xác lập lực lượng lãnh đạo và giành chính quyền trên phạm vi cả nước.',
    title: '1930-1945: Thành lập Đảng và Cách mạng tháng Tám',
  },
  {
    accentColor: '#bf5030',
    endYear: 1954,
    keyThemes: [{ label: 'Kháng chiến toàn dân' }, { label: 'Ngoại giao song hành quân sự' }],
    overview:
      'Nhà nước Việt Nam Dân chủ Cộng hòa vừa xây dựng chính quyền, vừa kháng chiến chống thực dân Pháp. Cuộc chiến kết thúc bằng thắng lợi Điện Biên Phủ và Hiệp định Genève.',
    slug: '1945-1954',
    startYear: 1945,
    summary: 'Bảo vệ chính quyền cách mạng và kết thúc chiến tranh Đông Dương lần thứ nhất.',
    title: '1945-1954: Kháng chiến chống Pháp và Điện Biên Phủ',
  },
  {
    accentColor: '#c46b2d',
    endYear: 1965,
    keyThemes: [{ label: 'Xây dựng miền Bắc' }, { label: 'Đấu tranh ở miền Nam' }],
    overview:
      'Sau Genève, đất nước tạm thời chia cắt. Miền Bắc bước vào xây dựng chủ nghĩa xã hội, miền Nam phát triển phong trào đấu tranh chống chế độ tay sai và can thiệp ngày càng sâu của Hoa Kỳ.',
    slug: '1954-1965',
    startYear: 1954,
    summary: 'Hai miền với hai nhiệm vụ chiến lược, chuẩn bị cho giai đoạn đối đầu trực tiếp quy mô lớn.',
    title: '1954-1965: Chia cắt đất nước và tích lũy lực lượng',
  },
  {
    accentColor: '#d08a34',
    endYear: 1973,
    keyThemes: [{ label: 'Chiến tranh cục bộ' }, { label: 'Tổng tiến công và nổi dậy' }],
    overview:
      'Sự can thiệp quân sự trực tiếp của Hoa Kỳ làm thay đổi quy mô chiến tranh. Các chiến dịch lớn, cao trào đấu tranh đô thị và đấu tranh ngoại giao diễn ra song song, dẫn tới Hiệp định Paris.',
    slug: '1965-1973',
    startYear: 1965,
    summary: 'Giai đoạn chiến tranh ác liệt nhất với mặt trận quân sự, chính trị và ngoại giao cùng phát triển.',
    title: '1965-1973: Kháng chiến chống Mỹ và Hiệp định Paris',
  },
  {
    accentColor: '#e0a34a',
    endYear: 1975,
    keyThemes: [{ label: 'Tổng tiến công chiến lược' }, { label: 'Giải phóng hoàn toàn miền Nam' }],
    overview:
      'Sau Hiệp định Paris, tương quan lực lượng thay đổi nhanh. Các chiến dịch Tây Nguyên, Huế - Đà Nẵng và Chiến dịch Hồ Chí Minh nối tiếp nhau trong mùa Xuân 1975.',
    slug: '1973-1975',
    startYear: 1973,
    summary: 'Hai năm quyết định dẫn đến sự sụp đổ của chính quyền Sài Gòn và thống nhất đất nước.',
    title: '1973-1975: Từ Paris đến mùa Xuân toàn thắng',
  },
  {
    accentColor: '#7d4d2b',
    endYear: 1986,
    keyThemes: [{ label: 'Thống nhất nhà nước' }, { label: 'Khắc phục hậu quả chiến tranh' }],
    overview:
      'Sau 1975, đất nước bước vào thời kỳ thống nhất bộ máy nhà nước, khắc phục hậu quả chiến tranh, bảo vệ biên giới và chuẩn bị cho đổi mới.',
    slug: '1975-1986',
    startYear: 1975,
    summary: 'Giai đoạn hậu chiến và hoàn thiện nhà nước thống nhất.',
    title: '1975-1986: Thống nhất đất nước và những thử thách hậu chiến',
  },
]

export const demoPlaces: DemoPlace[] = [
  {
    body: 'Bến Nhà Rồng gắn với thời điểm Nguyễn Tất Thành ra đi tìm đường cứu nước, về sau trở thành một biểu tượng mở đầu cho hành trình tư tưởng và chính trị của cách mạng Việt Nam thế kỷ XX.',
    modernLocation: {
      label: 'Bến Nhà Rồng, Quận 4',
      latitude: 10.7699,
      longitude: 106.7066,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1919-1930',
    region: 'south',
    slug: 'ben-nha-rong',
    sources: ['vien-su-hoc-can-hien-dai'],
    summary: 'Biểu tượng cho hành trình tìm đường cứu nước đầu thế kỷ XX.',
    title: 'Bến Nhà Rồng',
  },
  {
    body: 'Quảng trường Ba Đình là nơi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn độc lập ngày 2/9/1945, đánh dấu sự ra đời của nước Việt Nam Dân chủ Cộng hòa.',
    modernLocation: {
      label: 'Quảng trường Ba Đình',
      latitude: 21.0367,
      longitude: 105.8348,
      province: 'Hà Nội',
    },
    period: '1930-1945',
    region: 'north',
    slug: 'quang-truong-ba-dinh',
    sources: ['bao-tang-lich-su-quoc-gia', 'luu-tru-quoc-gia-1945'],
    summary: 'Không gian biểu tượng của tuyên ngôn độc lập và chính quyền cách mạng.',
    title: 'Quảng trường Ba Đình',
  },
  {
    body: 'Chiến khu Việt Bắc là trung tâm căn cứ địa cách mạng, nơi đặt cơ quan đầu não trong kháng chiến chống Pháp và là hậu phương chiến lược của nhiều chiến dịch lớn.',
    modernLocation: {
      label: 'ATK Việt Bắc',
      latitude: 21.711,
      longitude: 105.516,
      province: 'Thái Nguyên',
    },
    period: '1945-1954',
    region: 'north',
    slug: 'viet-bac',
    sources: ['lich-su-khang-chien-chong-phap', 'van-kien-dang-toan-tap'],
    summary: 'Căn cứ địa chiến lược và trung tâm chỉ đạo kháng chiến chống Pháp.',
    title: 'Việt Bắc',
  },
  {
    body: 'Điện Biên Phủ là địa bàn của chiến dịch quyết định năm 1954, nơi thất bại của tập đoàn cứ điểm Pháp làm thay đổi cục diện chiến tranh và đàm phán quốc tế.',
    modernLocation: {
      label: 'Cánh đồng Mường Thanh',
      latitude: 21.386,
      longitude: 103.023,
      province: 'Điện Biên',
    },
    period: '1945-1954',
    region: 'north',
    slug: 'dien-bien-phu',
    sources: ['lich-su-khang-chien-chong-phap', 'bach-khoa-quan-su'],
    summary: 'Không gian quyết chiến chiến lược của năm 1954.',
    title: 'Điện Biên Phủ',
  },
  {
    body: 'Vĩ tuyến 17 là ký hiệu chính trị - quân sự của sự chia cắt tạm thời theo Hiệp định Genève, định hình cấu trúc chiến lược hai miền suốt hơn hai thập niên.',
    modernLocation: {
      label: 'Khu vực cầu Hiền Lương - sông Bến Hải',
      latitude: 17.049,
      longitude: 107.035,
      province: 'Quảng Trị',
    },
    period: '1954-1965',
    region: 'central',
    slug: 'hien-luong-ben-hai',
    sources: ['ho-so-geneve-paris', 'bien-nien-su-kien-1930-1975'],
    summary: 'Biểu tượng trực quan của đất nước tạm chia cắt sau 1954.',
    title: 'Hiền Lương - Bến Hải',
  },
  {
    body: 'Đường Trường Sơn là không gian hậu cần chiến lược nối hậu phương miền Bắc với các chiến trường miền Nam, Tây Nguyên và Lào - Campuchia.',
    modernLocation: {
      label: 'Trục Trường Sơn qua Quảng Bình',
      latitude: 17.468,
      longitude: 106.598,
      province: 'Quảng Bình',
    },
    period: '1965-1973',
    region: 'interregional',
    slug: 'duong-truong-son',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    summary: 'Hệ thống giao thông - hậu cần chiến lược xuyên dãy Trường Sơn.',
    title: 'Đường Trường Sơn',
  },
  {
    body: 'Dinh Độc Lập là địa điểm gắn với kết thúc chiến tranh năm 1975 và chuyển giao quyền lực ở Sài Gòn.',
    modernLocation: {
      label: 'Dinh Độc Lập',
      latitude: 10.7771,
      longitude: 106.6953,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1973-1975',
    region: 'south',
    slug: 'dinh-doc-lap',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    summary: 'Điểm kết thúc biểu tượng của Chiến dịch Hồ Chí Minh.',
    title: 'Dinh Độc Lập',
  },
]

export const demoEvents: DemoEvent[] = [
  {
    content:
      'Ngày 3/2/1930, các tổ chức cộng sản trong nước được thống nhất thành một đảng duy nhất. Sự kiện tạo ra trung tâm lãnh đạo thống nhất cho phong trào cách mạng và xác lập một chương trình hành động mới.',
    datePrecision: 'day',
    displayYear: 1930,
    period: '1930-1945',
    places: ['ben-nha-rong'],
    region: 'south',
    slug: 'thanh-lap-dang-cong-san-viet-nam',
    sources: ['van-kien-dang-toan-tap', 'bien-nien-su-kien-1930-1975'],
    startDate: '1930-02-03T00:00:00.000Z',
    summary: 'Mốc hợp nhất các tổ chức cộng sản và xác lập trung tâm lãnh đạo cách mạng.',
    title: 'Thành lập Đảng Cộng sản Việt Nam',
    topics: ['organization'],
  },
  {
    content:
      'Ngày 2/9/1945, tại Ba Đình, Chủ tịch Hồ Chí Minh tuyên bố độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa. Đây là kết quả trực tiếp của Cách mạng tháng Tám và sự chuyển hóa quyền lực trên phạm vi cả nước.',
    datePrecision: 'day',
    displayYear: 1945,
    modernLocation: {
      label: 'Ba Đình',
      latitude: 21.0367,
      longitude: 105.8348,
      province: 'Hà Nội',
    },
    period: '1930-1945',
    places: ['quang-truong-ba-dinh'],
    region: 'north',
    slug: 'tuyen-ngon-doc-lap',
    sources: ['bao-tang-lich-su-quoc-gia', 'luu-tru-quoc-gia-1945'],
    startDate: '1945-09-02T00:00:00.000Z',
    summary: 'Tuyên bố thành lập nhà nước mới sau thắng lợi của Cách mạng tháng Tám.',
    title: 'Tuyên ngôn Độc lập',
    topics: ['organization', 'culture'],
  },
  {
    content:
      'Cuộc chiến đấu 60 ngày đêm ở Hà Nội cuối năm 1946 đánh dấu quyết tâm bảo vệ chính quyền non trẻ và mở đầu cuộc kháng chiến toàn quốc chống thực dân Pháp.',
    datePrecision: 'range',
    displayYear: 1946,
    endDate: '1947-02-17T00:00:00.000Z',
    modernLocation: {
      label: 'Khu phố cổ Hà Nội',
      latitude: 21.0345,
      longitude: 105.8522,
      province: 'Hà Nội',
    },
    period: '1945-1954',
    places: ['quang-truong-ba-dinh'],
    region: 'north',
    slug: 'toan-quoc-khang-chien',
    sources: ['lich-su-khang-chien-chong-phap', 'van-kien-dang-toan-tap'],
    startDate: '1946-12-19T00:00:00.000Z',
    summary: 'Mở đầu giai đoạn kháng chiến toàn quốc chống Pháp.',
    title: 'Toàn quốc kháng chiến',
    topics: ['military'],
  },
  {
    content:
      'Thắng lợi Điện Biên Phủ năm 1954 làm thay đổi tương quan lực lượng trên bàn đàm phán, mở đường cho việc ký Hiệp định Genève.',
    datePrecision: 'range',
    displayYear: 1954,
    endDate: '1954-05-07T00:00:00.000Z',
    modernLocation: {
      label: 'Điện Biên Phủ',
      latitude: 21.386,
      longitude: 103.023,
      province: 'Điện Biên',
    },
    period: '1945-1954',
    places: ['dien-bien-phu'],
    region: 'north',
    slug: 'chien-thang-dien-bien-phu',
    sources: ['lich-su-khang-chien-chong-phap', 'bach-khoa-quan-su'],
    startDate: '1954-03-13T00:00:00.000Z',
    summary: 'Trận quyết chiến chiến lược kết thúc chiến tranh Đông Dương lần thứ nhất.',
    title: 'Chiến thắng Điện Biên Phủ',
    topics: ['military', 'diplomacy'],
  },
  {
    content:
      'Phong trào Đồng khởi 1959-1960 đánh dấu bước phát triển từ đấu tranh chính trị sang kết hợp chính trị với vũ trang ở nhiều địa bàn miền Nam.',
    datePrecision: 'range',
    displayYear: 1960,
    endDate: '1960-12-31T00:00:00.000Z',
    modernLocation: {
      label: 'Bến Tre',
      latitude: 10.2415,
      longitude: 106.3756,
      province: 'Bến Tre',
    },
    period: '1954-1965',
    places: [],
    region: 'south',
    slug: 'dong-khoi-ben-tre',
    sources: ['bien-nien-su-kien-1930-1975', 'van-kien-dang-toan-tap'],
    startDate: '1959-01-01T00:00:00.000Z',
    summary: 'Bước ngoặt của phong trào cách mạng miền Nam đầu thập niên 1960.',
    title: 'Đồng khởi',
    topics: ['uprising', 'organization'],
  },
  {
    content:
      'Tổng tiến công và nổi dậy Tết Mậu Thân 1968 là chiến dịch quy mô lớn trên nhiều đô thị và chiến trường, tạo cú chấn động chính trị sâu rộng trong và ngoài Việt Nam.',
    datePrecision: 'month',
    displayYear: 1968,
    modernLocation: {
      label: 'Huế, Sài Gòn và các đô thị miền Nam',
      latitude: 16.4637,
      longitude: 107.5909,
      province: 'Thừa Thiên Huế',
    },
    period: '1965-1973',
    places: ['duong-truong-son'],
    region: 'interregional',
    slug: 'tet-mau-than-1968',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    startDate: '1968-01-30T00:00:00.000Z',
    summary: 'Đợt tổng tiến công làm thay đổi nhận thức chiến lược của đối phương.',
    title: 'Tổng tiến công và nổi dậy Tết Mậu Thân 1968',
    topics: ['military', 'culture'],
  },
  {
    content:
      'Hiệp định Paris năm 1973 đánh dấu việc Hoa Kỳ cam kết rút quân và tạo nên cục diện mới cho cuộc chiến tại miền Nam.',
    datePrecision: 'day',
    displayYear: 1973,
    modernLocation: {
      label: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      province: 'Ile-de-France',
    },
    period: '1965-1973',
    places: [],
    region: 'international',
    slug: 'hiep-dinh-paris-1973',
    sources: ['ho-so-geneve-paris', 'bien-nien-su-kien-1930-1975'],
    startDate: '1973-01-27T00:00:00.000Z',
    summary: 'Mốc ngoại giao then chốt làm đổi tương quan chiến lược cuối cuộc chiến.',
    title: 'Hiệp định Paris 1973',
    topics: ['diplomacy'],
  },
  {
    content:
      'Từ Tây Nguyên đến Huế - Đà Nẵng và Sài Gòn, mùa Xuân 1975 chứng kiến sự sụp đổ nhanh chóng của hệ thống phòng thủ đối phương và sự kết thúc của chiến tranh.',
    datePrecision: 'range',
    displayYear: 1975,
    endDate: '1975-04-30T00:00:00.000Z',
    modernLocation: {
      label: 'Sài Gòn',
      latitude: 10.7771,
      longitude: 106.6953,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1973-1975',
    places: ['dinh-doc-lap'],
    region: 'interregional',
    slug: 'dai-thang-mua-xuan-1975',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    startDate: '1975-03-10T00:00:00.000Z',
    summary: 'Chuỗi chiến dịch quyết định dẫn đến giải phóng hoàn toàn miền Nam.',
    title: 'Đại thắng mùa Xuân 1975',
    topics: ['military'],
  },
]

export const demoCampaigns: DemoCampaign[] = [
  {
    body: 'Một chiến dịch hiệp đồng quy mô lớn nhằm tiêu diệt tập đoàn cứ điểm Điện Biên Phủ, phối hợp giữa công tác hậu cần, pháo binh, công binh và chiến thuật công kiên.',
    datePrecision: 'range',
    displayYear: 1954,
    endDate: '1954-05-07T00:00:00.000Z',
    historicalGeometry: {
      coordinates: [
        [
          [102.88, 21.51],
          [103.26, 21.51],
          [103.26, 21.25],
          [102.88, 21.25],
          [102.88, 21.51],
        ],
      ],
      type: 'Polygon',
    },
    modernLocation: {
      label: 'Lòng chảo Điện Biên',
      latitude: 21.386,
      longitude: 103.023,
      province: 'Điện Biên',
    },
    outcome: 'Tiêu diệt tập đoàn cứ điểm, buộc Pháp phải ký Hiệp định Genève.',
    period: '1945-1954',
    region: 'north',
    relatedEvents: ['chien-thang-dien-bien-phu'],
    relatedPlaces: ['dien-bien-phu', 'viet-bac'],
    slug: 'chien-dich-dien-bien-phu',
    sources: ['lich-su-khang-chien-chong-phap', 'bach-khoa-quan-su'],
    startDate: '1954-03-13T00:00:00.000Z',
    summary: 'Chiến dịch quyết chiến chiến lược lớn nhất của kháng chiến chống Pháp.',
    title: 'Chiến dịch Điện Biên Phủ',
  },
  {
    body: 'Đường Trường Sơn là nỗ lực kéo dài nhiều năm để duy trì tuyến vận tải chiến lược, bảo đảm hậu cần và cơ động lực lượng cho chiến trường miền Nam.',
    datePrecision: 'range',
    displayYear: 1965,
    endDate: '1973-01-27T00:00:00.000Z',
    historicalGeometry: {
      coordinates: [
        [106.55, 17.47],
        [107.2, 16.4],
        [108.0, 15.2],
        [107.85, 13.8],
        [107.65, 12.35],
        [106.8, 11.2],
      ],
      type: 'LineString',
    },
    outcome: 'Bảo đảm sức người, sức của cho các chiến trường và tạo chiều sâu chiến lược.',
    period: '1965-1973',
    region: 'interregional',
    relatedEvents: ['tet-mau-than-1968'],
    relatedPlaces: ['duong-truong-son'],
    slug: 'van-tai-chien-luoc-truong-son',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    startDate: '1965-01-01T00:00:00.000Z',
    summary: 'Nỗ lực hậu cần chiến lược nối miền Bắc với các chiến trường phía Nam.',
    title: 'Tuyến vận tải chiến lược Trường Sơn',
  },
  {
    body: 'Chiến dịch Hồ Chí Minh là đòn quyết định cuối cùng, kết hợp nhiều cánh quân tiến vào Sài Gòn sau khi Tây Nguyên và Huế - Đà Nẵng đã sụp đổ.',
    datePrecision: 'range',
    displayYear: 1975,
    endDate: '1975-04-30T00:00:00.000Z',
    historicalGeometry: {
      coordinates: [
        [
          [106.35, 10.95],
          [106.95, 10.95],
          [106.95, 10.45],
          [106.35, 10.45],
          [106.35, 10.95],
        ],
      ],
      type: 'Polygon',
    },
    modernLocation: {
      label: 'Vòng vây Sài Gòn',
      latitude: 10.776,
      longitude: 106.699,
      province: 'TP. Hồ Chí Minh',
    },
    outcome: 'Giải phóng Sài Gòn, kết thúc chiến tranh và mở ra thống nhất đất nước.',
    period: '1973-1975',
    region: 'south',
    relatedEvents: ['dai-thang-mua-xuan-1975'],
    relatedPlaces: ['dinh-doc-lap'],
    slug: 'chien-dich-ho-chi-minh',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    startDate: '1975-04-26T00:00:00.000Z',
    summary: 'Chiến dịch cuối cùng của mùa Xuân 1975 tiến vào Sài Gòn.',
    title: 'Chiến dịch Hồ Chí Minh',
  },
]

export const demoHistoricalOverlays: DemoHistoricalOverlay[] = [
  {
    color: '#8c3d22',
    historicalGeometry: {
      coordinates: [
        [
          [104.8, 22.5],
          [106.2, 22.5],
          [106.2, 21.1],
          [104.8, 21.1],
          [104.8, 22.5],
        ],
      ],
      type: 'Polygon',
    },
    layerGroup: 'historical_overlays',
    layerKind: 'region',
    opacity: 0.25,
    period: '1945-1954',
    region: 'north',
    slug: 'overlay-viet-bac',
    sources: ['lich-su-khang-chien-chong-phap', 'van-kien-dang-toan-tap'],
    summary: 'Vùng căn cứ địa chiến lược của cuộc kháng chiến chống Pháp.',
    title: 'Chiến khu Việt Bắc',
    validFrom: '1947-01-01T00:00:00.000Z',
  },
  {
    color: '#ab2f24',
    historicalGeometry: {
      coordinates: [
        [106.55, 17.47],
        [107.2, 16.4],
        [108.0, 15.2],
        [107.85, 13.8],
        [107.65, 12.35],
        [106.8, 11.2],
      ],
      type: 'LineString',
    },
    layerGroup: 'historical_overlays',
    layerKind: 'route',
    opacity: 0.8,
    period: '1965-1973',
    region: 'interregional',
    relatedCampaign: 'van-tai-chien-luoc-truong-son',
    slug: 'overlay-truong-son',
    sources: ['bach-khoa-quan-su', 'bien-nien-su-kien-1930-1975'],
    summary: 'Trục vận tải chiến lược nối miền Bắc với các chiến trường phía Nam.',
    title: 'Đường Trường Sơn',
    validFrom: '1965-01-01T00:00:00.000Z',
    validTo: '1973-01-27T00:00:00.000Z',
  },
  {
    color: '#d08a34',
    historicalGeometry: {
      coordinates: [106.6953, 10.7771],
      type: 'Point',
    },
    layerGroup: 'historical_overlays',
    layerKind: 'point',
    opacity: 1,
    period: '1973-1975',
    region: 'south',
    relatedCampaign: 'chien-dich-ho-chi-minh',
    slug: 'overlay-dinh-doc-lap',
    sources: ['bach-khoa-quan-su'],
    summary: 'Điểm kết thúc chiến dịch và dấu mốc biểu tượng của ngày 30/4/1975.',
    title: 'Dinh Độc Lập',
    validFrom: '1975-04-30T00:00:00.000Z',
  },
  {
    color: '#5f86a4',
    historicalGeometry: {
      coordinates: [
        [106.98, 17.06],
        [107.09, 17.06],
      ],
      type: 'LineString',
    },
    layerGroup: 'historical_overlays',
    layerKind: 'front',
    opacity: 0.9,
    period: '1954-1965',
    region: 'central',
    slug: 'overlay-v17',
    sources: ['ho-so-geneve-paris', 'bien-nien-su-kien-1930-1975'],
    summary: 'Đường phân giới quân sự tạm thời theo Hiệp định Genève.',
    title: 'Vĩ tuyến 17',
    validFrom: '1954-07-21T00:00:00.000Z',
    validTo: '1975-04-30T00:00:00.000Z',
  },
]

export const demoBoundaryTransitions: DemoBoundaryTransition[] = [
  {
    changes: [
      {
        displayColor: '#8a5d34',
        memberProvinceSlugs: [
          'ha-giang',
          'cao-bang',
          'bac-kan',
          'lang-son',
          'tuyen-quang',
          'thai-nguyen',
          'lao-cai',
          'yen-bai',
          'son-la',
          'lai-chau',
          'dien-bien',
          'phu-tho',
          'vinh-phuc',
          'ha-noi',
          'ha-tay',
          'hoa-binh',
          'bac-giang',
          'bac-ninh',
          'hai-duong',
          'hai-phong',
          'quang-ninh',
          'hung-yen',
          'thai-binh',
          'ha-nam',
          'nam-dinh',
          'ninh-binh',
        ],
        slug: 'bac-ky',
        summary: 'Lớp tham chiếu xấp xỉ cho Bắc Kỳ trong bố cục thời thuộc địa và tiền cách mạng.',
        title: 'Bắc Kỳ',
        unitType: 'historical_region',
      },
      {
        displayColor: '#b77746',
        memberProvinceSlugs: [
          'thanh-hoa',
          'nghe-an',
          'ha-tinh',
          'quang-binh',
          'quang-tri',
          'thua-thien-hue',
          'da-nang',
          'quang-nam',
          'quang-ngai',
          'binh-dinh',
          'phu-yen',
          'khanh-hoa',
          'ninh-thuan',
          'binh-thuan',
          'kon-tum',
          'gia-lai',
          'dak-lak',
          'dak-nong',
          'lam-dong',
        ],
        slug: 'trung-ky',
        summary: 'Lớp tham chiếu xấp xỉ cho Trung Kỳ, bao gồm duyên hải Trung Bộ và Tây Nguyên trong v1.',
        title: 'Trung Kỳ',
        unitType: 'historical_region',
      },
      {
        displayColor: '#6c7b50',
        memberProvinceSlugs: [
          'tay-ninh',
          'binh-phuoc',
          'binh-duong',
          'dong-nai',
          'ho-chi-minh',
          'ba-ria-vung-tau',
          'long-an',
          'tien-giang',
          'ben-tre',
          'tra-vinh',
          'vinh-long',
          'can-tho',
          'hau-giang',
          'soc-trang',
          'dong-thap',
          'an-giang',
          'kien-giang',
          'bac-lieu',
          'ca-mau',
        ],
        slug: 'nam-ky',
        summary: 'Lớp tham chiếu xấp xỉ cho Nam Kỳ, dùng để đặt bối cảnh cho giai đoạn trước 1945.',
        title: 'Nam Kỳ',
        unitType: 'historical_region',
      },
    ],
    slug: '1858-1944-regions',
    sources: ['vien-su-hoc-can-hien-dai', 'van-kien-dang-toan-tap'],
    summary:
      'Lớp ranh giới nền tham chiếu cho giai đoạn cách mạng trước thống nhất. V1 vẫn dùng mảnh tỉnh hiện đại để bảo toàn khả năng click và label.',
    title: '1930-1975: Ranh giới tham chiếu trước thống nhất',
    validFromYear: 1858,
  },
  {
    changes: [
      {
        displayColor: '#7f5c40',
        memberProvinceSlugs: ['ha-giang', 'cao-bang', 'bac-kan', 'lang-son', 'tuyen-quang', 'thai-nguyen'],
        slug: 'viet-bac',
        summary: 'Không gian căn cứ và lãnh đạo kháng chiến gắn với Trung ương Đảng trong giai đoạn 1945-1954.',
        title: 'Việt Bắc',
        unitType: 'historical_region',
      },
      {
        displayColor: '#9e7a46',
        memberProvinceSlugs: ['lao-cai', 'yen-bai', 'son-la', 'lai-chau', 'dien-bien', 'hoa-binh'],
        slug: 'tay-bac',
        summary: 'Vùng Tây Bắc được dùng làm lớp nền lịch sử cho chiến trường và hành lang kháng chiến 1945-1954.',
        title: 'Tây Bắc',
        unitType: 'historical_region',
      },
      {
        displayColor: '#6f7b6b',
        memberProvinceSlugs: [
          'phu-tho',
          'vinh-phuc',
          'ha-noi',
          'ha-tay',
          'bac-giang',
          'bac-ninh',
          'hai-duong',
          'hai-phong',
          'quang-ninh',
          'hung-yen',
          'thai-binh',
          'ha-nam',
          'nam-dinh',
          'ninh-binh',
        ],
        slug: 'dong-bang-bac-bo',
        summary: 'Đồng bằng Bắc Bộ được gom để hiện bối cảnh đô thị, hậu phương và các điểm nóng cách mạng 1945-1954.',
        title: 'Đồng bằng Bắc Bộ',
        unitType: 'historical_region',
      },
      {
        displayColor: '#a9683c',
        memberProvinceSlugs: ['thanh-hoa', 'nghe-an', 'ha-tinh', 'quang-binh', 'quang-tri', 'thua-thien-hue'],
        slug: 'lien-khu-iv',
        summary: 'Liên khu IV được dùng làm lớp nền cho trục kháng chiến Trung Bộ giai đoạn 1945-1954.',
        title: 'Liên khu IV',
        unitType: 'historical_region',
      },
      {
        displayColor: '#c4874a',
        memberProvinceSlugs: [
          'da-nang',
          'quang-nam',
          'quang-ngai',
          'binh-dinh',
          'phu-yen',
          'khanh-hoa',
          'ninh-thuan',
          'binh-thuan',
          'kon-tum',
          'gia-lai',
          'dak-lak',
          'dak-nong',
          'lam-dong',
        ],
        slug: 'lien-khu-v',
        summary: 'Liên khu V gồm duyên hải Nam Trung Bộ và Tây Nguyên trong mô hình xấp xỉ của bản đồ.',
        title: 'Liên khu V',
        unitType: 'historical_region',
      },
      {
        displayColor: '#587c5a',
        memberProvinceSlugs: [
          'tay-ninh',
          'binh-phuoc',
          'binh-duong',
          'dong-nai',
          'ho-chi-minh',
          'ba-ria-vung-tau',
          'long-an',
          'tien-giang',
          'ben-tre',
          'tra-vinh',
          'vinh-long',
          'can-tho',
          'hau-giang',
          'soc-trang',
          'dong-thap',
          'an-giang',
          'kien-giang',
          'bac-lieu',
          'ca-mau',
        ],
        slug: 'nam-bo',
        summary: 'Nam Bộ được trình bày như một chiến trường lớn để đặt bối cảnh cho phong trào và chiến dịch 1945-1954.',
        title: 'Nam Bộ',
        unitType: 'historical_region',
      },
    ],
    slug: '1945-1953-war-zones',
    sources: ['lich-su-khang-chien-chong-phap', 'van-kien-dang-toan-tap'],
    summary:
      'Từ 1945 đến trước Genève 1954, bản đồ đổi sang các không gian kháng chiến lớn như Việt Bắc, Tây Bắc, Liên khu IV, Liên khu V và Nam Bộ thay vì tên tỉnh hiện đại.',
    title: '1945-1953: Căn cứ và liên khu kháng chiến',
    validFromYear: 1945,
  },
  {
    changes: [
      {
        displayColor: '#7d6d4a',
        memberProvinceSlugs: [
          'ha-giang',
          'cao-bang',
          'bac-kan',
          'lang-son',
          'tuyen-quang',
          'thai-nguyen',
          'lao-cai',
          'yen-bai',
          'son-la',
          'lai-chau',
          'dien-bien',
          'phu-tho',
          'vinh-phuc',
          'ha-noi',
          'ha-tay',
          'hoa-binh',
          'bac-giang',
          'bac-ninh',
          'hai-duong',
          'hai-phong',
          'quang-ninh',
          'hung-yen',
          'thai-binh',
          'ha-nam',
          'nam-dinh',
          'ninh-binh',
          'thanh-hoa',
          'nghe-an',
          'ha-tinh',
          'quang-binh',
        ],
        slug: 'mien-bac',
        summary: 'Lớp nền cho miền Bắc Việt Nam Dân chủ Cộng hòa trong giai đoạn 1954-1975, xấp xỉ theo ranh giới tỉnh hiện có.',
        title: 'Miền Bắc',
        unitType: 'historical_region',
      },
      {
        displayColor: '#9d5d43',
        memberProvinceSlugs: ['quang-tri', 'thua-thien-hue'],
        slug: 'tri-thien',
        summary: 'Trị - Thiên được tách riêng vì đây là địa bàn chuyển tiếp và chiến trường đặc thù sau 1954.',
        title: 'Trị - Thiên',
        unitType: 'historical_region',
      },
      {
        displayColor: '#be8148',
        memberProvinceSlugs: ['da-nang', 'quang-nam', 'quang-ngai', 'binh-dinh', 'phu-yen'],
        slug: 'khu-v',
        summary: 'Khu V được dùng làm lớp nền cho các phong trào và chiến dịch ở duyên hải Trung Trung Bộ.',
        title: 'Khu V',
        unitType: 'historical_region',
      },
      {
        displayColor: '#8f7c44',
        memberProvinceSlugs: ['kon-tum', 'gia-lai', 'dak-lak', 'dak-nong'],
        slug: 'tay-nguyen',
        summary: 'Tây Nguyên được thể hiện riêng để đặt bối cảnh cho các chiến dịch và hành lang chiến lược.',
        title: 'Tây Nguyên',
        unitType: 'historical_region',
      },
      {
        displayColor: '#a27057',
        memberProvinceSlugs: ['khanh-hoa', 'ninh-thuan', 'binh-thuan', 'lam-dong'],
        slug: 'khu-vi',
        summary: 'Khu VI là lớp không gian trung gian giữa duyên hải cực Nam Trung Bộ và nội địa cao nguyên.',
        title: 'Khu VI',
        unitType: 'historical_region',
      },
      {
        displayColor: '#5e7954',
        memberProvinceSlugs: ['tay-ninh', 'binh-phuoc', 'binh-duong', 'dong-nai', 'ho-chi-minh', 'ba-ria-vung-tau'],
        slug: 'dong-nam-bo',
        summary: 'Đông Nam Bộ đặt bối cảnh cho khu vực Sài Gòn - Gia Định và các chiến trường lân cận.',
        title: 'Đông Nam Bộ',
        unitType: 'historical_region',
      },
      {
        displayColor: '#4f6f68',
        memberProvinceSlugs: [
          'long-an',
          'tien-giang',
          'ben-tre',
          'tra-vinh',
          'vinh-long',
          'can-tho',
          'hau-giang',
          'soc-trang',
          'dong-thap',
          'an-giang',
          'kien-giang',
          'bac-lieu',
          'ca-mau',
        ],
        slug: 'tay-nam-bo',
        summary: 'Tây Nam Bộ được gom thành một lớp nền chiến trường lớn cho giai đoạn 1954-1975.',
        title: 'Tây Nam Bộ',
        unitType: 'historical_region',
      },
    ],
    slug: '1954-1975-historical-regions',
    sources: ['ho-so-geneve-paris', 'bach-khoa-quan-su', 'van-kien-dang-toan-tap'],
    summary:
      'Từ 1954 đến 1975, bản đồ chuyển sang các không gian lịch sử lớn như Miền Bắc, Trị - Thiên, Khu V, Tây Nguyên, Khu VI, Đông Nam Bộ và Tây Nam Bộ thay vì tên tỉnh hiện đại.',
    title: '1954-1975: Hai miền và các chiến trường cách mạng',
    validFromYear: 1954,
  },
  {
    changes: [
      {
        displayColor: '#8a6a3f',
        memberProvinceSlugs: ['ha-tay', 'hoa-binh'],
        slug: 'ha-son-binh',
        summary: 'Đơn vị hợp nhất dùng cho giai đoạn sau thống nhất.',
        title: 'Hà Sơn Bình',
        unitType: 'merged_province',
      },
      {
        displayColor: '#99573d',
        memberProvinceSlugs: ['ha-nam', 'nam-dinh', 'ninh-binh'],
        slug: 'ha-nam-ninh',
        title: 'Hà Nam Ninh',
        unitType: 'merged_province',
      },
      {
        displayColor: '#9d7a41',
        memberProvinceSlugs: ['bac-giang', 'bac-ninh'],
        slug: 'ha-bac',
        title: 'Hà Bắc',
        unitType: 'merged_province',
      },
      {
        displayColor: '#6f7c45',
        memberProvinceSlugs: ['hai-duong', 'hung-yen'],
        slug: 'hai-hung',
        title: 'Hải Hưng',
        unitType: 'merged_province',
      },
      {
        displayColor: '#536d8e',
        memberProvinceSlugs: ['vinh-phuc', 'phu-tho'],
        slug: 'vinh-phu',
        title: 'Vĩnh Phú',
        unitType: 'merged_province',
      },
      {
        displayColor: '#98734c',
        memberProvinceSlugs: ['lao-cai', 'yen-bai'],
        slug: 'hoang-lien-son',
        title: 'Hoàng Liên Sơn',
        unitType: 'merged_province',
      },
      {
        displayColor: '#7e6854',
        memberProvinceSlugs: ['ha-giang', 'tuyen-quang'],
        slug: 'ha-tuyen',
        title: 'Hà Tuyên',
        unitType: 'merged_province',
      },
      {
        displayColor: '#5c7a6a',
        memberProvinceSlugs: ['bac-kan', 'thai-nguyen'],
        slug: 'bac-thai',
        title: 'Bắc Thái',
        unitType: 'merged_province',
      },
      {
        displayColor: '#bb7540',
        memberProvinceSlugs: ['quang-ngai', 'binh-dinh'],
        slug: 'nghia-binh',
        title: 'Nghĩa Bình',
        unitType: 'merged_province',
      },
      {
        displayColor: '#b2604b',
        memberProvinceSlugs: ['phu-yen', 'khanh-hoa'],
        slug: 'phu-khanh',
        title: 'Phú Khánh',
        unitType: 'merged_province',
      },
      {
        displayColor: '#c07b5a',
        memberProvinceSlugs: ['ninh-thuan', 'binh-thuan'],
        slug: 'thuan-hai',
        title: 'Thuận Hải',
        unitType: 'merged_province',
      },
      {
        displayColor: '#7b6a37',
        memberProvinceSlugs: ['dak-lak', 'dak-nong'],
        slug: 'dak-lak-mo-rong',
        title: 'Đắk Lắk',
        unitType: 'merged_province',
      },
      {
        displayColor: '#5d7a3d',
        memberProvinceSlugs: ['gia-lai', 'kon-tum'],
        slug: 'gia-lai-kon-tum',
        title: 'Gia Lai - Kon Tum',
        unitType: 'merged_province',
      },
      {
        displayColor: '#8f5a44',
        memberProvinceSlugs: ['binh-duong', 'binh-phuoc'],
        slug: 'song-be',
        title: 'Sông Bé',
        unitType: 'merged_province',
      },
      {
        displayColor: '#8c4f54',
        memberProvinceSlugs: ['bac-lieu', 'ca-mau'],
        slug: 'minh-hai',
        title: 'Minh Hải',
        unitType: 'merged_province',
      },
      {
        displayColor: '#7a6550',
        memberProvinceSlugs: ['vinh-long', 'tra-vinh'],
        slug: 'cuu-long',
        title: 'Cửu Long',
        unitType: 'merged_province',
      },
      {
        displayColor: '#9c6d56',
        memberProvinceSlugs: ['quang-nam', 'da-nang'],
        slug: 'quang-nam-da-nang',
        title: 'Quảng Nam - Đà Nẵng',
        unitType: 'merged_province',
      },
    ],
    restoreAllProvinces: true,
    slug: '1976-1991-admin',
    sources: ['bien-nien-su-kien-1930-1975', 'van-kien-dang-toan-tap'],
    summary:
      'Lớp ranh giới mô phỏng cấu trúc tỉnh hợp nhất sau 1975, dùng để xem event và campaign trên một mốc năm cụ thể.',
    title: '1976-1991: Giai đoạn tỉnh hợp nhất',
    validFromYear: 1976,
  },
  {
    changes: [
      {
        displayColor: '#9d7a41',
        memberProvinceSlugs: ['bac-giang', 'bac-ninh'],
        slug: 'ha-bac',
        title: 'Hà Bắc',
        unitType: 'merged_province',
      },
      {
        displayColor: '#6f7c45',
        memberProvinceSlugs: ['hai-duong', 'hung-yen'],
        slug: 'hai-hung',
        title: 'Hải Hưng',
        unitType: 'merged_province',
      },
      {
        displayColor: '#536d8e',
        memberProvinceSlugs: ['vinh-phuc', 'phu-tho'],
        slug: 'vinh-phu',
        title: 'Vĩnh Phú',
        unitType: 'merged_province',
      },
      {
        displayColor: '#8c6e44',
        memberProvinceSlugs: ['ha-nam', 'nam-dinh'],
        slug: 'nam-ha',
        title: 'Nam Hà',
        unitType: 'merged_province',
      },
      {
        displayColor: '#98734c',
        memberProvinceSlugs: ['lao-cai', 'yen-bai'],
        slug: 'hoang-lien-son',
        title: 'Hoàng Liên Sơn',
        unitType: 'merged_province',
      },
      {
        displayColor: '#7e6854',
        memberProvinceSlugs: ['ha-giang', 'tuyen-quang'],
        slug: 'ha-tuyen',
        title: 'Hà Tuyên',
        unitType: 'merged_province',
      },
      {
        displayColor: '#5c7a6a',
        memberProvinceSlugs: ['bac-kan', 'thai-nguyen'],
        slug: 'bac-thai',
        title: 'Bắc Thái',
        unitType: 'merged_province',
      },
      {
        displayColor: '#8f5a44',
        memberProvinceSlugs: ['binh-duong', 'binh-phuoc'],
        slug: 'song-be',
        title: 'Sông Bé',
        unitType: 'merged_province',
      },
      {
        displayColor: '#8c4f54',
        memberProvinceSlugs: ['bac-lieu', 'ca-mau'],
        slug: 'minh-hai',
        title: 'Minh Hải',
        unitType: 'merged_province',
      },
      {
        displayColor: '#9c6d56',
        memberProvinceSlugs: ['quang-nam', 'da-nang'],
        slug: 'quang-nam-da-nang',
        title: 'Quảng Nam - Đà Nẵng',
        unitType: 'merged_province',
      },
    ],
    restoreProvinceSlugs: [
      'ha-tay',
      'hoa-binh',
      'ninh-binh',
      'quang-ngai',
      'binh-dinh',
      'phu-yen',
      'khanh-hoa',
      'ninh-thuan',
      'binh-thuan',
      'dak-lak',
      'dak-nong',
      'gia-lai',
      'kon-tum',
      'vinh-long',
      'tra-vinh',
    ],
    slug: '1992-1996-admin',
    sources: ['bien-nien-su-kien-1930-1975', 'van-kien-dang-toan-tap'],
    summary:
      'Lớp ranh giới trung gian sau đợt tách tỉnh đầu thập niên 1990 nhưng trước đợt tái lập diện rộng năm 1997.',
    title: '1992-1996: Tái cấu trúc từng phần',
    validFromYear: 1992,
  },
  {
    changes: [
      {
        displayColor: '#8f5a44',
        memberProvinceSlugs: ['binh-duong', 'binh-phuoc'],
        slug: 'song-be',
        title: 'Sông Bé',
        unitType: 'merged_province',
      },
      {
        displayColor: '#7b6a37',
        memberProvinceSlugs: ['dak-lak', 'dak-nong'],
        slug: 'dak-lak-mo-rong',
        title: 'Đắk Lắk',
        unitType: 'merged_province',
      },
      {
        displayColor: '#6c7f54',
        memberProvinceSlugs: ['lai-chau', 'dien-bien'],
        slug: 'lai-chau-cu',
        title: 'Lai Châu',
        unitType: 'merged_province',
      },
    ],
    restoreProvinceSlugs: [
      'bac-giang',
      'bac-ninh',
      'hai-duong',
      'hung-yen',
      'vinh-phuc',
      'phu-tho',
      'ha-nam',
      'nam-dinh',
      'lao-cai',
      'yen-bai',
      'ha-giang',
      'tuyen-quang',
      'bac-kan',
      'thai-nguyen',
      'bac-lieu',
      'ca-mau',
      'quang-nam',
      'da-nang',
    ],
    slug: '1997-2003-admin',
    sources: ['bien-nien-su-kien-1930-1975', 'bach-khoa-quan-su'],
    summary:
      'Lớp ranh giới cho giai đoạn nhiều tỉnh được tái lập năm 1997, nhưng chưa đến các điều chỉnh năm 2004 và 2008.',
    title: '1997-2003: Sau đợt tái lập 1997',
    validFromYear: 1997,
  },
  {
    changes: [],
    restoreProvinceSlugs: ['binh-duong', 'binh-phuoc', 'dak-lak', 'dak-nong', 'lai-chau', 'dien-bien'],
    slug: '2004-2007-admin',
    sources: ['bach-khoa-quan-su', 'bao-tang-lich-su-quoc-gia'],
    summary:
      'Lớp ranh giới sát hiện đại sau khi tái lập Điện Biên, Đắk Nông, Hậu Giang nhưng trước khi Hà Tây sáp nhập vào Hà Nội.',
    title: '2004-2007: Trước khi mở rộng Hà Nội',
    validFromYear: 2004,
  },
  {
    changes: [
      {
        displayColor: '#8c6141',
        memberProvinceSlugs: ['ha-noi', 'ha-tay'],
        slug: 'ha-noi-mo-rong',
        title: 'Hà Nội',
        unitType: 'municipality',
      },
    ],
    slug: '2008-2025-admin',
    sources: ['bach-khoa-quan-su', 'bao-tang-lich-su-quoc-gia'],
    summary:
      'Lớp ranh giới hiện đại xấp xỉ cho bản đồ v1, trong đó Hà Nội được mở rộng từ 2008 trên cơ sở dữ liệu SVG hiện có.',
    title: '2008-nay: Ranh giới hiện đại xấp xỉ',
    validFromYear: 2008,
  },
]

export const demoQuizzes: DemoQuiz[] = [
  {
    period: '1930-1945',
    questions: [
      {
        explanation: 'Sự kiện hợp nhất các tổ chức cộng sản diễn ra đầu tháng 2 năm 1930.',
        options: [
          { isCorrect: true, label: '1930' },
          { isCorrect: false, label: '1925' },
          { isCorrect: false, label: '1941' },
        ],
        prompt: 'Đảng Cộng sản Việt Nam được thành lập vào năm nào?',
      },
      {
        explanation:
          'Ba Đình gắn với Tuyên ngôn Độc lập ngày 2/9/1945, biểu tượng của sự ra đời nhà nước mới.',
        options: [
          { isCorrect: true, label: 'Quảng trường Ba Đình' },
          { isCorrect: false, label: 'Bến Nhà Rồng' },
          { isCorrect: false, label: 'Hiền Lương - Bến Hải' },
        ],
        prompt: 'Tuyên ngôn Độc lập được đọc tại đâu?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['thanh-lap-dang-cong-san-viet-nam', 'tuyen-ngon-doc-lap'],
    slug: 'quiz-giai-doan-1930-1945',
    sources: ['van-kien-dang-toan-tap', 'bao-tang-lich-su-quoc-gia'],
    summary: 'Kiểm tra nhanh các mốc nền tảng của giai đoạn thành lập Đảng và giành chính quyền.',
    title: 'Ôn tập 1930-1945',
  },
  {
    period: '1973-1975',
    questions: [
      {
        explanation: 'Hiệp định Paris được ký ngày 27/1/1973, tạo điều kiện chiến lược mới.',
        options: [
          { isCorrect: true, label: 'Hiệp định Paris' },
          { isCorrect: false, label: 'Hiệp định Genève' },
          { isCorrect: false, label: 'Hiệp định Sơ bộ 6/3' },
        ],
        prompt: 'Hiệp định nào mở ra cục diện mới trước mùa Xuân 1975?',
      },
      {
        explanation:
          'Chiến dịch Hồ Chí Minh là đòn cuối cùng tiến vào Sài Gòn trong những ngày cuối tháng 4/1975.',
        options: [
          { isCorrect: true, label: 'Chiến dịch Hồ Chí Minh' },
          { isCorrect: false, label: 'Chiến dịch Điện Biên Phủ' },
          { isCorrect: false, label: 'Chiến dịch Biên giới' },
        ],
        prompt: 'Tên chiến dịch kết thúc chiến tranh ngày 30/4/1975 là gì?',
      },
    ],
    relatedCampaigns: ['chien-dich-ho-chi-minh'],
    relatedEvents: ['hiep-dinh-paris-1973', 'dai-thang-mua-xuan-1975'],
    slug: 'quiz-mua-xuan-1975',
    sources: ['ho-so-geneve-paris', 'bach-khoa-quan-su'],
    summary: 'Bộ câu hỏi ngắn về giai đoạn từ Paris đến ngày toàn thắng.',
    title: 'Ôn tập mùa Xuân 1975',
  },
]
