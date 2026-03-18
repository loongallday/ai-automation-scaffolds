# Content Creator AI Automation / ระบบ AI อัตโนมัติสำหรับครีเอเตอร์

AI-powered content creation and planning stack using n8n + Dify.

ระบบ AI สำหรับครีเอเตอร์: สร้าง content หลาย platform, วางแผน content calendar, วิเคราะห์ engagement

---

## What's Included / สิ่งที่ได้

### Services

| Service    | Port   | Description                    |
|------------|--------|--------------------------------|
| n8n        | 5678   | Workflow automation engine     |
| Dify       | 3000   | AI app builder                 |
| Dify API   | 5001   | Dify backend API               |
| PostgreSQL | 5432   | Database                       |
| Caddy      | 80/443 | Reverse proxy with auto-SSL    |

> Creator stack uses Dify instead of Flowise for more flexible content workflows

### n8n Workflows (3)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Content Generator | `content-generator.json` | Webhook | สร้าง TikTok scripts + IG captions on demand |
| Content Calendar | `content-calendar.json` | Cron (Sunday 9 AM) | วางแผน content 7 วันอัตโนมัติ |
| Engagement Report | `engagement-report.json` | Cron (Monday 10 AM) | สรุป engagement รายสัปดาห์ |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- OpenAI API key
- Social media API tokens (optional):
  - TikTok API access token
  - Instagram Graph API token
  - Facebook Page token
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

Fill in OpenAI API key, Dify secret, and passwords. Social media tokens are optional.

### Step 3: Start services

```bash
docker compose up -d
```

> Dify may take 2-3 minutes to fully start (multiple sub-services)

### Step 4: Access services

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)
- **Dify:** https://dify.yourdomain.com (or http://localhost:3000)

### Step 5: Import workflows

```bash
../../import-workflows.sh http://localhost:5678 creator
```

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.mychannel.com` | Yes |
| `WEBHOOK_URL` | Webhook URL | `https://n8n.mychannel.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database user | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `DIFY_API_URL` | Dify API URL | `http://dify:5001` | Yes |
| `DIFY_SECRET_KEY` | Dify secret key | `openssl rand -hex 32` | Yes |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | Yes |
| `TIKTOK_ACCESS_TOKEN` | TikTok API token | From TikTok Developer | Optional |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram API token | From Meta Developer | Optional |
| `FACEBOOK_PAGE_TOKEN` | Facebook page token | From Meta Developer | Optional |
| `DOMAIN` | Your domain | `mychannel.com` | For SSL |

---

## How to Import Workflows into n8n

### Automated

```bash
../../import-workflows.sh http://localhost:5678 creator
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Import each JSON from `n8n-workflows/`
4. Set up OpenAI credentials
5. Connect Dify API credentials if using Dify nodes
6. **Activate** each workflow

---

## How to Test Each Workflow / ทดสอบ

### Content Generator (`content-generator.json`)

```bash
curl -X POST http://localhost:5678/webhook-test/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "วิธีประหยัดเงิน Gen Z",
    "niche": "finance",
    "tone": "fun and relatable",
    "audience": "Gen Z Thai 18-25"
  }'
```

Expected output: TikTok script + Instagram caption + hashtags.

### Content Calendar (`content-calendar.json`)

1. Activate workflow (runs Sunday 9 AM)
2. Click **Execute Workflow** to test now
3. Check output: 7-day content plan with topics, platforms, and posting times

### Engagement Report (`engagement-report.json`)

1. Activate workflow (runs Monday 10 AM)
2. Click **Execute Workflow** to test
3. Check output: weekly performance summary with top/bottom posts

---

## Demo Mode / โหมดสาธิต

### Start without social media APIs

```bash
cp .env.example .env
# Only fill in OPENAI_API_KEY
docker compose up -d
```

### Test content generation

```bash
# Generate content without posting
curl -X POST http://localhost:5678/webhook-test/generate-content \
  -H "Content-Type: application/json" \
  -d '{"topic":"อาหารคลีน","niche":"health","tone":"friendly","audience":"คนไทย 25-35"}'
```

### Demo scenario for a creator

1. Show content generation: input a topic, get multi-platform content
2. Show content calendar: automatic weekly planning
3. Show engagement report: weekly performance analysis
4. Show how content is saved to Google Sheets for review

### Demo limitations

- Social media posting needs real API tokens
- Engagement data needs manual input or API connection
- Dify takes time to start (wait 2-3 minutes)

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Brand voice** | n8n workflow AI prompt | "สนุก / จริงจัง / น่ารัก / มืออาชีพ" |
| **Target platforms** | n8n workflow | Enable/disable: TikTok, IG, YouTube, Facebook, LINE |
| **TikTok script duration** | n8n workflow | 15s / 30s / 60s |
| **Content pillars** | n8n workflow | Define 3-5 recurring themes |
| **Posting schedule** | n8n cron trigger | Customize days and times |
| **Niche/industry** | n8n workflow prompt | Finance, beauty, food, tech, etc. |
| **Engagement metrics** | n8n workflow | Views, likes, shares, saves, comments |
| **Report format** | n8n workflow | Summary vs detailed |
| **Output destination** | n8n workflow | Google Sheets, Notion, email |
| **Domain** | `.env` | Creator's domain |

### Example: Change Brand Voice

In the Content Generator workflow, find the AI node and update the system prompt:

```
คุณเป็น content strategist สำหรับ {ชื่อ creator}
Niche: {niche}
Tone: สนุกสนาน ใช้ศัพท์ Gen Z
Target: คนไทยอายุ 18-25
สร้าง content ที่ engage ได้ดี ใช้ hook แรงๆ
```

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| Dify not starting | Wait 2-3 min, check `docker compose logs dify` |
| Content generation returns empty | Verify `OPENAI_API_KEY` is valid |
| Content calendar not running | Check cron expression in trigger node |
| Social media posting fails | Verify API tokens, check rate limits |
| Dify API connection refused | Check `DIFY_API_URL` in workflow nodes |

```bash
docker compose ps
docker compose logs n8n
docker compose logs dify
curl http://localhost:5678/healthz
```

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
