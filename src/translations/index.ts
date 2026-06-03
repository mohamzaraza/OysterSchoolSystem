import type { Lang } from "@/context/LanguageContext";

const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      scholarship: "Scholarship",
      news: "News",
      jobs: "Jobs",
      contact: "Contact Us",
    },
    hero: {
      badge: "Admissions Open 2026",
      heading1: "Shaping Tomorrow's",
      heading2: "Leaders",
      heading3: "Today",
      body: "At Oyster School System, we equip every learner with modern, in-demand skills — nurturing curiosity, creativity, and the resilience to thrive in a changing world.",
      cta1: "Discover Our Story",
      cta2: "Book a Visit",
      stats: [
        { value: "2", label: "Campuses" },
        { value: "K–12", label: "Education" },
        { value: "PWD", label: "Islamabad" },
      ],
    },
    director: {
      quote:
        "Our vision is to equip every learner with modern, in-demand skills for a volatile job market. We ensure they are not merely fit for a changing world, but thrive in it — turning challenges into opportunities.",
      role: "School Director",
      school: "Oyster School System",
      cards: [
        { icon: "🎯", title: "Our Mission", desc: "Delivering purposeful education that builds real-world skills and confidence in every student." },
        { icon: "🌱", title: "Our Values", desc: "Curiosity, creativity, integrity, and resilience are at the core of everything we do." },
        { icon: "🏆", title: "Excellence", desc: "We uphold the highest academic standards while nurturing each child's unique potential." },
        { icon: "🤝", title: "Community", desc: "A supportive environment where students, parents, and teachers grow together." },
      ],
    },
    philosophy: {
      eyebrow: "How We Teach",
      title: "Our Learning Philosophy",
      subtitle: "Five pillars that define the Oyster way of education",
      pillars: [
        { title: "Learning Through Play", subtitle: "Purposeful Doing", desc: "We believe children learn best when they are engaged and having fun. Play is not a break from education — it is education." },
        { title: "Wonder & Discovery", subtitle: "Science Experiments", desc: "Hands-on science experiments spark a love for inquiry and critical thinking, building the scientists and innovators of tomorrow." },
        { title: "Nurturing Curiosity", subtitle: "Inspiring Creativity", desc: "Every child is a natural artist and thinker. We provide the space and encouragement to explore, create, and express freely." },
        { title: "Environment First", subtitle: "A Core Value", desc: "Environmental stewardship is woven into our curriculum — teaching children to respect and protect the world around them." },
        { title: "Tailored Education", subtitle: "Every Interest Matters", desc: "We recognize that each child is unique. Our approach adapts to individual learning styles, paces, and passions." },
      ],
    },
    updates: {
      latestEyebrow: "Latest",
      latestTitle: "School Updates",
      viewAll: "View All",
      upcomingEyebrow: "Upcoming",
      upcomingTitle: "Announcements",
      admissionsTitle: "Admissions 2026",
      admissionsBody: "Secure your child's place at Oyster School System today.",
      applyNow: "Apply Now",
      updates: [],
      announcements: [
        { title: "Annual Sports Day — Registration Open", date: "June 5, 2026", icon: "🏅" },
        { title: "Summer Camp Enrollment Now Live", date: "June 15, 2026", icon: "⛺" },
        { title: "Parent-Teacher Meeting Schedule", date: "May 28, 2026", icon: "🗓️" },
      ],
    },
    management: {
      eyebrow: "Our People",
      title: "School Management",
      subtitle: "Dedicated leaders committed to excellence in education",
      school: "Oyster School System",
      team: ["Director", "Principal", "Administrator", "Head Teacher"],
    },
    campuses: {
      eyebrow: "Where We Are",
      title: "Our Two Campuses",
      subtitle: "Both located in the PWD area, Islamabad",
      campuses: [
        {
          name: "Early Years Campus",
          subtitle: "Nursery · KG · Primary",
          address: "486 Street 29, Block D, PWD, Islamabad",
          description:
            "Our Early Years campus is a warm, nurturing environment where young learners take their first steps into formal education through play-based and exploratory learning.",
        },
        {
          name: "High School Campus",
          subtitle: "Middle School · Matric · O-Levels",
          address: "395 Street 36, Block C, PWD, Islamabad",
          description:
            "Our High School campus prepares students for the future with rigorous academics, skill-building programs, and a culture of curiosity and excellence.",
        },
      ],
    },
    footer: {
      tagline: "Equipping every learner with modern, in-demand skills to thrive in a changing world.",
      quickLinks: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Education", href: "/education" },
        { label: "Scholarship", href: "/scholarship" },
        { label: "News", href: "/news" },
        { label: "Jobs", href: "/jobs" },
      ],
      campusesTitle: "Our Campuses",
      early: { name: "Early Years Campus", address: "486 Street 29, Block D, PWD" },
      high: { name: "High School Campus", address: "395 Street 36, Block C, PWD" },
      contactTitle: "Get In Touch",
      copyright: "© 2026 Oyster School System. All rights reserved.",
      builtWith: "Built with ❤️ for quality education in Pakistan",
    },
  },

  ur: {
    nav: {
      home: "ہوم",
      about: "ہمارے بارے میں",
      education: "تعلیم",
      scholarship: "وظیفہ",
      news: "خبریں",
      jobs: "ملازمتیں",
      contact: "رابطہ کریں",
    },
    hero: {
      badge: "داخلے کھلے ہیں ۲۰۲۶",
      heading1: "کل کے",
      heading2: "رہنماؤں",
      heading3: "کو آج تیار کرنا",
      body: "آئسٹر اسکول سسٹم میں، ہم ہر طالب علم کو جدید اور ضروری مہارتوں سے آراستہ کرتے ہیں — تجسس، تخلیق اور ہمت کو پروان چڑھاتے ہوئے۔",
      cta1: "ہماری کہانی جانیں",
      cta2: "وزٹ بُک کریں",
      stats: [
        { value: "۲", label: "کیمپس" },
        { value: "K–12", label: "تعلیم" },
        { value: "PWD", label: "اسلام آباد" },
      ],
    },
    director: {
      quote:
        "ہماری وژن یہ ہے کہ ہر طالب علم کو بدلتے ہوئے روزگار بازار کے لیے جدید اور ضروری مہارتوں سے لیس کیا جائے۔ ہم اس بات کو یقینی بناتے ہیں کہ وہ نہ صرف اس دنیا کے لیے موزوں ہوں بلکہ مشکلات کو مواقع میں بدل کر ترقی کریں۔",
      role: "ڈائریکٹر",
      school: "آئسٹر اسکول سسٹم",
      cards: [
        { icon: "🎯", title: "ہمارا مشن", desc: "ہر طالب علم میں حقیقی مہارتیں اور اعتماد پیدا کرنے والی بامقصد تعلیم فراہم کرنا۔" },
        { icon: "🌱", title: "ہماری اقدار", desc: "تجسس، تخلیقیت، دیانتداری اور استقامت ہمارے ہر کام کی بنیاد ہیں۔" },
        { icon: "🏆", title: "عمدگی", desc: "ہم ہر بچے کی منفرد صلاحیت کو نکھارتے ہوئے اعلیٰ تعلیمی معیار برقرار رکھتے ہیں۔" },
        { icon: "🤝", title: "برادری", desc: "ایک ایسا معاون ماحول جہاں طلباء، والدین اور اساتذہ مل کر ترقی کریں۔" },
      ],
    },
    philosophy: {
      eyebrow: "ہم کیسے پڑھاتے ہیں",
      title: "ہمارا تعلیمی فلسفہ",
      subtitle: "پانچ ستون جو آئسٹر کے تعلیمی طریقے کی بنیاد ہیں",
      pillars: [
        { title: "کھیل کے ذریعے سیکھنا", subtitle: "بامقصد عمل", desc: "ہم یقین رکھتے ہیں کہ بچے اس وقت بہترین سیکھتے ہیں جب وہ مشغول اور خوش ہوں۔ کھیل تعلیم سے وقفہ نہیں — یہ خود تعلیم ہے۔" },
        { title: "حیرت اور دریافت", subtitle: "سائنسی تجربات", desc: "ہاتھوں سے سائنسی تجربات تحقیق اور تنقیدی سوچ کی محبت جگاتے ہیں، کل کے سائنسدانوں اور موجدوں کو تیار کرتے ہیں۔" },
        { title: "تجسس کو پروان چڑھانا", subtitle: "تخلیقیت کو ابھارنا", desc: "ہر بچہ ایک فطری فنکار اور مفکر ہے۔ ہم تلاش، تخلیق اور آزادانہ اظہار کے لیے جگہ اور حوصلہ فراہم کرتے ہیں۔" },
        { title: "ماحول پہلے", subtitle: "ایک بنیادی قدر", desc: "ماحولیاتی ذمہ داری ہمارے نصاب کا حصہ ہے — بچوں کو اپنے ارد گرد کی دنیا کا احترام اور تحفظ سکھانا۔" },
        { title: "ذاتی تعلیم", subtitle: "ہر دلچسپی اہم ہے", desc: "ہم جانتے ہیں کہ ہر بچہ منفرد ہے۔ ہمارا طریقہ انفرادی سیکھنے کے انداز، رفتار اور جذبے کے مطابق ڈھلتا ہے۔" },
      ],
    },
    updates: {
      latestEyebrow: "تازہ ترین",
      latestTitle: "اسکول اپڈیٹس",
      viewAll: "سب دیکھیں",
      upcomingEyebrow: "آنے والے",
      upcomingTitle: "اعلانات",
      admissionsTitle: "داخلے ۲۰۲۶",
      admissionsBody: "آج ہی آئسٹر اسکول سسٹم میں اپنے بچے کی جگہ محفوظ کریں۔",
      applyNow: "ابھی درخواست دیں",
      updates: [],
      announcements: [
        { title: "سالانہ کھیلوں کا دن — رجسٹریشن کھلی ہے", date: "۵ جون ۲۰۲۶", icon: "🏅" },
        { title: "سمر کیمپ داخلہ شروع ہو گیا", date: "۱۵ جون ۲۰۲۶", icon: "⛺" },
        { title: "والدین اساتذہ ملاقات کا شیڈول", date: "۲۸ مئی ۲۰۲۶", icon: "🗓️" },
      ],
    },
    management: {
      eyebrow: "ہمارے لوگ",
      title: "اسکول مینجمنٹ",
      subtitle: "تعلیم میں عمدگی کے لیے پرعزم رہنما",
      school: "آئسٹر اسکول سسٹم",
      team: ["ڈائریکٹر", "پرنسپل", "ایڈمنسٹریٹر", "ہیڈ ٹیچر"],
    },
    campuses: {
      eyebrow: "ہم کہاں ہیں",
      title: "ہمارے دو کیمپس",
      subtitle: "دونوں PWD، اسلام آباد میں واقع ہیں",
      campuses: [
        {
          name: "ابتدائی سالوں کا کیمپس",
          subtitle: "نرسری · کے جی · پرائمری",
          address: "۴۸۶ گلی ۲۹، بلاک ڈی، PWD، اسلام آباد",
          description:
            "ہمارا ابتدائی سالوں کا کیمپس ایک گرم، پرورش کرنے والا ماحول ہے جہاں چھوٹے طالب علم کھیل اور تلاش پر مبنی سیکھنے کے ذریعے رسمی تعلیم کے پہلے قدم اٹھاتے ہیں۔",
        },
        {
          name: "ہائی اسکول کیمپس",
          subtitle: "مڈل اسکول · میٹرک · او لیولز",
          address: "۳۹۵ گلی ۳۶، بلاک سی، PWD، اسلام آباد",
          description:
            "ہمارا ہائی اسکول کیمپس طلباء کو مستقبل کے لیے سخت تعلیم، مہارت سازی کے پروگراموں اور تجسس و عمدگی کی ثقافت سے تیار کرتا ہے۔",
        },
      ],
    },
    footer: {
      tagline: "ہر طالب علم کو جدید اور ضروری مہارتوں سے آراستہ کرنا تاکہ وہ بدلتی دنیا میں کامیاب ہوں۔",
      quickLinks: "فوری لنکس",
      links: [
        { label: "ہوم", href: "/" },
        { label: "ہمارے بارے میں", href: "/about" },
        { label: "تعلیم", href: "/education" },
        { label: "وظیفہ", href: "/scholarship" },
        { label: "خبریں", href: "/news" },
        { label: "ملازمتیں", href: "/jobs" },
      ],
      campusesTitle: "ہمارے کیمپس",
      early: { name: "ابتدائی سالوں کا کیمپس", address: "۴۸۶ گلی ۲۹، بلاک ڈی، PWD" },
      high: { name: "ہائی اسکول کیمپس", address: "۳۹۵ گلی ۳۶، بلاک سی، PWD" },
      contactTitle: "رابطہ کریں",
      copyright: "© ۲۰۲۶ آئسٹر اسکول سسٹم۔ جملہ حقوق محفوظ ہیں۔",
      builtWith: "پاکستان میں معیاری تعلیم کے لیے ❤️ کے ساتھ بنایا گیا",
    },
  },
} as const;

export function useT(lang: Lang) {
  return translations[lang];
}
