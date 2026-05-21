# Deploy automat cu GitHub Actions

Workflow: `.github/workflows/deploy-vm.yml` — pornește la **push pe `main`** și prin **Actions → Run workflow**.

## Mașina e doar prin VPN? („no route to host” cu runner GitHub Cloud)

Runner-ii **`ubuntu-latest`** rulează **în infrastructura GitHub**. Nu sunt conectați la VPN-ul tău, deci **nu pot deschide TCP la IP-ul privat / host-ul rezolvat doar din VPN**.

**În cazul tău:** folosește **self-hosted runner** pe VM sau pe altă stație care este mereu în VPN și are Docker + Git.

### Pași scurți — self-hosted (recomandat la VPN-only)

1. GitHub repo → **Settings → Actions → Runners → New self-hosted runner** — urmează pașii pentru **Linux** și descarcă / configurezi runner-ul **direct pe VM** (sau pe mașina care are acces SSH la mediul unde rulează Compose).
2. Pornești runner-ul (ideal ca serviciu, vezi ghid GitHub pentru `svc.sh`).
3. În repo → **Settings → Secrets and variables → Actions → Variables** → creezi **repository variable**:

   **`USE_SELF_HOSTED_DEPLOY`** = **`true`** (exact acest text)

4. Păstrezi în **Secrets**: **`VM_DEPLOY_PATH`** ca **cale absolută** la același checkout folosit pentru deploy (`pwd` în rădacina repoului pe acea mașină).

Atunci workflow-ul ignoră SSH din cloud și rulează comenzile **`docker compose`** local pe acea mașină.

**Secrets SSH** (`VM_HOST`, `VM_USER`, cheia privată etc.) nu mai sunt necesare pentru acest branch al workflow-ului, dar le poți păstra fără probleme dacă vor folosi SSH din cloud altă dată (`USE_SELF_HOSTED_DEPLOY` neechivalent cu `true`).

### Ai SSH public către VM (nu depinzi doar de VPN)

Lasă **`USE_SELF_HOSTED_DEPLOY` ne‑setată** sau **`false`** (sau nu există astfel de variabilă). Atunci workflow-ul folosește job-ul **SSH**. Trebuie port **22** (sau setat explicit) rutabil din internet față de runner-ii GitHub, plus cheie fără parolă pentru CI sau secret **`VM_SSH_KEY_PASSPHRASE`**.

## Ce rulează pe server (în ambele moduri)

1. Intră în `VM_DEPLOY_PATH`.
2. `git pull --ff-only` pentru `origin main`.
3. `docker compose build web` și `docker compose up -d` (migrate la start în container).

Asigură-te că checkout-ul este `git clone` către repo-ul GitHub și `origin` e corect.

## Secrets (workflow SSH din cloud — fără self-hosted variable)

În repo: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Exemplu | Rol |
|--------|---------|-----|
| `VM_HOST` | IP public rezolvabil fără VPN | SSH |
| `VM_USER` | `deploy` | SSH |
| `VM_SSH_PRIVATE_KEY` | cheie privată | SSH |
| `VM_SSH_KEY_PASSPHRASE` | *(opțional)* | Doar dacă cheia privată are parolă; altfel omit |
| `VM_DEPLOY_PATH` | `/home/.../tabere` | În ambele moduri pentru `cd`; la self-hosted și la SSH |

## Self-hosted și `script_stop`

Runner-ul **`appleboy/ssh-action`** nu acceptă `script_stop`; deploy-ul încă se oprește la prima eroare datorită **`set -euo pipefail`** în script.

## Alternative

- **Pull pe VM în cron**: script local pe VM care rulează `git pull && docker compose up -d` pe interval (fără Actions).
- **Environment** în GitHub cu approval înainte de deploy pe producție.
