# Taberele Micilor Ingineri

Site Next.js + PostgreSQL pentru înscrieri, panou admin și rapoarte zilnice.

**Repo:** `PolitehnicaBucuresti/tabere`  
**Producție:** `https://tabere.upb.ro` (prin Traefik pe VM)

---

## Cerințe

| Mediu | Ce trebuie instalat |
|--------|---------------------|
| **Local (dev)** | Node.js 20+, npm, Docker + Docker Compose v2 |
| **VM (prod)** | Docker + Docker Compose v2, Git, rețeaua Traefik (`traefik_default`) |

---

## 1. Instalare locală (prima dată)

```bash
git clone git@github.com:PolitehnicaBucuresti/tabere.git
cd tabere
```

Creează fișierul `.env` în rădăcina proiectului (lângă `docker-compose.yml`):

```env
# Baza de date (parola trebuie să fie aceeași peste tot)
DB_PASSWORD=schimba_parola_local

# Pentru dev cu `npm run dev` + Postgres din Docker:
DATABASE_URL="postgresql://tabere:schimba_parola_local@localhost:5432/tabere?schema=public"

# SMTP (e-mailuri la înscriere + raport zilnic)
SMTP_HOST=relay.upb.ro
SMTP_PORT=25
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
CONTACT_FORM_TO_EMAIL=marketing@upb.ro
INSCRIPTION_MARKETING_REVIEW_EMAIL=marketing@upb.ro

# Admin (obligatoriu în producție)
ADMIN_PASSWORD=parola_puternica_admin
ADMIN_SESSION_SECRET=un_string_random_lung_minim_32_caractere

# Opțional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DISABLE_DAILY_CRON=1
CRON_SECRET=secret_pentru_cron_manual
```

> **Notă:** Nu comite `.env` în Git. Cere colegilor valorile reale de producție separat (parole, SMTP).

---

## 2. Rulare locală

### Varianta A — recomandat: tot stack-ul în Docker

```bash
docker compose up --build -d
```

Sau:

```bash
make prod-start
```

- Site: port mapat de Docker (vezi output la final) sau configurează Traefik local.
- DB: `127.0.0.1:5432`
- Migrările Prisma rulează automat la pornirea containerului `web`.

Oprire:

```bash
docker compose down
# sau
make prod-stop
```

### Varianta B — Next.js pe mașină + doar DB în Docker

```bash
# 1. Pornește doar baza de date
docker compose up -d db

# 2. Instalează dependențele
npm ci

# 3. Aplică migrările
npx prisma migrate deploy

# 4. Pornește dev server
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)

> Dacă ai deja Postgres pe portul 5432, schimbă în `docker-compose.yml` mapping-ul la `127.0.0.1:5433:5432` și folosește portul `5433` în `DATABASE_URL`.

---

## 3. Comenzi utile (local)

| Comandă | Ce face |
|---------|---------|
| `npm ci` | Instalează dependențele (folosește lockfile) |
| `npm run dev` | Server development Next.js |
| `npm run build` | Build de producție (fără Docker) |
| `npm run start` | Pornește build-ul de producție |
| `npm run lint` | ESLint |
| `npx prisma migrate deploy` | Aplică migrări DB |
| `npx prisma studio` | UI pentru baza de date |
| `docker compose logs -f web` | Loguri aplicație |
| `docker compose logs -f db` | Loguri Postgres |
| `docker compose ps` | Status containere |
| `docker compose build web` | Rebuild doar imaginea web |
| `docker compose up -d --build` | Rebuild + repornire |

Makefile scurt:

```bash
make install      # npm ci
make dev-start    # npm run dev
make prod-start   # docker compose up --build -d
make prod-stop    # docker compose down
```

---

## 4. Panou admin

| | |
|--|--|
| **URL** | `/parc-tabere-7qm2x9` |
| **Parolă** | din `.env` → `ADMIN_PASSWORD` (implicit dev: vezi `lib/admin-config.ts`) |

Din panou poți:
- vedea / edita înscrierile
- exporta Excel
- configura destinatari raport zilnic
- trimite manual raportul zilnic

Raport automat: zilnic la **09:00** (Europe/Bucharest). Oprire: `DISABLE_DAILY_CRON=1` în `.env`.

---

## 5. Deploy pe VM (manual)

Conectare SSH la VM, apoi:

```bash
cd /calea/catre/tabere    # același path ca VM_DEPLOY_PATH din GitHub
git fetch origin main
git checkout main
git pull --ff-only origin main
docker compose build web
docker compose up -d --remove-orphans
```

Verificare:

```bash
docker compose ps
docker compose logs -f web --tail 100
```

### Cerințe pe VM

1. **`.env`** există în folderul proiectului (cu parole reale, SMTP, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).
2. Rețeaua Docker **`traefik_default`** există (Traefik rutează `tabere.upb.ro`).
3. `TABERE_HOST=tabere.upb.ro` în `.env` dacă domeniul diferă.

### Deploy automat (GitHub Actions)

La **push pe `main`**, workflow-ul `.github/workflows/deploy-vm.yml` rulează automat.

Detalii complete (self-hosted runner vs SSH): **[docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md)**

Pe scurt:
- **VM doar prin VPN** → runner self-hosted + variabilă `USE_SELF_HOSTED_DEPLOY=true`
- **SSH public** → secrets `VM_HOST`, `VM_USER`, `VM_SSH_PRIVATE_KEY`, `VM_DEPLOY_PATH`

---

## 6. Structură rapidă

```
app/              # pagini Next.js + API routes
lib/              # logică (email, admin, înscrieri, program)
prisma/           # schema + migrări PostgreSQL
public/           # imagini, PDF-uri statice
docker-compose.yml
Dockerfile
```

---

## 7. Probleme frecvente

**Build Docker eșuează**
```bash
docker compose build web --no-cache
docker compose logs web
```

**Eroare la migrări DB**
```bash
docker compose exec web npx prisma migrate deploy
```

**Port 5432 ocupat local**
- Schimbă portul DB în `docker-compose.yml` la `5433` și actualizează `DATABASE_URL`.

**Site nu răspunde pe VM**
```bash
docker compose ps
docker network ls | grep traefik
docker compose logs web --tail 50
```

**Deploy din Actions nu merge**
- Verifică că `VM_DEPLOY_PATH` pointează la **acest** repo (`tabere`), nu alt proiect.
- Pe VM: `pwd && git remote -v && ls` — trebuie să vezi `docker-compose.yml` din tabere.

---

## Contact / acces

- Repo GitHub: cere acces la echipa care administrează `PolitehnicaBucuresti/tabere`
- Parole producție (`.env`, admin, DB): ținute separat, nu în Git
