import type { DemoEvent, DemoPlace, DemoQuiz } from './demo-content.js'

export const supplementalLeaderCopyBySlug: Record<
  string,
  {
    overview?: string
    summary?: string
  }
> = {
  'tran-phu': {
    overview:
      'Trần Phú gắn với quá trình hoàn chỉnh hệ thống lãnh đạo đầu tiên của Đảng, từ việc chuẩn bị Hội nghị Trung ương tháng 10/1930, khởi thảo Luận cương chính trị đến việc nêu tấm gương kiên trung trong nhà tù thực dân trước lúc hy sinh năm 1931.',
    summary:
      'Tổng Bí thư đầu tiên, gắn với Hội nghị Trung ương tháng 10/1930, Luận cương chính trị và khí tiết cộng sản trong chặng 1930-1931.',
  },
}

export const supplementalLeaderPlaces: DemoPlace[] = [
  {
    body: 'Hương Cảng là địa điểm diễn ra Hội nghị Ban Chấp hành Trung ương tháng 10/1930 do Trần Phú chủ trì, nơi Trung ương chính thức được kiện toàn và đồng chí Trần Phú được bầu làm Tổng Bí thư đầu tiên của Đảng.',
    modernLocation: {
      label: 'Hương Cảng',
      latitude: 22.3193,
      longitude: 114.1694,
      province: 'Hồng Kông',
    },
    period: '1930-1945',
    region: 'international',
    slug: 'huong-cang',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với Hội nghị Trung ương tháng 10/1930 và việc Trần Phú được bầu làm Tổng Bí thư.',
    title: 'Hương Cảng',
  },
  {
    body: 'Nhà thương Chợ Quán gắn với chặng cuối cuộc đời hoạt động của Trần Phú sau quá trình bị giam cầm và tra tấn tại Sài Gòn. Đây là nơi đồng chí trút hơi thở cuối cùng ngày 6/9/1931 và để lại lời nhắn bất hủ: "Hãy giữ vững chí khí chiến đấu".',
    modernLocation: {
      label: 'Khu vực Chợ Quán, Quận 5',
      latitude: 10.7549,
      longitude: 106.6755,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    region: 'south',
    slug: 'nha-thuong-cho-quan',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với chặng cuối đời và lời nhắn bất hủ của Trần Phú.',
    title: 'Nhà thương Chợ Quán',
  },
]

export const supplementalLeaderEvents: DemoEvent[] = [
  {
    content:
      'Hội nghị Ban Chấp hành Trung ương tháng 10/1930 tại Hương Cảng do Trần Phú chủ trì, đã thông qua nhiều văn kiện quan trọng về tình hình, nhiệm vụ, điều lệ và công tác tổ chức. Hội nghị đồng thời kiện toàn Ban Chấp hành Trung ương chính thức và bầu Trần Phú làm Tổng Bí thư đầu tiên của Đảng.',
    datePrecision: 'range',
    displayYear: 1930,
    endDate: '1930-10-31T00:00:00.000Z',
    modernLocation: {
      label: 'Hương Cảng',
      latitude: 22.3193,
      longitude: 114.1694,
      province: 'Hồng Kông',
    },
    period: '1930-1945',
    places: ['huong-cang'],
    region: 'international',
    slug: 'hoi-nghi-trung-uong-thang-10-1930',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam', 'van-kien-dang-toan-tap'],
    startDate: '1930-10-14T00:00:00.000Z',
    summary: 'Hội nghị kiện toàn Trung ương, thông qua nhiều văn kiện và bầu Trần Phú làm Tổng Bí thư đầu tiên.',
    title: 'Hội nghị Trung ương tháng 10/1930 tại Hương Cảng',
    topics: ['organization', 'ideology'],
  },
  {
    content:
      'Sau khi bị bắt tại Sài Gòn ngày 18/4/1931, Trần Phú vẫn giữ vững khí tiết của người cộng sản trong nhà tù thực dân. Ngày 6/9/1931, đồng chí hy sinh tại Nhà thương Chợ Quán, để lại lời nhắn bất hủ: "Hãy giữ vững chí khí chiến đấu".',
    datePrecision: 'range',
    displayYear: 1931,
    endDate: '1931-09-06T00:00:00.000Z',
    modernLocation: {
      label: 'Nhà thương Chợ Quán',
      latitude: 10.7549,
      longitude: 106.6755,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: ['nha-thuong-cho-quan'],
    region: 'south',
    slug: 'tran-phu-bi-bat-va-hy-sinh-1931',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startDate: '1931-04-18T00:00:00.000Z',
    summary: 'Chặng cuối đời thể hiện khí tiết cách mạng và lời nhắn bất hủ của Trần Phú.',
    title: 'Trần Phú bị bắt và hy sinh năm 1931',
    topics: ['leadership', 'repression'],
  },
]

export const supplementalLeaderQuizzes: DemoQuiz[] = [
  {
    period: '1930-1945',
    questions: [
      {
        explanation:
          'Hội nghị Ban Chấp hành Trung ương tháng 10/1930 tại Hương Cảng đã bầu Trần Phú làm Tổng Bí thư đầu tiên của Đảng.',
        options: [
          { isCorrect: true, label: 'Hội nghị Trung ương tháng 10/1930 tại Hương Cảng' },
          { isCorrect: false, label: 'Hội nghị thành lập Đảng tháng 2/1930' },
          { isCorrect: false, label: 'Đại hội II năm 1951' },
        ],
        prompt: 'Sự kiện nào gắn với việc Trần Phú được bầu làm Tổng Bí thư đầu tiên?',
      },
      {
        explanation:
          'Luận cương chính trị tháng 10/1930 là văn kiện lý luận quan trọng gắn trực tiếp với Trần Phú trong giai đoạn đầu của Đảng.',
        options: [
          { isCorrect: true, label: 'Luận cương chính trị tháng 10/1930' },
          { isCorrect: false, label: 'Tự chỉ trích năm 1939' },
          { isCorrect: false, label: 'Nghị quyết 10 năm 1988' },
        ],
        prompt: 'Văn kiện nào là dấu ấn lý luận nổi bật gắn với Trần Phú?',
      },
      {
        explanation:
          'Trước lúc hy sinh ngày 6/9/1931, Trần Phú để lại lời nhắn bất hủ: "Hãy giữ vững chí khí chiến đấu".',
        options: [
          { isCorrect: true, label: 'Hãy giữ vững chí khí chiến đấu' },
          { isCorrect: false, label: 'Không có gì quý hơn độc lập tự do' },
          { isCorrect: false, label: 'Dù chết không sờn lòng' },
        ],
        prompt: 'Lời nhắn nào gắn với chặng cuối cuộc đời cách mạng của Trần Phú?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: [
      'luan-cuong-chinh-tri-1930',
      'hoi-nghi-trung-uong-thang-10-1930',
      'tran-phu-bi-bat-va-hy-sinh-1931',
    ],
    slug: 'quiz-tran-phu-1930-1931',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Trần Phú, Luận cương chính trị và chặng 1930-1931.',
    title: 'Ôn tập Trần Phú 1930-1931',
  },
]
