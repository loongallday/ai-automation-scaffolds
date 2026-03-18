// ============================================================
// AI Studio — Demo Dashboard Configuration
// ============================================================
// Per-industry presets with mock/real LINE switching.
// Override DEMO_CONFIG.industry via industry-config.js
// ============================================================

const INDUSTRY_PRESETS = {

  // ─── E-Commerce ────────────────────────────────────────────
  ecommerce: {
    name_th: "อีคอมเมิร์ซ",
    name_en: "E-Commerce",
    accent: "#06c",
    botName: "Shop Assistant",
    botAvatar: "🛒",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่ร้านค้าออนไลน์ของเรา สอบถามสินค้าได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "คำสั่งซื้อ Orders", icon: "📦", component: "order" },
      { id: "review", label: "รีวิว Reviews", icon: "⭐", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "สินค้า X200 ราคาเท่าไหร่",
      "มีโปรโมชั่นอะไรบ้าง",
      "สั่งซื้อสินค้า 2 ชิ้น",
      "เช็คสถานะการจัดส่ง",
      "ขอเปลี่ยน/คืนสินค้า",
    ],
    mockReplies: {
      "สินค้า X200 ราคาเท่าไหร่": "สินค้า X200 ราคา 12,500 บาทครับ ตอนนี้มีโปรลด 10% เหลือ 11,250 บาท สนใจสั่งซื้อเลยไหมครับ?",
      "มีโปรโมชั่นอะไรบ้าง": "โปรโมชั่นเดือนนี้ครับ:\n1. ซื้อ 2 ชิ้นลด 15%\n2. สมาชิกใหม่ลด 200 บาท\n3. ส่งฟรีเมื่อซื้อครบ 1,500 บาท\nสนใจรายการไหนครับ?",
      "สั่งซื้อสินค้า 2 ชิ้น": "รับทราบครับ! กรุณาแจ้งรหัสสินค้าหรือชื่อสินค้าที่ต้องการสั่ง 2 ชิ้นด้วยนะครับ จะได้จัดเตรียมให้ถูกต้องครับ",
      "เช็คสถานะการจัดส่ง": "กรุณาแจ้งหมายเลขคำสั่งซื้อ (เช่น ORD-XXXXXX) จะเช็คสถานะให้ทันทีครับ หรือแจ้งชื่อ-เบอร์โทรที่ใช้สั่งซื้อก็ได้ครับ",
      "ขอเปลี่ยน/คืนสินค้า": "รับทราบครับ สามารถเปลี่ยน/คืนสินค้าได้ภายใน 7 วัน กรุณาแจ้ง:\n1. หมายเลขคำสั่งซื้อ\n2. เหตุผลที่ต้องการเปลี่ยน/คืน\n3. ถ่ายรูปสินค้าส่งมาด้วยนะครับ",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ระบบ AI กำลังค้นหาสินค้าให้คุณ จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "สร้างคำสั่งซื้อ Create Order",
      fields: [
        { id: "orderName", label: "ชื่อลูกค้า Customer Name", type: "text", default: "สมชาย ใจดี" },
        { id: "orderPhone", label: "เบอร์โทร Phone", type: "text", default: "081-234-5678" },
        { id: "orderItems", label: "รายการสินค้า Items", type: "text", default: "X200 Pro x2, เคสกันกระแทก x2", fullWidth: true },
        { id: "orderAddress", label: "ที่อยู่จัดส่ง Shipping Address", type: "textarea", default: "123/45 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับออเดอร์", icon: "1" },
        { id: "processing", label: "กำลังจัดเตรียม", icon: "2" },
        { id: "shipped", label: "จัดส่งแล้ว", icon: "3" },
      ],
      itemIdPrefix: "ORD",
    },
    reviewContext: {
      title: "รีวิวสินค้า Product Review",
      subtitle: "จำลองรีวิวสินค้าเพื่อทดสอบ AI ตอบรีวิวอัตโนมัติ",
      placeholder: "เขียนรีวิวสินค้าที่นี่...",
      defaultReview: "สินค้าคุณภาพดี ส่งไว แพ็คสวย แนะนำเลยครับ",
      mockReplies: {
        5: "ขอบคุณมากครับสำหรับรีวิว 5 ดาว! ดีใจที่สินค้าถูกใจ หวังว่าจะอุดหนุนอีกนะครับ 🎉",
        4: "ขอบคุณสำหรับรีวิวครับ! ดีใจที่พอใจสินค้า เรามุ่งพัฒนาให้ดียิ่งขึ้นเสมอครับ",
        3: "ขอบคุณสำหรับความคิดเห็นครับ จะนำไปปรับปรุงสินค้าให้ดียิ่งขึ้น หากมีข้อเสนอแนะเพิ่มเติมยินดีรับฟังครับ",
        2: "ขออภัยที่สินค้ายังไม่ถูกใจครับ กรุณาแจ้งปัญหา จะรีบดำเนินการแก้ไขให้ครับ",
        1: "ขออภัยอย่างยิ่งครับ ทีมงานจะติดต่อกลับเพื่อแก้ไขปัญหาโดยเร็วที่สุด ขอโอกาสให้เราดูแลนะครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statMessages", value: "248", label: "ข้อความวันนี้ Messages", change: "+12%", direction: "up" },
        { id: "statOrders", value: "37", label: "ออเดอร์วันนี้ Orders", change: "+8%", direction: "up" },
        { id: "statRevenue", value: "฿89,420", label: "ยอดขายวันนี้ Revenue", change: "+15%", direction: "up" },
        { id: "statConversion", value: "14.9%", label: "Conversion Rate", change: "+2.1%", direction: "up" },
      ],
      charts: [
        { id: "chart1", title: "ยอดขายรายวัน Daily Sales (฿)", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [42000, 58000, 39000, 62000, 71000, 85000, 68000], color: "#06c" },
        { id: "chart2", title: "ข้อความต่อวัน Messages/Day", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [120, 185, 142, 198, 245, 310, 248], color: "#30d158" },
        { id: "chart3", title: "การกระจายคะแนนรีวิว Ratings", type: "hbar", labels: ["5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"], data: [45, 28, 12, 5, 2], colors: ["#30d158", "#34d399", "#fbbf24", "#fb923c", "#ff453a"] },
        { id: "chart4", title: "เวลาตอบกลับ Response Time (วินาที)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [2.1, 1.8, 2.4, 1.5, 1.2, 1.9, 1.3], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Restaurant ────────────────────────────────────────────
  restaurant: {
    name_th: "ร้านอาหาร",
    name_en: "Restaurant",
    accent: "#e85d04",
    botName: "ร้านอาหาร Bot",
    botAvatar: "🍜",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่ร้านอาหารของเรา สั่งอาหารหรือจองโต๊ะได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "ออเดอร์อาหาร Orders", icon: "🍽️", component: "order" },
      { id: "review", label: "รีวิวอาหาร Reviews", icon: "⭐", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "สั่งกะเพราหมูสับ 2 จาน",
      "ขอเมนูแนะนำหน่อย",
      "จองโต๊ะ 4 ที่นั่ง วันศุกร์",
      "มีเมนูมังสวิรัติไหม",
      "อาหารกี่นาทีถึง",
    ],
    mockReplies: {
      "สั่งกะเพราหมูสับ 2 จาน": "รับออเดอร์ครับ! กะเพราหมูสับ 2 จาน รวม 120 บาท\nจัดส่งประมาณ 30-40 นาทีครับ ต้องการเพิ่มเมนูอื่นไหมครับ?",
      "ขอเมนูแนะนำหน่อย": "เมนูแนะนำวันนี้ครับ:\n1. ข้าวผัดปู — 89 บาท\n2. ต้มยำกุ้ง — 159 บาท\n3. ส้มตำไทย — 59 บาท\n4. หมูกระทะเซ็ต — 299 บาท\nสนใจเมนูไหนครับ?",
      "จองโต๊ะ 4 ที่นั่ง วันศุกร์": "รับทราบครับ! ขอยืนยันรายละเอียด:\n- วันศุกร์นี้\n- 4 ที่นั่ง\n- กรุณาแจ้งเวลาที่ต้องการมาด้วยนะครับ\nจะจัดโต๊ะให้เรียบร้อยครับ",
      "มีเมนูมังสวิรัติไหม": "มีครับ! เมนูมังสวิรัติของเราได้แก่:\n1. ผัดผักรวม — 69 บาท\n2. แกงเขียวหวานเต้าหู้ — 79 บาท\n3. ข้าวผัดผัก — 59 บาท\n4. สลัดผักสด — 89 บาท\nสนใจเมนูไหนครับ?",
      "อาหารกี่นาทีถึง": "ออเดอร์ปัจจุบันใช้เวลาประมาณ 25-35 นาทีครับ จะแจ้งอัปเดตให้ทราบเมื่อไรเดอร์รับออเดอร์แล้วนะครับ",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ร้านเรายินดีบริการ จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "สร้างออเดอร์อาหาร Create Food Order",
      fields: [
        { id: "orderName", label: "ชื่อลูกค้า Customer Name", type: "text", default: "สมชาย ใจดี" },
        { id: "orderPhone", label: "เบอร์โทร Phone", type: "text", default: "081-234-5678" },
        { id: "orderItems", label: "รายการอาหาร Menu Items", type: "text", default: "กะเพราหมูสับ x2, ไข่ดาว x2, น้ำเปล่า x2", fullWidth: true },
        { id: "orderAddress", label: "ที่อยู่จัดส่ง Delivery Address", type: "textarea", default: "123/45 ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ 10110", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับออเดอร์", icon: "1" },
        { id: "processing", label: "กำลังปรุง", icon: "2" },
        { id: "shipped", label: "จัดส่งแล้ว", icon: "3" },
      ],
      itemIdPrefix: "FOOD",
    },
    reviewContext: {
      title: "รีวิวอาหาร Food Review",
      subtitle: "จำลองรีวิวร้านอาหารเพื่อทดสอบ AI ตอบรีวิวอัตโนมัติ",
      placeholder: "เขียนรีวิวอาหาร/บริการที่นี่...",
      defaultReview: "อาหารอร่อยมาก บริการดี แต่รอนานหน่อย",
      mockReplies: {
        5: "ขอบคุณมากครับสำหรับรีวิว 5 ดาว! ทีมเชฟดีใจมากที่อาหารถูกใจ หวังว่าจะได้ต้อนรับอีกนะครับ 🍜",
        4: "ขอบคุณสำหรับรีวิวครับ! ดีใจที่อาหารถูกปาก เราจะพัฒนาทุกเมนูให้ดียิ่งขึ้นครับ",
        3: "ขอบคุณสำหรับความคิดเห็นครับ จะนำไปปรับปรุงรสชาติและบริการให้ดียิ่งขึ้นครับ",
        2: "ขออภัยที่ยังไม่ถูกใจครับ จะปรับปรุงอย่างเร่งด่วน หากแจ้งเมนูที่ไม่พอใจ จะดูแลให้ครับ",
        1: "ขออภัยอย่างยิ่งครับ ผู้จัดการจะติดต่อกลับเพื่อรับฟังปัญหาและแก้ไขโดยเร็วที่สุดครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statOrders", value: "156", label: "ออเดอร์วันนี้ Orders", change: "+18%", direction: "up" },
        { id: "statRevenue", value: "฿47,800", label: "รายได้วันนี้ Revenue", change: "+12%", direction: "up" },
        { id: "statAvgTicket", value: "฿306", label: "เฉลี่ยต่อบิล Avg Ticket", change: "+5%", direction: "up" },
        { id: "statWaitTime", value: "28 นาที", label: "เวลารอเฉลี่ย Wait Time", change: "-8%", direction: "down" },
      ],
      charts: [
        { id: "chart1", title: "ออเดอร์รายวัน Daily Orders", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [98, 124, 107, 135, 156, 189, 167], color: "#e85d04" },
        { id: "chart2", title: "รายได้รายวัน Daily Revenue (฿)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [29400, 37200, 32100, 40500, 47800, 56700, 50100], color: "#30d158" },
        { id: "chart3", title: "การกระจายคะแนนรีวิว Ratings", type: "hbar", labels: ["5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"], data: [52, 31, 10, 4, 1], colors: ["#30d158", "#34d399", "#fbbf24", "#fb923c", "#ff453a"] },
        { id: "chart4", title: "เวลารอเฉลี่ย Avg Wait Time (นาที)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [25, 22, 28, 20, 18, 32, 28], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Real Estate ───────────────────────────────────────────
  realestate: {
    name_th: "อสังหาริมทรัพย์",
    name_en: "Real Estate",
    accent: "#059669",
    botName: "Property Bot",
    botAvatar: "🏠",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่บริการอสังหาริมทรัพย์ ค้นหาคอนโด/บ้านได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "ลูกค้าสนใจ Leads", icon: "🎯", component: "order" },
      { id: "review", label: "รีวิวตัวแทน Reviews", icon: "⭐", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "มีคอนโดแถวพระราม9ไหม",
      "ต้องการบ้านเดี่ยว งบ 5 ล้าน",
      "ขอนัดดูห้องตัวอย่าง",
      "สอบถามเรื่องสินเชื่อบ้าน",
      "มีโครงการใหม่เปิดตัวไหม",
    ],
    mockReplies: {
      "มีคอนโดแถวพระราม9ไหม": "มีครับ! แนะนำ 3 โครงการ:\n1. Life Asoke Rama 9 — เริ่ม 3.2 ล้าน\n2. The Line Asoke-Ratchada — เริ่ม 4.5 ล้าน\n3. Rhythm Asoke — เริ่ม 5.1 ล้าน\nสนใจนัดดูห้องตัวอย่างไหมครับ?",
      "ต้องการบ้านเดี่ยว งบ 5 ล้าน": "รับทราบครับ! บ้านเดี่ยว งบ 5 ล้าน มีหลายทำเลครับ:\n1. รังสิต-ลำลูกกา — 3 ห้องนอน\n2. บางนา-ตราด — 4 ห้องนอน\n3. พุทธมณฑล — 3 ห้องนอน\nสนใจทำเลไหนเป็นพิเศษครับ?",
      "ขอนัดดูห้องตัวอย่าง": "ยินดีครับ! กรุณาแจ้ง:\n1. โครงการที่สนใจ\n2. วัน-เวลาที่สะดวก\n3. เบอร์โทรติดต่อ\nจะจัดตัวแทนดูแลให้ครับ",
      "สอบถามเรื่องสินเชื่อบ้าน": "สินเชื่อบ้านปัจจุบันครับ:\n- ดอกเบี้ย 3 ปีแรก: 2.99%\n- วงเงินสูงสุด 95% ของราคาประเมิน\n- ผ่อนนาน 30 ปี\nต้องการให้ช่วยคำนวณงวดผ่อนไหมครับ?",
      "มีโครงการใหม่เปิดตัวไหม": "โครงการเปิดใหม่เดือนนี้ครับ:\n1. The Reserve Sathorn — คอนโดหรู เริ่ม 8.9 ล้าน\n2. Centro Chaengwattana — ทาวน์โฮม เริ่ม 3.5 ล้าน\nลงทะเบียนรับสิทธิ์พิเศษ Pre-Sale ได้ครับ",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ทีมตัวแทนอสังหาฯ กำลังตรวจสอบข้อมูลให้ จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "บันทึกลูกค้าสนใจ Create Lead",
      fields: [
        { id: "orderName", label: "ชื่อลูกค้า Customer Name", type: "text", default: "สมศรี มั่นคง" },
        { id: "orderPhone", label: "เบอร์โทร Phone", type: "text", default: "089-876-5432" },
        { id: "orderItems", label: "ความต้องการ Property Interest", type: "text", default: "คอนโด 1 ห้องนอน แถวพระราม 9 งบ 3-4 ล้าน", fullWidth: true },
        { id: "orderAddress", label: "หมายเหตุ Notes", type: "textarea", default: "ต้องการนัดดูห้องตัวอย่างวันเสาร์ ช่วงบ่าย สนใจแบบวิวสวน ชั้นสูง", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับข้อมูล Lead", icon: "1" },
        { id: "processing", label: "นัดดูโครงการ", icon: "2" },
        { id: "shipped", label: "ปิดการขาย", icon: "3" },
      ],
      itemIdPrefix: "LEAD",
    },
    reviewContext: {
      title: "รีวิวตัวแทน Agent Review",
      subtitle: "จำลองรีวิวตัวแทนอสังหาฯ เพื่อทดสอบ AI ตอบรีวิวอัตโนมัติ",
      placeholder: "เขียนรีวิวบริการตัวแทนอสังหาฯ ที่นี่...",
      defaultReview: "ตัวแทนให้บริการดีมาก ช่วยหาห้องที่ตรงใจ อธิบายรายละเอียดชัดเจน",
      mockReplies: {
        5: "ขอบคุณมากครับสำหรับรีวิว 5 ดาว! ยินดีที่ช่วยหาที่พักในฝันได้ หากต้องการคำปรึกษาเพิ่มเติมยินดีเสมอครับ 🏠",
        4: "ขอบคุณสำหรับรีวิวครับ! ดีใจที่บริการเป็นที่พอใจ ทีมงานจะดูแลอย่างต่อเนื่องครับ",
        3: "ขอบคุณสำหรับความคิดเห็นครับ จะนำไปปรับปรุงบริการให้ดียิ่งขึ้นครับ",
        2: "ขออภัยที่บริการยังไม่ถูกใจครับ กรุณาแจ้งรายละเอียดเพิ่มเติม จะรีบปรับปรุงครับ",
        1: "ขออภัยอย่างยิ่งครับ ผู้จัดการสาขาจะติดต่อกลับเพื่อรับฟังปัญหาโดยเร็วที่สุดครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statLeads", value: "42", label: "ลูกค้าสนใจ Leads", change: "+22%", direction: "up" },
        { id: "statViewings", value: "18", label: "นัดชมโครงการ Viewings", change: "+15%", direction: "up" },
        { id: "statListings", value: "156", label: "ประกาศ Listings", change: "+3", direction: "up" },
        { id: "statConversion", value: "8.2%", label: "อัตราปิดขาย Conversion", change: "+1.4%", direction: "up" },
      ],
      charts: [
        { id: "chart1", title: "ลูกค้าสนใจรายวัน Daily Leads", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [28, 35, 31, 42, 38, 52, 45], color: "#059669" },
        { id: "chart2", title: "นัดชมโครงการ Viewings/Day", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [8, 12, 10, 15, 18, 24, 20], color: "#30d158" },
        { id: "chart3", title: "การกระจายคะแนนรีวิว Ratings", type: "hbar", labels: ["5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"], data: [38, 22, 8, 3, 1], colors: ["#30d158", "#34d399", "#fbbf24", "#fb923c", "#ff453a"] },
        { id: "chart4", title: "เวลาตอบกลับ Response Time (นาที)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [12, 8, 15, 7, 5, 10, 6], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Legal ─────────────────────────────────────────────────
  legal: {
    name_th: "สำนักงานกฎหมาย",
    name_en: "Legal",
    accent: "#7c3aed",
    botName: "Legal Bot",
    botAvatar: "⚖️",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่สำนักงานกฎหมาย ปรึกษาเรื่องกฎหมายได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "รับคดี Cases", icon: "📋", component: "order" },
      { id: "review", label: "ความพึงพอใจ Feedback", icon: "📝", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "รบกวนสอบถามเรื่องสัญญาเช่า",
      "ต้องการปรึกษาเรื่องหย่า",
      "มีปัญหาเรื่องลิขสิทธิ์",
      "ขอทำพินัยกรรม",
      "ถูกฟ้อง ต้องทำอย่างไร",
    ],
    mockReplies: {
      "รบกวนสอบถามเรื่องสัญญาเช่า": "ยินดีครับ! เรื่องสัญญาเช่าสามารถสอบถามได้เลยครับ เช่น:\n- ระยะเวลาสัญญา\n- ค่าเช่าและเงินประกัน\n- เงื่อนไขการต่อสัญญา\n- สิทธิ์ผู้เช่า/ผู้ให้เช่า\nมีคำถามเฉพาะเจาะจงไหมครับ?",
      "ต้องการปรึกษาเรื่องหย่า": "รับทราบครับ เรื่องการหย่ามี 2 แบบ:\n1. หย่าโดยความยินยอม — ทำที่อำเภอ\n2. หย่าโดยคำสั่งศาล — ยื่นฟ้อง\nต้องการนัดปรึกษาทนายเพื่อวิเคราะห์กรณีของท่านไหมครับ?",
      "มีปัญหาเรื่องลิขสิทธิ์": "รับทราบครับ เรื่องลิขสิทธิ์ ช่วยแจ้งรายละเอียดเพิ่มเติม:\n1. ท่านเป็นเจ้าของลิขสิทธิ์ที่ถูกละเมิด?\n2. หรือถูกกล่าวหาว่าละเมิด?\n3. ลิขสิทธิ์ประเภทใด? (งานเขียน, ซอฟต์แวร์, ดนตรี ฯลฯ)\nจะได้วิเคราะห์แนวทางที่เหมาะสมครับ",
      "ขอทำพินัยกรรม": "ยินดีครับ! การทำพินัยกรรมมีหลายรูปแบบ:\n1. พินัยกรรมแบบธรรมดา — เขียนเอง\n2. พินัยกรรมแบบเอกสารฝ่ายเมือง — จดที่อำเภอ\n3. พินัยกรรมแบบลับ — ส่งให้อำเภอเก็บรักษา\nต้องการนัดพบทนายเพื่อจัดทำไหมครับ?",
      "ถูกฟ้อง ต้องทำอย่างไร": "กรุณาอย่าตกใจครับ ขั้นตอนเบื้องต้น:\n1. ตรวจสอบหมายศาลให้ชัดเจน\n2. จดวันนัดพิจารณา\n3. เตรียมเอกสารที่เกี่ยวข้อง\n4. นัดปรึกษาทนายโดยเร็ว\nต้องการนัดปรึกษาเร่งด่วนไหมครับ?",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ทีมทนายกำลังตรวจสอบรายละเอียด จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "บันทึกรับคดี Case Intake",
      fields: [
        { id: "orderName", label: "ชื่อลูกความ Client Name", type: "text", default: "วิชัย สุจริต" },
        { id: "orderPhone", label: "เบอร์โทร Phone", type: "text", default: "082-345-6789" },
        { id: "orderItems", label: "ประเภทคดี Case Type", type: "text", default: "สัญญาเช่า — ผู้เช่าไม่จ่ายค่าเช่า 3 เดือน", fullWidth: true },
        { id: "orderAddress", label: "รายละเอียดคดี Case Details", type: "textarea", default: "ผู้เช่าค้างชำระค่าเช่า 3 เดือน รวม 45,000 บาท สัญญาระบุค่าปรับล่าช้า ต้องการทวงถามและดำเนินคดีหากจำเป็น", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับคดี", icon: "1" },
        { id: "processing", label: "วิเคราะห์", icon: "2" },
        { id: "shipped", label: "ดำเนินการ", icon: "3" },
      ],
      itemIdPrefix: "CASE",
    },
    reviewContext: {
      title: "ความพึงพอใจลูกความ Client Feedback",
      subtitle: "จำลองฟีดแบ็คจากลูกความเพื่อทดสอบ AI ตอบกลับอัตโนมัติ",
      placeholder: "เขียนความคิดเห็นเกี่ยวกับบริการทนายที่นี่...",
      defaultReview: "ทนายให้คำปรึกษาดีมาก อธิบายกฎหมายให้เข้าใจง่าย ดำเนินคดีรวดเร็ว",
      mockReplies: {
        5: "ขอบคุณมากครับสำหรับความไว้วางใจ! ทีมทนายยินดีที่ได้ช่วยเหลือ หากมีเรื่องกฎหมายเพิ่มเติมยินดีเสมอครับ ⚖️",
        4: "ขอบคุณสำหรับฟีดแบ็คครับ! ดีใจที่บริการเป็นที่พอใจ เราจะพัฒนาต่อเนื่องครับ",
        3: "ขอบคุณสำหรับความคิดเห็นครับ จะนำไปปรับปรุงบริการให้ดียิ่งขึ้นครับ",
        2: "ขออภัยที่บริการยังไม่ถูกใจครับ หัวหน้าทนายจะติดต่อเพื่อรับฟังปัญหาครับ",
        1: "ขออภัยอย่างยิ่งครับ หุ้นส่วนผู้จัดการจะติดต่อกลับเพื่อแก้ไขปัญหาทันทีครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statCases", value: "23", label: "คดีเดือนนี้ Cases", change: "+4", direction: "up" },
        { id: "statConsultations", value: "67", label: "การปรึกษา Consultations", change: "+18%", direction: "up" },
        { id: "statDocuments", value: "145", label: "เอกสาร Documents", change: "+12", direction: "up" },
        { id: "statResponseTime", value: "2.4 ชม.", label: "เวลาตอบกลับ Avg Response", change: "-15%", direction: "down" },
      ],
      charts: [
        { id: "chart1", title: "คดีต่อสัปดาห์ Cases/Week", type: "bar", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"], data: [5, 8, 6, 9, 7, 11, 8], color: "#7c3aed" },
        { id: "chart2", title: "การปรึกษารายวัน Consultations/Day", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [8, 12, 15, 11, 9, 6, 2], color: "#30d158" },
        { id: "chart3", title: "ประเภทคดี Case Types", type: "hbar", labels: ["สัญญา", "อาญา", "แรงงาน", "ทรัพย์สิน", "ครอบครัว"], data: [35, 18, 15, 12, 8], colors: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"] },
        { id: "chart4", title: "เวลาตอบกลับ Response Time (ชม.)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [2.1, 1.8, 2.4, 1.5, 3.2, 4.5, 6.0], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Healthcare ────────────────────────────────────────────
  healthcare: {
    name_th: "คลินิก/โรงพยาบาล",
    name_en: "Healthcare",
    accent: "#0891b2",
    botName: "Health Bot",
    botAvatar: "🏥",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่คลินิกของเรา นัดหมอหรือสอบถามอาการได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "นัดหมาย Appointments", icon: "📅", component: "order" },
      { id: "review", label: "รีวิวคลินิก Reviews", icon: "⭐", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "อยากจองคิวหมอวันศุกร์",
      "มีอาการปวดหัวเรื้อรัง",
      "ขอนัดตรวจสุขภาพประจำปี",
      "สอบถามค่ารักษา",
      "ขอใบรับรองแพทย์",
    ],
    mockReplies: {
      "อยากจองคิวหมอวันศุกร์": "รับทราบครับ ขอสอบถามเพิ่มเติม:\n- ต้องการพบแพทย์แผนกไหนครับ?\n- ช่วงเวลาที่สะดวก เช้าหรือบ่ายครับ?\nวันศุกร์นี้ยังมีคิวว่างอยู่ครับ",
      "มีอาการปวดหัวเรื้อรัง": "รับทราบครับ ขอสอบถามเพิ่มเติม:\n1. ปวดมานานแค่ไหนครับ?\n2. ปวดบริเวณไหน ข้างเดียวหรือสองข้าง?\n3. มีอาการอื่นร่วมด้วยไหม เช่น คลื่นไส้ ตาพร่ามัว?\nแนะนำพบแพทย์แผนกอายุรกรรมครับ",
      "ขอนัดตรวจสุขภาพประจำปี": "มีแพ็คเกจตรวจสุขภาพครับ:\n1. Basic Check — 1,990 บาท\n2. Premium Check — 4,990 บาท\n3. Executive Check — 9,990 บาท\nต้องการรายละเอียดแพ็คเกจไหนครับ?",
      "สอบถามค่ารักษา": "ยินดีตอบครับ กรุณาแจ้ง:\n1. อาการ/โรคที่ต้องการรักษา\n2. แผนกที่ต้องการ\nจะประเมินค่าใช้จ่ายเบื้องต้นให้ครับ\n(ค่าตรวจเริ่มต้น 300-500 บาท)",
      "ขอใบรับรองแพทย์": "สามารถออกใบรับรองแพทย์ได้ครับ:\n- ค่าบริการ 200 บาท\n- ใช้เวลาประมาณ 30 นาที\n- ต้องพบแพทย์ตรวจร่างกายเบื้องต้น\nต้องการนัดวันไหนครับ?",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ทีมแพทย์กำลังตรวจสอบ จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "นัดหมายแพทย์ Create Appointment",
      fields: [
        { id: "orderName", label: "ชื่อผู้ป่วย Patient Name", type: "text", default: "สมหญิง สุขใจ" },
        { id: "orderPhone", label: "เบอร์โทร Phone", type: "text", default: "083-456-7890" },
        { id: "orderItems", label: "แผนก/อาการ Department/Symptoms", type: "text", default: "อายุรกรรม — ปวดหัวเรื้อรัง, เวียนศีรษะ", fullWidth: true },
        { id: "orderAddress", label: "หมายเหตุ Notes", type: "textarea", default: "ต้องการนัดวันศุกร์ ช่วงบ่าย มีประวัติแพ้ยา Aspirin", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับนัด", icon: "1" },
        { id: "processing", label: "รอตรวจ", icon: "2" },
        { id: "shipped", label: "ตรวจเสร็จ", icon: "3" },
      ],
      itemIdPrefix: "APT",
    },
    reviewContext: {
      title: "รีวิวคลินิก Clinic Review",
      subtitle: "จำลองรีวิวคลินิกเพื่อทดสอบ AI ตอบรีวิวอัตโนมัติ",
      placeholder: "เขียนรีวิวคลินิก/หมอที่นี่...",
      defaultReview: "หมอใจดีมาก อธิบายอาการชัดเจน คลินิกสะอาด ไม่ต้องรอนาน",
      mockReplies: {
        5: "ขอบคุณมากครับสำหรับรีวิว 5 ดาว! ทีมแพทย์และเจ้าหน้าที่ดีใจมาก หวังว่าจะได้ดูแลสุขภาพท่านต่อไปครับ 🏥",
        4: "ขอบคุณสำหรับรีวิวครับ! ดีใจที่บริการเป็นที่พอใจ เราจะพัฒนาให้ดียิ่งขึ้นครับ",
        3: "ขอบคุณสำหรับความคิดเห็นครับ จะนำไปปรับปรุงบริการให้ดียิ่งขึ้นครับ",
        2: "ขออภัยที่บริการยังไม่ถูกใจครับ กรุณาแจ้งปัญหา จะรีบปรับปรุงครับ",
        1: "ขออภัยอย่างยิ่งครับ ผู้อำนวยการคลินิกจะติดต่อกลับเพื่อรับฟังปัญหาทันทีครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statPatients", value: "89", label: "ผู้ป่วยวันนี้ Patients", change: "+7%", direction: "up" },
        { id: "statAppointments", value: "64", label: "นัดหมายวันนี้ Appointments", change: "+12%", direction: "up" },
        { id: "statWaitTime", value: "18 นาที", label: "เวลารอเฉลี่ย Wait Time", change: "-22%", direction: "down" },
        { id: "statSatisfaction", value: "4.7", label: "ความพึงพอใจ Satisfaction", change: "+0.3", direction: "up" },
      ],
      charts: [
        { id: "chart1", title: "ผู้ป่วยรายวัน Daily Patients", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [72, 85, 68, 92, 89, 45, 20], color: "#0891b2" },
        { id: "chart2", title: "นัดหมายรายวัน Appointments/Day", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [48, 62, 55, 71, 64, 35, 12], color: "#30d158" },
        { id: "chart3", title: "การกระจายคะแนนรีวิว Ratings", type: "hbar", labels: ["5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"], data: [55, 25, 10, 3, 1], colors: ["#30d158", "#34d399", "#fbbf24", "#fb923c", "#ff453a"] },
        { id: "chart4", title: "เวลารอเฉลี่ย Avg Wait Time (นาที)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [22, 18, 25, 15, 12, 10, 8], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Creator ───────────────────────────────────────────────
  creator: {
    name_th: "ครีเอเตอร์/อินฟลูเอนเซอร์",
    name_en: "Creator",
    accent: "#db2777",
    botName: "Creator Bot",
    botAvatar: "🎬",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่ระบบจัดการคอนเทนต์ สอบถามเรื่องคอนเทนต์ได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "คิวคอนเทนต์ Content Queue", icon: "🎯", component: "order" },
      { id: "review", label: "Engagement", icon: "📈", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "ต้องการวิดีโอรีวิวสินค้า",
      "ขอ Caption สำหรับ IG",
      "วางแผนคอนเทนต์เดือนหน้า",
      "เช็คยอด Engagement ล่าสุด",
      "ต้องการ Thumbnail สวยๆ",
    ],
    mockReplies: {
      "ต้องการวิดีโอรีวิวสินค้า": "รับทราบครับ! กรุณาแจ้งรายละเอียด:\n1. สินค้าอะไร?\n2. ความยาวที่ต้องการ? (Short/Long)\n3. แพลตฟอร์ม? (TikTok/YouTube/IG)\n4. Tone? (สนุก/Professional/Aesthetic)\nจะจัดคิวให้ครับ",
      "ขอ Caption สำหรับ IG": "ได้ครับ! กรุณาแจ้ง:\n1. คอนเทนต์เกี่ยวกับอะไร?\n2. Mood? (Casual/Professional/Fun)\n3. ต้องการ Hashtag ด้วยไหม?\nAI จะสร้าง Caption ให้ 3 แบบเลือกครับ",
      "วางแผนคอนเทนต์เดือนหน้า": "เยี่ยมครับ! Content Calendar เดือนหน้า:\n- สัปดาห์ 1: Behind the scenes\n- สัปดาห์ 2: Tutorial/How-to\n- สัปดาห์ 3: Collaboration\n- สัปดาห์ 4: Q&A/Engagement\nต้องการปรับแก้ตรงไหนครับ?",
      "เช็คยอด Engagement ล่าสุด": "Engagement สัปดาห์นี้ครับ:\n- Reach: 125K (+18%)\n- Likes: 8.2K (+12%)\n- Comments: 342 (+25%)\n- Shares: 89 (+45%)\n- Engagement Rate: 6.8%\nเทียบกับสัปดาห์ก่อน ดีขึ้นมากครับ!",
      "ต้องการ Thumbnail สวยๆ": "รับทราบครับ! สำหรับ Thumbnail กรุณาแจ้ง:\n1. หัวข้อวิดีโอ?\n2. สไตล์? (Minimalist/Bold/Colorful)\n3. ต้องการใส่หน้า Creator ไหม?\n4. ข้อความหลักบน Thumbnail?\nจะออกแบบให้ 3 แบบเลือกครับ",
    },
    defaultReply: "ขอบคุณสำหรับข้อความครับ! ระบบ AI กำลังประมวลผล จะตอบกลับโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "สร้างคิวคอนเทนต์ Create Content",
      fields: [
        { id: "orderName", label: "ชื่อแบรนด์/ลูกค้า Brand/Client", type: "text", default: "Beauty Brand X" },
        { id: "orderPhone", label: "ติดต่อ Contact", type: "text", default: "line: @beautybrandx" },
        { id: "orderItems", label: "ประเภทคอนเทนต์ Content Type", type: "text", default: "วิดีโอรีวิว TikTok 60 วินาที + IG Story 3 เฟรม", fullWidth: true },
        { id: "orderAddress", label: "Brief/รายละเอียด Details", type: "textarea", default: "รีวิวเซรั่มหน้าใส ใช้ 7 วัน เห็นผลจริง Tone สนุก/เป็นกันเอง ใส่ CTA ให้กดลิงก์ใน Bio", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "รับ Brief", icon: "1" },
        { id: "processing", label: "ถ่ายทำ/ตัดต่อ", icon: "2" },
        { id: "shipped", label: "เผยแพร่", icon: "3" },
      ],
      itemIdPrefix: "CTN",
    },
    reviewContext: {
      title: "Engagement Metrics",
      subtitle: "จำลองข้อมูล Engagement เพื่อทดสอบ AI วิเคราะห์อัตโนมัติ",
      placeholder: "เขียน Comment จากผู้ติดตามที่นี่...",
      defaultReview: "คอนเทนต์ดีมากค่ะ ได้ความรู้ สนุก ติดตามทุกคลิปเลย!",
      mockReplies: {
        5: "ขอบคุณมากค่ะ! ดีใจที่คอนเทนต์เป็นประโยชน์ จะทำให้ดียิ่งๆ ขึ้นไปเรื่อยๆ นะคะ 🎬✨",
        4: "ขอบคุณค่ะ! จะพยายามทำคอนเทนต์ให้สนุกและมีประโยชน์ยิ่งขึ้นค่ะ",
        3: "ขอบคุณสำหรับ Feedback ค่ะ! จะนำไปปรับปรุงคอนเทนต์ต่อไปค่ะ",
        2: "ขอบคุณที่แจ้งค่ะ จะปรับปรุงให้ดีขึ้นค่ะ มีอะไรอยากให้ทำ Comment มาได้เลยนะคะ",
        1: "ขอโทษค่ะ จะรับฟังและปรับปรุงคอนเทนต์ให้ตรงใจผู้ติดตามมากขึ้นค่ะ",
      },
    },
    analytics: {
      stats: [
        { id: "statPosts", value: "12", label: "โพสต์สัปดาห์นี้ Posts", change: "+4", direction: "up" },
        { id: "statEngagement", value: "6.8%", label: "Engagement Rate", change: "+1.2%", direction: "up" },
        { id: "statFollowers", value: "125K", label: "ผู้ติดตาม Followers", change: "+2.3K", direction: "up" },
        { id: "statReach", value: "458K", label: "การเข้าถึง Reach", change: "+28%", direction: "up" },
      ],
      charts: [
        { id: "chart1", title: "Engagement รายวัน Daily Engagement", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [2800, 4200, 3500, 5100, 4800, 7200, 6100], color: "#db2777" },
        { id: "chart2", title: "ผู้ติดตามใหม่ New Followers/Day", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [180, 250, 320, 280, 410, 520, 380], color: "#30d158" },
        { id: "chart3", title: "ประเภทคอนเทนต์ยอดนิยม Top Content", type: "hbar", labels: ["Video", "Reel/Short", "Story", "Post", "Live"], data: [42, 38, 28, 18, 8], colors: ["#db2777", "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8"] },
        { id: "chart4", title: "Reach รายวัน Daily Reach (K)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [45, 62, 55, 78, 72, 98, 85], color: "#8b5cf6" },
      ],
    },
  },

  // ─── Home AI (Smart Home / IoT) ────────────────────────────
  "home-ai": {
    name_th: "บ้านอัจฉริยะ",
    name_en: "Home AI",
    accent: "#0284c7",
    botName: "Home Bot",
    botAvatar: "🏡",
    welcomeMessage: "สวัสดีครับ! ยินดีต้อนรับสู่ระบบบ้านอัจฉริยะ สั่งงานอุปกรณ์ได้เลยครับ",
    tabs: [
      { id: "line", label: "LINE Chat", icon: "💬", component: "line" },
      { id: "order", label: "อุปกรณ์ Devices", icon: "📡", component: "order" },
      { id: "review", label: "บันทึก Logs", icon: "📋", component: "review" },
      { id: "analytics", label: "วิเคราะห์ Analytics", icon: "📊", component: "analytics" },
      { id: "sheet", label: "ฐานข้อมูล Database", icon: "📋", component: "sheet" },
    ],
    quickMessages: [
      "เปิดไฟห้องนั่งเล่น",
      "ตั้งแอร์ 25 องศา",
      "เช็คสถานะอุปกรณ์ทั้งหมด",
      "ตั้งเวลาปิดไฟ 4 ทุ่ม",
      "เปิดโหมดออกจากบ้าน",
    ],
    mockReplies: {
      "เปิดไฟห้องนั่งเล่น": "เปิดไฟห้องนั่งเล่นเรียบร้อยครับ!\n- สถานะ: ON\n- ความสว่าง: 80%\n- สี: Warm White (3000K)\nต้องการปรับความสว่างไหมครับ?",
      "ตั้งแอร์ 25 องศา": "ตั้งแอร์เรียบร้อยครับ!\n- อุณหภูมิ: 25 °C\n- โหมด: Cool\n- ความเร็วพัดลม: Auto\n- อุณหภูมิห้องปัจจุบัน: 28.5 °C\nจะเย็นถึง 25 °C ในอีกประมาณ 10 นาทีครับ",
      "เช็คสถานะอุปกรณ์ทั้งหมด": "สถานะอุปกรณ์ทั้งหมดครับ:\n- ไฟห้องนั่งเล่น: ON (80%)\n- แอร์ห้องนอน: OFF\n- กล้อง CCTV หน้าบ้าน: ONLINE\n- ประตูรั้ว: LOCKED\n- เครื่องซักผ้า: IDLE\nทุกอุปกรณ์ปกติครับ",
      "ตั้งเวลาปิดไฟ 4 ทุ่ม": "ตั้งเวลาปิดไฟเรียบร้อยครับ!\n- อุปกรณ์: ไฟทั้งหมด\n- เวลาปิด: 22:00 น.\n- ทำซ้ำ: ทุกวัน\nต้องการยกเว้นไฟดวงไหนไหมครับ?",
      "เปิดโหมดออกจากบ้าน": "เปิดโหมดออกจากบ้านเรียบร้อยครับ!\n- ปิดไฟทั้งหมด\n- ปิดแอร์ทั้งหมด\n- เปิดกล้อง CCTV ทุกตัว\n- ล็อคประตูทั้งหมด\n- เปิดเซ็นเซอร์ตรวจจับความเคลื่อนไหว\nบ้านปลอดภัยครับ!",
    },
    defaultReply: "ขอบคุณสำหรับคำสั่งครับ! ระบบ AI กำลังประมวลผล จะดำเนินการโดยเร็วที่สุดครับ\n\n(Demo mock reply — เชื่อมต่อ n8n เพื่อใช้ AI จริง)",
    orderForm: {
      title: "เพิ่มอุปกรณ์ Add Device",
      fields: [
        { id: "orderName", label: "ชื่ออุปกรณ์ Device Name", type: "text", default: "Smart Light - ห้องนั่งเล่น" },
        { id: "orderPhone", label: "ประเภท Type", type: "text", default: "Lighting / Zigbee" },
        { id: "orderItems", label: "โซน/ห้อง Zone/Room", type: "text", default: "ชั้น 1 — ห้องนั่งเล่น", fullWidth: true },
        { id: "orderAddress", label: "Automation Rules", type: "textarea", default: "เปิดอัตโนมัติเมื่อ:\n- เวลา 18:00 น.\n- เซ็นเซอร์ตรวจจับคนในห้อง\nปิดอัตโนมัติเมื่อ:\n- เวลา 23:00 น.\n- ไม่มีคนในห้อง 30 นาที", fullWidth: true },
      ],
      timeline: [
        { id: "received", label: "ลงทะเบียน", icon: "1" },
        { id: "processing", label: "ตั้งค่า", icon: "2" },
        { id: "shipped", label: "ออนไลน์", icon: "3" },
      ],
      itemIdPrefix: "DEV",
    },
    reviewContext: {
      title: "บันทึกระบบ Automation Logs",
      subtitle: "จำลองบันทึก Automation เพื่อทดสอบระบบ AI วิเคราะห์อัตโนมัติ",
      placeholder: "เขียนบันทึก/หมายเหตุที่นี่...",
      defaultReview: "ระบบทำงานเสถียร ไฟเปิด/ปิดอัตโนมัติตามเวลา แอร์ปรับอุณหภูมิตามอากาศ",
      mockReplies: {
        5: "ระบบทำงานสมบูรณ์ครับ! ประสิทธิภาพสัปดาห์นี้: ลดการใช้พลังงาน 18%, อุปกรณ์ทั้งหมดออนไลน์ 99.8% uptime 🏡",
        4: "ระบบทำงานดีครับ! มีข้อเสนอแนะ: ปรับ Schedule ไฟห้องนอนให้ Dim ลง 50% หลัง 22:00 จะประหยัดพลังงานเพิ่ม 5%",
        3: "บันทึกรับทราบครับ พบว่ามีอุปกรณ์ 2 ตัว Offline เป็นระยะ กำลัง Monitor อยู่ครับ",
        2: "รับทราบปัญหาครับ จะตรวจสอบและปรับแก้ระบบ Automation โดยเร็วครับ",
        1: "แจ้งเตือน! พบปัญหาร้ายแรง ระบบจะ Fallback เป็น Manual Mode จนกว่าจะแก้ไขเสร็จครับ",
      },
    },
    analytics: {
      stats: [
        { id: "statAutomations", value: "342", label: "Automations วันนี้", change: "+5%", direction: "up" },
        { id: "statEnergy", value: "-18%", label: "ประหยัดพลังงาน Energy Saved", change: "+3%", direction: "up" },
        { id: "statDevices", value: "24", label: "อุปกรณ์ Devices", change: "+2", direction: "up" },
        { id: "statUptime", value: "99.8%", label: "Uptime", change: "+0.2%", direction: "up" },
      ],
      charts: [
        { id: "chart1", title: "Automations รายวัน Daily Automations", type: "bar", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [280, 310, 295, 342, 318, 265, 240], color: "#0284c7" },
        { id: "chart2", title: "การใช้พลังงาน Energy Usage (kWh)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [28, 25, 30, 22, 24, 32, 35], color: "#30d158" },
        { id: "chart3", title: "อุปกรณ์ตามประเภท Devices by Type", type: "hbar", labels: ["Lighting", "Climate", "Security", "Appliance", "Sensor"], data: [8, 4, 5, 3, 4], colors: ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"] },
        { id: "chart4", title: "Uptime รายวัน Daily Uptime (%)", type: "line", labels: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], data: [99.9, 99.8, 100, 99.5, 99.9, 99.8, 100], color: "#8b5cf6" },
      ],
    },
  },
};

// ============================================================
// AI System Prompts — per-industry
// ============================================================
// Shared guardrail suffix — appended to ALL system prompts
const GUARDRAIL_SUFFIX = `

กฎสำคัญที่ต้องปฏิบัติตาม:
1. ตอบเฉพาะเรื่องที่เกี่ยวข้องกับธุรกิจเท่านั้น ถ้าลูกค้าถามเรื่องที่ไม่เกี่ยวข้อง ให้ปฏิเสธสุภาพและนำกลับมาที่หัวข้อธุรกิจ
2. ห้ามสร้างข้อมูลเท็จ ถ้าไม่แน่ใจให้บอกว่า "ขอตรวจสอบข้อมูลก่อนนะครับ" หรือ "แนะนำให้ติดต่อทีมงานโดยตรง"
3. ห้ามเปิดเผยว่าคุณเป็น AI หรือ chatbot เว้นแต่ลูกค้าถามตรงๆ
4. ห้ามให้ข้อมูลส่วนตัวของพนักงานหรือลูกค้าคนอื่น
5. ถ้าลูกค้าใช้ภาษาหยาบคาย ให้ตอบสุภาพและเสนอให้ติดต่อพนักงาน
6. ห้ามทำธุรกรรมการเงินหรือให้ข้อมูลบัญชีธนาคาร
7. ตอบกระชับ ไม่เกิน 3-4 ประโยค ยกเว้นต้องอธิบายรายละเอียดสินค้า/บริการ
8. ถ้าลูกค้าต้องการคุยกับพนักงานจริง ให้บอกว่า "รับทราบครับ จะส่งต่อให้ทีมงานติดต่อกลับโดยเร็วครับ"`;

const AI_SYSTEM_PROMPTS = {
  ecommerce: "คุณเป็น AI assistant ของร้านค้าออนไลน์ ช่วยตอบคำถามเกี่ยวกับสินค้า ราคา โปรโมชัน สถานะการสั่งซื้อ และการจัดส่ง ตอบเป็นภาษาไทยสุภาพ กระชับ เป็นมิตร ใช้ครับ/ค่ะ" + GUARDRAIL_SUFFIX,
  restaurant: "คุณเป็น AI assistant ของร้านอาหาร ช่วยรับออเดอร์ แนะนำเมนู จองโต๊ะ แจ้งเวลารอ บอกราคา ตอบเป็นภาษาไทยเป็นกันเอง" + GUARDRAIL_SUFFIX,
  realestate: "คุณเป็น AI assistant ของบริษัทอสังหาริมทรัพย์ ช่วยแนะนำโครงการ นัดชมห้อง ให้ข้อมูลราคาและสิ่งอำนวยความสะดวก ตอบเป็นภาษาไทยมืออาชีพ" + GUARDRAIL_SUFFIX,
  legal: "คุณเป็น AI assistant ของสำนักงานกฎหมาย ช่วยตอบคำถามเบื้องต้นเกี่ยวกับกฎหมาย นัดปรึกษาทนาย ให้ข้อมูลบริการ ตอบเป็นภาษาไทยสุภาพ (ไม่ใช่การให้คำปรึกษาทางกฎหมาย)" + GUARDRAIL_SUFFIX,
  healthcare: "คุณเป็น AI assistant ของคลินิก/โรงพยาบาล ช่วยนัดหมายแพทย์ ให้ข้อมูลเวลาทำการ แผนก ตอบเป็นภาษาไทยอ่อนโยน (ไม่ใช่การวินิจฉัยโรค)" + GUARDRAIL_SUFFIX,
  creator: "คุณเป็น AI assistant ของทีม Content Creator ช่วยวางแผน content, คิด caption, แนะนำ hashtag, brainstorm ไอเดีย ตอบเป็นภาษาไทยสร้างสรรค์" + GUARDRAIL_SUFFIX,
  "home-ai": "คุณเป็น AI assistant สำหรับ Smart Home ช่วยควบคุมอุปกรณ์ ตั้งค่า automation ดูสถานะระบบ ตอบเป็นภาษาไทยกระชับ" + GUARDRAIL_SUFFIX,
  review: "คุณเป็น AI ที่ช่วยตอบรีวิวลูกค้า ตอบเป็นภาษาไทยสุภาพ ขอบคุณลูกค้า ถ้ารีวิวดีให้ชื่นชม ถ้ารีวิวไม่ดีให้ขอโทษและเสนอแก้ไข กระชับ 2-3 ประโยค",
  order_confirm: "คุณเป็น AI ที่ช่วยยืนยันการสั่งซื้อ/นัดหมาย สรุปรายละเอียดให้ลูกค้า ตอบเป็นภาษาไทยสุภาพ กระชับ",
};

// ============================================================
// DEMO_CONFIG — main runtime configuration
// ============================================================
const DEMO_CONFIG = {
  // Industry — overridden by industry-config.js
  industry: "ecommerce",

  // Environment: "demo" (mock) or "production" (real LINE)
  environment: "demo",

  // n8n webhook
  n8n_webhook_url: "http://localhost:7780/webhook/",

  // Webhook paths
  line_webhook_path: "line",
  order_webhook_path: "order-demo",
  review_webhook_path: "review-demo",

  // LINE production settings (saved to localStorage)
  line_channel_secret: "",
  line_channel_access_token: "",

  // Simulated response delay (ms) when using mock
  fallback_delay: 1500,

  // AI Provider (DeepSeek)
  ai: {
    provider: "deepseek",
    api_key: "YOUR_DEEPSEEK_API_KEY",
    endpoint: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    max_tokens: 500,
    temperature: 0.7,
  },
};
