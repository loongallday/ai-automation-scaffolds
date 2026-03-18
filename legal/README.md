# Legal AI Automation / ระบบ AI อัตโนมัติสำหรับสำนักงานกฎหมาย

AI-powered automation for Thai law firms using n8n + Flowise + Qdrant vector database.

ระบบ AI สำหรับทนาย: วิเคราะห์สัญญา, ค้นกฎหมาย, ตรวจ PDPA, ร่างเอกสาร

---

## What's Included / สิ่งที่ได้

### Services

| Service    | Port      | Description                       |
|------------|-----------|-----------------------------------|
| n8n        | 5678      | Workflow automation engine        |
| Flowise    | 3000      | RAG chatflow builder              |
| Qdrant     | 6333/6334 | Vector database for legal docs    |
| PostgreSQL | 5432      | Relational database               |
| Caddy      | 80/443    | Reverse proxy with auto-SSL       |

> Legal scaffold ใช้ resource มากที่สุด — ต้องมี Qdrant สำหรับ vector storage

### n8n Workflows (2)

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Document Draft | `document-draft.json` | Webhook | ร่างเอกสารกฎหมายจาก template (NDA, สัญญาเช่า, หนังสือทวงถาม) |
| PDPA Check | `pdpa-check.json` | Webhook | ตรวจ privacy policy เทียบกับ PDPA requirements |

### Flowise Chatflows (2)

| Chatflow | File | Purpose |
|----------|------|---------|
| Contract Analysis | `flowise/contract-analysis.json` | Upload + วิเคราะห์สัญญา PDF — extract risks, obligations, terms |
| Legal Search | `flowise/legal-search.json` | ค้นข้อกฎหมายไทย + สัญญาตัวอย่างด้วย natural language |

---

## Prerequisites / สิ่งที่ต้องมี

- Docker & Docker Compose (v2+)
- OpenAI API key (for embeddings and LLM)
- Domain name with DNS:
  - `n8n.yourdomain.com` -> server IP
  - `flowise.yourdomain.com` -> server IP
- **Minimum 8GB RAM** (Qdrant + Flowise + n8n)
- Legal document PDFs for RAG knowledge base

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

Fill in OpenAI API key, passwords, and domain.

### Step 3: Start services

```bash
docker compose up -d
```

### Step 4: Access services

- **n8n:** https://n8n.yourdomain.com (or http://localhost:5678)
- **Flowise:** https://flowise.yourdomain.com (or http://localhost:3000)
- **Qdrant Dashboard:** http://localhost:6333/dashboard

### Step 5: Import workflows and chatflows

```bash
../../import-workflows.sh http://localhost:5678 legal
```

Then import Flowise chatflows via Flowise UI.

---

## Environment Variables / ตัวแปร

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `N8N_HOST` | n8n hostname | `n8n.mylawfirm.com` | Yes |
| `WEBHOOK_URL` | Webhook URL | `https://n8n.mylawfirm.com/` | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key | `openssl rand -hex 32` | Yes |
| `POSTGRES_DB` | Database name | `automation` | Yes |
| `POSTGRES_USER` | Database user | `automation` | Yes |
| `POSTGRES_PASSWORD` | Database password | Strong random | Yes |
| `FLOWISE_USERNAME` | Flowise login | `admin` | Yes |
| `FLOWISE_PASSWORD` | Flowise password | Strong random | Yes |
| `QDRANT_HOST` | Qdrant hostname | `qdrant` (Docker network) | Yes |
| `QDRANT_PORT` | Qdrant port | `6333` | Yes |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | Yes |
| `DOMAIN` | Your domain | `mylawfirm.com` | For SSL |

---

## How to Import Workflows into n8n

### Automated

```bash
../../import-workflows.sh http://localhost:5678 legal
```

### Manual (n8n UI)

1. Open n8n at http://localhost:5678
2. **Add Workflow** > **Import from File**
3. Import `document-draft.json` and `pdpa-check.json`
4. Set up OpenAI credentials in n8n
5. **Activate** each workflow

### Flowise Chatflows

1. Open Flowise at http://localhost:3000
2. **Chatflows** > **Add New** > **Load Chatflow**
3. Import `flowise/contract-analysis.json`
4. Import `flowise/legal-search.json`
5. Update API keys in chatflow nodes
6. Upload legal documents (PDFs) to build the knowledge base

---

## How to Test Each Workflow / ทดสอบ

### Contract Analysis (Flowise)

