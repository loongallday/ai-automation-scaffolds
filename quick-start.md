# AI Studio Thailand — Quick Start Guide

## One-Liner Setup (ติดตั้งด้วยคำสั่งเดียว)

```bash
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s <industry> <domain> <email>
```

**Example / ตัวอย่าง:**

```bash
# E-commerce store
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s ecommerce ai.myshop.com admin@myshop.com

# Restaurant
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s restaurant ai.myrestaurant.com owner@myrestaurant.com

# Law firm
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s legal ai.mylawfirm.com admin@mylawfirm.com

# Clinic / Hospital
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s healthcare ai.myclinic.com admin@myclinic.com

# Real estate
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s realestate ai.myproperty.com admin@myproperty.com

# Content creator
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s creator ai.mychannel.com admin@mychannel.com

# Home AI (local, no domain needed — use .local)
curl -sSL https://raw.githubusercontent.com/ai-studio-thailand/ai-automation-scaffolds/main/setup.sh | bash -s home-ai homelab.local me@gmail.com
```

---

## Prerequisites Checklist (สิ่งที่ต้องมีก่อน)

- [ ] **Docker** — [Install Docker](https://docs.docker.com/get-docker/)
- [ ] **Docker Compose** — Included with Docker Desktop. Linux: `sudo apt install docker-compose-plugin`
- [ ] **curl** — Usually pre-installed. If not: `sudo apt install curl`
- [ ] **A domain** (optional for home-ai) — Point DNS A records to your server:
  - `n8n.yourdomain.com` -> your server IP
  - `flowise.yourdomain.com` -> your server IP
- [ ] **Ports 7780 and 7781 open** — For HTTPS via Caddy auto-SSL

---

## Manual Step-by-Step (ติดตั้งด้วยตนเอง)

### 1. Clone the repository

```bash
git clone https://github.com/ai-studio-thailand/ai-automation-scaffolds.git
cd ai-automation-scaffolds
```

### 2. Run setup

```bash
chmod +x setup.sh
./setup.sh ecommerce ai.myshop.com admin@myshop.com
```

### 3. Or do it fully manually

```bash
# Copy scaffold to deployment directory
cp -r ecommerce ~/ai-deployments/my-shop
cd ~/ai-deployments/my-shop

# Create .env from example
cp .env.example .env

# Edit .env — fill in your values
nano .env
# Required changes:
#   - N8N_HOST=n8n.yourdomain.com
#   - WEBHOOK_URL=https://n8n.yourdomain.com/
#   - N8N_ENCRYPTION_KEY=<run: openssl rand -hex 32>
#   - POSTGRES_PASSWORD=<run: openssl rand -hex 16>
#   - DOMAIN=yourdomain.com
#   - API keys (LINE, OpenAI, etc.)

# Start services
docker compose up -d

# Wait for services to start (about 30 seconds)
# Check: http://localhost:7777 (n8n)
# Check: http://localhost:7778 (Flowise)
```

---

## Post-Setup Guide (หลังติดตั้ง)

### Import Workflows (นำเข้า Workflows)

```bash
# Automated import
./import-workflows.sh http://localhost:7777 ecommerce

# Or use the industry-specific local setup
cd ecommerce
./setup-local.sh
```

**Manual import via n8n UI:**
1. Open n8n (http://localhost:7777)
2. Click **Add Workflow** > **Import from File**
3. Select JSON files from `<industry>/n8n-workflows/`
4. Activate each workflow after import

### Configure API Keys (ตั้งค่า API Keys)

#### LINE Messaging API
1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a Messaging API channel
3. Copy **Channel Access Token** and **Channel Secret**
4. Add to `.env`:
   ```
   LINE_CHANNEL_ACCESS_TOKEN=your-token-here
   LINE_CHANNEL_SECRET=your-secret-here
   ```
5. Set webhook URL in LINE console:
   ```
   https://n8n.yourdomain.com/webhook/line
   ```

#### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

#### After editing .env, restart:
```bash
docker compose restart
```

### Connect LINE Webhook

1. In LINE Developers Console, set webhook URL:
   ```
   https://n8n.yourdomain.com/webhook/line
   ```
2. Enable **Use webhook**
3. Disable **Auto-reply messages** (LINE Official Account Manager)
4. Test by sending a message to your LINE bot

---

## Troubleshooting (แก้ไขปัญหา)

### Docker won't start / Docker ไม่ทำงาน
```bash
# Check Docker status
docker info

# On Linux, make sure your user is in the docker group
sudo usermod -aG docker $USER
# Log out and back in

# On Mac, open Docker Desktop app
```

### Port already in use / พอร์ตถูกใช้แล้ว
```bash
# Find what's using the port
lsof -i :7777
lsof -i :7778

# Stop conflicting service or change port in docker-compose.yml
```

### n8n shows "Bad Gateway" / n8n แสดง Bad Gateway
```bash
# Check container logs
docker compose logs n8n

# Common fix: wait longer for PostgreSQL to start
docker compose restart n8n
```

### Cannot connect to PostgreSQL / เชื่อมต่อ PostgreSQL ไม่ได้
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
```

### SSL certificate not working / SSL ใบรับรองไม่ทำงาน
```bash
# Check Caddy logs
docker compose logs caddy

# Make sure DNS is pointing to your server
dig n8n.yourdomain.com

# Make sure ports 7780 and 7781 are open
sudo ufw allow 7780
sudo ufw allow 7781
```

### Workflow import fails / นำเข้า workflow ไม่สำเร็จ
```bash
# Check n8n is running
curl http://localhost:7777/healthz

# Import manually via UI (drag and drop JSON file)
# Or check API key:
curl -H "X-N8N-API-KEY: your-key" http://localhost:7777/api/v1/workflows
```

### Services keep restarting / Services รีสตาร์ทตลอด
```bash
# Check all logs
docker compose logs --tail=50

# Check resource usage
docker stats

# Common cause: not enough RAM (minimum 2GB recommended)
free -h
```

### LINE webhook not receiving messages / LINE webhook ไม่ได้รับข้อความ
1. Verify webhook URL is correct in LINE Developers Console
2. Make sure webhook is enabled
3. Check n8n webhook is active (workflow must be **activated**)
4. Test with: `curl -X POST https://n8n.yourdomain.com/webhook/line`
5. Check n8n execution log for errors

---

## Available Industries (ประเภทธุรกิจที่รองรับ)

| Industry | Description | Services |
|----------|-------------|----------|
| `ecommerce` | Online store automation | n8n, Flowise, PostgreSQL, Caddy |
| `restaurant` | Restaurant/food business | n8n, PostgreSQL, Caddy |
| `legal` | Law firm / legal office | n8n, Flowise, Qdrant, PostgreSQL, Caddy |
| `healthcare` | Clinic / hospital | n8n, Flowise, PostgreSQL, Caddy |
| `realestate` | Property / real estate | n8n, Flowise, PostgreSQL, Caddy |
| `creator` | Content creator | n8n, Dify, PostgreSQL, Caddy |
| `home-ai` | Personal home AI | n8n, Open WebUI, Ollama, PostgreSQL |

---

## Support / ติดต่อสอบถาม

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
