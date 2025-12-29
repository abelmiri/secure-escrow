export interface ProgressStep {
  title: string
  description: string
  date: string
  time: string
  status?: "completed" | "pending" | "in_progress"
  icon?: "check" | "clock" | "circle"
}

export interface TransactionParty {
  name: string
  email: string
  isVerified: boolean
}

export interface Message {
  id: string
  senderName: string
  date: string
  text: string
  isCurrentUser?: boolean
}

export interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  uploadedBy: string
}

export interface Deal {
  id: string
  title: string
  status: string
  statusType: "processing" | "pending" | "inspection" | "completed"
  role: "خریدار" | "فروشنده" | "کارگزار"
  participant: string
  date: string
  amount: string
  progress: ProgressStep[]
  requiredAction?: {
    text: string
    showAcceptButton?: boolean
    showSupportButton?: boolean
  }
  buyer?: TransactionParty
  seller?: TransactionParty
  serviceFee?: string
  totalAmount?: string
  paymentStatus?: string
  messages?: Message[]
  documents?: Document[]
  details?: {
    category?: string
    description?: string
    location?: string
    deliveryMethod?: string
    inspectionPeriod?: string
    terms?: string
  }
}

export const dealsData: Deal[] = [
  {
    id: "TXN-001",
    title: "دامنه techstartup.com",
    status: "در حال انجام",
    statusType: "processing",
    role: "خریدار",
    participant: "فروشنده: رضا رضایی",
    date: "۱۴۰۳/۰۸/۲۴",
    amount: "25,000",
    serviceFee: "625",
    totalAmount: "25,625",
    requiredAction: {
      text: "در انتظار تکمیل انتقال دامنه توسط فروشنده",
      showAcceptButton: true,
      showSupportButton: true,
    },
    buyer: {
      name: "علی علوی",
      email: "ali.alavi@example.com",
      isVerified: true,
    },
    seller: {
      name: "رضا رضایی",
      email: "reza.rezaei@example.com",
      isVerified: true,
    },
    paymentStatus: "پرداخت در حساب امانی ایمن شده",
    progress: [
      {
        title: "تراکنش ایجاد شد",
        description: "خریدار معامله امانی را آغاز کرد",
        date: "۱۴۰۳/۰۸/۲۴",
        time: "10:30",
        status: "completed",
        icon: "check",
      },
      {
        title: "فروشنده پذیرفت",
        description: "فروشنده با شرایط معامله موافقت کرد",
        date: "۱۴۰۳/۰۸/۲۴",
        time: "11:15",
        status: "completed",
        icon: "check",
      },
      {
        title: "پرداخت دریافت شد",
        description: "پرداخت خریدار تایید و در حساب امانی نگهداری شد",
        date: "۱۴۰۳/۰۸/۲۴",
        time: "14:45",
        status: "completed",
        icon: "check",
      },
      {
        title: "انتقال دامنه آغاز شد",
        description: "فروشنده فرآیند انتقال دامنه را شروع کرد",
        date: "۱۴۰۳/۰۸/۲۵",
        time: "09:00",
        status: "in_progress",
        icon: "clock",
      },
      {
        title: "بازرسی خریدار",
        description: "دوره بازرسی ۳ روزه برای خریدار جهت تایید دامنه",
        date: "",
        time: "",
        status: "pending",
        icon: "circle",
      },
      {
        title: "آزادسازی پرداخت",
        description: "وجوه پس از تایید خریدار به فروشنده انتقال داده میشود",
        date: "",
        time: "",
        status: "pending",
        icon: "circle",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "رضا رضایی",
        date: "۱۴۰۳/۰۸/۲۵",
        text: "کد مجوز انتقال به ایمیل شما ارسال شد. لطفاً بررسی کرده و دریافت را تایید کنید.",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderName: "علی علوی",
        date: "۱۴۰۳/۰۸/۲۵",
        text: "کد مجوز دریافت شد. امروز انتقال را از طرف خود آغاز خواهم کرد.",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderName: "رضا رضایی",
        date: "۱۴۰۳/۰۸/۲۵",
        text: "عالی! اگر سوالی داشتید حتماً اطلاع دهید.",
        isCurrentUser: false,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "قرارداد انتقال دامنه",
        type: "PDF",
        size: "245 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۴",
        uploadedBy: "رضا رضایی",
      },
      {
        id: "doc-2",
        name: "کد مجوز انتقال",
        type: "TXT",
        size: "1 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۵",
        uploadedBy: "رضا رضایی",
      },
      {
        id: "doc-3",
        name: "تاییدیه WHOIS",
        type: "PDF",
        size: "180 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۴",
        uploadedBy: "علی علوی",
      },
    ],
    details: {
      category: "دامنه اینترنتی",
      description: "دامنه پریمیوم techstartup.com با سابقه ۵ ساله و رتبه بالا",
      location: "آنلاین",
      deliveryMethod: "انتقال مستقیم از پنل",
      inspectionPeriod: "۳ روز",
      terms: "دامنه باید بدون مشکل فنی و با تمام دسترسی‌ها تحویل داده شود",
    },
  },
  {
    id: "TXN-002",
    title: "تسلا مدل ۳ سال ۲۰۲۳",
    status: "در انتظار پرداخت",
    statusType: "pending",
    role: "فروشنده",
    participant: "خریدار: مریم رضایی",
    date: "۱۴۰۳/۰۸/۲۳",
    amount: "42,000",
    serviceFee: "1,050",
    totalAmount: "43,050",
    requiredAction: {
      text: "در انتظار واریز وجه توسط خریدار جهت شروع فرآیند معامله",
      showAcceptButton: false,
      showSupportButton: true,
    },
    buyer: {
      name: "مریم رضایی",
      email: "maryam.rezaei@example.com",
      isVerified: true,
    },
    seller: {
      name: "احمد محمدی",
      email: "ahmad.mohammadi@example.com",
      isVerified: true,
    },
    paymentStatus: "در انتظار پرداخت",
    progress: [
      {
        title: "ایجاد معامله",
        description: "معامله توسط فروشنده ایجاد شد",
        date: "۱۴۰۳/۰۸/۲۳",
        time: "۱۱:۰۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "تایید شرایط",
        description: "خریدار شرایط معامله را مشاهده و تایید کرد",
        date: "۱۴۰۳/۰۸/۲۳",
        time: "۱۲:۳۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "پرداخت خریدار",
        description: "در انتظار واریز وجه توسط خریدار",
        date: "",
        time: "",
        status: "pending",
        icon: "circle",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "مریم رضایی",
        date: "۱۴۰۳/۰۸/۲۳",
        text: "سلام، من خریدار هستم. می‌خواستم بپرسم آیا خودرو سند دارد؟",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderName: "احمد محمدی",
        date: "۱۴۰۳/۰۸/۲۳",
        text: "بله، خودرو سند دارد و تمام مدارک کامل است. پس از پرداخت می‌توانید بررسی کنید.",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderName: "مریم رضایی",
        date: "۱۴۰۳/۰۸/۲۳",
        text: "ممنون. امروز پرداخت را انجام می‌دهم.",
        isCurrentUser: false,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "کارت خودرو",
        type: "PDF",
        size: "320 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۳",
        uploadedBy: "احمد محمدی",
      },
      {
        id: "doc-2",
        name: "گواهینامه معاینه فنی",
        type: "PDF",
        size: "150 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۳",
        uploadedBy: "احمد محمدی",
      },
      {
        id: "doc-3",
        name: "عکس‌های خودرو",
        type: "ZIP",
        size: "5.2 MB",
        uploadDate: "۱۴۰۳/۰۸/۲۳",
        uploadedBy: "احمد محمدی",
      },
    ],
    details: {
      category: "خودرو",
      description: "تسلا مدل ۳ سال ۲۰۲۳، رنگ مشکی، ۱۵,۰۰۰ کیلومتر کارکرد",
      location: "تهران",
      deliveryMethod: "تحویل حضوری",
      inspectionPeriod: "۷ روز",
      terms: "خودرو باید بدون مشکل فنی و با تمام لوازم جانبی تحویل داده شود",
    },
  },
  {
    id: "TXN-003",
    title: "وب‌سایت تجارت الکترونیک با موجودی",
    status: "دوره بازرسی",
    statusType: "inspection",
    role: "خریدار",
    participant: "فروشنده: رضا علیزاده",
    date: "۱۴۰۳/۰۸/۲۲",
    amount: "85,000",
    serviceFee: "2,125",
    totalAmount: "87,125",
    requiredAction: {
      text: "کالا/خدمات تحویل شده و در بازه زمانی بازرسی قرار دارد. لطفاً بررسی کنید",
      showAcceptButton: true,
      showSupportButton: true,
    },
    buyer: {
      name: "علی احمدی",
      email: "ali.ahmadi@example.com",
      isVerified: true,
    },
    seller: {
      name: "رضا علیزاده",
      email: "reza.alizadeh@example.com",
      isVerified: true,
    },
    paymentStatus: "پرداخت در حساب امانی ایمن شده",
    progress: [
      {
        title: "پرداخت امن",
        description: "مبلغ معامله در حساب امانی امان یار بلوکه شد",
        date: "۱۴۰۳/۰۸/۲۲",
        time: "۰۸:۴۵",
        status: "completed",
        icon: "check",
      },
      {
        title: "تحویل مستندات",
        description: "دسترسی‌های وب‌سایت توسط فروشنده ارسال شد",
        date: "۱۴۰۳/۰۸/۲۲",
        time: "۱۳:۲۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "شروع بازرسی",
        description: "خریدار در حال بررسی صحت اطلاعات و موجودی است",
        date: "۱۴۰۳/۰۸/۲۲",
        time: "۱۵:۰۰",
        status: "in_progress",
        icon: "clock",
      },
      {
        title: "تایید نهایی",
        description: "پس از تایید خریدار، وجه به فروشنده انتقال داده می‌شود",
        date: "",
        time: "",
        status: "pending",
        icon: "circle",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "رضا علیزاده",
        date: "۱۴۰۳/۰۸/۲۲",
        text: "سلام، دسترسی‌های وب‌سایت و پنل مدیریت را برای شما ارسال کردم.",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderName: "علی احمدی",
        date: "۱۴۰۳/۰۸/۲۲",
        text: "ممنون. در حال بررسی هستم. موجودی انبار را هم می‌خواهم بررسی کنم.",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderName: "رضا علیزاده",
        date: "۱۴۰۳/۰۸/۲۲",
        text: "حتماً. اگر سوالی داشتید بپرسید.",
        isCurrentUser: false,
      },
      {
        id: "4",
        senderName: "علی احمدی",
        date: "۱۴۰۳/۰۸/۲۳",
        text: "بررسی کردم. همه چیز درست است. تا فردا تایید نهایی می‌دهم.",
        isCurrentUser: true,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "دسترسی‌های پنل مدیریت",
        type: "TXT",
        size: "2 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۲",
        uploadedBy: "رضا علیزاده",
      },
      {
        id: "doc-2",
        name: "گزارش موجودی انبار",
        type: "XLSX",
        size: "450 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۲",
        uploadedBy: "رضا علیزاده",
      },
      {
        id: "doc-3",
        name: "کدهای منبع",
        type: "ZIP",
        size: "12.5 MB",
        uploadDate: "۱۴۰۳/۰۸/۲۲",
        uploadedBy: "رضا علیزاده",
      },
      {
        id: "doc-4",
        name: "قرارداد انتقال",
        type: "PDF",
        size: "380 KB",
        uploadDate: "۱۴۰۳/۰۸/۲۲",
        uploadedBy: "علی احمدی",
      },
    ],
    details: {
      category: "وب‌سایت",
      description:
        "وب‌سایت تجارت الکترونیک کامل با موجودی انبار و سیستم مدیریت سفارش",
      location: "آنلاین",
      deliveryMethod: "انتقال دسترسی‌ها",
      inspectionPeriod: "۳ روز",
      terms:
        "تمام دسترسی‌ها و کدهای منبع باید تحویل داده شود و وب‌سایت باید بدون مشکل کار کند",
    },
  },
  {
    id: "TXN-004",
    title: "ساعت رولکس کلاسیک",
    status: "تکمیل شده",
    statusType: "completed",
    role: "فروشنده",
    participant: "خریدار: سارا کریمی",
    date: "۱۴۰۳/۰۸/۲۰",
    amount: "15,000",
    serviceFee: "375",
    totalAmount: "15,375",
    requiredAction: {
      text: "این معامله با موفقیت به پایان رسیده است",
      showAcceptButton: false,
      showSupportButton: false,
    },
    buyer: {
      name: "سارا کریمی",
      email: "sara.karimi@example.com",
      isVerified: true,
    },
    seller: {
      name: "محمد رضایی",
      email: "mohammad.rezaei@example.com",
      isVerified: true,
    },
    paymentStatus: "پرداخت به فروشنده انجام شد",
    progress: [
      {
        title: "پرداخت دریافت شد",
        description: "پرداخت خریدار تایید و در حساب امانی نگهداری شد",
        date: "۱۴۰۳/۰۸/۱۸",
        time: "۰۸:۳۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "ارسال کالا",
        description: "کالا از طریق پست پیشتاز ارسال شد",
        date: "۱۴۰۳/۰۸/۱۸",
        time: "۰۹:۰۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "دریافت کالا",
        description: "خریدار کالا را دریافت و تایید کرد",
        date: "۱۴۰۳/۰۸/۲۰",
        time: "۱۰:۳۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "آزادسازی وجه",
        description: "مبلغ ۱۵,۰۰۰ تومان به حساب فروشنده واریز شد",
        date: "۱۴۰۳/۰۸/۲۰",
        time: "۱۲:۰۰",
        status: "completed",
        icon: "check",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "محمد رضایی",
        date: "۱۴۰۳/۰۸/۱۸",
        text: "سلام، ساعت را بسته‌بندی کردم و امروز از طریق پست پیشتاز ارسال می‌کنم.",
        isCurrentUser: true,
      },
      {
        id: "2",
        senderName: "سارا کریمی",
        date: "۱۴۰۳/۰۸/۱۸",
        text: "ممنون. کد رهگیری را هم ارسال کنید.",
        isCurrentUser: false,
      },
      {
        id: "3",
        senderName: "محمد رضایی",
        date: "۱۴۰۳/۰۸/۱۸",
        text: "کد رهگیری: 1234567890",
        isCurrentUser: true,
      },
      {
        id: "4",
        senderName: "سارا کریمی",
        date: "۱۴۰۳/۰۸/۲۰",
        text: "ساعت را دریافت کردم. کیفیت عالی است. تایید می‌کنم.",
        isCurrentUser: false,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "گواهی اصالت",
        type: "PDF",
        size: "280 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۸",
        uploadedBy: "محمد رضایی",
      },
      {
        id: "doc-2",
        name: "عکس‌های ساعت",
        type: "ZIP",
        size: "3.8 MB",
        uploadDate: "۱۴۰۳/۰۸/۱۸",
        uploadedBy: "محمد رضایی",
      },
      {
        id: "doc-3",
        name: "رسید پست",
        type: "PDF",
        size: "120 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۸",
        uploadedBy: "محمد رضایی",
      },
    ],
    details: {
      category: "کالای فیزیکی",
      description: "ساعت رولکس کلاسیک مدل دیت‌جاست، طلای ۱۸ عیار، سال ۲۰۲۰",
      location: "تهران",
      deliveryMethod: "پست پیشتاز",
      inspectionPeriod: "۷ روز",
      terms: "ساعت باید با تمام لوازم جانبی و گواهی اصالت تحویل داده شود",
    },
  },
  {
    id: "TXN-005",
    title: "پیش‌پرداخت ملک تجاری",
    status: "تکمیل شده",
    statusType: "completed",
    role: "خریدار",
    participant: "فروشنده: حمید حسینی",
    date: "۱۴۰۳/۰۸/۱۸",
    amount: "150,000",
    serviceFee: "3,750",
    totalAmount: "153,750",
    requiredAction: {
      text: "این معامله با موفقیت به پایان رسیده است",
      showAcceptButton: false,
      showSupportButton: false,
    },
    buyer: {
      name: "حسین احمدی",
      email: "hossein.ahmadi@example.com",
      isVerified: true,
    },
    seller: {
      name: "حمید حسینی",
      email: "hamid.hosseini@example.com",
      isVerified: true,
    },
    paymentStatus: "پرداخت به فروشنده انجام شد",
    progress: [
      {
        title: "ثبت قرارداد",
        description: "مبایعه‌نامه در سامانه بارگذاری شد",
        date: "۱۴۰۳/۰۸/۱۵",
        time: "۱۶:۰۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "پرداخت پیش‌پرداخت",
        description: "پیش‌پرداخت در حساب امانی نگهداری شد",
        date: "۱۴۰۳/۰۸/۱۶",
        time: "۱۰:۰۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "تکمیل معامله",
        description: "انتقال سند انجام و معامله با موفقیت پایان یافت",
        date: "۱۴۰۳/۰۸/۱۸",
        time: "۱۱:۴۵",
        status: "completed",
        icon: "check",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "حمید حسینی",
        date: "۱۴۰۳/۰۸/۱۵",
        text: "سلام، مبایعه‌نامه را آماده کردم و در سامانه بارگذاری کردم.",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderName: "حسین احمدی",
        date: "۱۴۰۳/۰۸/۱۵",
        text: "ممنون. در حال بررسی هستم.",
        isCurrentUser: true,
      },
      {
        id: "3",
        senderName: "حسین احمدی",
        date: "۱۴۰۳/۰۸/۱۶",
        text: "مبایعه‌نامه را تایید کردم. پیش‌پرداخت را واریز می‌کنم.",
        isCurrentUser: true,
      },
      {
        id: "4",
        senderName: "حمید حسینی",
        date: "۱۴۰۳/۰۸/۱۸",
        text: "انتقال سند انجام شد. معامله با موفقیت تکمیل شد.",
        isCurrentUser: false,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "مبایعه‌نامه",
        type: "PDF",
        size: "1.2 MB",
        uploadDate: "۱۴۰۳/۰۸/۱۵",
        uploadedBy: "حمید حسینی",
      },
      {
        id: "doc-2",
        name: "سند مالکیت",
        type: "PDF",
        size: "850 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۵",
        uploadedBy: "حمید حسینی",
      },
      {
        id: "doc-3",
        name: "گزارش کارشناسی",
        type: "PDF",
        size: "620 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۶",
        uploadedBy: "حسین احمدی",
      },
      {
        id: "doc-4",
        name: "قبض انتقال سند",
        type: "PDF",
        size: "180 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۸",
        uploadedBy: "حمید حسینی",
      },
    ],
    details: {
      category: "املاک",
      description: "ملک تجاری در منطقه تجاری شهر، مساحت ۲۰۰ متر مربع",
      location: "تهران، میدان ولیعصر",
      deliveryMethod: "انتقال سند رسمی",
      inspectionPeriod: "۱۴ روز",
      terms: "پیش‌پرداخت ۱۵۰,۰۰۰ تومان و مابقی پس از انتقال سند",
    },
  },
  {
    id: "TXN-006",
    title: "خدمات مشاوره فنی",
    status: "در حال انجام",
    statusType: "processing",
    role: "کارگزار",
    participant: "طرفین: شرکت آرمان و توسعه",
    date: "۱۴۰۳/۰۸/۱۷",
    amount: "5,000",
    serviceFee: "125",
    totalAmount: "5,125",
    requiredAction: {
      text: "خدمات در حال انجام است. پس از تکمیل، گزارش نهایی ارسال خواهد شد",
      showAcceptButton: false,
      showSupportButton: true,
    },
    buyer: {
      name: "شرکت آرمان",
      email: "info@arman-co.com",
      isVerified: true,
    },
    seller: {
      name: "شرکت توسعه",
      email: "info@tosee-co.com",
      isVerified: true,
    },
    paymentStatus: "پرداخت در حساب امانی ایمن شده",
    progress: [
      {
        title: "تعیین کارمزد",
        description: "میزان کارمزد کارگزاری توافق شد",
        date: "۱۴۰۳/۰۸/۱۶",
        time: "۱۰:۰۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "پرداخت دریافت شد",
        description: "پرداخت در حساب امانی نگهداری شد",
        date: "۱۴۰۳/۰۸/۱۷",
        time: "۰۸:۳۰",
        status: "completed",
        icon: "check",
      },
      {
        title: "شروع فاز اول",
        description: "مشاوره فنی بخش زیرساخت آغاز شد",
        date: "۱۴۰۳/۰۸/۱۷",
        time: "۰۹:۱۵",
        status: "in_progress",
        icon: "clock",
      },
      {
        title: "تکمیل و تحویل",
        description: "پس از تکمیل خدمات، گزارش نهایی ارسال و وجه آزاد می‌شود",
        date: "",
        time: "",
        status: "pending",
        icon: "circle",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "شرکت توسعه",
        date: "۱۴۰۳/۰۸/۱۶",
        text: "سلام، قرارداد کارگزاری را آماده کردیم. لطفاً بررسی کنید.",
        isCurrentUser: false,
      },
      {
        id: "2",
        senderName: "شرکت آرمان",
        date: "۱۴۰۳/۰۸/۱۶",
        text: "ممنون. بررسی کردیم و تایید کردیم.",
        isCurrentUser: false,
      },
      {
        id: "3",
        senderName: "شرکت توسعه",
        date: "۱۴۰۳/۰۸/۱۷",
        text: "فاز اول مشاوره را شروع کردیم. گزارش اولیه را تا پایان هفته ارسال می‌کنیم.",
        isCurrentUser: false,
      },
      {
        id: "4",
        senderName: "شرکت آرمان",
        date: "۱۴۰۳/۰۸/۱۷",
        text: "عالی، منتظر گزارش هستیم.",
        isCurrentUser: false,
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "قرارداد کارگزاری",
        type: "PDF",
        size: "520 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۶",
        uploadedBy: "شرکت توسعه",
      },
      {
        id: "doc-2",
        name: "برنامه کاری فاز اول",
        type: "PDF",
        size: "380 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۷",
        uploadedBy: "شرکت توسعه",
      },
      {
        id: "doc-3",
        name: "گزارش پیشرفت",
        type: "DOCX",
        size: "250 KB",
        uploadDate: "۱۴۰۳/۰۸/۱۸",
        uploadedBy: "شرکت توسعه",
      },
    ],
    details: {
      category: "خدمات",
      description: "مشاوره فنی برای بهینه‌سازی زیرساخت‌های فناوری اطلاعات شرکت",
      location: "آنلاین و حضوری",
      deliveryMethod: "ارائه گزارش و مشاوره",
      inspectionPeriod: "۱۴ روز",
      terms:
        "خدمات در سه فاز انجام می‌شود و پس از تایید هر فاز، وجه مربوطه آزاد می‌شود",
    },
  },
]
