# E-commerce AI Automation / ระบบ AI อัตโนมัติสำหรับร้านค้าออนไลน์

AI-powered automation stack for Thai e-commerce businesses using n8n + Flowise.

ระบบ AI ครบวงจร: chatbot ตอบลูกค้า, ประมวลผลออร์เดอร์, แจ้งเตือน stock, รายงานยอดขาย

---

## What's Included / สิ่งที่ได้

### Services

| Service    | Port   | Description                    |
|------------|--------|--------------------------------|
| n8n        | 5678   | Workflow automation engine     |
| Flowise    | 3000   | RAG chatflow builder           |
| PostgreSQL | 5432   | Database for n8n + Flowise     |
| Caddy      | 80/443 | Reverse proxy with auto-SSL    |

### n8n Workflows (4)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| LINE Chatbot | `line-chatbot.json` | Webhook (LINE) | Auto-reply customer messages with product info via RAG |
| Order Processing | `order-processing.json` | Webhook | Extract order details from LINE messages, check stock, create invoice |
| Stock Alert | `stock-alert.json` | Cron (every 6 hours) | Alert when product stock falls below threshold |
| Daily Report | `daily-report.json` | Cron (9 PM daily) | Daily sales summary with insights |

### Flowise Chatflows (1)

| Chatflow | File | Purpose |
|----------|------|---------|
| Product RAG | `flowise/product-rag.json` | Search product database to answer customer questions |

### Sample Data

