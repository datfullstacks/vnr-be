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
  'le-hong-phong': {
    overview:
      'Lê Hồng Phong gắn với chặng khôi phục hệ thống tổ chức của Đảng sau thời kỳ bị khủng bố nặng nề, nối lại mạch lãnh đạo trong nước với phong trào cộng sản quốc tế, chủ trì chuẩn bị Đại hội I năm 1935 và tiếp tục định hình bước chuyển chiến lược mới qua Đại hội VII Quốc tế Cộng sản và Hội nghị Thượng Hải năm 1936.',
    summary:
      'Tổng Bí thư của giai đoạn khôi phục tổ chức, gắn với Đại hội I năm 1935, Đại hội VII Quốc tế Cộng sản và bước chuyển hướng năm 1936.',
  },
  'ha-huy-tap': {
    overview:
      'Hà Huy Tập để lại dấu ấn ở năng lực lý luận và tổ chức trong bước chuyển từ phục hồi hệ thống lãnh đạo sang mở rộng phong trào dân chủ 1936-1939, gắn với Hội nghị Thượng Hải năm 1936, việc tổ chức lại Trung ương trong nước và các hội nghị tại Hóc Môn, Bà Điểm trước khi hy sinh năm 1941.',
    summary:
      'Tổng Bí thư gắn với bước chuyển hướng năm 1936, việc tổ chức lại Trung ương và chặng phát triển phong trào dân chủ 1936-1939.',
  },
  'nguyen-van-cu': {
    overview:
      'Nguyễn Văn Cừ nhấn mạnh yêu cầu tự chỉnh đốn và nâng cao năng lực lãnh đạo khi tình hình thế giới, trong nước chuyển nhanh. Từ Hội nghị Bà Điểm tháng 3/1938, dấu ấn của đồng chí thể hiện rõ ở Tự chỉ trích năm 1939, Hội nghị Trung ương 6 và bản lĩnh kiên trung cho tới khi bị xử bắn năm 1941.',
    summary:
      'Tổng Bí thư tiêu biểu của chặng tự chỉnh đốn, gắn với Hội nghị Bà Điểm năm 1938, Tự chỉ trích và bước điều chỉnh chiến lược cuối thập niên 1930.',
  },
  'truong-chinh': {
    overview:
      'Trường Chinh là nhà lý luận và tổ chức then chốt của nhiều bước ngoặt: hoàn chỉnh chuyển hướng giải phóng dân tộc, lãnh đạo Tổng khởi nghĩa, định hình đường lối kháng chiến kiến quốc và sau đó giữ vai trò chuyển tiếp ở ngưỡng mở đầu đổi mới năm 1986.',
    summary:
      'Một Tổng Bí thư gắn với nhiều bước ngoặt lớn từ chuyển hướng chiến lược năm 1941 đến kháng chiến kiến quốc và chặng chuyển tiếp năm 1986.',
  },
  'ho-chi-minh': {
    overview:
      'Chủ tịch Hồ Chí Minh là điểm quy tụ chiến lược của cách mạng Việt Nam, từ chuẩn bị đường lối giải phóng dân tộc, giành chính quyền, tuyên bố độc lập đến định hình tầm nhìn xây dựng đất nước và chủ nghĩa xã hội trong giai đoạn mới.',
    summary:
      'Người sáng lập Đảng, gắn với những cột mốc mở đường cho độc lập dân tộc, nhà nước mới và định hướng phát triển lâu dài.',
  },
  'le-duan': {
    overview:
      'Lê Duẩn gắn với chặng chiến tranh cách mạng quy mô lớn, giữ vai trò trung tâm trong đường lối giải phóng miền Nam, thống nhất đất nước và xử lý những bài toán đầu tiên của thời kỳ sau 1975.',
    summary:
      'Tổng Bí thư của giai đoạn chiến tranh chống Mỹ, đại thắng mùa Xuân 1975 và bước đầu xây dựng đất nước thống nhất.',
  },
  'nguyen-van-linh': {
    overview:
      'Nguyễn Văn Linh gắn với bước mở đầu của công cuộc đổi mới, nhấn mạnh yêu cầu nhìn thẳng vào sự thật, điều chỉnh tư duy phát triển và đưa các quyết sách cải cách đi vào đời sống sản xuất, xã hội.',
    summary:
      'Tổng Bí thư mở đầu đổi mới, gắn với Đại hội VI năm 1986 và các quyết sách tháo gỡ cho sản xuất, nhất là trong nông nghiệp.',
  },
  'do-muoi': {
    overview:
      'Đỗ Mười tiếp nối đường lối đổi mới trong bối cảnh thế giới biến động mạnh, đồng thời gắn với chặng xác nhận cương lĩnh phát triển mới và mở rộng không gian hội nhập khu vực qua việc Việt Nam gia nhập ASEAN.',
    summary:
      'Tổng Bí thư của chặng tiếp tục đổi mới, củng cố cương lĩnh phát triển và mở rộng hội nhập khu vực trong thập niên 1990.',
  },
  'le-kha-phieu': {
    overview:
      'Lê Khả Phiêu gắn với yêu cầu xây dựng, chỉnh đốn Đảng ở cuối thế kỷ XX và những bước chuyển quan trọng của tiến trình hội nhập kinh tế quốc tế, trong đó có Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000.',
    summary:
      'Tổng Bí thư của giai đoạn nhấn mạnh chỉnh đốn Đảng và mở thêm cửa cho hội nhập kinh tế quốc tế.',
  },
  'nong-duc-manh': {
    overview:
      'Nông Đức Mạnh gắn với giai đoạn đẩy mạnh phát triển và hội nhập sâu hơn, trong đó Đại hội IX xác lập nhịp phát triển mới và việc gia nhập WTO năm 2007 đánh dấu bước hội nhập toàn cầu nổi bật.',
    summary:
      'Tổng Bí thư của chặng tăng tốc hội nhập, gắn với Đại hội IX năm 2001 và cột mốc gia nhập WTO năm 2007.',
  },
  'nguyen-phu-trong': {
    overview:
      'Nguyễn Phú Trọng gắn với chặng nhấn mạnh xây dựng, chỉnh đốn Đảng, củng cố kỷ luật chính trị và đẩy mạnh phòng, chống tham nhũng, tiêu cực, đồng thời định hình các ưu tiên phát triển trong bối cảnh cạnh tranh quốc tế và chuyển đổi số ngày càng mạnh.',
    summary:
      'Tổng Bí thư của giai đoạn nhấn mạnh xây dựng, chỉnh đốn Đảng và phòng, chống tham nhũng trong bối cảnh phát triển mới.',
  },
  'to-lam': {
    overview:
      'Tô Lâm mở ra chặng lãnh đạo đương nhiệm trong dữ liệu của site, gắn với yêu cầu giữ ổn định chiến lược, tinh gọn bộ máy và nâng hiệu quả điều hành trong bối cảnh đất nước bước vào nhịp cải cách mới.',
    summary:
      'Tổng Bí thư đương nhiệm trong lát cắt hiện nay, gắn với bước mở đầu nhiệm kỳ từ năm 2024 và chủ trương tinh gọn bộ máy.',
  },
}

