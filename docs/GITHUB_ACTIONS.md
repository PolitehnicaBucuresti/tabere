# Deploy automat cu GitHub Actions

Workflow-ul **Deploy to VM** (`.github/workflows/deploy-vm.yml`) rulează la **push pe `main`** și poate fi pornit manual din tab-ul **Actions**.

## Ce face pe mașina ta

1. Intră în directorul repo-ului (`VM_DEPLOY_PATH`).
2. Face `git pull --ff-only` de pe `origin main`.
3. Reconstruiește și repornește serviciul **`web`** cu Docker Compose (`migrate deploy` rulează la start în container, vezi `Dockerfile`).

Asigură-te că pe VM:

- Repo-ul este un checkout git cu **remote `origin`** către acest repository GitHub și branch-ul `main` urmărește `origin/main`.
- Există `.env` lângă `docker-compose.yml` (SMTP, `DB_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, secrete admin etc.).
- Utilizatorul SSH are drepturi să ruleze `docker` și `docker compose` în acel folder (ideal membru în grupul `docker` sau rulezi cu același user cu care ai făcut deploy manual).

## Secrets în GitHub

În repo: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Exemplu | Rol |
|--------|---------|-----|
| `VM_HOST` | `203.0.113.50` sau `tabere.upb.ro` | Host SSH |
| `VM_USER` | `deploy` | User SSH |
| `VM_SSH_PRIVATE_KEY` | conținutul cheii **private** PEM/OpenSSH | Autentificare (cheia **publică** trebuie în `authorized_keys` pe VM) |
| `VM_DEPLOY_PATH` | `/home/deploy/tabere` | Cale **absolută** către rădăcina repo-ului pe server |

Nu comita niciodată cheia privată în repo.

### Branch diferit de `main`

Editează `.github/workflows/deploy-vm.yml`: înlocuiește `main` cu branch-ul dorit în `on.push.branches` și în pașii `git`.

### Deploy doar manual

Șterge sau comentează secțiunea `push:` din workflow și folosește doar **Run workflow** din GitHub Actions.

### Alternative

- **Self-hosted runner** pe VM (GitHub „runs-on: self-hosted”) — nu mai ai nevoie de SSH din cloud; runner-ul execută pașii direct pe server.
- **Dispatche-uri sau protecție:** poți restrânge workflow-ul la tag-uri (`on: push: tags:`) sau folosi **environment** cu approval în GitHub pentru producție.
