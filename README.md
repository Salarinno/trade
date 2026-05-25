# TradeLog — ژورنال ترید حرفه‌ای

## راه‌اندازی پروژه

### ۱. نصب پکیج‌ها
```bash
npm install
```

### ۲. تنظیم Supabase
1. برو به [supabase.com](https://supabase.com) و یه پروژه جدید بساز
2. از منوی **SQL Editor** فایل `src/lib/supabase/schema.sql` رو اجرا کن
3. از منوی **Project Settings > API** مقدارهای زیر رو کپی کن:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ۳. فایل env
```bash
cp .env.example .env.local
# مقدارهای Supabase رو داخل .env.local بذار
```

### ۴. اجرای پروژه
```bash
npm run dev
# باز کن: http://localhost:3000
```

### ۵. دیپلوی روی Vercel
```bash
# اول نصب Vercel CLI
npm i -g vercel

# دیپلوی
vercel

# متغیرهای محیطی رو توی Vercel Dashboard اضافه کن
```

---

## ساختار پروژه

```
src/
├── app/
│   ├── auth/
│   │   ├── login/          # صفحه ورود
│   │   └── register/       # صفحه ثبت‌نام
│   ├── dashboard/          # داشبورد اصلی
│   ├── trades/
│   │   ├── new/            # ثبت معامله جدید
│   │   └── [id]/           # جزئیات معامله
│   ├── stats/              # آمار پیشرفته
│   ├── psychology/         # روانشناسی ترید
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # کامپوننت‌های پایه
│   ├── dashboard/          # کامپوننت‌های داشبورد
│   ├── trades/             # کامپوننت‌های معاملات
│   └── layout/             # Sidebar, Topbar
├── lib/
│   ├── supabase/           # کلاینت Supabase
│   └── utils.ts            # توابع کمکی
├── hooks/                  # Custom React Hooks
└── types/                  # TypeScript Types
```

---

## تکنولوژی‌ها

| بخش | تکنولوژی |
|-----|----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deploy | Vercel |
