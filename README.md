# AI Studio Thailand — Automation Scaffolds

> **Pre-built AI automation stacks for Thai businesses**
> โครงสร้าง AI Automation พร้อมใช้สำหรับธุรกิจไทย

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is this? / นี่คืออะไร

**AI Automation Scaffolds** คือชุด template พร้อม deploy สำหรับ 7 ประเภทธุรกิจ แต่ละ scaffold ประกอบด้วย:

- **Docker Compose** — one-command deployment ทุก service
- **n8n Workflows** — workflow JSON files พร้อม import (LINE chatbot, alerts, reports)
- **Flowise/Dify Chatflows** — RAG pipelines สำหรับ AI search (ถ้ามี)
- **Environment Templates** — `.env.example` พร้อม placeholders ทุกตัว
- **Sample Data** — CSV / JSON ตัวอย่างสำหรับทดสอบ
- **Reverse Proxy** — Caddy config with auto-SSL
- **Backup Scripts** — automated PostgreSQL + volume backups

**Target:** ติดตั้งระบบ AI ให้ลูกค้าใน 3-6 ชั่วโมง แทนที่จะ build from scratch

---

## Directory Structure / โครงสร้างโปรเจกต์

```
ai-automation-scaffolds/
├── ecommerce/                  # E-commerce (LINE chatbot, orders, stock alerts)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── line-chatbot.json
│   │   ├── order-processing.json
│   │   ├── stock-alert.json
│   │   └── daily-report.json
│   ├── flowise/
│   │   └── product-rag.json
│   ├── data/
│   │   └── products-sample.csv
│   ├── setup-local.sh
│   └── README.md
│
├── restaurant/                 # Restaurant (LINE orders, inventory, reviews)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── line-order-bot.json
│   │   ├── inventory-alert.json
│   │   ├── review-reply.json
│   │   └── daily-sales.json
│   ├── data/
│   │   ├── menu-sample.csv
│   │   └── inventory-sample.csv
│   ├── setup-local.sh
│   └── README.md
│
├── legal/                      # Law firm (contract analysis, PDPA, drafting)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── document-draft.json
│   │   └── pdpa-check.json
│   ├── flowise/
│   │   ├── contract-analysis.json
│   │   └── legal-search.json
│   ├── setup-local.sh
│   └── README.md
│
├── healthcare/                 # Clinic (appointments, reminders, drug info)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── appointment-bot.json
│   │   ├── patient-reminder.json
│   │   └── daily-clinic-report.json
│   ├── flowise/
│   │   └── drug-info-rag.json
│   ├── setup-local.sh
│   └── README.md
│
├── realestate/                 # Real estate (property search, leads, scheduling)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── property-inquiry-bot.json
│   │   ├── appointment-scheduler.json
│   │   └── lead-scoring.json
│   ├── flowise/
│   │   └── listing-rag.json
│   ├── data/
│   │   └── listings-sample.csv
│   ├── setup-local.sh
│   └── README.md
│
├── creator/                    # Content creator (content generation, calendar)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── content-generator.json
│   │   ├── content-calendar.json
│   │   └── engagement-report.json
│   ├── setup-local.sh
│   └── README.md
│
├── home-ai/                    # Personal home AI (briefing, email, Ollama)
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── n8n-workflows/
│   │   ├── morning-briefing.json
│   │   └── email-summary.json
│   ├── setup-local.sh
│   └── README.md
│
├── shared/                     # Shared components (all scaffolds)
│   ├── caddy/
│   │   └── Caddyfile           # Reverse proxy template
│   ├── backup/
│   │   └── backup.sh           # Automated backup script
│   ├── monitoring/
│   │   └── uptime-check.json   # Uptime Kuma config
│   └── tailscale/
│       └── setup.md            # Secure remote access guide
│
├── setup.sh                    # One-command automated setup
├── import-workflows.sh         # Bulk workflow importer
├── quick-start.md              # Step-by-step quick start guide
└── README.md                   # This file
```

---

## Quick Start / เริ่มต้นอย่างรวดเร็ว

### One-Command Setup (ติดตั้งด้วยคำสั่งเดียว)

```bash
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s <industry> <domain> <email>
```

**Examples:**

