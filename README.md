This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database & panou admin

- **PostgreSQL** via Docker Compose (`db` service). Set `DB_PASSWORD` in `.env`; `DATABASE_URL` este setat în `docker-compose` pentru serviciul `web`.
- **Migrations:** `npx prisma migrate deploy` (rulează automat în Docker înainte de `npm start`).
- **Panou (URL discret):** `/parc-tabere-7qm2x9` — configurare în `lib/admin-config.ts` (`ADMIN_PATH_SEGMENT`); redenumirea necesită actualizare foldere `app/parc-tabere-7qm2x9` și `middleware.ts` matcher.
- **Parolă implicită** (înlocuiește în producție cu `ADMIN_PASSWORD`): `UpbTabere#adm_k7n2`. `ADMIN_SESSION_SECRET` obligatoriu puternic în producție.
- **Export:** Excel `.xlsx` din lista de înscrieri.
- **Raport zilnic 09:00 (Europe/Bucharest):** destinatari în „Notificări zilnice”; cron în `instrumentation.ts`. Oprire: `DISABLE_DAILY_CRON=1`. Manual (aceeași trimitere ca job-ul zilnic): `POST /api/admin/cron/daily` cu `Authorization: Bearer <CRON_SECRET>` **sau** din panou **Notificări zilnice → „Trimite raportul acum”** (`POST /api/admin/digest/send`, sesiune admin).

Înscrierile publice sunt persistate înainte de e-mailuri (`/api/inscriere`).

## Deploy automat (GitHub Actions)

Vezi [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md): deploy SSH din cloud SAU **runner self-hosted pe VM** (necesar dacă VM-ul e accesibil doar prin VPN).
