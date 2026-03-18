# Healthcare / Clinic AI Automation / ระบบ AI อัตโนมัติสำหรับคลินิก

AI-powered automation for Thai clinics and healthcare facilities.

ระบบ AI สำหรับคลินิก: จองนัดผ่าน LINE, เตือนนัดผู้ป่วย, ค้นข้อมูลยา, รายงานประจำวัน

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
| Appointment Bot | `appointment-bot.json` | Webhook (LINE) | จอง/เช็ค/ยกเลิกนัดผ่าน LINE |
| Patient Reminder | `patient-reminder.json` | Cron (8 AM daily) | เตือนผู้ป่วยที่มีนัดวันพรุ่งนี้ |
| Daily Clinic Report | `daily-clinic-report.json` | Cron (8 PM daily) | สรุปผลประกอบการคลินิกรายวัน |

### Flowise Chatflows (1)

| Chatflow | File | Purpose |
|----------|------|---------|
| Drug Info RAG | `flowise/drug-info-rag.json` | ค้นข้อมูลยา: dosage, interaction, contraindication |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- LINE Messaging API account
- OpenAI API key
- Domain name with DNS pointed to server
- Drug information PDFs for RAG knowledge base

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

Fill in LINE credentials, OpenAI API key, admin LINE user ID, and passwords.

### Step 3: Start services

```bash
docker compose up -d
```

### Step 4: Access services

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)
- **Flowise:** https://flowise.yourdomain.com (or http://localhost:3000)

### Step 5: Import workflows and chatflows

```bash
../../import-workflows.sh http://localhost:5678 healthcare
```

Import Flowise chatflow via Flowise UI.

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.myclinic.com` | Yes |
| `WEBHOOK_URL` | Webhook URL | `https://n8n.myclinic.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database user | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `FLOWISE_USERNAME` | Flowise login | `admin` | Yes |
| `FLOWISE_PASSWORD` | Flowise password | Strong random | Yes |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE API token | From LINE Developers | For LINE features |
| `LINE_CHANNEL_SECRET` | LINE secret | From LINE Developers | For LINE features |
| `ADMIN_LINE_USER_ID` | Clinic admin LINE ID | For alerts/reports | For notifications |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | For AI features |
| `DOMAIN` | Your domain | `myclinic.com` | For SSL |

---

## How to Import Workflows into n8n

### Automated

```bash
../../import-workflows.sh http://localhost:5678 healthcare
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Import each JSON from `n8n-workflows/`
4. Set up LINE and OpenAI credentials
5. **Activate** each workflow

### Flowise Drug Info RAG

1. Open Flowise at http://localhost:3000
2. **Chatflows** > **Add New** > **Load Chatflow**
3. Import `flowise/drug-info-rag.json`
4. Update OpenAI API key in nodes
5. Upload drug information PDFs (formulary, clinical guidelines, NLEM)
6. Test: "Paracetamol dosage สำหรับเด็ก?"

---

## How to Test Each Workflow / ทดสอบ

### Appointment Bot (`appointment-bot.json`)

**With LINE:**
1. Set webhook URL: `https://n8n.yourdomain.com/webhook/appointment`
2. Send: "หมอสมชายมีคิววันเสาร์ไหม"
3. Bot should show available slots

**Without LINE:**
```bash
curl -X POST http://localhost:5678/webhook-test/appointment \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"อยากจองนัดหมอวันพรุ่งนี้"},"source":{"userId":"test-patient"},"replyToken":"test-token"}]}'
```

### Patient Reminder (`patient-reminder.json`)

1. Activate workflow (runs 8 AM daily)
2. Click **Execute Workflow** to test now
3. Verify reminder messages for tomorrow's appointments

### Daily Clinic Report (`daily-clinic-report.json`)

1. Activate workflow (runs 8 PM daily)
2. Click **Execute Workflow** to test
3. Check summary: patients seen, revenue, department breakdown

### Drug Info RAG (Flowise)

1. Upload drug PDFs to Flowise knowledge base
2. Test queries:
   - "Amoxicillin ขนาดยาสำหรับผู้ใหญ่?"
   - "ยาอะไรที่ห้ามใช้ร่วมกับ Warfarin?"
   - "ผลข้างเคียงของ Metformin?"

---

## Demo Mode / โหมดสาธิต

### Start services

```bash
cp .env.example .env
docker compose up -d
```

### Test without real LINE

- Import workflows, use **Execute Workflow** button
- Send test payloads via curl (see examples above)
- Use n8n's webhook test URLs

### Upload sample drug data

- Upload publicly available drug information PDFs to Flowise
- Use Thai FDA drug list or NLEM documents as test data

### Demo scenario for a clinic owner

1. Show appointment bot replying to LINE messages
2. Show automatic patient reminder (next-day appointments)
3. Show daily clinic summary report
4. Show drug info RAG answering pharmacist questions

### Demo limitations

- LINE replies need valid token
- Appointment booking needs Google Calendar integration
- Drug info RAG quality depends on uploaded documents

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Doctor list** | n8n workflow | Add doctor names and specialties |
| **Slot duration** | n8n workflow | 15 / 30 / 60 min per appointment |
| **Working hours** | n8n workflow | Set per-doctor schedule |
| **Reminder timing** | n8n cron trigger | 24h before, 1h before, etc. |
| **Preparation instructions** | n8n message template | "งดน้ำ/อาหาร 8 ชม." |
| **Report metrics** | n8n workflow | patients, revenue, wait times |
| **Drug knowledge base** | Flowise | Upload clinic's drug formulary |
| **Domain** | `.env` | Clinic's domain |
| **LINE credentials** | `.env` | Clinic's LINE OA |

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| Appointment bot not responding | Check webhook URL in LINE console, ensure workflow activated |
| Reminders not sending | Verify cron schedule, check `ADMIN_LINE_USER_ID` |
| Drug RAG returns wrong info | Upload more relevant documents, adjust chunk size |
| Flowise login fails | Check `FLOWISE_USERNAME`/`FLOWISE_PASSWORD` in `.env` |
| Report missing data | Verify data source connections (Google Sheets/Calendar) |

```bash
docker compose ps
docker compose logs n8n
docker compose logs flowise
curl http://localhost:5678/healthz
```

---

## Disclaimer / ข้อจำกัดความรับผิดชอบ

This system is an administrative tool only. Drug information RAG is for reference purposes. Always consult qualified healthcare professionals for medical decisions.

ระบบนี้เป็นเครื่องมือช่วยบริหารเท่านั้น ข้อมูลยาเป็นข้อมูลอ้างอิง ต้องปรึกษาแพทย์/เภสัชกรก่อนตัดสินใจทางการแพทย์

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
