# Restaurant AI Automation / ระบบ AI อัตโนมัติสำหรับร้านอาหาร

Lightweight AI automation stack for Thai restaurants using n8n.

ระบบ AI สำหรับร้านอาหาร: สั่งอาหารผ่าน LINE, แจ้งเตือนวัตถุดิบ, ตอบรีวิว, รายงานยอดขาย

---

## What's Included / สิ่งที่ได้

### Services

| Service    | Port   | Description                    |
|------------|--------|--------------------------------|
| n8n        | 5678   | Workflow automation engine     |
| PostgreSQL | 5432   | Database                       |
| Caddy      | 80/443 | Reverse proxy with auto-SSL    |

> Restaurant เป็น scaffold ที่เบาที่สุด ไม่มี Flowise/RAG ใช้ RAM น้อย

### n8n Workflows (4)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| LINE Order Bot | `line-order-bot.json` | Webhook (LINE) | รับออร์เดอร์อาหารผ่าน LINE chat |
| Inventory Alert | `inventory-alert.json` | Cron (7 AM daily) | แจ้งเตือนวัตถุดิบใกล้หมด |
| Review Reply | `review-reply.json` | Cron (every 3 hours) | ตอบ Google Reviews อัตโนมัติ |
| Daily Sales | `daily-sales.json` | Cron (10 PM daily) | สรุปยอดขายรายวัน |

### Sample Data

| File | Description |
|------|-------------|
| `data/menu-sample.csv` | 10 sample menu items with name, price, category |
| `data/inventory-sample.csv` | Ingredient inventory with quantities and thresholds |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- LINE Messaging API account ([LINE Developers Console](https://developers.line.biz/))
- OpenAI API key ([OpenAI Platform](https://platform.openai.com/))
- Google Business Profile (for review auto-reply)
- Domain name with DNS: `n8n.yourdomain.com` -> server IP

---

## Quick Start / เริ่มต้น

### Step 1: Copy environment file

```bash
cp .env.example .env
```

### Step 2: Edit `.env`

```bash
nano .env
```

Fill in LINE credentials, OpenAI API key, Google Business IDs, and passwords.

### Step 3: Start services

```bash
docker compose up -d
```

### Step 4: Access n8n

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)

### Step 5: Import workflows

```bash
../../import-workflows.sh http://localhost:5678 restaurant
```

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.myrestaurant.com` | Yes |
| `WEBHOOK_URL` | Full webhook URL | `https://n8n.myrestaurant.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Random encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database username | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE API token | From LINE Developers | For LINE features |
| `LINE_CHANNEL_SECRET` | LINE secret | From LINE Developers | For LINE features |
| `ADMIN_LINE_USER_ID` | Owner's LINE user ID | For alerts | For notifications |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | For AI features |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | Google Business account | For reviews | For review reply |
| `GOOGLE_BUSINESS_LOCATION_ID` | Google Business location | For reviews | For review reply |
| `DOMAIN` | Your domain | `myrestaurant.com` | For SSL |

---

## How to Import Workflows into n8n / นำเข้า Workflows

### Automated

```bash
../../import-workflows.sh http://localhost:5678 restaurant
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Select JSON from `n8n-workflows/`
4. Set up credentials (LINE, OpenAI, Google Business)
5. **Activate** the workflow

---

## How to Test Each Workflow / ทดสอบ

### LINE Order Bot (`line-order-bot.json`)

**With LINE:**
1. Set webhook URL: `https://n8n.yourdomain.com/webhook/line-order`
2. Send: "กะเพราหมูสับ 2 + ต้มยำ 1"
3. Bot should extract items, calculate total, confirm order

**Without LINE (curl):**
```bash
curl -X POST http://localhost:5678/webhook-test/line-order \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"ข้าวผัด 2 จาน"},"source":{"userId":"test-user"},"replyToken":"test-token"}]}'
```

### Inventory Alert (`inventory-alert.json`)

1. Activate workflow (runs at 7 AM)
2. Click **Execute Workflow** to test now
3. Check if alert fires for items below threshold

### Review Reply (`review-reply.json`)

1. Activate workflow (runs every 3 hours)
2. Requires Google Business API credentials
3. Click **Execute Workflow** to test

### Daily Sales (`daily-sales.json`)

1. Activate workflow (runs at 10 PM)
2. Click **Execute Workflow** to test
3. Check output for sales summary

---

## Demo Mode / โหมดสาธิต

### Start without real API keys

```bash
cp .env.example .env
docker compose up -d
```

### Test workflows manually

- Import workflows into n8n
- Use **Execute Workflow** button
- Use webhook test URLs (shown in webhook node)
- Send mock LINE payloads via curl

### Load sample data

Import sample menu and inventory into PostgreSQL:

```bash
# Copy sample data into container
docker cp data/menu-sample.csv <postgres_container>:/tmp/
docker cp data/inventory-sample.csv <postgres_container>:/tmp/

# Import
docker exec -i <postgres_container> psql -U automation -d automation -c "\copy menu FROM '/tmp/menu-sample.csv' CSV HEADER"
```

### Demo limitations

- LINE replies won't send without valid token
- Google Reviews needs real API credentials
- AI features need valid OpenAI key

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Menu items** | Google Sheets / PostgreSQL | Upload customer's real menu |
| **Prices** | Same as menu | Update prices in data source |
| **Order confirmation message** | n8n workflow | Edit message template node |
| **Kitchen notification** | n8n workflow | Change LINE Group ID for kitchen |
| **Inventory thresholds** | Data source | Set per-ingredient minimums |
| **Report time** | n8n workflow cron trigger | Change from 22:00 to desired time |
| **Review reply tone** | n8n workflow AI prompt | "ตอบแบบอบอุ่น เป็นกันเอง" |
| **Upsell suggestions** | n8n workflow | Configure upsell rules |
| **Domain** | `.env` | Customer's domain |
| **LINE credentials** | `.env` | Customer's LINE OA |

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| n8n not starting | `docker compose logs n8n` — check PostgreSQL connection |
| Orders not extracting correctly | Check AI prompt in order processing node |
| Kitchen not receiving notifications | Verify `ADMIN_LINE_USER_ID` or kitchen LINE group ID |
| Google Reviews API error | Verify Google Business account/location IDs |
| Inventory alerts not firing | Check threshold values in data source |
| Wrong prices in orders | Update menu data source with correct prices |

```bash
# Debug commands
docker compose ps
docker compose logs --tail=50
curl http://localhost:5678/healthz
```

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
