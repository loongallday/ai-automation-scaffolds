# Real Estate AI Automation / ระบบ AI อัตโนมัติสำหรับอสังหาริมทรัพย์

AI-powered automation for Thai real estate agencies.

ระบบ AI สำหรับอสังหาฯ: ค้นทรัพย์ผ่าน LINE, นัดชมทรัพย์, ให้คะแนน leads อัตโนมัติ

---

## What's Included / สิ่งที่ได้

### Services

| Service    | Port   | Description                    |
|------------|--------|--------------------------------|
| n8n        | 5678   | Workflow automation engine     |
| Flowise    | 3000   | RAG chatflow builder           |
| PostgreSQL | 5432   | Database                       |
| Caddy      | 80/443 | Reverse proxy with auto-SSL    |

### n8n Workflows (3)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Property Inquiry Bot | `property-inquiry-bot.json` | Webhook (LINE) | ค้นทรัพย์ตาม criteria ที่ลูกค้าพิมพ์ |
| Appointment Scheduler | `appointment-scheduler.json` | Webhook | นัดชมทรัพย์ + reminder + follow-up |
| Lead Scoring | `lead-scoring.json` | Cron (9 AM daily) | ให้คะแนน leads ตาม interactions |

### Flowise Chatflows (1)

| Chatflow | File | Purpose |
|----------|------|---------|
| Listing RAG | `flowise/listing-rag.json` | ค้นทรัพย์ด้วย natural language จาก listing database |

### Sample Data

| File | Description |
|------|-------------|
| `data/listings-sample.csv` | 10 sample listings (condos, houses, townhouses, land) |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- LINE Messaging API account
- OpenAI API key
- Domain name with DNS pointed to server

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

Fill in LINE credentials, OpenAI key, agent LINE user ID, and passwords.

### Step 3: Start services

```bash
docker compose up -d
```

### Step 4: Access services

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)
- **Flowise:** https://flowise.yourdomain.com (or http://localhost:3000)

### Step 5: Import workflows and upload listings

```bash
../../import-workflows.sh http://localhost:5678 realestate
```

Then upload `data/listings-sample.csv` to Flowise RAG.

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.myproperty.com` | Yes |
| `WEBHOOK_URL` | Webhook URL | `https://n8n.myproperty.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database user | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `FLOWISE_USERNAME` | Flowise login | `admin` | Yes |
| `FLOWISE_PASSWORD` | Flowise password | Strong random | Yes |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE API token | From LINE Developers | For LINE |
| `LINE_CHANNEL_SECRET` | LINE secret | From LINE Developers | For LINE |
| `ADMIN_LINE_USER_ID` | Agent LINE user ID | For lead alerts | For notifications |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | For AI |
| `DOMAIN` | Your domain | `myproperty.com` | For SSL |

---

## How to Import Workflows into n8n

### Automated

```bash
../../import-workflows.sh http://localhost:5678 realestate
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Import each JSON from `n8n-workflows/`
4. Set up LINE and OpenAI credentials
5. **Activate** each workflow

### Flowise Listing RAG

1. Open Flowise at http://localhost:3000
2. **Chatflows** > **Add New** > **Load Chatflow**
3. Import `flowise/listing-rag.json`
4. Upload `data/listings-sample.csv` as knowledge base
5. Test: "หาคอนโด สุขุมวิท งบ 3 ล้าน"

---

## How to Test Each Workflow / ทดสอบ

### Property Inquiry Bot (`property-inquiry-bot.json`)

**With LINE:**
1. Set webhook URL: `https://n8n.yourdomain.com/webhook/property-inquiry`
2. Send: "หาคอนโด สุขุมวิท งบ 3 ล้าน ใกล้ BTS"
3. Bot should return matching listings

**Without LINE:**
```bash
curl -X POST http://localhost:5678/webhook-test/property-inquiry \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"หาบ้านเดี่ยว บางนา 5 ล้าน"},"source":{"userId":"test-buyer"},"replyToken":"test-token"}]}'
```

### Appointment Scheduler (`appointment-scheduler.json`)

**Test via curl:**
```bash
curl -X POST http://localhost:5678/webhook-test/schedule-viewing \
  -H "Content-Type: application/json" \
  -d '{"property_id":"P001","client_name":"คุณสมชาย","preferred_date":"2026-03-20","preferred_time":"14:00"}'
```

### Lead Scoring (`lead-scoring.json`)

1. Activate workflow (runs 9 AM daily)
2. Click **Execute Workflow** to test now
3. Check output: leads sorted by score with hot lead alerts

---

## Demo Mode / โหมดสาธิต

### Start services

```bash
cp .env.example .env
docker compose up -d
```

### Load sample listings

1. Open Flowise, import listing-rag chatflow
2. Upload `data/listings-sample.csv`
3. Test property search: "มีคอนโดราคาไม่เกิน 5 ล้านไหม"

### Demo scenario for a real estate agency

1. Show property search via LINE (or curl)
2. Show automatic listing matching
3. Show appointment scheduling flow
4. Show lead scoring and hot lead alerts
5. Show how agent gets notified for high-score leads

### Test without LINE

- Use n8n webhook test URLs
- Send mock payloads via curl
- Check execution logs in n8n

### Demo limitations

- LINE replies need valid token
- Appointment scheduling needs Google Calendar
- Lead scoring needs historical interaction data

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Property listings** | Flowise RAG / Google Sheets | Upload client's real listing data |
| **Search criteria** | n8n workflow | Add filters: property type, area, budget, size |
| **Number of results** | n8n workflow | Show top 3, 5, or 10 matches |
| **Yield calculation** | n8n workflow | Include/exclude rental yield |
| **Viewing duration** | n8n workflow | 1 hour default, adjust as needed |
| **Follow-up timing** | n8n workflow | 24h after viewing, or custom |
| **Lead scoring weights** | n8n workflow | Adjust criteria: views, budget match, response time |
| **Hot lead threshold** | n8n workflow | Score > 80 = hot lead (adjustable) |
| **Agent notifications** | n8n workflow | LINE user ID or group ID |
| **Domain** | `.env` | Agency's domain |
| **LINE credentials** | `.env` | Agency's LINE OA |

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| Property search returns nothing | Upload listings to Flowise RAG first |
| Wrong properties returned | Adjust search prompts and chunk settings |
| Appointments not creating | Check Google Calendar API credentials |
| Lead scoring all zeros | Need interaction history data |
| Flowise login fails | Check `FLOWISE_USERNAME`/`FLOWISE_PASSWORD` |

```bash
docker compose ps
docker compose logs n8n
docker compose logs flowise
curl http://localhost:5678/healthz
```

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