```bash
# E-commerce store
./setup.sh ecommerce ai.myshop.com admin@myshop.com

# Restaurant
./setup.sh restaurant ai.myrestaurant.com owner@myrestaurant.com

# Law firm
./setup.sh legal ai.mylawfirm.com admin@mylawfirm.com

# Clinic
./setup.sh healthcare ai.myclinic.com admin@myclinic.com

# Real estate
./setup.sh realestate ai.myproperty.com admin@myproperty.com

# Content creator
./setup.sh creator ai.mychannel.com admin@mychannel.com

# Home AI (local deployment, no public domain)
./setup.sh home-ai homelab.local me@gmail.com
```

### What `setup.sh` Does

1. Validates arguments and prerequisites
2. Copies the scaffold to `~/ai-deployments/<industry>-<timestamp>/`
3. Generates `.env` with secure random passwords (encryption keys, DB passwords)
4. Starts Docker containers via `docker compose up -d`
5. Waits for services to be healthy
6. Prints access URLs and next steps

### Manual Setup (5 steps)

```bash
# 1. Clone the repo
git clone https://github.com/ai-studio-thailand/ai-automation-scaffolds.git
cd ai-automation-scaffolds

# 2. Copy scaffold to deployment directory
cp -r ecommerce ~/ai-deployments/my-shop
cd ~/ai-deployments/my-shop

# 3. Create and edit .env
cp .env.example .env
nano .env   # Fill in your values

# 4. Start services
docker compose up -d

# 5. Import workflows into n8n
# Via script:
../../import-workflows.sh http://localhost:5678 ecommerce
# Or via n8n UI: Workflows > Import from File > select JSON files
```

---

## Prerequisites / สิ่งที่ต้องมีก่อน

### Required (ต้องมี)

| Requirement | Version | How to Install |
|-------------|---------|----------------|
| **Docker** | 20.10+ | `curl -fsSL https://get.docker.com \| sh` |
| **Docker Compose** | v2+ | Included with Docker Desktop; Linux: `sudo apt install docker-compose-plugin` |
| **curl** | any | Usually pre-installed; `sudo apt install curl` |
| **openssl** | any | Usually pre-installed; `sudo apt install openssl` |

### Optional (ตามประเภทธุรกิจ)

| Requirement | Used By | Purpose |
|-------------|---------|---------|
| **Domain name** | All (except home-ai) | DNS A records for `n8n.` and `flowise.` subdomains |
| **Ports 80/443 open** | All (except home-ai) | HTTPS via Caddy auto-SSL |
| **LINE Messaging API** | ecommerce, restaurant, healthcare, realestate | LINE chatbot functionality |
| **OpenAI API key** | All | AI model access (GPT, embeddings) |
| **Ollama** | home-ai | Local LLM inference |
| **Google Business API** | restaurant | Review auto-reply |

### Minimum Server Specs

| Scaffold | CPU | RAM | Disk | Est. Cost |
|----------|-----|-----|------|-----------|
| restaurant | 2 vCPU | 2 GB | 60 GB | 350-500 THB/mo |
| ecommerce | 2 vCPU | 4 GB | 80 GB | 500-900 THB/mo |
| healthcare | 2 vCPU | 4 GB | 80 GB | 500-900 THB/mo |
| realestate | 2 vCPU | 4 GB | 80 GB | 500-900 THB/mo |
| creator | 2 vCPU | 4-8 GB | 80 GB | 500-1,500 THB/mo |
| home-ai | 2 vCPU | 4 GB | 80 GB | 500-900 THB/mo |
| legal | 4 vCPU | 8-16 GB | 160 GB | 1,200-2,500 THB/mo |

---

## Available Industries / ประเภทธุรกิจที่รองรับ

| Industry | Stack | Workflows | RAG | Key Feature |
|----------|-------|-----------|-----|-------------|
| **ecommerce** | n8n + Flowise + PostgreSQL + Caddy | 4 | Product RAG | LINE chatbot + order processing |
| **restaurant** | n8n + PostgreSQL + Caddy | 4 | None | LINE ordering + inventory alerts |
| **legal** | n8n + Flowise + Qdrant + PostgreSQL + Caddy | 2 + 2 chatflows | Contract + Legal search | PDPA compliance + contract analysis |
| **healthcare** | n8n + Flowise + PostgreSQL + Caddy | 3 | Drug info | Appointment booking + patient reminders |
| **realestate** | n8n + Flowise + PostgreSQL + Caddy | 3 | Property listings | Property search + lead scoring |
| **creator** | n8n + Dify + PostgreSQL + Caddy | 3 | None (Dify) | Multi-platform content generation |
| **home-ai** | n8n + Open WebUI + Ollama + PostgreSQL | 2 | None | Morning briefing + email digest |

