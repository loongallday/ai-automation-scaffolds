#!/bin/bash
# Automated Backup Script for AI Automation Stacks
# Usage: ./backup.sh [stack_name]
# Example: ./backup.sh ecommerce
#
# Recommended: Add to crontab for daily backups
# 0 3 * * * /path/to/backup.sh ecommerce >> /var/log/backup.log 2>&1

set -euo pipefail

# Configuration
STACK_NAME="${1:-}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -z "$STACK_NAME" ]; then
    echo "Usage: $0 <stack_name>"
    echo "Available stacks: ecommerce, restaurant, legal, healthcare, realestate, creator, home-ai"
    exit 1
fi

STACK_DIR="$(dirname "$0")/../../${STACK_NAME}"
BACKUP_PATH="${BACKUP_DIR}/${STACK_NAME}/${TIMESTAMP}"

# Ensure backup directory exists
mkdir -p "$BACKUP_PATH"

echo "[$(date)] Starting backup for ${STACK_NAME}..."

# 1. Backup PostgreSQL database
echo "[$(date)] Backing up PostgreSQL..."
POSTGRES_CONTAINER=$(docker compose -f "${STACK_DIR}/docker-compose.yml" ps -q postgres 2>/dev/null || echo "")

if [ -n "$POSTGRES_CONTAINER" ]; then
    docker exec "$POSTGRES_CONTAINER" pg_dumpall -U automation | gzip > "${BACKUP_PATH}/postgres_dump.sql.gz"
    echo "[$(date)] PostgreSQL backup complete."
else
    echo "[$(date)] WARNING: PostgreSQL container not found. Skipping DB backup."
fi

# 2. Backup n8n data
echo "[$(date)] Backing up n8n data..."
N8N_CONTAINER=$(docker compose -f "${STACK_DIR}/docker-compose.yml" ps -q n8n 2>/dev/null || echo "")

if [ -n "$N8N_CONTAINER" ]; then
    docker cp "${N8N_CONTAINER}:/home/node/.n8n" "${BACKUP_PATH}/n8n_data"
    echo "[$(date)] n8n backup complete."
fi

# 3. Backup Flowise data (if exists)
FLOWISE_CONTAINER=$(docker compose -f "${STACK_DIR}/docker-compose.yml" ps -q flowise 2>/dev/null || echo "")

if [ -n "$FLOWISE_CONTAINER" ]; then
    echo "[$(date)] Backing up Flowise data..."
    docker cp "${FLOWISE_CONTAINER}:/root/.flowise" "${BACKUP_PATH}/flowise_data"
    echo "[$(date)] Flowise backup complete."
fi

# 4. Backup Qdrant data (if exists, for legal stack)
QDRANT_CONTAINER=$(docker compose -f "${STACK_DIR}/docker-compose.yml" ps -q qdrant 2>/dev/null || echo "")

if [ -n "$QDRANT_CONTAINER" ]; then
    echo "[$(date)] Backing up Qdrant snapshots..."
    curl -s "http://localhost:6333/snapshots" -X POST | jq -r '.result.name' | while read snapshot; do
        curl -s "http://localhost:6333/snapshots/${snapshot}" -o "${BACKUP_PATH}/${snapshot}"
    done
    echo "[$(date)] Qdrant backup complete."
fi

# 5. Backup environment file
if [ -f "${STACK_DIR}/.env" ]; then
    cp "${STACK_DIR}/.env" "${BACKUP_PATH}/env_backup"
fi

# 6. Compress backup
echo "[$(date)] Compressing backup..."
tar -czf "${BACKUP_DIR}/${STACK_NAME}/${STACK_NAME}_${TIMESTAMP}.tar.gz" -C "${BACKUP_PATH}" .
rm -rf "${BACKUP_PATH}"

# 7. Clean old backups
echo "[$(date)] Cleaning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}/${STACK_NAME}" -name "*.tar.gz" -mtime "+${RETENTION_DAYS}" -delete

BACKUP_SIZE=$(du -sh "${BACKUP_DIR}/${STACK_NAME}/${STACK_NAME}_${TIMESTAMP}.tar.gz" | cut -f1)
echo "[$(date)] Backup complete: ${STACK_NAME}_${TIMESTAMP}.tar.gz (${BACKUP_SIZE})"
