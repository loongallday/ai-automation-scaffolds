#!/bin/bash
# ============================================================
# AI Studio — One-Command Demo Setup
# Usage: ./setup-credentials.sh [industry]
# ============================================================
set -e

INDUSTRY="${1:-ecommerce}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
N8N_URL="http://localhost:7777"
N8N_EMAIL="admin@aistudiothailand.com"
N8N_PASSWORD="Demo1234!"
COOKIE="/tmp/n8n-setup-$$.txt"

echo ""
echo "🚀 AI Studio — Demo Setup ($INDUSTRY)"
echo "============================================="

# ── 1. Wait for n8n ──
echo "⏳ Waiting for n8n..."
for i in $(seq 1 60); do
  if curl -sf "$N8N_URL/healthz" > /dev/null 2>&1; then break; fi
  if [ "$i" -eq 60 ]; then echo "❌ n8n didn't start"; exit 1; fi
  sleep 2
done
echo "✅ n8n ready"

# ── 2. Create owner ──
echo "👤 Setting up owner account..."
curl -sf -X POST "$N8N_URL/rest/owner/setup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$N8N_EMAIL\",\"firstName\":\"AI\",\"lastName\":\"Studio\",\"password\":\"$N8N_PASSWORD\"}" > /dev/null 2>&1 || true
echo "✅ Owner: $N8N_EMAIL"

# ── 3. Login ──
curl -sf -X POST "$N8N_URL/rest/login" \
  -H "Content-Type: application/json" \
  -d "{\"emailOrLdapLoginId\":\"$N8N_EMAIL\",\"password\":\"$N8N_PASSWORD\"}" \
  -c "$COOKIE" > /dev/null 2>&1
echo "✅ Logged in"

# ── 4. Import workflows ──
WF_DIR="$SCRIPT_DIR/$INDUSTRY/n8n-workflows"
IMPORTED=0

if [ -d "$WF_DIR" ]; then
  echo "📥 Importing workflows from $INDUSTRY..."
  for wf_file in "$WF_DIR"/*.json; do
    [ ! -f "$wf_file" ] && continue
    WF_NAME=$(basename "$wf_file" .json)

    # Import
    RESULT=$(curl -sf -X POST "$N8N_URL/rest/workflows" \
      -H "Content-Type: application/json" \
      -b "$COOKIE" \
      -d @"$wf_file" 2>&1) || { echo "   ⚠️  $WF_NAME — import failed"; continue; }

    WF_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('id',''))" 2>/dev/null)
    VERSION=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('versionId',''))" 2>/dev/null)

    if [ -z "$WF_ID" ]; then echo "   ⚠️  $WF_NAME — no ID"; continue; fi

    # Activate (n8n v2 requires POST /activate with versionId)
    curl -sf -X POST "$N8N_URL/rest/workflows/$WF_ID/activate" \
      -H "Content-Type: application/json" \
      -b "$COOKIE" \
      -d "{\"versionId\":\"$VERSION\"}" > /dev/null 2>&1 || true

    IMPORTED=$((IMPORTED + 1))
    echo "   ✅ $WF_NAME — active"
  done
fi

# ── 5. Done ──
rm -f "$COOKIE"

echo ""
echo "============================================="
echo "✅ Setup complete! ($IMPORTED workflows imported)"
echo ""
echo "📋 Access URLs:"
echo "   Dashboard:  http://localhost:7780"
echo "   n8n:        http://localhost:7777"
echo "   Flowise:    http://localhost:7778"
echo ""
echo "🔑 Credentials:"
echo "   n8n:        $N8N_EMAIL / $N8N_PASSWORD"
echo "   Flowise:    admin / Demo1234!"
echo "   Postgres:   automation / demo-pass-2024"
echo ""
echo "🎯 Open http://localhost:7780 and try the LINE chat!"
echo "============================================="