1. Open the Contract Analysis chatflow in Flowise
2. Upload a contract PDF
3. Ask questions:
   - "สัญญานี้มีข้อกำหนดอะไรบ้าง?"
   - "มีความเสี่ยงอะไรในสัญญานี้?"
   - "ระยะเวลาสัญญาเท่าไหร่?"

### Legal Search (Flowise)

1. Upload legal PDFs to the knowledge base first
2. Ask: "NDA ต้องมีอะไรบ้าง?"
3. Ask: "สัญญาเช่ามีข้อกำหนดอะไรตาม ป.พ.พ.?"

### PDPA Check (`pdpa-check.json`)

```bash
curl -X POST https://n8n.yourdomain.com/webhook/pdpa-check \
  -H "Content-Type: application/json" \
  -d '{
    "content": "your privacy policy text here",
    "context": "privacy policy for e-commerce website"
  }'
```

**Test locally:**
```bash
curl -X POST http://localhost:5678/webhook-test/pdpa-check \
  -H "Content-Type: application/json" \
  -d '{"content":"เราเก็บข้อมูลชื่อ อีเมล เบอร์โทร เพื่อให้บริการ","context":"privacy policy"}'
```

### Document Drafting (`document-draft.json`)

```bash
curl -X POST http://localhost:5678/webhook-test/draft-document \
  -H "Content-Type: application/json" \
  -d '{
    "document_type": "nda",
    "parties": "บริษัท A และ บริษัท B",
    "key_terms": "ระยะเวลา 2 ปี, เขตอำนาจศาลไทย",
    "conditions": "mutual NDA"
  }'
```

---

## Demo Mode / โหมดสาธิต

### Start without external APIs

```bash
cp .env.example .env
# Set OPENAI_API_KEY to your key (needed for embeddings)
docker compose up -d
```

### Upload sample legal documents

1. Open Flowise
2. Go to Contract Analysis chatflow
3. Upload sample PDFs (e.g., template NDA, sample lease agreement)
4. Test queries against the uploaded documents

### Test PDPA check with sample text

```bash
curl -X POST http://localhost:5678/webhook-test/pdpa-check \
  -H "Content-Type: application/json" \
  -d '{"content":"บริษัทเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเพื่อการให้บริการ","context":"privacy policy demo"}'
```

### Demo limitations

- Contract analysis quality depends on uploaded documents
- RAG search needs a populated knowledge base
- Qdrant needs time to build vector index for large document sets

---

## Customization Guide / Customize สำหรับลูกค้า

| Item | Where | How |
|------|-------|-----|
| **Document templates** | n8n workflow | Add/edit templates in document-draft workflow |
| **PDPA checklist** | n8n workflow | Customize 8 PDPA categories in pdpa-check |
| **Legal knowledge base** | Flowise | Upload client-specific legal documents |
| **Contract types** | Flowise chatflow | Adjust prompts for specific contract types |
| **Output language** | n8n/Flowise prompts | Thai / English / bilingual |
| **Vector store** | Qdrant | Separate collections per client |
| **Disclaimer text** | n8n workflow | Update legal disclaimer in output |
| **Domain** | `.env` | Client's domain |

---

## Troubleshooting / แก้ไขปัญหา

| Problem | Solution |
|---------|----------|
| Qdrant not starting | Check RAM (needs 2+ GB), `docker compose logs qdrant` |
| Flowise can't connect to Qdrant | Verify `QDRANT_HOST=qdrant` in chatflow config |
| Contract analysis empty results | Upload documents to Flowise first |
| PDPA check timeout | Large documents may take 30+ seconds, increase timeout |
| Embedding errors | Verify `OPENAI_API_KEY` is valid and has credits |
| Vector search returns irrelevant results | Adjust chunk size and overlap in Flowise |

```bash
# Debug commands
docker compose ps
docker compose logs qdrant
docker compose logs flowise
curl http://localhost:6333/dashboard  # Qdrant health
```

---

## Disclaimer / ข้อจำกัดความรับผิดชอบ

This system provides AI-assisted analysis only. All outputs should be reviewed by a qualified legal professional before use. This is not a substitute for professional legal advice.

ระบบนี้ให้ข้อมูลช่วยวิเคราะห์เท่านั้น ผลลัพธ์ทั้งหมดต้องได้รับการตรวจสอบจากนักกฎหมายที่มีคุณสมบัติก่อนนำไปใช้

---

## Support / ติดต่อ

- Website: [aistudio.co.th](https://aistudio.co.th)
- LINE: @ai-studio-th
- Email: support@aistudio.co.th
