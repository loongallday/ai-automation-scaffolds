#!/bin/bash
# =============================================================================
# AI Studio Thailand — Workflow Importer / นำเข้า Workflow อัตโนมัติ
# =============================================================================
# Imports all workflow JSONs into a running n8n instance
# Usage: ./import-workflows.sh <n8n-url> <industry>
# Example: ./import-workflows.sh http://localhost:7777 ecommerce
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
error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Banner ---
echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║        AI Studio Thailand — Workflow Importer           ║"
echo "  ║              นำเข้า Workflow อัตโนมัติ                     ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Validate Arguments ---
if [ $# -lt 2 ]; then
    error "Usage: ./import-workflows.sh <n8n-url> <industry>"
    error "การใช้งาน: ./import-workflows.sh <n8n-url> <ประเภทธุรกิจ>"
    echo ""
    echo "Examples / ตัวอย่าง:"
    echo "  ./import-workflows.sh http://localhost:7777 ecommerce"
    echo "  ./import-workflows.sh https://n8n.myshop.com restaurant"
    exit 1
fi

N8N_URL="${1%/}"  # Remove trailing slash
INDUSTRY="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

VALID_INDUSTRIES=("ecommerce" "restaurant" "legal" "healthcare" "realestate" "creator" "home-ai")
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

WORKFLOWS_DIR="$SCRIPT_DIR/$INDUSTRY/n8n-workflows"

if [ ! -d "$WORKFLOWS_DIR" ]; then
    error "Workflows directory not found: $WORKFLOWS_DIR"
    error "ไม่พบโฟลเดอร์ workflows: $WORKFLOWS_DIR"
    exit 1
fi

# --- Check n8n is reachable ---
info "Checking n8n connectivity / ตรวจสอบการเชื่อมต่อ n8n..."

MAX_WAIT=30
ATTEMPT=1
while [ $ATTEMPT -le $MAX_WAIT ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$N8N_URL/healthz" 2>/dev/null || echo "000")
    if [[ "$HTTP_CODE" =~ ^(200|301|302|401|403)$ ]]; then
        success "n8n is reachable at $N8N_URL"
        break
    fi
    if [ $ATTEMPT -eq $MAX_WAIT ]; then
        error "Cannot reach n8n at $N8N_URL (HTTP $HTTP_CODE)"
        error "ไม่สามารถเชื่อมต่อ n8n ที่ $N8N_URL"
        echo ""
        echo "Make sure n8n is running / ตรวจสอบว่า n8n ทำงานอยู่:"
        echo "  docker compose ps"
        exit 1
    fi
    echo -ne "\r  Waiting for n8n... ($ATTEMPT/$MAX_WAIT)"
    sleep 2
    ATTEMPT=$((ATTEMPT + 1))
done

# --- Get or create API key ---
# n8n v1.x supports REST API. We'll try using the API directly.
# If the instance is fresh (no owner), we need to set up first.

info "Checking n8n setup status / ตรวจสอบสถานะ n8n..."

# Check if n8n needs initial setup (owner creation)
SETUP_CHECK=$(curl -s "$N8N_URL/api/v1/workflows" -w "\n%{http_code}" 2>/dev/null)
SETUP_HTTP=$(echo "$SETUP_CHECK" | tail -1)

if [ "$SETUP_HTTP" = "401" ]; then
    warn "n8n requires authentication. / n8n ต้องการการยืนยันตัวตน"
    echo ""
    echo "Please provide your n8n API key / กรุณาใส่ n8n API key:"
    echo "  1. Open n8n in browser / เปิด n8n ในเบราว์เซอร์: $N8N_URL"
    echo "  2. Go to Settings > API / ไปที่ Settings > API"
    echo "  3. Create an API key / สร้าง API key"
    echo ""
    read -rp "  API Key: " N8N_API_KEY

    if [ -z "$N8N_API_KEY" ]; then
        error "API key is required / ต้องใส่ API key"
        exit 1
    fi

    # Verify API key works
    VERIFY=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_URL/api/v1/workflows" 2>/dev/null)

    if [ "$VERIFY" != "200" ]; then
        error "Invalid API key (HTTP $VERIFY) / API key ไม่ถูกต้อง"
        exit 1
    fi
    success "API key verified / ยืนยัน API key สำเร็จ"
    AUTH_HEADER="-H \"X-N8N-API-KEY: $N8N_API_KEY\""
elif [ "$SETUP_HTTP" = "200" ]; then
    info "n8n is accessible without API key (fresh instance)"
    N8N_API_KEY=""
    AUTH_HEADER=""
else
    warn "Unexpected response from n8n (HTTP $SETUP_HTTP). Attempting import anyway..."
    N8N_API_KEY=""
    AUTH_HEADER=""
fi

# --- Import Workflows ---
echo ""
info "Importing workflows from: $WORKFLOWS_DIR"
info "นำเข้า workflows จาก: $WORKFLOWS_DIR"
echo ""

IMPORTED=0
FAILED=0
TOTAL=0

for WORKFLOW_FILE in "$WORKFLOWS_DIR"/*.json; do
    [ -f "$WORKFLOW_FILE" ] || continue
    TOTAL=$((TOTAL + 1))

    FILENAME=$(basename "$WORKFLOW_FILE")
    WORKFLOW_NAME="${FILENAME%.json}"

    # Read the workflow JSON
    WORKFLOW_JSON=$(cat "$WORKFLOW_FILE")

    # Wrap in n8n import format if not already wrapped
    # n8n API expects: { "name": "...", "nodes": [...], "connections": {...} ... }
    # If the file is just nodes/connections, we wrap it
    if echo "$WORKFLOW_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if 'nodes' in d else 1)" 2>/dev/null; then
        IMPORT_JSON="$WORKFLOW_JSON"
    else
        # Wrap as a basic workflow
        IMPORT_JSON=$(python3 -c "
import json, sys
data = json.load(open('$WORKFLOW_FILE'))
if 'name' not in data:
    data['name'] = '$WORKFLOW_NAME'
print(json.dumps(data))
" 2>/dev/null || echo "$WORKFLOW_JSON")
    fi

    # Make sure the workflow has a name
    IMPORT_JSON=$(echo "$IMPORT_JSON" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if 'name' not in data or not data['name']:
        data['name'] = '$WORKFLOW_NAME'
    print(json.dumps(data))
except:
    sys.exit(1)
" 2>/dev/null || echo "$IMPORT_JSON")

    # Import via n8n REST API
    if [ -n "$N8N_API_KEY" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" \
            -X POST "$N8N_URL/api/v1/workflows" \
            -H "Content-Type: application/json" \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -d "$IMPORT_JSON" 2>/dev/null)
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" \
            -X POST "$N8N_URL/api/v1/workflows" \
            -H "Content-Type: application/json" \
            -d "$IMPORT_JSON" 2>/dev/null)
    fi

    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [[ "$HTTP_CODE" =~ ^(200|201)$ ]]; then
        WORKFLOW_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id','?'))" 2>/dev/null || echo "?")
        success "Imported: $FILENAME (ID: $WORKFLOW_ID)"
        IMPORTED=$((IMPORTED + 1))
    else
        error "Failed to import: $FILENAME (HTTP $HTTP_CODE)"
        if [ "$HTTP_CODE" != "000" ]; then
            echo "  Response: $(echo "$BODY" | head -c 200)"
        fi
        FAILED=$((FAILED + 1))
    fi
done

# --- Summary ---
echo ""
echo -e "${BOLD}══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Import Summary / สรุปการนำเข้า${NC}"
echo -e "${BOLD}══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Total workflows / ทั้งหมด:     $TOTAL"
echo -e "  ${GREEN}Imported / นำเข้าสำเร็จ:${NC}       $IMPORTED"
if [ $FAILED -gt 0 ]; then
    echo -e "  ${RED}Failed / ล้มเหลว:${NC}             $FAILED"
fi
echo ""

if [ $FAILED -gt 0 ]; then
    warn "Some workflows failed to import. / บาง workflows นำเข้าไม่สำเร็จ"
    echo "  You can import them manually via n8n UI."
    echo "  สามารถนำเข้าด้วยตนเองผ่านหน้า n8n ได้"
    echo ""
    echo "  Manual import / นำเข้าด้วยตนเอง:"
    echo "    1. Open $N8N_URL in browser"
    echo "    2. Click 'Add Workflow' > 'Import from File'"
    echo "    3. Select JSON files from: $WORKFLOWS_DIR"
fi

if [ $IMPORTED -gt 0 ]; then
    echo ""
    success "Workflows imported! Open n8n to activate them."
    success "นำเข้า workflows แล้ว! เปิด n8n เพื่อเปิดใช้งาน"
    echo ""
    echo "  n8n URL: $N8N_URL"
    echo ""
    echo "  Remember to / อย่าลืม:"
    echo "    - Activate each workflow / เปิดใช้งานแต่ละ workflow"
    echo "    - Configure credentials / ตั้งค่า credentials (LINE, OpenAI, etc.)"
    echo "    - Test webhook URLs / ทดสอบ webhook URLs"
fi

echo ""
