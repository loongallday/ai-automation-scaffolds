# AI Studio — Demo Credentials

> ⚠️ These are DEMO credentials only. Change all passwords before production use.

## Universal Demo Credentials (same across all 7 industries)

### n8n (Workflow Engine)
- URL: http://localhost:7777
- Email: admin@aistudiothailand.com
- Password: Demo1234!
- API Key: (generated on first setup)

### Flowise (AI Chains)
- URL: http://localhost:7778
- Username: admin
- Password: Demo1234!
- Secret Key: flowise-demo-secret-2024

### PostgreSQL (Database)
- Host: localhost:7779 (external) / postgres:5432 (internal)
- Database: automation
- Username: automation
- Password: demo-pass-2024

### Caddy (Reverse Proxy)
- Dashboard: http://localhost:7780
- Dashboard + Demo: http://localhost:7780/demo
- HTTPS: http://localhost:7781

### DeepSeek AI (LLM)
- API Key: YOUR_DEEPSEEK_API_KEY
- Endpoint: https://api.deepseek.com
- Model: deepseek-chat
- ⚠️ Requires active balance — top up at https://platform.deepseek.com

### n8n DeepSeek Credential Setup
After first login to n8n:
1. Go to Settings → Credentials → Add Credential
2. Search "OpenAI" → Create
3. Name: "DeepSeek API"
4. API Key: YOUR_DEEPSEEK_API_KEY
5. Base URL: https://api.deepseek.com
6. Save

### Demo Dashboard
- URL: http://localhost:7780 (or http://localhost:7780/demo)
- No login required
- Environment toggle: Demo ↔ Production
- AI Status: Shows green when DeepSeek connected

### LINE (for Production mode)
- Create channel at: https://developers.line.biz
- Required: Channel Secret + Channel Access Token
- Webhook URL: http://your-domain:7780/webhook/line

## Per-Industry Extras

### Legal (Qdrant Vector DB)
- URL: http://localhost:7782
- gRPC: localhost:7783
- No auth by default

### Creator (Dify)
- URL: http://localhost:7778
- Uses same port as Flowise (only one runs per stack)

### Home AI (Open WebUI)
- URL: http://localhost:7778
- Uses same port as Flowise

## Quick Test Commands

```bash
# Test n8n
curl http://localhost:7777/healthz

# Test Flowise
curl http://localhost:7778

# Test Dashboard
curl http://localhost:7780

# Test webhook (via Caddy CORS proxy)
curl -X POST http://localhost:7780/webhook/line \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"สวัสดี"},"source":{"userId":"test-001"}}]}'

# Test DeepSeek API
curl https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer YOUR_DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"max_tokens":10}'

# Test PostgreSQL
PGPASSWORD=demo-pass-2024 psql -h localhost -p 7779 -U automation -d automation -c "SELECT 1"
```
