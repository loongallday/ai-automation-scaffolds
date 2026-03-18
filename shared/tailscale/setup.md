# Tailscale Setup Guide / คู่มือติดตั้ง Tailscale

Tailscale creates a secure private network (VPN) so you can access your automation services from anywhere without exposing them to the public internet.

## Why Tailscale? / ทำไมต้อง Tailscale?

- Access n8n, Flowise, etc. from anywhere securely
- No need to open ports on your firewall
- No need for a public domain or SSL certificates
- Simple setup, works on all devices
- Free for personal use (up to 100 devices)

## Installation / วิธีติดตั้ง

### On your server (Linux)

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start and authenticate
sudo tailscale up

# Check your Tailscale IP
tailscale ip -4
```

### On your Mac

```bash
# Install via Homebrew
brew install --cask tailscale

# Or download from https://tailscale.com/download/mac
```

### On your iPhone/Android

Download "Tailscale" from the App Store or Google Play.

## Configuration / การตั้งค่า

### 1. Enable MagicDNS

1. Go to [Tailscale Admin Console](https://login.tailscale.com/admin/dns)
2. Enable "MagicDNS"
3. Now you can access services by hostname (e.g., `http://my-server:5678`)

### 2. Access services via Tailscale

Once connected, access your services using the Tailscale IP:

| Service    | URL                              |
|------------|----------------------------------|
| n8n        | `http://<tailscale-ip>:5678`    |
| Flowise    | `http://<tailscale-ip>:3000`    |
| PostgreSQL | `<tailscale-ip>:5432`           |

### 3. Update docker-compose.yml

For services you only want accessible via Tailscale, bind to the Tailscale interface:

```yaml
services:
  n8n:
    ports:
      - "100.x.x.x:5678:5678"  # Replace with your Tailscale IP
```

### 4. Share with team members (optional)

```bash
# Share a specific device with another Tailscale user
tailscale share <device-name> <user@email.com>
```

## Docker Integration / ใช้กับ Docker

Add Tailscale as a sidecar container:

```yaml
services:
  tailscale:
    image: tailscale/tailscale:latest
    hostname: my-automation-server
    environment:
      - TS_AUTHKEY=${TAILSCALE_AUTHKEY}
      - TS_STATE_DIR=/var/lib/tailscale
    volumes:
      - tailscale_data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    restart: always

volumes:
  tailscale_data:
```

Generate an auth key at: https://login.tailscale.com/admin/settings/keys

## Subnet Router / เข้าถึงเครือข่ายภายใน

To access all Docker services through Tailscale:

```bash
# On your server, advertise the Docker network
sudo tailscale up --advertise-routes=172.17.0.0/16

# Approve the route in Tailscale Admin Console
```

## Troubleshooting / แก้ปัญหา

```bash
# Check Tailscale status
tailscale status

# Check connectivity
tailscale ping <other-device>

# Restart Tailscale
sudo systemctl restart tailscaled
```