---

## How to Customize Per Customer / วิธี Customize สำหรับลูกค้าแต่ละราย

### Level 1: Environment Variables (ง่ายสุด, ไม่ต้องแก้ code)

ส่วนใหญ่ customize ผ่าน `.env` ได้เลย:

```bash
# Customer domain
DOMAIN=customer-domain.com

# Customer's LINE OA credentials
LINE_CHANNEL_ACCESS_TOKEN=customer-line-token
LINE_CHANNEL_SECRET=customer-line-secret

# API keys (use customer's or our keys)
OPENAI_API_KEY=sk-customer-key

# Branding in .env (some workflows read these)
BUSINESS_NAME=ร้านค้า ABC
```

### Level 2: Workflow Modifications (ผ่าน n8n UI)

1. Open n8n at `https://n8n.customer-domain.com`
2. Edit workflow nodes directly:
   - **System prompts** — brand voice, product categories, reply style
   - **Schedule triggers** — change cron times to match business hours
   - **Notification channels** — LINE Group ID, Slack webhook, email
   - **Google Sheets IDs** — connect to customer's data sources

### Level 3: Add/Remove Workflows

- Import only the workflows the customer needs
- Create custom workflows for unique business logic
- Export and save as new scaffold variant

### Level 4: Stack Changes (advanced)

- Add/remove services in `docker-compose.yml`
- Switch AI models (e.g., GPT-4o -> Claude Sonnet)
- Add Qdrant for production RAG (ecommerce, healthcare)
- Scale with more RAM/CPU for heavy workloads

---

## Demo Mode / โหมดสาธิต

You can test scaffolds locally without real API keys using demo mode:

### 1. Start without external APIs

```bash
cp .env.example .env
# Leave LINE and OpenAI keys empty or use placeholder values
docker compose up -d
```

### 2. Access services locally

- **n8n:** http://localhost:5678
- **Flowise:** http://localhost:3000 (if applicable)
- **Open WebUI:** http://localhost:3000 (home-ai)
- **PostgreSQL:** localhost:5432

### 3. Test workflows manually

In n8n, use **Manual Execution** (click "Execute Workflow") instead of waiting for triggers:

- For webhook-triggered workflows: use n8n's built-in test URL
- For cron-triggered workflows: click "Execute Workflow" to run immediately
- For LINE-dependent workflows: send test JSON payloads via curl

### 4. Mock LINE webhook

```bash
# Simulate a LINE message
curl -X POST http://localhost:5678/webhook-test/line-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "type": "message",
      "message": {"type": "text", "text": "สินค้ามีอะไรบ้าง"},
      "source": {"userId": "demo-user-123"},
      "replyToken": "demo-reply-token"
    }]
  }'
```

### 5. Demo with sample data

Each scaffold includes sample data in `data/`:
- `ecommerce/data/products-sample.csv` — 10 sample products
- `restaurant/data/menu-sample.csv` — 10 menu items
- `restaurant/data/inventory-sample.csv` — ingredient inventory
- `realestate/data/listings-sample.csv` — 10 property listings

---

## Importing Workflows / นำเข้า Workflows

### Automated Import (via script)

```bash
./import-workflows.sh <n8n-url> <industry>

# Examples:
./import-workflows.sh http://localhost:5678 ecommerce
./import-workflows.sh https://n8n.myshop.com restaurant
```

The script will:
1. Check n8n connectivity
2. Request API key if n8n requires authentication
3. Import all JSON files from `<industry>/n8n-workflows/`
4. Report success/failure for each workflow

### Manual Import (via n8n UI)

1. Open n8n in your browser
2. Click **Add Workflow** > **Import from File**
3. Select the JSON file from `<industry>/n8n-workflows/`
4. Review the imported workflow
5. Update credentials (LINE, OpenAI, etc.) in workflow settings
6. **Activate** the workflow (toggle switch)
7. Repeat for each workflow file

### Flowise Chatflow Import

