#!/bin/bash
# =============================================================================
# AI Studio Thailand — E-commerce Local Setup
# ติดตั้งระบบ AI สำหรับร้านค้าออนไลน์
# =============================================================================
# Usage: ./setup-local.sh
# =============================================================================

set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║     AI Studio Thailand — E-commerce Setup               ║"
echo "  ║     ระบบ AI สำหรับร้านค้าออนไลน์                           ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Prerequisites ---
info "Checking prerequisites / ตรวจสอบโปรแกรมที่ต้องมี..."
command -v docker &>/dev/null || error "Docker not found. Install: https://docs.docker.com/get-docker/"
docker info &>/dev/null 2>&1 || error "Docker is not running. กรุณาเปิด Docker ก่อน"
success "Docker is ready"

# --- Generate .env ---
if [ -f "$SCRIPT_DIR/.env" ]; then
    warn ".env already exists. Backing up to .env.backup"
    cp "$SCRIPT_DIR/.env" "$SCRIPT_DIR/.env.backup"
fi

cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"

ENCRYPTION_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
FLOWISE_PASS=$(openssl rand -hex 12)

sed -i.bak "s|N8N_ENCRYPTION_KEY=change-me-to-random-string|N8N_ENCRYPTION_KEY=$ENCRYPTION_KEY|" "$SCRIPT_DIR/.env"
sed -i.bak "s|POSTGRES_PASSWORD=change-me|POSTGRES_PASSWORD=$DB_PASSWORD|" "$SCRIPT_DIR/.env"
sed -i.bak "s|FLOWISE_PASSWORD=change-me|FLOWISE_PASSWORD=$FLOWISE_PASS|" "$SCRIPT_DIR/.env"
rm -f "$SCRIPT_DIR/.env.bak"

# --- Interactive API Key Prompts ---
echo ""
echo -e "${BOLD}Configure API Keys / ตั้งค่า API Keys${NC}"
echo "(Press Enter to skip and configure later / กด Enter เพื่อข้ามไปตั้งค่าทีหลัง)"
echo ""

read -rp "  Domain (e.g. ai.myshop.com) [localhost]: " INPUT_DOMAIN
INPUT_DOMAIN="${INPUT_DOMAIN:-localhost}"
sed -i.bak "s|yourdomain.com|$INPUT_DOMAIN|g" "$SCRIPT_DIR/.env"
rm -f "$SCRIPT_DIR/.env.bak"

read -rp "  LINE Channel Access Token: " LINE_TOKEN
if [ -n "$LINE_TOKEN" ]; then
    sed -i.bak "s|LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token|LINE_CHANNEL_ACCESS_TOKEN=$LINE_TOKEN|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  LINE Channel Secret: " LINE_SECRET
if [ -n "$LINE_SECRET" ]; then
    sed -i.bak "s|LINE_CHANNEL_SECRET=your-line-channel-secret|LINE_CHANNEL_SECRET=$LINE_SECRET|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

read -rp "  OpenAI API Key (sk-...): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    sed -i.bak "s|OPENAI_API_KEY=sk-your-openai-api-key|OPENAI_API_KEY=$OPENAI_KEY|" "$SCRIPT_DIR/.env"
    rm -f "$SCRIPT_DIR/.env.bak"
fi

success ".env configured / ตั้งค่า .env เรียบร้อย"

# --- Docker Compose Up ---
echo ""
info "Starting Docker containers / กำลังเริ่ม Docker containers..."

cd "$SCRIPT_DIR"
if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

$COMPOSE_CMD up -d

# --- Wait for Health ---
info "Waiting for services to be ready / รอ services ให้พร้อม..."

for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:7777/healthz 2>/dev/null | grep -qE "^(200|301|302)$"; then
        success "n8n is ready / n8n พร้อมแล้ว"
        break
    fi
    echo -ne "\r  Waiting for n8n... ($i/30)"
    sleep 2
done
echo ""

for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:7778 2>/dev/null; then
        success "Flowise is ready / Flowise พร้อมแล้ว"
        break
    fi
    echo -ne "\r  Waiting for Flowise... ($i/30)"
    sleep 2
done
echo ""

# --- Import Workflows ---
info "Importing workflows / กำลังนำเข้า workflows..."
if [ -f "$PARENT_DIR/import-workflows.sh" ]; then
    bash "$PARENT_DIR/import-workflows.sh" http://localhost:7777 ecommerce || warn "Auto-import skipped. Import manually after n8n setup."
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
echo -e "  ${CYAN}Flowise (AI):${NC}      http://localhost:7778"
echo -e "  ${CYAN}Flowise Login:${NC}     admin / $FLOWISE_PASS"
echo ""
echo -e "  ${YELLOW}Workflows included / Workflows ที่มี:${NC}"
echo "    - LINE Chatbot (แชทบอท LINE)"
echo "    - Order Processing (ประมวลผลคำสั่งซื้อ)"
echo "    - Stock Alert (แจ้งเตือนสินค้าใกล้หมด)"
echo "    - Daily Report (รายงานประจำวัน)"
echo ""
echo "  Edit .env to add missing API keys / แก้ไข .env เพื่อเพิ่ม API keys:"
echo "    nano $SCRIPT_DIR/.env"
echo ""
