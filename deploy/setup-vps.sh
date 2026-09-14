#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# One-time bootstrap for stylesystem.spardevsvr.com
#
# Run this ONCE, directly on the VPS, logged in as `hermes`:
#
#   scp deploy/setup-vps.sh hermes@187.127.24.62:~/
#   ssh hermes@187.127.24.62
#   bash setup-vps.sh
#
# It installs nginx (if missing), creates the deploy directory that
# GitHub Actions rsyncs into, writes an nginx server block for the
# domain, opens the firewall, and authorizes the CI deploy key. It is
# safe to re-run — every step is idempotent.
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="stylesystem.spardevsvr.com"
DEPLOY_PATH="/var/www/stylesystem"

# Public half of the dedicated CI deploy keypair (generated for this
# project; the matching private key goes into the DEPLOY_SSH_KEY GitHub
# secret — see DEPLOYMENT.md). Safe to keep here: it's a public key.
DEPLOY_PUBKEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB8GUqkVs4Es9PAmHOOz2LXRH7xCrcw+7OTjU4v9IdyM github-actions-deploy@style-system"

echo "==> Installing nginx (skipped if already present)"
if ! command -v nginx >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y nginx
fi

echo "==> Creating deploy directory: $DEPLOY_PATH"
sudo mkdir -p "$DEPLOY_PATH"
sudo chown -R "$USER":"$USER" "$DEPLOY_PATH"
sudo chmod 755 "$DEPLOY_PATH"
if [ ! -f "$DEPLOY_PATH/index.html" ]; then
  echo "<!doctype html><title>stylesystem</title><p>Waiting for first deploy…</p>" > "$DEPLOY_PATH/index.html"
fi

echo "==> Writing nginx site config for $DOMAIN"
sudo tee /etc/nginx/sites-available/stylesystem.conf > /dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${DEPLOY_PATH};
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    gzip on;
    gzip_types text/css application/javascript application/json text/plain;
}
NGINX

sudo ln -sf /etc/nginx/sites-available/stylesystem.conf /etc/nginx/sites-enabled/stylesystem.conf
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

echo "==> Opening firewall ports 80/443 (if ufw is active)"
if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 'Nginx Full' 2>/dev/null || { sudo ufw allow 80/tcp && sudo ufw allow 443/tcp; }
fi

echo "==> Authorizing the GitHub Actions deploy key for $USER"
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
if ! grep -qF "github-actions-deploy@style-system" "$HOME/.ssh/authorized_keys"; then
  echo "$DEPLOY_PUBKEY" >> "$HOME/.ssh/authorized_keys"
fi
chmod 600 "$HOME/.ssh/authorized_keys"

cat <<EOF

✅ Server ready.

Next steps:
  1. Point DNS: create an A record for ${DOMAIN} -> \$(this server's public IP).
  2. Once it resolves, get HTTPS with:
       sudo apt-get install -y certbot python3-certbot-nginx
       sudo certbot --nginx -d ${DOMAIN}
  3. Push to main (or re-run the "Deploy to VPS" GitHub Action) to publish the site.
EOF
