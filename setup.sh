#!/bin/bash
# =============================================================================
# AI Studio Thailand — Automated Setup / ระบบติดตั้งอัตโนมัติ
# =============================================================================
# Usage: ./setup.sh <industry> <domain> <email>
# Example: ./setup.sh ecommerce ai.myshop.com admin@myshop.com
#
# ติดตั้งระบบ AI Automation ครบจบในคำสั่งเดียว
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

# --- Helpers ---
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; }
step()    { echo -e "\n${CYAN}${BOLD}▶ $1${NC}"; }

# --- Constants ---
VALID_INDUSTRIES=("ecommerce" "restaurant" "legal" "healthcare" "realestate" "creator" "home-ai")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_BASE="${DEPLOY_BASE:-$HOME/ai-deployments}"

# --- Banner ---
echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║           AI Studio Thailand — Auto Setup               ║"
echo "  ║        ระบบติดตั้ง AI Automation อัตโนมัติ                  ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# =============================================================================
# 1. Validate Arguments / ตรวจสอบพารามิเตอร์
# =============================================================================
step "1/7 Validating arguments / ตรวจสอบพารามิเตอร์"

if [ $# -lt 3 ]; then
    error "Usage: ./setup.sh <industry> <domain> <email>"
    error "การใช้งาน: ./setup.sh <ประเภทธุรกิจ> <โดเมน> <อีเมล>"
    echo ""
    echo "Available industries / ประเภทธุรกิจที่รองรับ:"
    for ind in "${VALID_INDUSTRIES[@]}"; do
        echo "  - $ind"
    done
    echo ""
    echo "Example / ตัวอย่าง:"
    echo "  ./setup.sh ecommerce ai.myshop.com admin@myshop.com"
    exit 1
fi

INDUSTRY="$1"
DOMAIN="$2"
EMAIL="$3"

# Validate industry
INDUSTRY_VALID=false
for ind in "${VALID_INDUSTRIES[@]}"; do
    if [ "$INDUSTRY" = "$ind" ]; then
        INDUSTRY_VALID=true
        break
    fi
done

if [ "$INDUSTRY_VALID" = false ]; then
    error "Invalid industry: '$INDUSTRY'"
    error "ประเภทธุรกิจไม่ถูกต้อง: '$INDUSTRY'"
    echo "Valid options / ตัวเลือกที่ใช้ได้: ${VALID_INDUSTRIES[*]}"
    exit 1
fi

# Validate domain format (basic check)
if [[ ! "$DOMAIN" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    error "Invalid domain format: '$DOMAIN'"
    error "รูปแบบโดเมนไม่ถูกต้อง: '$DOMAIN'"
    exit 1
fi

# Validate email format (basic check)
if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    error "Invalid email format: '$EMAIL'"
    error "รูปแบบอีเมลไม่ถูกต้อง: '$EMAIL'"
    exit 1
fi

success "Industry: $INDUSTRY | Domain: $DOMAIN | Email: $EMAIL"

# =============================================================================
# 2. Check Prerequisites / ตรวจสอบโปรแกรมที่ต้องมี
# =============================================================================
step "2/7 Checking prerequisites / ตรวจสอบโปรแกรมที่ต้องมี"

MISSING=()

if ! command -v docker &>/dev/null; then
    MISSING+=("docker")
fi

if ! docker compose version &>/dev/null 2>&1; then
    if ! command -v docker-compose &>/dev/null; then
        MISSING+=("docker-compose")
    fi
fi

if ! command -v curl &>/dev/null; then
    MISSING+=("curl")
fi

if ! command -v openssl &>/dev/null; then
    MISSING+=("openssl")
fi

if [ ${#MISSING[@]} -gt 0 ]; then
    error "Missing prerequisites / โปรแกรมที่ขาด: ${MISSING[*]}"
    echo ""
    echo "Install instructions / วิธีติดตั้ง:"
    for prog in "${MISSING[@]}"; do
        case "$prog" in
            docker)
                echo "  Docker: curl -fsSL https://get.docker.com | sh"
                ;;
            docker-compose)
                echo "  Docker Compose: included with Docker Desktop, or:"
                echo "    sudo apt-get install docker-compose-plugin"
                ;;
            curl)
                echo "  curl: sudo apt-get install curl"
                ;;
            openssl)
                echo "  openssl: sudo apt-get install openssl"
                ;;
        esac
    done
    exit 1
fi

# Check Docker is running
if ! docker info &>/dev/null 2>&1; then
    error "Docker is not running. Please start Docker first."
    error "Docker ไม่ทำงาน กรุณาเปิด Docker ก่อน"
    exit 1
fi

success "All prerequisites found / มีโปรแกรมที่ต้องใช้ครบแล้ว"

# =============================================================================
# 3. Copy Scaffold / คัดลอกโครงสร้างโปรเจกต์
# =============================================================================
step "3/7 Creating deployment directory / สร้างโฟลเดอร์สำหรับติดตั้ง"

SCAFFOLD_DIR="$SCRIPT_DIR/$INDUSTRY"
DEPLOY_DIR="$DEPLOY_BASE/${INDUSTRY}-$(date +%Y%m%d-%H%M%S)"

if [ ! -d "$SCAFFOLD_DIR" ]; then
    error "Scaffold directory not found: $SCAFFOLD_DIR"
    error "ไม่พบโฟลเดอร์ต้นแบบ: $SCAFFOLD_DIR"
    exit 1
fi

mkdir -p "$DEPLOY_DIR"
cp -r "$SCAFFOLD_DIR/"* "$DEPLOY_DIR/"
cp -r "$SCAFFOLD_DIR/".env.example "$DEPLOY_DIR/" 2>/dev/null || true

# Copy shared Caddyfile if exists
if [ -f "$SCRIPT_DIR/shared/caddy/Caddyfile" ]; then
    cp "$SCRIPT_DIR/shared/caddy/Caddyfile" "$DEPLOY_DIR/Caddyfile"
fi

success "Scaffold copied to: $DEPLOY_DIR"
success "คัดลอกต้นแบบไปที่: $DEPLOY_DIR"

# =============================================================================
# 4. Generate .env / สร้างไฟล์ตั้งค่า
# =============================================================================
step "4/7 Generating .env configuration / สร้างไฟล์ตั้งค่า .env"

ENCRYPTION_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
FLOWISE_PASS=$(openssl rand -hex 12)
WEBUI_SECRET=$(openssl rand -hex 32)
DIFY_SECRET=$(openssl rand -hex 32)

ENV_FILE="$DEPLOY_DIR/.env"

# Start with the example as base and do replacements
if [ -f "$DEPLOY_DIR/.env.example" ]; then
    cp "$DEPLOY_DIR/.env.example" "$ENV_FILE"
else
    error "No .env.example found in scaffold / ไม่พบไฟล์ .env.example"
    exit 1
fi

# Universal replacements
sed -i.bak "s|change-me-to-random-string|$ENCRYPTION_KEY|g" "$ENV_FILE"
sed -i.bak "s|N8N_ENCRYPTION_KEY=.*|N8N_ENCRYPTION_KEY=$ENCRYPTION_KEY|" "$ENV_FILE"
sed -i.bak "s|POSTGRES_PASSWORD=change-me|POSTGRES_PASSWORD=$DB_PASSWORD|" "$ENV_FILE"
sed -i.bak "s|FLOWISE_PASSWORD=change-me|FLOWISE_PASSWORD=$FLOWISE_PASS|" "$ENV_FILE"
sed -i.bak "s|yourdomain.com|$DOMAIN|g" "$ENV_FILE"
sed -i.bak "s|n8n.local|n8n.$DOMAIN|g" "$ENV_FILE"

# Replace domain in Caddyfile too
if [ -f "$DEPLOY_DIR/Caddyfile" ]; then
    sed -i.bak "s|{\$DOMAIN}|$DOMAIN|g" "$DEPLOY_DIR/Caddyfile"
fi

# Industry-specific replacements
case "$INDUSTRY" in
    creator)
        sed -i.bak "s|DIFY_SECRET_KEY=.*|DIFY_SECRET_KEY=$DIFY_SECRET|" "$ENV_FILE"
        ;;
    home-ai)
        sed -i.bak "s|WEBUI_SECRET_KEY=.*|WEBUI_SECRET_KEY=$WEBUI_SECRET|" "$ENV_FILE"
        sed -i.bak "s|WEBHOOK_URL=http://.*|WEBHOOK_URL=http://n8n.$DOMAIN:7777/|" "$ENV_FILE"
        ;;
