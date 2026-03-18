# Home AI Automation / ระบบ AI ส่วนตัวสำหรับใช้ที่บ้าน

Personal AI automation stack with Open WebUI + n8n + Ollama for daily productivity.

ระบบ AI ส่วนตัว: สรุปข้อมูลเช้า, สรุปอีเมล, chat กับ AI แบบ local ไม่ต้องส่งข้อมูลออก

---

## What's Included / สิ่งที่ได้

### Services

| Service      | Port | Description                      |
|--------------|------|----------------------------------|
| n8n          | 5678 | Workflow automation engine       |
| Open WebUI   | 3000 | Chat UI for Ollama/OpenAI        |
| PostgreSQL   | 5432 | Database                         |

> Home AI ไม่มี Caddy (ใช้ local network) และไม่มี Flowise (ใช้ Open WebUI + Ollama)

### n8n Workflows (2)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Morning Briefing | `morning-briefing.json` | Cron (7 AM daily) | สรุปเช้า: อากาศ + ข่าว + นัดหมาย + motivation |
| Email Summary | `email-summary.json` | Cron (8 AM, 1 PM, 6 PM) | สรุปอีเมลที่ยังไม่อ่าน 3 รอบ/วัน |

### Local AI

- **Ollama** runs on the host machine (not in Docker)
- **Open WebUI** connects to Ollama for private AI chat
- No data leaves your network (privacy-first)

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- **Ollama** installed on host machine:
  ```bash
  curl -fsSL https://ollama.ai/install.sh | sh
  ollama pull llama3.1
  ```
- OpenAI API key (optional, for cloud AI fallback)
- LINE Notify token (for push notifications)
- Gmail app password (for email summary)
- Google Calendar API access (for morning briefing)

---

## Quick Start / เริ่มต้น

### Step 1: Install Ollama (if not already)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.1
```

### Step 2: Copy environment file

```bash
cp .env.example .env
```

### Step 3: Edit `.env`

```bash
nano .env
```

Fill in:
- `OLLAMA_BASE_URL` (usually `http://host.docker.internal:11434` on Mac/Windows)
- `EMAIL_ADDRESS` and `EMAIL_APP_PASSWORD` for Gmail
- `LINE_NOTIFY_TOKEN` for notifications
- `OPENAI_API_KEY` (optional, for cloud AI)

### Step 4: Start services

```bash
docker compose up -d
```

### Step 5: Access services

- **Open WebUI:** http://localhost:3000
- **n8n:** http://localhost:5678

Create your Open WebUI account on first visit.

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `localhost` | Yes |
| `WEBHOOK_URL` | Webhook URL | `http://localhost:5678/` | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database user | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `OLLAMA_BASE_URL` | Ollama URL | `http://host.docker.internal:11434` | For local AI |
| `WEBUI_SECRET_KEY` | Open WebUI secret | `openssl rand -hex 32` | Yes |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | Optional |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID | `primary` or calendar email | For morning briefing |
| `EMAIL_ADDRESS` | Gmail address | `you@gmail.com` | For email summary |
| `EMAIL_APP_PASSWORD` | Gmail app password | From Google Account | For email summary |
| `LINE_NOTIFY_TOKEN` | LINE Notify token | From notify-bot.line.me | For notifications |

---

## How to Import Workflows into n8n

### Automated

```bash
../../import-workflows.sh http://localhost:5678 home-ai
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Import `morning-briefing.json` and `email-summary.json`
4. Set up credentials (Gmail, Google Calendar, LINE Notify)
5. **Activate** each workflow

---

## How to Test Each Workflow / ทดสอบ

### Morning Briefing (`morning-briefing.json`)

1. Activate workflow (runs 7 AM daily)
2. Click **Execute Workflow** to test now
3. Check output: weather, calendar events, email count, daily quote
4. Verify LINE Notify notification

### Email Summary (`email-summary.json`)

1. Activate workflow (runs 8 AM, 1 PM, 6 PM)
2. Click **Execute Workflow** to test now
3. Check output: unread emails classified and summarized
4. Verify LINE Notify notification

### Open WebUI Chat

1. Open http://localhost:3000
2. Select a model (e.g., llama3.1)
3. Chat in Thai: "สรุปข่าว AI วันนี้ให้หน่อย"
4. Test with different Ollama models: `ollama pull gemma2`, `ollama pull mistral`

---

## Demo Mode / โหมดสาธิต

### Start with minimal setup

```bash
# Make sure Ollama is running
ollama serve

cp .env.example .env
# Fill in OLLAMA_BASE_URL and basic passwords
docker compose up -d
```

### Test without Gmail/Calendar

- Import workflows
- Use **Execute Workflow** to test
- Workflows will show errors for missing Gmail/Calendar credentials but demonstrate the flow

### Test Open WebUI immediately

1. Open http://localhost:3000
2. Create account
3. Chat with Ollama models locally
4. No API keys needed for local models

### Demo scenario

1. Show Open WebUI chat with Ollama (private, local AI)
2. Show morning briefing output
3. Show email summary with categorization
4. Explain: "ข้อมูลทั้งหมดอยู่ใน network ของคุณ ไม่ส่งออกไปไหน"

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Wake time** | n8n cron trigger | Change 7 AM to desired time |
| **Email check times** | n8n cron trigger | Change 8 AM/1 PM/6 PM schedule |
| **News sources** | n8n workflow | Add/remove RSS feeds |
| **Weather location** | n8n workflow | Set latitude/longitude |
| **Ollama model** | Open WebUI / n8n | Pull different models: `ollama pull gemma2` |
| **Email accounts** | n8n workflow | Support multiple Gmail accounts |
| **Notification channel** | n8n workflow | LINE Notify, email, or both |
| **Summary language** | n8n workflow prompt | Thai, English, or mixed |
| **Calendar account** | n8n workflow | Google Calendar ID |

### Adding More Ollama Models

```bash
ollama pull llama3.1        # General purpose
ollama pull gemma2          # Lightweight, fast
ollama pull mistral         # Good for coding
ollama pull deepseek-r1     # Reasoning
```

All pulled models appear automatically in Open WebUI.

---

## LINE Notify Setup / ตั้งค่า LINE Notify

1. Go to [LINE Notify](https://notify-bot.line.me/en/)
2. Log in with your LINE account
3. Go to "My page"
4. Click "Generate token"
5. Choose notification target (1-on-1 or group)
6. Copy the token to `.env` as `LINE_NOTIFY_TOKEN`
7. Test: run morning briefing workflow

---

## Gmail App Password Setup / ตั้งค่า Gmail

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password to `.env` as `EMAIL_APP_PASSWORD`

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| Open WebUI can't find Ollama | Check `OLLAMA_BASE_URL`, make sure Ollama is running |
| "No models available" | Run `ollama pull llama3.1` on host machine |
| Email summary empty | Check `EMAIL_APP_PASSWORD`, enable 2FA in Google |
| LINE Notify not sending | Verify token at notify-bot.line.me |
| Morning briefing missing weather | Check weather API key or use free API |
| Slow AI responses | Normal for local models; use smaller model or add GPU |
| Open WebUI login issues | `docker compose restart open-webui` |

```bash
# Debug commands
docker compose ps
docker compose logs n8n
docker compose logs open-webui
ollama list                    # Check available models
curl http://localhost:11434    # Check Ollama is running
curl http://localhost:5678/healthz
```

### Ollama on Linux (Docker host networking)

If using Linux (not Mac/Windows), change `OLLAMA_BASE_URL` to:

```
OLLAMA_BASE_URL=http://172.17.0.1:11434
```

Or use host network mode in docker-compose.yml.

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