| File | Description |
|------|-------------|
| `data/products-sample.csv` | 10 sample products with name, price, description, stock |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- LINE Messaging API account ([LINE Developers Console](https://developers.line.biz/))
- OpenAI API key ([OpenAI Platform](https://platform.openai.com/))
- Domain name with DNS A records pointing to your server:
  - `n8n.yourdomain.com` -> server IP
  - `flowise.yourdomain.com` -> server IP
- Ports 80 and 443 open on your server

---

## Quick Start / เริ่มต้น

### Step 1: Copy environment file

```bash
cp .env.example .env
```

### Step 2: Edit `.env` with your values

```bash
nano .env
```

Fill in:
- LINE channel credentials
- OpenAI API key
- Strong passwords for PostgreSQL and Flowise
- Your domain name

### Step 3: Start services

```bash
docker compose up -d
```

### Step 4: Access services

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)
- **Flowise:** https://flowise.yourdomain.com (or http://localhost:3000)

Create your n8n account on first visit.

### Step 5: Import workflows and chatflows

```bash
# Automated import
../../import-workflows.sh http://localhost:5678 ecommerce

# Or use the local setup script
./setup-local.sh
```

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.myshop.com` | Yes |
| `WEBHOOK_URL` | Full webhook URL for n8n | `https://n8n.myshop.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Random encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database username | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | `openssl rand -hex 16` | Yes |
| `FLOWISE_USERNAME` | Flowise admin username | `admin` | Yes |
| `FLOWISE_PASSWORD` | Flowise admin password | Strong random password | Yes |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API token | From LINE Developers | For LINE features |
| `LINE_CHANNEL_SECRET` | LINE channel secret | From LINE Developers | For LINE features |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | For AI features |
| `DOMAIN` | Your domain name | `myshop.com` | For SSL |

---

## How to Import Workflows into n8n / นำเข้า Workflows

### Method 1: Automated (script)

```bash
../../import-workflows.sh http://localhost:5678 ecommerce
```

### Method 2: Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. Click **Add Workflow** > **Import from File**
3. Select a JSON file from `n8n-workflows/`
4. Review the workflow nodes
5. Set up credentials:
   - Go to **Settings** > **Credentials**
   - Add LINE Messaging API credentials
   - Add OpenAI credentials
6. **Activate** the workflow (toggle the switch at the top)
7. Repeat for each workflow file

### Importing Flowise Chatflows

1. Open Flowise at http://localhost:3000
2. Log in with your FLOWISE_USERNAME and FLOWISE_PASSWORD
3. Click **Chatflows** > **Add New** > **Load Chatflow**
4. Select `flowise/product-rag.json`
5. Update the OpenAI API key in the chatflow nodes
6. Go to the Document Store and upload `data/products-sample.csv`
7. Test the chatflow using the built-in chat interface

---

## How to Test Each Workflow / ทดสอบแต่ละ Workflow

### LINE Chatbot (`line-chatbot.json`)

1. Activate the workflow in n8n
2. Set webhook URL in LINE Developers Console:
   ```
   https://n8n.yourdomain.com/webhook/line-webhook
   ```
3. Send a message to your LINE OA: "สินค้ามีอะไรบ้าง"
4. Verify the bot responds with product information

**Test without LINE:**
```bash
curl -X POST http://localhost:5678/webhook-test/line-webhook \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"ราคาสินค้า"},"source":{"userId":"test-user"},"replyToken":"test-token"}]}'
```

### Order Processing (`order-processing.json`)

1. This workflow is triggered by the LINE chatbot workflow
2. Send an order message via LINE: "สั่ง iPhone case 2 ชิ้น"
3. Check n8n execution log for order extraction and stock check

### Stock Alert (`stock-alert.json`)

1. Activate the workflow (runs every 6 hours)
2. To test immediately: click **Execute Workflow** in n8n
3. Verify alert is sent when stock < threshold

### Daily Report (`daily-report.json`)

1. Activate the workflow (runs at 9 PM daily)
2. To test immediately: click **Execute Workflow**
3. Check the generated report in the execution output

---

## Demo Mode / โหมดสาธิต (ทดสอบโดยไม่ต้องมี API keys จริง)

### 1. Start services with placeholder keys

```bash
cp .env.example .env
# Leave API keys as placeholder values
docker compose up -d
```

### 2. Test with manual execution

- Open n8n at http://localhost:5678
- Import workflows
- Use **Execute Workflow** button instead of waiting for triggers
- Use n8n's webhook test URL (shown when you select a webhook node)

### 3. Load sample data

- Upload `data/products-sample.csv` into Flowise as the knowledge base
- Use Flowise's built-in chat to test RAG queries: "มีสินค้าอะไรบ้าง"

### 4. Simulate LINE messages with curl

```bash
curl -X POST http://localhost:5678/webhook-test/line-webhook \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"สินค้าราคาเท่าไหร่"},"source":{"userId":"demo-user"},"replyToken":"demo-token"}]}'
```

### Limitations in demo mode

- LINE replies won't actually send (no valid token)
- AI responses require a valid OpenAI key (or use Ollama locally)
- SSL won't work without a real domain

---

## Customization Guide / คู่มือการ Customize สำหรับลูกค้า

### What to Change Per Customer

| Item | Where to Change | How |
|------|-----------------|-----|
| **Domain** | `.env` | Update `DOMAIN`, `N8N_HOST`, `WEBHOOK_URL` |
| **LINE credentials** | `.env` | Get from customer's LINE Developers Console |
| **API keys** | `.env` | Use customer's or shared API key |
| **Product data** | Flowise / Google Sheets | Upload customer's product catalog |
| **Chatbot personality** | n8n workflow (system prompt) | Edit the AI node's system message |
| **Report schedule** | n8n workflow (cron trigger) | Change cron expression in trigger node |
| **Alert thresholds** | n8n workflow (filter node) | Change stock threshold values |
| **Notification target** | n8n workflow | Change LINE user ID or group ID |
| **Branding** | n8n workflow (message templates) | Update reply message templates |

### Customizing the Chatbot Tone

In the LINE Chatbot workflow, find the AI/OpenAI node and edit the system prompt:

```
คุณเป็นผู้ช่วยร้าน {ชื่อร้าน} พูดจาสุภาพ ใช้ภาษาไทย
ตอบสั้นกระชับ ให้ข้อมูลสินค้าตามที่ถาม
ถ้าไม่แน่ใจ แนะนำให้ทักแอดมินโดยตรง
```

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Cause | Solution |
|---------|-------|----------|
| n8n shows "Bad Gateway" | PostgreSQL not ready yet | `docker compose restart n8n`, wait 30 seconds |
| Flowise login fails | Wrong credentials | Check `FLOWISE_USERNAME` and `FLOWISE_PASSWORD` in `.env` |
| LINE webhook not receiving | Workflow not activated | Toggle the workflow ON in n8n |
| LINE webhook 404 | Wrong webhook URL | Check URL matches webhook node path in n8n |
| Chatbot doesn't reply | Missing LINE token | Verify `LINE_CHANNEL_ACCESS_TOKEN` in `.env`, restart |
| RAG returns empty results | No documents uploaded | Upload product data to Flowise document store |
| SSL certificate error | DNS not configured | Verify A records: `dig n8n.yourdomain.com` |
| Port 5678 in use | Another service running | `lsof -i :5678` to find and stop it |
| Database connection refused | PostgreSQL container down | `docker compose logs postgres` |

### Check Service Status

```bash
# All containers
docker compose ps

# Service logs
docker compose logs n8n
docker compose logs flowise
docker compose logs postgres

# n8n health check
curl http://localhost:5678/healthz
```

---

## LINE Webhook Setup / ตั้งค่า LINE Webhook

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Select your Messaging API channel
3. Set Webhook URL to: `https://n8n.yourdomain.com/webhook/line-webhook`
4. Enable **Use webhook**
5. Go to LINE Official Account Manager
6. Disable **Auto-reply messages** (n8n handles replies instead)
7. Test by sending a message to your LINE OA

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