esac

# Append metadata
cat >> "$ENV_FILE" <<EOF

# === Auto-generated by AI Studio Thailand Setup ===
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Industry: $INDUSTRY
# Domain: $DOMAIN
# Email: $EMAIL
# ===================================================
# IMPORTANT: Add your API keys below / กรุณาเพิ่ม API keys ด้านล่าง
# - LINE_CHANNEL_ACCESS_TOKEN: Get from LINE Developers Console
#   https://developers.line.biz/
# - OPENAI_API_KEY: Get from OpenAI Platform
#   https://platform.openai.com/api-keys
# ===================================================
EOF

# Clean up backup files
rm -f "$DEPLOY_DIR/"*.bak "$DEPLOY_DIR/".env.bak

success ".env generated with secure random passwords"
success "สร้างไฟล์ .env พร้อมรหัสผ่านแบบสุ่มแล้ว"

# =============================================================================
# 5. Start Docker Containers / เริ่มต้น Docker
# =============================================================================
step "5/7 Starting Docker containers / กำลังเริ่ม Docker containers"

cd "$DEPLOY_DIR"

# Use docker compose (v2) or docker-compose (v1)
if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

info "Running: $COMPOSE_CMD up -d"
$COMPOSE_CMD up -d

success "Containers started / เริ่ม containers แล้ว"

