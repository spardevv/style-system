# Deploy — CI/CD para stylesystem.spardevsvr.online

Todo push em `main` roda [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que sincroniza `index.html`, `style.css` e `app.js` para o VPS via `rsync` sobre SSH. Como é um site estático sem build, o deploy é só isso — sem etapa de compilação.

Feito o setup abaixo uma vez, todo `git push` para `main` publica sozinho.

---

## Status

- ✅ **SSH** (`hermes@187.127.24.62:22`) aberto e acessível.
- ✅ **Servidor configurado** — `deploy/setup-vps.sh` já rodou no VPS: nginx instalado, `/var/www/stylesystem` criado, portas 80/443 abertas, chave de deploy autorizada.
- ✅ **DNS ativo** — `stylesystem.spardevsvr.online` resolve para `187.127.24.62`.
- ✅ **Secret `DEPLOY_SSH_KEY`** configurado no GitHub.
- ⬜ **HTTPS** — ainda não emitido (passo 3 abaixo).

O que falta é só o certificado HTTPS; o deploy via push em `main` já funciona.

---

## Setup (uma vez só)

### 1. Configurar o servidor ✅ feito

O script [`deploy/setup-vps.sh`](deploy/setup-vps.sh) já rodou no VPS — instalou nginx, criou `/var/www/stylesystem`, escreveu o server block, abriu as portas 80/443 e autorizou a chave de deploy dedicada (não é a sua chave pessoal) em `~hermes/.ssh/authorized_keys`. É idempotente; se precisar rodar de novo (ex.: reinstalar o servidor):

```bash
curl -o setup-vps.sh https://raw.githubusercontent.com/spardevv/style-system/main/deploy/setup-vps.sh
bash setup-vps.sh
```
Rode direto numa sessão SSH interativa no servidor (não via `ssh host 'comando'` de fora) — o `sudo` precisa de terminal pra pedir a senha.

### 2. Apontar o DNS ✅ feito

`stylesystem.spardevsvr.online` já resolve para `187.127.24.62`.

### 3. HTTPS — pendente

```bash
ssh hermes@187.127.24.62
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d stylesystem.spardevsvr.online
```

O certbot já reconfigura o nginx para redirecionar HTTP → HTTPS automaticamente.

### 4. Secret no GitHub ✅ feito

`DEPLOY_SSH_KEY` já está em **Settings → Secrets and variables → Actions** com a chave privada do par de deploy.

Host, usuário e caminho (`stylesystem.spardevsvr.online`, `hermes`, `/var/www/stylesystem`) estão fixos no workflow como `env:` — não são segredos, mas dá pra mudá-los direto no `deploy.yml` se o servidor mudar.

> Se precisar trocar a chave de deploy: gere um novo par (`ssh-keygen -t ed25519 -C "github-actions-deploy@style-system" -f deploy_key -N ""`), atualize `DEPLOY_PUBKEY` em `deploy/setup-vps.sh`, rode o script de novo no servidor, e troque o valor do secret `DEPLOY_SSH_KEY` pela nova privada.

---

## Testando

Depois do secret configurado:

```bash
git push origin main
```

ou dispare manualmente em **Actions → Deploy to VPS → Run workflow**. Acompanhe o log — o último passo é o `rsync`; se passar, o site já está no ar em [stylesystem.spardevsvr.online](http://stylesystem.spardevsvr.online) (HTTP até o certificado sair — passo 3 acima).

---

## Rollback

Não há histórico de releases no servidor (rsync sobrescreve direto). Para reverter, dê `git revert` do commit problemático e faça push — o workflow re-publica o estado anterior. Se quiser manter backups automáticos das versões antigas, dá pra estender `deploy.yml` para copiar `$DEPLOY_PATH` para `$DEPLOY_PATH.bak` antes do rsync.