export const supplementalLeaderPresentationBySlug: Record<
  string,
  {
    displayName?: string
    officeLabel?: string
    summary?: string
    tenureLabel?: string
    terms?: { endYear: number; label: string; startYear: number }[]
  }
> = {
  'ho-chi-minh': {
    displayName: 'Chủ tịch Hồ Chí Minh',
    summary: 'Người sáng lập ra Đảng Cộng sản Việt Nam.',
    tenureLabel:
      'Chủ tịch Đảng từ 02/1951 đến 9/1969; Tổng Bí thư của Đảng từ 10/1956 đến 9/1960',
    terms: [
      { endYear: 1969, label: 'Chủ tịch Đảng từ 02/1951 đến 9/1969', startYear: 1951 },
      { endYear: 1960, label: 'Tổng Bí thư của Đảng từ 10/1956 đến 9/1960', startYear: 1956 },
    ],
  },
  'tran-phu': {
    displayName: 'Đồng chí Trần Phú',
    tenureLabel: 'Tổng Bí thư từ 10/1930 đến 4/1931',
    terms: [{ endYear: 1931, label: 'Tổng Bí thư từ 10/1930 đến 4/1931', startYear: 1930 }],
  },
  'le-hong-phong': {
    displayName: 'Đồng chí Lê Hồng Phong',
    tenureLabel: 'Tổng Bí thư từ 03/1935 đến 10/1936',
    terms: [{ endYear: 1936, label: 'Tổng Bí thư từ 03/1935 đến 10/1936', startYear: 1935 }],
  },
  'ha-huy-tap': {
    displayName: 'Đồng chí Hà Huy Tập',
    tenureLabel: 'Tổng Bí thư từ 10/1936 đến 03/1938',
    terms: [{ endYear: 1938, label: 'Tổng Bí thư từ 10/1936 đến 03/1938', startYear: 1936 }],
  },
  'nguyen-van-cu': {
    displayName: 'Đồng chí Nguyễn Văn Cừ',
    tenureLabel: 'Tổng Bí thư từ 03/1938 đến 01/1940',
    terms: [{ endYear: 1940, label: 'Tổng Bí thư từ 03/1938 đến 01/1940', startYear: 1938 }],
  },
  'truong-chinh': {
    displayName: 'Đồng chí Trường Chinh',
    tenureLabel: 'Tổng Bí thư từ 5/1941 đến 10/1956; từ 7/1986 đến 12/1986',
    terms: [
      { endYear: 1956, label: 'Tổng Bí thư từ 5/1941 đến 10/1956', startYear: 1941 },
      { endYear: 1986, label: 'Tổng Bí thư từ 7/1986 đến 12/1986', startYear: 1986 },
    ],
  },
  'le-duan': {
    displayName: 'Đồng chí Lê Duẩn',
    officeLabel: 'Tổng Bí thư',
    tenureLabel: 'Tổng Bí thư từ 9/1960 đến 7/1986',
    terms: [{ endYear: 1986, label: 'Tổng Bí thư từ 9/1960 đến 7/1986', startYear: 1960 }],
  },
  'nguyen-van-linh': {
    displayName: 'Đồng chí Nguyễn Văn Linh',
    tenureLabel: 'Tổng Bí thư từ 12/1986 đến 6/1991',
    terms: [{ endYear: 1991, label: 'Tổng Bí thư từ 12/1986 đến 6/1991', startYear: 1986 }],
  },
  'do-muoi': {
    displayName: 'Đồng chí Đỗ Mười',
    tenureLabel: 'Tổng Bí thư từ 6/1991 đến 12/1997',
    terms: [{ endYear: 1997, label: 'Tổng Bí thư từ 6/1991 đến 12/1997', startYear: 1991 }],
  },
  'le-kha-phieu': {
    displayName: 'Đồng chí Lê Khả Phiêu',
    tenureLabel: 'Tổng Bí thư từ 12/1997 đến 4/2001',
    terms: [{ endYear: 2001, label: 'Tổng Bí thư từ 12/1997 đến 4/2001', startYear: 1997 }],
  },
  'nong-duc-manh': {
    displayName: 'Đồng chí Nông Đức Mạnh',
    tenureLabel: 'Tổng Bí thư từ 4/2001 đến 01/2011',
    terms: [{ endYear: 2011, label: 'Tổng Bí thư từ 4/2001 đến 01/2011', startYear: 2001 }],
  },
  'nguyen-phu-trong': {
    displayName: 'Đồng chí Nguyễn Phú Trọng',
    tenureLabel: 'Tổng Bí thư từ 01/2011 đến 7/2024',
    terms: [{ endYear: 2024, label: 'Tổng Bí thư từ 01/2011 đến 7/2024', startYear: 2011 }],
  },
  'to-lam': {
    displayName: 'Đồng chí Tô Lâm',
    tenureLabel: 'Tổng Bí thư từ 03/8/2024',
    terms: [{ endYear: 2026, label: 'Tổng Bí thư từ 03/8/2024', startYear: 2024 }],
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
  {
    body: 'Ma Cao gắn với Đại hội lần thứ nhất của Đảng năm 1935, cột mốc khôi phục hệ thống tổ chức và nhịp lãnh đạo sau giai đoạn bị khủng bố nặng nề, đồng thời gắn trực tiếp với vai trò của Lê Hồng Phong trong việc nối lại mạch hoạt động của Đảng.',
    modernLocation: {
      label: 'Ma Cao',
      latitude: 22.1987,
      longitude: 113.5439,
      province: 'Ma Cao',
    },
    period: '1930-1945',
    region: 'international',
    slug: 'ma-cao',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với Đại hội I năm 1935 và vai trò của Lê Hồng Phong trong chặng khôi phục tổ chức.',
    title: 'Ma Cao',
  },
  {
    body: 'Mátxcơva là địa bàn hoạt động chính của Lê Hồng Phong từ tháng 3/1935 đến tháng 7/1936 trên cương vị Tổng Bí thư Đảng Cộng sản Đông Dương và Ủy viên Ban Chấp hành Quốc tế Cộng sản, đồng thời là nơi diễn ra Đại hội VII Quốc tế Cộng sản năm 1935.',
    modernLocation: {
      label: 'Mátxcơva',
      latitude: 55.7558,
      longitude: 37.6173,
      province: 'Moscow',
    },
    period: '1930-1945',
    region: 'international',
    slug: 'matxcova',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Địa bàn hoạt động nổi bật của Lê Hồng Phong trong giai đoạn 1935-1936 và nơi diễn ra Đại hội VII Quốc tế Cộng sản.',
    title: 'Mátxcơva',
  },
  {
    body: 'Thượng Hải gắn với Hội nghị tháng 7/1936, nơi Trung ương Đảng điều chỉnh một số điểm trong nghị quyết Đại hội I theo tinh thần Đại hội VII Quốc tế Cộng sản, xác định bước chuyển chiến lược mới và bầu Hà Huy Tập làm Tổng Bí thư để về nước tổ chức lại Ban Chấp hành Trung ương.',
    modernLocation: {
      label: 'Thượng Hải',
      latitude: 31.2304,
      longitude: 121.4737,
      province: 'Thượng Hải',
    },
    period: '1930-1945',
    region: 'international',
    slug: 'thuong-hai',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Địa điểm gắn với Hội nghị Thượng Hải tháng 7/1936, bước chuyển chiến lược mới và việc Hà Huy Tập được bầu làm Tổng Bí thư.',
    title: 'Thượng Hải',
  },
  {
    body: 'Bà Điểm - Hóc Môn là không gian hội họp bí mật quan trọng của Trung ương Đảng ở cuối thập niên 1930, gắn với các hội nghị do Hà Huy Tập và sau đó là Nguyễn Văn Cừ chủ trì trong quá trình điều chỉnh chiến lược và kiện toàn lãnh đạo.',
    modernLocation: {
      label: 'Bà Điểm - Hóc Môn',
      latitude: 10.8898,
      longitude: 106.5965,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    region: 'south',
    slug: 'ba-diem-hoc-mon',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Địa điểm gắn với chuỗi hội nghị Trung ương cuối thập niên 1930, từ Hà Huy Tập đến Nguyễn Văn Cừ.',
    title: 'Bà Điểm - Hóc Môn',
  },
  {
    body: 'Hóc Môn - Gia Định gắn với Hội nghị Trung ương tháng 3/1937 do Hà Huy Tập chủ trì, một mốc tiếp tục củng cố hệ thống lãnh đạo trong nước và triển khai bước chuyển sách lược mới sau Hội nghị Thượng Hải năm 1936.',
    modernLocation: {
      label: 'Hóc Môn - Gia Định',
      latitude: 10.8896,
      longitude: 106.596,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    region: 'south',
    slug: 'hoc-mon-gia-dinh',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Địa điểm gắn với Hội nghị Trung ương tháng 3/1937 do Hà Huy Tập chủ trì.',
    title: 'Hóc Môn - Gia Định',
  },
  {
    body: 'Ngã tư Giếng Nước ở Hóc Môn là nơi thực dân Pháp xử bắn Hà Huy Tập ngày 28/8/1941. Địa điểm này gắn với chặng cuối cuộc đời của một nhà lý luận và lãnh đạo kiên trung của Đảng.',
    modernLocation: {
      label: 'Ngã tư Giếng Nước, Hóc Môn',
      latitude: 10.8882,
      longitude: 106.5949,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    region: 'south',
    slug: 'nga-tu-gieng-nuoc',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với chặng cuối cuộc đời và sự hy sinh của Hà Huy Tập.',
    title: 'Ngã tư Giếng Nước',
  },
  {
    body: 'Bandar Seri Begawan gắn với việc Việt Nam chính thức gia nhập ASEAN ngày 28/7/1995, một bước mở rộng không gian hội nhập khu vực trong thời kỳ Đỗ Mười giữ cương vị Tổng Bí thư.',
    modernLocation: {
      label: 'Bandar Seri Begawan',
      latitude: 4.9031,
      longitude: 114.9398,
      province: 'Brunei',
    },
    period: '1991-1997',
    region: 'international',
    slug: 'bandar-seri-begawan',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với cột mốc Việt Nam gia nhập ASEAN năm 1995 trong thời kỳ Đỗ Mười.',
    title: 'Bandar Seri Begawan',
  },
  {
    body: 'Washington, D.C. gắn với Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000, một cột mốc mở rộng hội nhập kinh tế quốc tế ở giai đoạn Lê Khả Phiêu giữ cương vị Tổng Bí thư.',
    modernLocation: {
      label: 'Washington, D.C.',
      latitude: 38.9072,
      longitude: -77.0369,
      province: 'District of Columbia',
    },
    period: '1997-2001',
    region: 'international',
    slug: 'washington-dc',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000 trong thời kỳ Lê Khả Phiêu.',
    title: 'Washington, D.C.',
  },
  {
    body: 'Geneva gắn với việc Việt Nam gia nhập WTO ngày 11/1/2007, cột mốc hội nhập toàn cầu nổi bật trong giai đoạn Nông Đức Mạnh giữ cương vị Tổng Bí thư.',
    modernLocation: {
      label: 'Geneva',
      latitude: 46.2044,
      longitude: 6.1432,
      province: 'Geneva',
    },
    period: '2001-2011',
    region: 'international',
    slug: 'geneva',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Địa điểm gắn với cột mốc Việt Nam gia nhập WTO năm 2007 trong thời kỳ Nông Đức Mạnh.',
    title: 'Geneva',
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
  {
    content:
      'Đại hội VII Quốc tế Cộng sản khai mạc ngày 25/7/1935 tại Mátxcơva. Lê Hồng Phong tham dự với tư cách Trưởng đoàn đại biểu Đảng Cộng sản Đông Dương, trình bày tham luận quan trọng về phong trào cách mạng Đông Dương giai đoạn 1930-1935 và sau đó được bầu vào Ban Chấp hành Quốc tế Cộng sản.',
    datePrecision: 'range',
    displayYear: 1935,
    endDate: '1935-08-20T00:00:00.000Z',
    modernLocation: {
      label: 'Mátxcơva',
      latitude: 55.7558,
      longitude: 37.6173,
      province: 'Moscow',
    },
    period: '1930-1945',
    places: ['matxcova'],
    region: 'international',
    slug: 'dai-hoi-vii-quoc-te-cong-san-1935',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    startDate: '1935-07-25T00:00:00.000Z',
    summary: 'Mốc quốc tế nổi bật của Lê Hồng Phong với vai trò Trưởng đoàn đại biểu và Ủy viên Ban Chấp hành Quốc tế Cộng sản.',
    title: 'Lê Hồng Phong dự Đại hội VII Quốc tế Cộng sản năm 1935',
    topics: ['organization', 'international'],
  },
  {
    content:
      'Hội nghị Thượng Hải tháng 7/1936 đánh dấu bước chuyển chiến lược quan trọng của Đảng theo tinh thần Đại hội VII Quốc tế Cộng sản. Hội nghị điều chỉnh một số điểm trong nghị quyết Đại hội I, xác định yêu cầu thành lập mặt trận dân chủ rộng rãi chống phát xít và phản động thuộc địa, đồng thời bầu Hà Huy Tập làm Tổng Bí thư để về nước tổ chức lại Trung ương.',
    datePrecision: 'month',
    displayYear: 1936,
    modernLocation: {
      label: 'Thượng Hải',
      latitude: 31.2304,
      longitude: 121.4737,
      province: 'Thượng Hải',
    },
    period: '1930-1945',
    places: ['thuong-hai'],
    region: 'international',
    slug: 'hoi-nghi-thuong-hai-1936',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    startDate: '1936-07-01T00:00:00.000Z',
    summary: 'Mốc chuyển hướng sách lược năm 1936 theo tinh thần Đại hội VII Quốc tế Cộng sản và cột mốc Hà Huy Tập được bầu làm Tổng Bí thư.',
    title: 'Hội nghị Thượng Hải tháng 7/1936',
    topics: ['strategy', 'organization'],
  },
  {
    content:
      'Ngày 12/10/1936, Hà Huy Tập triệu tập Hội nghị cán bộ Trung ương, bầu ra Ban Chấp hành Trung ương Đảng và trực tiếp đứng đầu với cương vị Tổng Bí thư. Đây là mốc tổ chức lại hệ thống lãnh đạo trong nước sau thời gian đứt gãy và chuẩn bị cho nhịp phát triển mới của phong trào dân chủ.',
    datePrecision: 'day',
    displayYear: 1936,
    modernLocation: {
      label: 'Nam Kỳ',
      latitude: 10.7769,
      longitude: 106.7009,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: [],
    region: 'south',
    slug: 'hoi-nghi-can-bo-trung-uong-thang-10-1936',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    startDate: '1936-10-12T00:00:00.000Z',
    summary: 'Mốc tổ chức lại Ban Chấp hành Trung ương trong nước do Hà Huy Tập trực tiếp triệu tập và lãnh đạo.',
    title: 'Hội nghị cán bộ Trung ương ngày 12/10/1936',
    topics: ['organization'],
  },
  {
    content:
      'Từ ngày 13 đến 14/3/1937, Hà Huy Tập chủ trì Hội nghị Ban Chấp hành Trung ương Đảng tại Hóc Môn, Gia Định. Hội nghị thể hiện rõ vai trò trực tiếp của đồng chí trong việc củng cố Trung ương và triển khai đường lối vận động dân chủ sau bước chuyển sách lược năm 1936.',
    datePrecision: 'range',
    displayYear: 1937,
    endDate: '1937-03-14T00:00:00.000Z',
    modernLocation: {
      label: 'Hóc Môn - Gia Định',
      latitude: 10.8896,
      longitude: 106.596,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: ['hoc-mon-gia-dinh'],
    region: 'south',
    slug: 'hoi-nghi-hoc-mon-thang-3-1937',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startDate: '1937-03-13T00:00:00.000Z',
    summary: 'Mốc củng cố Trung ương và triển khai đường lối vận động dân chủ do Hà Huy Tập chủ trì tại Hóc Môn.',
    title: 'Hội nghị Trung ương tại Hóc Môn tháng 3/1937',
    topics: ['organization', 'strategy'],
  },
  {
    content:
      'Cuối tháng 3/1938, Ban Chấp hành Trung ương họp tại Bà Điểm, Hóc Môn, Gia Định. Hội nghị bầu Nguyễn Văn Cừ làm Tổng Bí thư, đánh dấu chặng chuyển giao cương vị lãnh đạo sau thời kỳ Hà Huy Tập trực tiếp tổ chức lại Trung ương và thúc đẩy phong trào dân chủ.',
    datePrecision: 'range',
    displayYear: 1938,
    endDate: '1938-03-30T00:00:00.000Z',
    modernLocation: {
      label: 'Bà Điểm - Hóc Môn',
      latitude: 10.8898,
      longitude: 106.5965,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: ['ba-diem-hoc-mon'],
    region: 'south',
    slug: 'hoi-nghi-ba-diem-thang-3-1938',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startDate: '1938-03-29T00:00:00.000Z',
    summary: 'Hội nghị đánh dấu chặng chuyển giao cương vị Tổng Bí thư từ Hà Huy Tập sang Nguyễn Văn Cừ.',
    title: 'Hội nghị Bà Điểm tháng 3/1938',
    topics: ['organization'],
  },
  {
    content:
      'Ngày 28/8/1941, Hà Huy Tập bị thực dân Pháp xử bắn tại Hóc Môn, Gia Định sau khi bị giam giữ và kết án trong bối cảnh khởi nghĩa Nam Kỳ. Sự hy sinh của đồng chí khép lại chặng đời của một nhà lý luận xuất sắc và một Tổng Bí thư kiên trung của Đảng.',
    datePrecision: 'day',
    displayYear: 1941,
    modernLocation: {
      label: 'Ngã tư Giếng Nước, Hóc Môn',
      latitude: 10.8882,
      longitude: 106.5949,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: ['nga-tu-gieng-nuoc'],
    region: 'south',
    slug: 'ha-huy-tap-bi-xu-ban-1941',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startDate: '1941-08-28T00:00:00.000Z',
    summary: 'Chặng cuối cuộc đời của Hà Huy Tập, gắn với sự hy sinh tại Hóc Môn năm 1941.',
    title: 'Hà Huy Tập bị xử bắn năm 1941',
    topics: ['repression', 'leadership'],
  },
  {
    content:
      'Ngày 28/8/1941, Nguyễn Văn Cừ bị thực dân Pháp xử bắn tại Hóc Môn, Gia Định cùng nhiều chiến sĩ cách mạng khác. Sự hy sinh của đồng chí khép lại chặng đời của một Tổng Bí thư tiêu biểu cho tinh thần tự chỉnh đốn, kiên cường trước khủng bố và thử thách lịch sử.',
    datePrecision: 'day',
    displayYear: 1941,
    modernLocation: {
      label: 'Ngã tư Giếng Nước, Hóc Môn',
      latitude: 10.8882,
      longitude: 106.5949,
      province: 'TP. Hồ Chí Minh',
    },
    period: '1930-1945',
    places: ['nga-tu-gieng-nuoc'],
    region: 'south',
    slug: 'nguyen-van-cu-bi-xu-ban-1941',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    startDate: '1941-08-28T00:00:00.000Z',
    summary: 'Chặng cuối cuộc đời của Nguyễn Văn Cừ, gắn với sự hy sinh tại Hóc Môn năm 1941.',
    title: 'Nguyễn Văn Cừ bị xử bắn năm 1941',
    topics: ['repression', 'leadership'],
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
  {
    period: '1930-1945',
    questions: [
      {
        explanation:
          'Đại hội lần thứ nhất của Đảng năm 1935 là cột mốc khôi phục tổ chức và nối lại nhịp lãnh đạo trong giai đoạn Lê Hồng Phong.',
        options: [
          { isCorrect: true, label: 'Đại hội lần thứ nhất của Đảng năm 1935' },
          { isCorrect: false, label: 'Hội nghị Trung ương 8 năm 1941' },
          { isCorrect: false, label: 'Đại hội VI năm 1986' },
        ],
        prompt: 'Mốc nào gắn rõ nhất với chặng khôi phục tổ chức dưới thời Lê Hồng Phong?',
      },
      {
        explanation:
          'Đại hội VII Quốc tế Cộng sản năm 1935 là mốc quốc tế nổi bật, tại đó Lê Hồng Phong tham dự với tư cách Trưởng đoàn đại biểu Đảng Cộng sản Đông Dương và được bầu vào Ban Chấp hành Quốc tế Cộng sản.',
        options: [
          { isCorrect: true, label: 'Đại hội VII Quốc tế Cộng sản năm 1935' },
          { isCorrect: false, label: 'Hội nghị Trung ương 8 năm 1941' },
          { isCorrect: false, label: 'Đại hội IX của Đảng năm 2001' },
        ],
        prompt: 'Mốc quốc tế nào gắn trực tiếp với vai trò Trưởng đoàn đại biểu của Lê Hồng Phong?',
      },
      {
        explanation:
          'Hội nghị Thượng Hải tháng 7/1936 đánh dấu bước chuyển chiến lược mới dưới sự lãnh đạo của Lê Hồng Phong, hướng tới mặt trận dân chủ rộng rãi chống phát xít và phản động thuộc địa.',
        options: [
          { isCorrect: true, label: 'Hội nghị Thượng Hải tháng 7/1936' },
          { isCorrect: false, label: 'Tổng tuyển cử năm 1976' },
          { isCorrect: false, label: 'Việt Nam gia nhập WTO năm 2007' },
        ],
        prompt: 'Mốc nào cho thấy bước chuyển chiến lược mới của Đảng trong năm 1936 dưới thời Lê Hồng Phong?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['dai-hoi-lan-thu-nhat-1935', 'dai-hoi-vii-quoc-te-cong-san-1935', 'hoi-nghi-thuong-hai-1936'],
    slug: 'quiz-le-hong-phong-1935-1936',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Lê Hồng Phong qua Đại hội I năm 1935, vai trò quốc tế và bước chuyển chiến lược năm 1936.',
    title: 'Ôn tập Lê Hồng Phong 1935-1936',
  },
  {
    period: '1930-1945',
    questions: [
      {
        explanation:
          'Hội nghị Thượng Hải tháng 7/1936 là mốc gắn với việc Hà Huy Tập được bầu làm Tổng Bí thư và bước chuyển chiến lược mới của Đảng.',
        options: [
          { isCorrect: true, label: 'Hội nghị Thượng Hải tháng 7/1936' },
          { isCorrect: false, label: 'Đại hội VII năm 1991' },
          { isCorrect: false, label: 'Tổng tuyển cử năm 1976' },
        ],
        prompt: 'Mốc nào gắn trực tiếp với việc Hà Huy Tập được bầu làm Tổng Bí thư?',
      },
      {
        explanation:
          'Ngày 12/10/1936, Hà Huy Tập triệu tập Hội nghị cán bộ Trung ương để tổ chức lại Ban Chấp hành Trung ương trong nước.',
        options: [
          { isCorrect: true, label: 'Hội nghị cán bộ Trung ương ngày 12/10/1936' },
          { isCorrect: false, label: 'Đại hội II của Đảng năm 1951' },
          { isCorrect: false, label: 'Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000' },
        ],
        prompt: 'Mốc nào thể hiện việc Hà Huy Tập trực tiếp tổ chức lại Ban Chấp hành Trung ương trong nước?',
      },
      {
        explanation:
          'Ngã tư Giếng Nước ở Hóc Môn là địa điểm gắn với sự hy sinh của Hà Huy Tập ngày 28/8/1941.',
        options: [
          { isCorrect: true, label: 'Ngã tư Giếng Nước, Hóc Môn' },
          { isCorrect: false, label: 'Quảng trường Ba Đình' },
          { isCorrect: false, label: 'Bandar Seri Begawan' },
        ],
        prompt: 'Địa điểm nào gắn với chặng cuối cuộc đời của Hà Huy Tập?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: [
      'hoi-nghi-thuong-hai-1936',
      'hoi-nghi-can-bo-trung-uong-thang-10-1936',
      'hoi-nghi-hoc-mon-thang-3-1937',
      'ha-huy-tap-bi-xu-ban-1941',
    ],
    slug: 'quiz-ha-huy-tap-1936-1938',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Ôn tập nhanh về Hà Huy Tập qua bước chuyển chiến lược năm 1936, việc tổ chức lại Trung ương và chặng hy sinh.',
    title: 'Ôn tập Hà Huy Tập 1936-1938',
  },
  {
    period: '1930-1945',
    questions: [
      {
        explanation:
          'Hội nghị Bà Điểm cuối tháng 3/1938 là mốc gắn với việc Nguyễn Văn Cừ được bầu làm Tổng Bí thư của Đảng.',
        options: [
          { isCorrect: true, label: 'Hội nghị Bà Điểm tháng 3/1938' },
          { isCorrect: false, label: 'Đại hội VII Quốc tế Cộng sản năm 1935' },
          { isCorrect: false, label: 'Đại hội IX của Đảng năm 2001' },
        ],
        prompt: 'Mốc nào gắn trực tiếp với việc Nguyễn Văn Cừ được bầu làm Tổng Bí thư?',
      },
      {
        explanation:
          'Tác phẩm Tự chỉ trích năm 1939 là dấu ấn lý luận nổi bật gắn trực tiếp với Nguyễn Văn Cừ.',
        options: [
          { isCorrect: true, label: 'Tự chỉ trích năm 1939' },
          { isCorrect: false, label: 'Luận cương chính trị tháng 10/1930' },
          { isCorrect: false, label: 'Nghị quyết Trung ương 4 khóa XI năm 2012' },
        ],
        prompt: 'Văn kiện nào gắn rõ nhất với Nguyễn Văn Cừ?',
      },
      {
        explanation:
          'Ngày 28/8/1941, Nguyễn Văn Cừ bị xử bắn tại Ngã tư Giếng Nước ở Hóc Môn, Gia Định.',
        options: [
          { isCorrect: true, label: 'Ngã tư Giếng Nước, Hóc Môn' },
          { isCorrect: false, label: 'Geneva' },
          { isCorrect: false, label: 'Quảng trường Ba Đình' },
        ],
        prompt: 'Địa điểm nào gắn với chặng cuối cuộc đời của Nguyễn Văn Cừ?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: [
      'hoi-nghi-ba-diem-thang-3-1938',
      'tu-chi-trich-1939',
      'hoi-nghi-trung-uong-6-1939',
      'nguyen-van-cu-bi-xu-ban-1941',
    ],
    slug: 'quiz-nguyen-van-cu-1938-1940',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Ôn tập nhanh về Nguyễn Văn Cừ qua Hội nghị Bà Điểm năm 1938, Tự chỉ trích và chặng hy sinh năm 1941.',
    title: 'Ôn tập Nguyễn Văn Cừ 1938-1940',
  },
  {
    period: '1945-1954',
    questions: [
      {
        explanation:
          'Hội nghị Trung ương 8 năm 1941 hoàn chỉnh bước chuyển hướng chiến lược, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.',
        options: [
          { isCorrect: true, label: 'Hội nghị Trung ương 8 năm 1941' },
          { isCorrect: false, label: 'Đại hội VII năm 1991' },
          { isCorrect: false, label: 'Nghị quyết 10 năm 1988' },
        ],
        prompt: 'Mốc nào gắn với bước chuyển hướng chiến lược đầu thời kỳ Trường Chinh?',
      },
      {
        explanation:
          'Chiến dịch Điện Biên Phủ là chiến dịch lớn gắn với chặng kháng chiến kiến quốc mà Trường Chinh là một trong những lãnh đạo trung tâm.',
        options: [
          { isCorrect: true, label: 'Chiến dịch Điện Biên Phủ' },
          { isCorrect: false, label: 'Chiến dịch Hồ Chí Minh' },
          { isCorrect: false, label: 'Vận tải chiến lược Trường Sơn' },
        ],
        prompt: 'Chiến dịch nào là lát cắt quân sự tiêu biểu trên trang Trường Chinh?',
      },
      {
        explanation:
          'Pác Bó là địa điểm gắn với Hội nghị Trung ương 8 năm 1941, còn Việt Bắc là căn cứ địa nổi bật của thời kỳ kháng chiến.',
        options: [
          { isCorrect: true, label: 'Pác Bó' },
          { isCorrect: false, label: 'Washington, D.C.' },
          { isCorrect: false, label: 'Bandar Seri Begawan' },
        ],
        prompt: 'Địa điểm nào gắn trực tiếp với Hội nghị Trung ương 8 năm 1941?',
      },
    ],
    relatedCampaigns: ['chien-dich-dien-bien-phu'],
    relatedEvents: ['tong-khoi-nghia-thang-tam-1945'],
    slug: 'quiz-truong-chinh-1941-1956',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Ôn tập nhanh về Trường Chinh qua chuyển hướng chiến lược, tổng khởi nghĩa và kháng chiến kiến quốc.',
    title: 'Ôn tập Trường Chinh 1941-1956',
  },
  {
    period: '1945-1954',
    questions: [
      {
        explanation:
          'Tuyên ngôn Độc lập ngày 2/9/1945 là mốc gắn trực tiếp với Hồ Chí Minh và sự ra đời của nước Việt Nam Dân chủ Cộng hòa.',
        options: [
          { isCorrect: true, label: 'Tuyên ngôn Độc lập' },
          { isCorrect: false, label: 'Hiệp định Paris năm 1973' },
          { isCorrect: false, label: 'Việt Nam gia nhập WTO năm 2007' },
        ],
        prompt: 'Sự kiện nào gắn trực tiếp nhất với việc khai sinh nhà nước mới dưới sự lãnh đạo của Hồ Chí Minh?',
      },
      {
        explanation:
          'Đại hội II năm 1951 gắn với cương vị Chủ tịch Đảng của Hồ Chí Minh trong danh mục trình bày của site.',
        options: [
          { isCorrect: true, label: 'Đại hội II của Đảng năm 1951' },
          { isCorrect: false, label: 'Đại hội IX của Đảng năm 2001' },
          { isCorrect: false, label: 'Đại hội XIII của Đảng năm 2021' },
        ],
        prompt: 'Đại hội nào gắn với cương vị Chủ tịch Đảng của Hồ Chí Minh?',
      },
      {
        explanation:
          'Quảng trường Ba Đình là không gian lịch sử gắn với Tuyên ngôn Độc lập ngày 2/9/1945.',
        options: [
          { isCorrect: true, label: 'Quảng trường Ba Đình' },
          { isCorrect: false, label: 'Tòa nhà Quốc hội' },
          { isCorrect: false, label: 'Nhà thương Chợ Quán' },
        ],
        prompt: 'Địa danh nào gắn trực tiếp với Tuyên ngôn Độc lập?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['tuyen-ngon-doc-lap'],
    slug: 'quiz-ho-chi-minh-1941-1960',
    sources: ['tu-lieu-van-kien-dang', 'van-kien-dang-toan-tap'],
    summary: 'Ôn tập nhanh về Hồ Chí Minh qua những mốc giải phóng dân tộc, lập quốc và định hướng giai đoạn mới.',
    title: 'Ôn tập Hồ Chí Minh 1941-1960',
  },
  {
    period: '1965-1973',
    questions: [
      {
        explanation:
          'Đại hội III năm 1960 là mốc gắn với chặng mở đầu vai trò lãnh đạo của Lê Duẩn trong tư cách người đứng đầu Đảng.',
        options: [
          { isCorrect: true, label: 'Đại hội III của Đảng năm 1960' },
          { isCorrect: false, label: 'Đại hội VI của Đảng năm 1986' },
          { isCorrect: false, label: 'Đại hội XI của Đảng năm 2011' },
        ],
        prompt: 'Mốc nào gắn với chặng mở đầu vai trò lãnh đạo của Lê Duẩn?',
      },
      {
        explanation:
          'Chiến dịch Hồ Chí Minh và Đại thắng mùa Xuân 1975 là lát cắt tiêu biểu của chặng kết thúc chiến tranh, thống nhất đất nước.',
        options: [
          { isCorrect: true, label: 'Chiến dịch Hồ Chí Minh và Đại thắng mùa Xuân 1975' },
          { isCorrect: false, label: 'Phong trào dân chủ 1936-1939' },
          { isCorrect: false, label: 'Việt Nam gia nhập ASEAN năm 1995' },
        ],
        prompt: 'Tổ hợp mốc nào gắn rõ nhất với chặng kết thúc chiến tranh dưới thời Lê Duẩn?',
      },
      {
        explanation:
          'Đường Trường Sơn là trục hậu cần chiến lược nổi bật gắn với giai đoạn chiến tranh cách mạng dưới thời Lê Duẩn.',
        options: [
          { isCorrect: true, label: 'Đường Trường Sơn' },
          { isCorrect: false, label: 'Ma Cao' },
          { isCorrect: false, label: 'Geneva' },
        ],
        prompt: 'Địa danh nào là biểu tượng của trục hậu cần chiến lược trong thời kỳ Lê Duẩn?',
      },
    ],
    relatedCampaigns: ['chien-dich-ho-chi-minh'],
    relatedEvents: ['tet-mau-than-1968', 'dai-thang-mua-xuan-1975'],
    slug: 'quiz-le-duan-1960-1986',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Lê Duẩn qua chiến tranh chống Mỹ, đại thắng mùa Xuân và bước đầu thống nhất đất nước.',
    title: 'Ôn tập Lê Duẩn 1960-1986',
  },
  {
    period: '1986-1991',
    questions: [
      {
        explanation:
          'Đại hội VI năm 1986 mở ra đường lối đổi mới, gắn trực tiếp với chặng Nguyễn Văn Linh giữ cương vị Tổng Bí thư.',
        options: [
          { isCorrect: true, label: 'Đại hội VI của Đảng năm 1986' },
          { isCorrect: false, label: 'Đại hội VII của Đảng năm 1991' },
          { isCorrect: false, label: 'Đại hội XIII của Đảng năm 2021' },
        ],
        prompt: 'Mốc nào mở đầu công cuộc đổi mới trong thời kỳ Nguyễn Văn Linh?',
      },
      {
        explanation:
          'Nghị quyết 10 năm 1988 là quyết sách quan trọng giúp đổi mới đi vào sản xuất nông nghiệp.',
        options: [
          { isCorrect: true, label: 'Nghị quyết 10 năm 1988 về đổi mới nông nghiệp' },
          { isCorrect: false, label: 'Nghị quyết Trung ương 6 lần 2 năm 1999' },
          { isCorrect: false, label: 'Nghị quyết 202/2025/QH15' },
        ],
        prompt: 'Quyết sách nào giúp đổi mới đi sâu vào sản xuất nông nghiệp dưới thời Nguyễn Văn Linh?',
      },
      {
        explanation:
          'Hội trường Ba Đình là địa danh nổi bật gắn với Đại hội VI trong lát cắt trình bày của site.',
        options: [
          { isCorrect: true, label: 'Hội trường Ba Đình' },
          { isCorrect: false, label: 'Pác Bó' },
          { isCorrect: false, label: 'Washington, D.C.' },
        ],
        prompt: 'Địa danh nào gắn với Đại hội VI năm 1986?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['dai-hoi-vi-1986', 'nghi-quyet-10-1988'],
    slug: 'quiz-nguyen-van-linh-1986-1991',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Nguyễn Văn Linh, Đại hội VI và bước đầu của công cuộc đổi mới.',
    title: 'Ôn tập Nguyễn Văn Linh 1986-1991',
  },
  {
    period: '1991-1997',
    questions: [
      {
        explanation:
          'Đại hội VII năm 1991 xác nhận tiếp tục đổi mới và thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội.',
        options: [
          { isCorrect: true, label: 'Đại hội VII của Đảng năm 1991' },
          { isCorrect: false, label: 'Đại hội I của Đảng năm 1935' },
          { isCorrect: false, label: 'Đại hội IX của Đảng năm 2001' },
        ],
        prompt: 'Mốc nào mở đầu thời kỳ Đỗ Mười với cương lĩnh phát triển mới?',
      },
      {
        explanation:
          'Việt Nam gia nhập ASEAN ngày 28/7/1995 là bước ngoặt hội nhập khu vực tiêu biểu trong thời kỳ Đỗ Mười.',
        options: [
          { isCorrect: true, label: 'Việt Nam gia nhập ASEAN năm 1995' },
          { isCorrect: false, label: 'Việt Nam gia nhập WTO năm 2007' },
          { isCorrect: false, label: 'Hiệp định Paris năm 1973' },
        ],
        prompt: 'Bước ngoặt hội nhập khu vực nào gắn trực tiếp với thời kỳ Đỗ Mười?',
      },
      {
        explanation:
          'Bandar Seri Begawan là địa điểm gắn với lễ kết nạp Việt Nam vào ASEAN năm 1995.',
        options: [
          { isCorrect: true, label: 'Bandar Seri Begawan' },
          { isCorrect: false, label: 'Geneva' },
          { isCorrect: false, label: 'Hương Cảng' },
        ],
        prompt: 'Việt Nam gia nhập ASEAN năm 1995 tại đâu?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['dai-hoi-vii-1991', 'viet-nam-gia-nhap-asean-1995'],
    slug: 'quiz-do-muoi-1991-1997',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Đỗ Mười qua Đại hội VII, cương lĩnh 1991 và bước mở rộng hội nhập khu vực.',
    title: 'Ôn tập Đỗ Mười 1991-1997',
  },
  {
    period: '1997-2001',
    questions: [
      {
        explanation:
          'Nghị quyết Trung ương 6 lần 2 khóa VIII năm 1999 nhấn mạnh nhiệm vụ xây dựng, chỉnh đốn Đảng trong thời kỳ Lê Khả Phiêu.',
        options: [
          { isCorrect: true, label: 'Nghị quyết Trung ương 6 lần 2 khóa VIII năm 1999' },
          { isCorrect: false, label: 'Nghị quyết 10 năm 1988' },
          { isCorrect: false, label: 'Nghị quyết Trung ương 4 khóa XI năm 2012' },
        ],
        prompt: 'Văn kiện nào nhấn mạnh xây dựng, chỉnh đốn Đảng trong thời kỳ Lê Khả Phiêu?',
      },
      {
        explanation:
          'Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000 là bước mở rộng hội nhập kinh tế quốc tế tiêu biểu trong giai đoạn này.',
        options: [
          { isCorrect: true, label: 'Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000' },
          { isCorrect: false, label: 'Việt Nam gia nhập ASEAN năm 1995' },
          { isCorrect: false, label: 'Việt Nam gia nhập WTO năm 2007' },
        ],
        prompt: 'Sự kiện nào mở thêm cửa cho hội nhập kinh tế quốc tế thời Lê Khả Phiêu?',
      },
      {
        explanation:
          'Washington, D.C. là địa điểm gắn với Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000.',
        options: [
          { isCorrect: true, label: 'Washington, D.C.' },
          { isCorrect: false, label: 'Bandar Seri Begawan' },
          { isCorrect: false, label: 'Bà Điểm - Hóc Môn' },
        ],
        prompt: 'Hiệp định Thương mại Việt Nam - Hoa Kỳ năm 2000 gắn với địa điểm nào?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['nghi-quyet-trung-uong-6-lan-2-1999', 'hiep-dinh-thuong-mai-viet-my-2000'],
    slug: 'quiz-le-kha-phieu-1997-2001',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Lê Khả Phiêu qua nhiệm vụ chỉnh đốn Đảng và bước mở rộng hội nhập kinh tế quốc tế.',
    title: 'Ôn tập Lê Khả Phiêu 1997-2001',
  },
  {
    period: '2001-2011',
    questions: [
      {
        explanation:
          'Đại hội IX năm 2001 mở đầu giai đoạn Nông Đức Mạnh giữ cương vị Tổng Bí thư trong danh mục của site.',
        options: [
          { isCorrect: true, label: 'Đại hội IX của Đảng năm 2001' },
          { isCorrect: false, label: 'Đại hội III của Đảng năm 1960' },
          { isCorrect: false, label: 'Đại hội VI của Đảng năm 1986' },
        ],
        prompt: 'Mốc nào mở đầu thời kỳ Nông Đức Mạnh trên trục lãnh đạo?',
      },
      {
        explanation:
          'Việt Nam gia nhập WTO ngày 11/1/2007 là cột mốc hội nhập toàn cầu nổi bật của giai đoạn này.',
        options: [
          { isCorrect: true, label: 'Việt Nam gia nhập WTO năm 2007' },
          { isCorrect: false, label: 'Việt Nam gia nhập ASEAN năm 1995' },
          { isCorrect: false, label: 'Hiệp định Paris năm 1973' },
        ],
        prompt: 'Cột mốc hội nhập toàn cầu nổi bật nhất trong thời kỳ Nông Đức Mạnh là gì?',
      },
      {
        explanation:
          'Geneva là địa điểm gắn với việc Việt Nam gia nhập WTO năm 2007.',
        options: [
          { isCorrect: true, label: 'Geneva' },
          { isCorrect: false, label: 'Ma Cao' },
          { isCorrect: false, label: 'Pác Bó' },
        ],
        prompt: 'Việt Nam gia nhập WTO năm 2007 gắn với địa điểm nào?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['dai-hoi-ix-2001', 'viet-nam-gia-nhap-wto-2007'],
    slug: 'quiz-nong-duc-manh-2001-2011',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Nông Đức Mạnh qua Đại hội IX và cột mốc gia nhập WTO năm 2007.',
    title: 'Ôn tập Nông Đức Mạnh 2001-2011',
  },
  {
    period: '2011-2024',
    questions: [
      {
        explanation:
          'Đại hội XI năm 2011 mở đầu thời kỳ Nguyễn Phú Trọng giữ cương vị Tổng Bí thư trong cấu trúc dữ liệu của site.',
        options: [
          { isCorrect: true, label: 'Đại hội XI của Đảng năm 2011' },
          { isCorrect: false, label: 'Đại hội I của Đảng năm 1935' },
          { isCorrect: false, label: 'Đại hội VI của Đảng năm 1986' },
        ],
        prompt: 'Mốc nào mở đầu thời kỳ Nguyễn Phú Trọng trên trục lãnh đạo?',
      },
      {
        explanation:
          'Nghị quyết Trung ương 4 khóa XI năm 2012 là cột mốc nhấn mạnh xây dựng, chỉnh đốn Đảng trong thời kỳ Nguyễn Phú Trọng.',
        options: [
          { isCorrect: true, label: 'Nghị quyết Trung ương 4 khóa XI năm 2012' },
          { isCorrect: false, label: 'Nghị quyết Trung ương 6 năm 1939' },
          { isCorrect: false, label: 'Nghị quyết 10 năm 1988' },
        ],
        prompt: 'Văn kiện nào gắn trực tiếp với yêu cầu xây dựng, chỉnh đốn Đảng thời Nguyễn Phú Trọng?',
      },
      {
        explanation:
          'Cao điểm phòng, chống tham nhũng năm 2023 là nét nổi bật của giai đoạn Nguyễn Phú Trọng trong dữ liệu hiện có của site.',
        options: [
          { isCorrect: true, label: 'Cao điểm phòng, chống tham nhũng năm 2023' },
          { isCorrect: false, label: 'Tổng tuyển cử năm 1976' },
          { isCorrect: false, label: 'Việt Nam gia nhập ASEAN năm 1995' },
        ],
        prompt: 'Điểm nhấn quản trị nào nổi bật trên trang Nguyễn Phú Trọng?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: [
      'dai-hoi-xi-2011',
      'nghi-quyet-trung-uong-4-khoa-xi-2012',
      'dai-hoi-xiii-2021',
      'chien-dich-phong-chong-tham-nhung-2023',
    ],
    slug: 'quiz-nguyen-phu-trong-2011-2024',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Nguyễn Phú Trọng qua các mốc xây dựng, chỉnh đốn Đảng và phòng, chống tham nhũng.',
    title: 'Ôn tập Nguyễn Phú Trọng 2011-2024',
  },
  {
    period: '2024-2026',
    questions: [
      {
        explanation:
          'Việc Tô Lâm được bầu làm Tổng Bí thư năm 2024 là mốc mở đầu chặng lãnh đạo đương nhiệm trong dữ liệu của site.',
        options: [
          { isCorrect: true, label: 'Tô Lâm được bầu làm Tổng Bí thư năm 2024' },
          { isCorrect: false, label: 'Đại hội IX năm 2001' },
          { isCorrect: false, label: 'Hội nghị Trung ương 8 năm 1941' },
        ],
        prompt: 'Mốc nào mở đầu chặng lãnh đạo của Tô Lâm trên site?',
      },
      {
        explanation:
          'Chủ trương tinh gọn bộ máy năm 2025 là điểm nhấn cải cách tổ chức nổi bật trong lát cắt hiện nay.',
        options: [
          { isCorrect: true, label: 'Chủ trương tinh gọn bộ máy năm 2025' },
          { isCorrect: false, label: 'Phong trào dân chủ 1936-1939' },
          { isCorrect: false, label: 'Đại hội VII năm 1991' },
        ],
        prompt: 'Điểm nhấn cải cách tổ chức nào nổi bật trong lát cắt về Tô Lâm?',
      },
      {
        explanation:
          'Tòa nhà Quốc hội là địa danh chính được dùng để đặt bối cảnh cho giai đoạn mở đầu nhiệm kỳ của Tô Lâm.',
        options: [
          { isCorrect: true, label: 'Tòa nhà Quốc hội' },
          { isCorrect: false, label: 'Nhà thương Chợ Quán' },
          { isCorrect: false, label: 'Bandar Seri Begawan' },
        ],
        prompt: 'Địa danh nào đang được dùng để đặt bối cảnh cho lát cắt về Tô Lâm?',
      },
    ],
    relatedCampaigns: [],
    relatedEvents: ['to-lam-duoc-bau-tong-bi-thu-2024', 'chu-truong-tinh-gon-bo-may-2025'],
    slug: 'quiz-to-lam-2024-2026',
    sources: ['tu-lieu-van-kien-dang', 'dang-cong-san-viet-nam'],
    summary: 'Ôn tập nhanh về Tô Lâm qua mốc mở đầu nhiệm kỳ và chủ trương tinh gọn bộ máy.',
    title: 'Ôn tập Tô Lâm 2024-2026',
  },
]
