#!/bin/bash
# =============================================================================
# AI Studio Thailand — Home AI Local Setup
# ติดตั้งระบบ AI ส่วนตัวสำหรับใช้ที่บ้าน
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║     AI Studio Thailand — Home AI Setup                  ║"
echo "  ║     ระบบ AI ส่วนตัวสำหรับใช้ที่บ้าน                         ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Prerequisites ---
info "Checking prerequisites / ตรวจสอบโปรแกรมที่ต้องมี..."
command -v docker &>/dev/null || error "Docker not found. Install: https://docs.docker.com/get-docker/"
docker info &>/dev/null 2>&1 || error "Docker is not running. กรุณาเปิด Docker ก่อน"
success "Docker is ready"

# Check for Ollama
if command -v ollama &>/dev/null; then
    success "Ollama found"
    if ollama list 2>/dev/null | grep -q "llama"; then
        success "Ollama models detected"
    else
        warn "No Ollama models found. Install one: ollama pull llama3.2"
        warn "ไม่พบโมเดล Ollama ติดตั้ง: ollama pull llama3.2"
    fi
else
    warn "Ollama not found. Install from: https://ollama.com"
    warn "Open WebUI will work but needs Ollama running on host"
fi

# --- Generate .env ---
if [ -f "$SCRIPT_DIR/.env" ]; then
    warn ".env already exists. Backing up to .env.backup"
    cp "$SCRIPT_DIR/.env" "$SCRIPT_DIR/.env.backup"
fi

cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"

ENCRYPTION_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
WEBUI_SECRET=$(openssl rand -hex 32)

sed -i.bak "s|N8N_ENCRYPTION_KEY=change-me-to-random-string|N8N_ENCRYPTION_KEY=$ENCRYPTION_KEY|" "$SCRIPT_DIR/.env"
sed -i.bak "s|POSTGRES_PASSWORD=change-me|POSTGRES_PASSWORD=$DB_PASSWORD|" "$SCRIPT_DIR/.env"
sed -i.bak "s|WEBUI_SECRET_KEY=change-me-to-random-string|WEBUI_SECRET_KEY=$WEBUI_SECRET|" "$SCRIPT_DIR/.env"
rm -f "$SCRIPT_DIR/.env.bak"

# --- Interactive API Key Prompts ---
echo ""
echo -e "${BOLD}Configure Settings / ตั้งค่า${NC}"
echo "(Press Enter to skip / กด Enter เพื่อข้าม)"
echo ""

read -rp "  OpenAI API Key (optional, for cloud AI) (sk-...): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    sed -i.bak "s|OPENAI_API_KEY=sk-your-openai-api-key|OPENAI_API_KEY=$OPENAI_KEY|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  Google Calendar ID (e.g. you@gmail.com): " GCAL_ID
if [ -n "$GCAL_ID" ]; then
    sed -i.bak "s|GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com|GOOGLE_CALENDAR_ID=$GCAL_ID|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  Email address (for email summary): " EMAIL_ADDR
if [ -n "$EMAIL_ADDR" ]; then
    sed -i.bak "s|EMAIL_ADDRESS=your-email@gmail.com|EMAIL_ADDRESS=$EMAIL_ADDR|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  Email App Password (Gmail app password): " EMAIL_PASS
if [ -n "$EMAIL_PASS" ]; then
    sed -i.bak "s|EMAIL_APP_PASSWORD=your-app-password|EMAIL_APP_PASSWORD=$EMAIL_PASS|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  LINE Notify Token (for notifications): " LINE_NOTIFY
if [ -n "$LINE_NOTIFY" ]; then
    sed -i.bak "s|LINE_NOTIFY_TOKEN=your-line-notify-token|LINE_NOTIFY_TOKEN=$LINE_NOTIFY|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

success ".env configured / ตั้งค่า .env เรียบร้อย"

# --- Docker Compose Up ---
echo ""
info "Starting Docker containers / กำลังเริ่ม Docker containers..."
cd "$SCRIPT_DIR"
if docker compose version &>/dev/null 2>&1; then COMPOSE_CMD="docker compose"; else COMPOSE_CMD="docker-compose"; fi
$COMPOSE_CMD up -d

# --- Wait for Health ---
info "Waiting for services / รอ services ให้พร้อม..."
for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:7777/healthz 2>/dev/null | grep -qE "^(200|301|302)$"; then
        success "n8n is ready / n8n พร้อมแล้ว"; break
    fi
    echo -ne "\r  Waiting for n8n... ($i/30)"; sleep 2
done
echo ""

for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:7778 2>/dev/null; then
        success "Open WebUI is ready / Open WebUI พร้อมแล้ว"; break
    fi
    echo -ne "\r  Waiting for Open WebUI... ($i/30)"; sleep 2
done
echo ""

# --- Import Workflows ---
info "Importing workflows / กำลังนำเข้า workflows..."
if [ -f "$PARENT_DIR/import-workflows.sh" ]; then
    bash "$PARENT_DIR/import-workflows.sh" http://localhost:7777 home-ai || warn "Auto-import skipped. Import manually after n8n setup."
else
    warn "import-workflows.sh not found. Import workflows manually via n8n UI."
fi

# --- Done ---
echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Setup Complete! / ติดตั้งเสร็จแล้ว!${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}n8n (Workflows):${NC}   http://localhost:7777"
echo -e "  ${CYAN}Open WebUI (Chat):${NC} http://localhost:7778"
echo ""
echo -e "  ${YELLOW}Workflows included / Workflows ที่มี:${NC}"
echo "    - Morning Briefing (สรุปตอนเช้า)"
echo "    - Email Summary (สรุปอีเมล)"
echo ""
echo -e "  ${YELLOW}Tips / เคล็ดลับ:${NC}"
echo "    - Make sure Ollama is running: ollama serve"
echo "    - Pull a model: ollama pull llama3.2"
echo "    - Open WebUI connects to Ollama automatically"
echo ""
echo "  Edit .env to add missing settings / แก้ไข .env เพื่อเพิ่มการตั้งค่า:"
echo "    nano $SCRIPT_DIR/.env"
echo ""
