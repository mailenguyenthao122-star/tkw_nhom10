const ALL_SLOTS = [
  '06:00','07:00','08:00','09:00','10:00','11:00',
  '13:00','14:00','15:00','16:00','17:00',
  '18:00','19:00','20:00','21:00','22:00'
];

const COURTS = {
  pickpark: {
    name: 'PickPark Cầu Giấy',
    loc:  '96 Trần Thái Tông, Cầu Giấy, Hà Nội',
    price: '80.000đ', priceNum: 80000,
    totalCourts: 6,
    status: 'open', statusLabel: 'Còn sân',
    hours: '05:30 – 23:00',
    rating: '4.9', reviewCount: 128,
    ratingBars: [88,9,2,1,0],
    tags: ['Có mái che','Đèn LED','Thuê vợt','Gửi xe'],
    facilities: ['🏓 6 sân tiêu chuẩn','💡 Đèn LED cao cấp','🏠 Mái che toàn bộ','🚿 Nhà tắm sạch sẽ','🅿️ Gửi xe miễn phí','🛒 Thuê vợt tại chỗ'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1!2d105.7923!3d21.0285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9b05e94a01%3A0xbcf928d1f3929c28!2sTr%E1%BA%A7n%20Th%C3%A1i%20T%C3%B4ng%2C%20C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2svn!4v1700000000000',
    mapCaption: '96 Trần Thái Tông, Cầu Giấy · Cách Metro Cầu Giấy 300m',
    takenSlots: ['06:00','07:00','11:00','17:00'],
    reviews: [
      { name:'Nguyễn Minh Tuấn', stars:'★★★★★', text:'Sân rộng, sạch sẽ, đèn chiếu sáng tốt, nhân viên nhiệt tình. Sẽ quay lại!', date:'24/04/2025' },
      { name:'Trần Thu Hà',       stars:'★★★★★', text:'Đặt online rất tiện, không cần gọi điện. Giá hợp lý, vị trí trung tâm.', date:'22/04/2025' },
      { name:'Lê Văn Phong',      stars:'★★★★☆', text:'Vợt thuê chất lượng tốt. Bãi xe hơi nhỏ giờ cao điểm nhưng vẫn ổn.', date:'18/04/2025' }
    ]
  },
  procourt: {
    name: 'ProCourt Tây Hồ',
    loc:  '28 Xuân Diệu, Tây Hồ, Hà Nội',
    price: '100.000đ', priceNum: 100000,
    totalCourts: 8,
    status: 'busy', statusLabel: 'Gần hết',
    hours: '06:00 – 22:00',
    rating: '4.8', reviewCount: 95,
    ratingBars: [83,12,3,2,0],
    tags: ['Ngoài trời','View hồ Tây','Nhà hàng','HLV'],
    facilities: ['🏓 8 sân ngoài trời','🌅 View hồ Tây','🍽️ Nhà hàng tại sân','🅿️ Gửi xe rộng','🎓 HLV chuyên nghiệp','📱 Check-in App'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.8!2d105.8367!3d21.0636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9b!2sXu%C3%A2n%20Di%E1%BB%87u!5e0!3m2!1svi!2svn!4v1700000000001',
    mapCaption: '28 Xuân Diệu, Tây Hồ · View hồ Tây tuyệt đẹp',
    takenSlots: ['06:00','07:00','08:00','11:00','17:00','19:00'],
    reviews: [
      { name:'Phạm Quỳnh Anh', stars:'★★★★★', text:'View hồ Tây cực đẹp, chơi xong ngồi nhà hàng ngắm cảnh rất thích.', date:'23/04/2025' },
      { name:'Hoàng Đức Minh', stars:'★★★★★', text:'Đội mình hay book ở đây cho team building. Nhân viên hỗ trợ nhiệt tình.', date:'20/04/2025' },
      { name:'Vũ Thị Lan',     stars:'★★★★☆', text:'Giờ cao điểm hơi đông, nên đặt trước 2–3 ngày. Sân ngoài trời thoáng.', date:'15/04/2025' }
    ]
  },
  greencourt: {
    name: 'GreenCourt Đống Đa',
    loc:  '45 Láng Hạ, Đống Đa, Hà Nội',
    price: '70.000đ', priceNum: 70000,
    totalCourts: 4,
    status: 'open', statusLabel: 'Còn sân',
    hours: '06:00 – 22:30',
    rating: '4.6', reviewCount: 67,
    ratingBars: [75,15,6,3,1],
    tags: ['Trong nhà','HLV','Café','Giá tốt'],
    facilities: ['🏓 4 sân trong nhà','💡 Đèn LED đêm','🏠 Mái che 100%','🚿 Phòng thay đồ','🎓 HLV chuyên nghiệp','☕ Khu café nhỏ'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d105.8217!3d21.0189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sLang+Ha!5e0!3m2!1svi!2svn!4v1700000000002',
    mapCaption: '45 Láng Hạ, Đống Đa · Gần Đại sứ quán Nhật Bản',
    takenSlots: ['06:00','11:00','17:00'],
    reviews: [
      { name:'Ngô Thành Long', stars:'★★★★☆', text:'Giá tốt nhất khu vực, HLV nhiệt tình. Sân nhỏ nhưng chất lượng ổn.', date:'21/04/2025' },
      { name:'Đinh Thị Mai',   stars:'★★★★★', text:'Học ở đây 2 tháng rồi, HLV dạy rất bài bản. Sẽ tiếp tục gia hạn.', date:'17/04/2025' }
    ]
  },
  smashhub: {
    name: 'SmashHub Hoàng Mai',
    loc:  '12 Tam Trinh, Hoàng Mai, Hà Nội',
    price: '90.000đ', priceNum: 90000,
    totalCourts: 10,
    status: 'open', statusLabel: 'Còn sân',
    hours: '05:00 – 23:30',
    rating: '4.9', reviewCount: 203,
    ratingBars: [90,7,2,1,0],
    tags: ['10 sân','Có mái','Café','Thuê vợt'],
    facilities: ['🏓 10 sân tiêu chuẩn','💡 LED cao cấp','🏠 Mái che kết hợp','🚿 Phòng tắm VIP','🅿️ Bãi xe 200 chỗ','🍹 Café & ăn uống'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2!2d105.8489!3d20.9893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sTam+Trinh!5e0!3m2!1svi!2svn!4v1700000000003',
    mapCaption: '12 Tam Trinh, Hoàng Mai · Sân lớn nhất khu vực phía Nam',
    takenSlots: ['06:00','07:00','11:00','17:00'],
    reviews: [
      { name:'Trịnh Văn Nam',  stars:'★★★★★', text:'10 sân mà không bao giờ thiếu chỗ. Khu café ngon, giá hợp lý.', date:'24/04/2025' },
      { name:'Lý Thị Bích',    stars:'★★★★★', text:'Đặt online cực nhanh, 2 phút là xong. Nhân viên thân thiện.', date:'22/04/2025' },
      { name:'Dương Tuấn Khanh',stars:'★★★★★', text:'Đèn LED sáng, chơi đêm rất thích. Tốt nhất Hoàng Mai!', date:'19/04/2025' }
    ]
  },
  cityclub: {
    name: 'CityClub Hai Bà Trưng',
    loc:  '38 Lê Đại Hành, Hai Bà Trưng, Hà Nội',
    price: '85.000đ', priceNum: 85000,
    totalCourts: 5,
    status: 'open', statusLabel: 'Còn sân',
    hours: '06:00 – 23:00',
    rating: '4.7', reviewCount: 84,
    ratingBars: [79,14,5,2,0],
    tags: ['Trong nhà','Có máy lạnh','Phòng VIP','Gửi xe'],
    facilities: ['🏓 5 sân trong nhà','❄️ Máy lạnh toàn bộ','🏆 Phòng VIP','🚿 Phòng tắm riêng','🅿️ Gửi xe ô tô','☕ Quầy nước miễn phí'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8!2d105.8456!3d21.0089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sLe+Dai+Hanh!5e0!3m2!1svi!2svn!4v1700000000004',
    mapCaption: '38 Lê Đại Hành, Hai Bà Trưng · Gần hồ Thiền Quang',
    takenSlots: ['06:00','09:00','11:00','17:00','20:00'],
    reviews: [
      { name:'Bùi Thanh Tùng', stars:'★★★★★', text:'Sân trong nhà có máy lạnh, chơi mùa hè cực thoải mái. Recommend!', date:'23/04/2025' },
      { name:'Nguyễn Hà Linh', stars:'★★★★☆', text:'Phòng VIP xịn sò, giá hợp lý so với chất lượng.', date:'19/04/2025' }
    ]
  },
  sunpark: {
    name: 'SunPark Long Biên',
    loc:  '102 Nguyễn Văn Cừ, Long Biên, Hà Nội',
    price: '75.000đ', priceNum: 75000,
    totalCourts: 7,
    status: 'open', statusLabel: 'Còn sân',
    hours: '05:30 – 22:30',
    rating: '4.5', reviewCount: 56,
    ratingBars: [72,18,7,2,1],
    tags: ['7 sân','Ngoài trời','Đèn LED','Giá rẻ'],
    facilities: ['🏓 7 sân ngoài trời','💡 Hệ thống đèn LED','🌳 Không gian thoáng','🚿 Nhà tắm cơ bản','🅿️ Gửi xe máy','🥤 Bán đồ uống'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.6!2d105.8823!3d21.0389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sNguyen+Van+Cu!5e0!3m2!1svi!2svn!4v1700000000005',
    mapCaption: '102 Nguyễn Văn Cừ, Long Biên · Gần cầu Long Biên',
    takenSlots: ['06:00','11:00','17:00'],
    reviews: [
      { name:'Lê Minh Đức',   stars:'★★★★☆', text:'Giá rẻ nhất mà chất lượng không tệ. Sân thoáng, view đẹp.', date:'20/04/2025' },
      { name:'Phạm Thu Thảo', stars:'★★★★☆', text:'Phù hợp cho nhóm đông, giá thành thấp. Sẽ quay lại.', date:'16/04/2025' }
    ]
  }
};

const ADDONS = [
  { id:'addon-racket', emoji:'🏓', label:'Thuê vợt & bóng',  price:30000,  priceLabel:'+30.000đ' },
  { id:'addon-coach',  emoji:'🎓', label:'Đặt HLV 1 buổi',  price:200000, priceLabel:'+200.000đ' },
  { id:'addon-cafe',   emoji:'🍹', label:'Set café & nước',  price:50000,  priceLabel:'+50.000đ' },
  { id:'addon-towel',  emoji:'🧴', label:'Khăn & nước tắm', price:20000,  priceLabel:'+20.000đ' },
  { id:'addon-photo',  emoji:'📸', label:'Chụp ảnh kỷ niệm',price:100000, priceLabel:'+100.000đ' },
  { id:'addon-locker', emoji:'🔐', label:'Tủ đồ cá nhân',   price:15000,  priceLabel:'+15.000đ' }
];

const SERVICES = [
  { icon:'🏓', name:'Thuê vợt & bóng',    desc:'Vợt chất lượng cao, bóng chuẩn outdoor/indoor.',           price:'30.000đ / buổi',      action:'booking' },
  { icon:'🎓', name:'Đặt huấn luyện viên',desc:'HLV chuyên nghiệp cho người mới & trung cấp.',             price:'200.000đ / buổi',     action:'booking' },
  { icon:'🏆', name:'Tổ chức giải đấu',   desc:'Đặt sân trọn gói cho giải nội bộ, team building.',        price:'Liên hệ báo giá',     action:'hotline' },
  { icon:'👥', name:'Tìm đối / ghép đôi', desc:'Ghép cặp theo trình độ & khu vực, hoàn toàn miễn phí.',   price:'Miễn phí',            action:'wip'     },
  { icon:'📅', name:'Gói thành viên tháng',desc:'Tiết kiệm 30–40%, ưu tiên giờ cao điểm.',                 price:'từ 800.000đ / tháng', action:'wip'     },
  { icon:'🍹', name:'Café & ăn uống',     desc:'Set đồ uống, snack phục vụ tại sân sau khi chơi.',        price:'50.000đ / set',       action:'booking' },
  { icon:'📸', name:'Chụp ảnh kỷ niệm',  desc:'Thợ ảnh chuyên nghiệp ghi lại những khoảnh khắc đẹp.',    price:'100.000đ / buổi',     action:'booking' },
  { icon:'🔐', name:'Tủ đồ cá nhân',     desc:'Khóa tủ an toàn, giữ đồ trong suốt buổi chơi.',           price:'15.000đ / lần',       action:'booking' },
  { icon:'🚌', name:'Đặt xe đưa đón',    desc:'Xe đưa đón tận nơi cho nhóm từ 5 người trở lên.',          price:'Liên hệ báo giá',     action:'hotline' }
];