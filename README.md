# Корпоративный портал (MVP)

B2B личный кабинет предприятия для аудита и контроля качества.

## Стек

- Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- NextAuth.js (Credentials)
- TanStack Query, React Hook Form, Zod
- xlsx + nodemailer
- Recharts, react-hot-toast

## Быстрый старт

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Демо-учётки (после seed)

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | `admin@ok-uok.local` | `Admin123!` |
| Manager | `manager@ok-uok.local` | `Manager123!` |
| User | `user@ok-uok.local` | `User123!` |

## Бизнес-правила

- Самостоятельная регистрация запрещена
- Сотрудников создаёт только Admin (приглашение + временный пароль)
- Роли: Admin / Manager / User
- Еженедельный отчёт: сохранение → Excel → отправка на email
- В режиме разработки письма логируются в консоль (`EMAIL_DEV_FALLBACK=true`)

## Структура

```text
app/
  (public)/          # /, /login
  (cabinet)/         # /dashboard, /audits, /reports/*, /employees
  api/auth/          # NextAuth route handler
components/          # UI, layout, forms
lib/                 # prisma, auth, excel, mail, validations, actions
prisma/              # schema, migrations, seed
```