# =============================================================================
# 6. Wait for Services / รอให้ services พร้อม
# =============================================================================
step "6/7 Waiting for services to be healthy / รอให้ services พร้อมใช้งาน"

wait_for_service() {
    local name="$1"
    local url="$2"
    local max_attempts="${3:-30}"
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -qE "^(200|301|302|401|403)$"; then
            success "$name is ready / $name พร้อมแล้ว"
            return 0
        fi
        echo -ne "\r  Waiting for $name... ($attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    echo ""
    warn "$name did not respond in time. It may still be starting up."
    warn "$name ยังไม่พร้อม อาจกำลังเริ่มต้นอยู่"
    return 1
}

# Check n8n
wait_for_service "n8n" "http://localhost:7777/healthz" 30

# Check Flowise (if in this stack)
if grep -q "flowise" "$DEPLOY_DIR/docker-compose.yml" 2>/dev/null; then
    wait_for_service "Flowise" "http://localhost:7778" 30
fi

# Check Open WebUI (home-ai)
if grep -q "open-webui" "$DEPLOY_DIR/docker-compose.yml" 2>/dev/null; then
    wait_for_service "Open WebUI" "http://localhost:8080" 30
fi

# =============================================================================
# 7. Print Results / แสดงผลลัพธ์
# =============================================================================
step "7/7 Setup Complete! / ติดตั้งเสร็จแล้ว!"

echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Setup Complete! / ติดตั้งเสร็จแล้ว!${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}Deployment directory / โฟลเดอร์ที่ติดตั้ง:${NC}"
echo "  $DEPLOY_DIR"
echo ""
echo -e "${BOLD}Access URLs / ลิงก์เข้าใช้งาน:${NC}"
echo -e "  ${CYAN}n8n (Workflows):${NC}  https://n8n.$DOMAIN"
echo -e "                     http://localhost:7777"

if grep -q "flowise" "$DEPLOY_DIR/docker-compose.yml" 2>/dev/null; then
    echo -e "  ${CYAN}Flowise (AI):${NC}     https://flowise.$DOMAIN"
    echo -e "                     http://localhost:7778"
    echo -e "  ${CYAN}Flowise Login:${NC}    admin / $FLOWISE_PASS"
fi

if grep -q "open-webui" "$DEPLOY_DIR/docker-compose.yml" 2>/dev/null; then
    echo -e "  ${CYAN}Open WebUI:${NC}       http://localhost:8080"
fi

echo ""
echo -e "${BOLD}Database / ฐานข้อมูล:${NC}"
echo -e "  PostgreSQL:       localhost:7779"
echo -e "  Password:         $DB_PASSWORD"
echo ""
echo -e "${YELLOW}${BOLD}Next Steps / สิ่งที่ต้องทำต่อ:${NC}"
echo ""
echo "  1. Add your API keys to .env / เพิ่ม API keys ใน .env:"
echo "     nano $DEPLOY_DIR/.env"
echo ""
echo "  2. Import workflows into n8n / นำเข้า workflows:"
echo "     $SCRIPT_DIR/import-workflows.sh http://localhost:7777 $INDUSTRY"
echo ""
echo "  3. Configure LINE webhook URL / ตั้งค่า LINE webhook:"
echo "     https://n8n.$DOMAIN/webhook/line"
echo ""
echo "  4. Restart after editing .env / รีสตาร์ทหลังแก้ .env:"
echo "     cd $DEPLOY_DIR && $COMPOSE_CMD restart"
echo ""

# =============================================================================
# Optional: Tailscale / ติดตั้ง Tailscale (เลือกได้)
# =============================================================================
if [ "${INSTALL_TAILSCALE:-}" = "yes" ] || [ "${4:-}" = "--tailscale" ]; then
    step "Installing Tailscale / กำลังติดตั้ง Tailscale"
    if command -v tailscale &>/dev/null; then
        warn "Tailscale is already installed / Tailscale ติดตั้งแล้ว"
    else
        info "Installing Tailscale..."
        curl -fsSL https://tailscale.com/install.sh | sh
        success "Tailscale installed. Run 'sudo tailscale up' to connect."
        success "Tailscale ติดตั้งแล้ว ใช้คำสั่ง 'sudo tailscale up' เพื่อเชื่อมต่อ"
    fi
elif [ "${4:-}" != "--tailscale" ]; then
    echo -e "${BLUE}[TIP]${NC} Want secure remote access? Re-run with --tailscale flag"
    echo -e "      ต้องการเข้าถึงจากระยะไกล? ใส่ --tailscale ตอนรัน"
    echo ""
fi

echo -e "${GREEN}${BOLD}Enjoy your AI automation! / ขอให้สนุกกับระบบ AI! 🚀${NC}"
echo ""