1. Open Flowise in your browser
2. Go to **Chatflows** > **Add New** > **Load Chatflow**
3. Select the JSON file from `<industry>/flowise/`
4. Update API keys and vector store settings
5. Upload sample data if applicable
6. Test the chatflow in Flowise UI

---

## Backup and Recovery / การสำรองข้อมูล

### Automated Backup

```bash
# Run backup manually
./shared/backup/backup.sh ecommerce

# Setup daily automated backup (3 AM)
crontab -e
# Add: 0 3 * * * /path/to/backup.sh ecommerce >> /var/log/backup.log 2>&1
```

### What Gets Backed Up

- PostgreSQL database (full dump)
- n8n data volume (workflows, credentials, execution history)
- Flowise data volume (chatflows, configurations)
- Qdrant snapshots (vector data, if applicable)
- Environment file (`.env`)

### Recovery

```bash
# Extract backup
tar -xzf ecommerce_20260317_030000.tar.gz -C /tmp/restore/

# Restore PostgreSQL
cat /tmp/restore/postgres_dump.sql.gz | gunzip | docker exec -i <postgres_container> psql -U automation

# Restore n8n data
docker cp /tmp/restore/n8n_data <n8n_container>:/home/node/.n8n

# Restart services
docker compose restart
```

---

## Secure Remote Access / การเข้าถึงจากระยะไกล

We recommend **Tailscale** for secure access without exposing services to the public internet.

See `shared/tailscale/setup.md` for detailed instructions.

Quick setup:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
tailscale ip -4   # Get your Tailscale IP
```

Then access services via Tailscale IP: `http://<tailscale-ip>:5678`

---

## Troubleshooting / แก้ไขปัญหา

See the detailed troubleshooting section in `quick-start.md`, or check each industry README for stack-specific issues.

### Common Issues

| Problem | Solution |
|---------|----------|
| Docker won't start | Check `docker info`, ensure Docker Desktop is running |
| Port already in use | `lsof -i :5678` to find conflicts |
| n8n "Bad Gateway" | `docker compose restart n8n` — wait for PostgreSQL |
| SSL not working | Verify DNS A records, check `docker compose logs caddy` |
| Workflow import fails | Check `curl http://localhost:5678/healthz`, import via UI |
| LINE webhook not working | Check webhook URL in LINE console, ensure workflow is **activated** |
| Services keep restarting | `docker compose logs --tail=50`, check RAM (min 2GB) |
| Cannot connect to PostgreSQL | `docker compose logs postgres`, check credentials in `.env` |

---

## Contributing / การร่วมพัฒนา

### Adding a New Industry Scaffold

1. Create a new directory: `mkdir new-industry`
2. Copy structure from an existing scaffold:
   ```bash
   cp ecommerce/docker-compose.yml new-industry/
   cp ecommerce/.env.example new-industry/
   mkdir new-industry/n8n-workflows
   ```
3. Customize `docker-compose.yml` for the industry's service stack
4. Create n8n workflow JSON files (build in n8n UI, then export)
5. Create Flowise chatflow JSON files if RAG is needed
6. Add sample data in `data/`
7. Write a comprehensive `README.md`
8. Add the industry to `setup.sh` VALID_INDUSTRIES array
9. Test the full setup flow

### Modifying Existing Scaffolds

1. Make changes in the scaffold directory (not in a deployment)
2. Test locally with `docker compose up -d`
3. Export modified workflows from n8n UI as JSON
4. Update README if environment variables or setup steps changed
5. Commit changes

### Code Style

- Shell scripts: use `set -euo pipefail`, add Thai+English comments
- Docker Compose: use named volumes, always set `restart: always`
- n8n workflows: use descriptive node names, add sticky notes for documentation
- Environment variables: use SCREAMING_SNAKE_CASE, provide sensible defaults

---

## License

MIT License. See [LICENSE](LICENSE) for details.

Free to use, modify, and distribute for commercial and non-commercial purposes.

---

## Support / ติดต่อสอบถาม

- **Website:** [aistudio.co.th](https://aistudio.co.th)
- **LINE:** @ai-studio-th
- **Email:** support@aistudio.co.th

---

> Built with n8n, Flowise, Dify, PostgreSQL, Caddy, and Ollama.
> Designed for Thai businesses by AI Studio Thailand.
