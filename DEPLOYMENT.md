# Deploy — CI/CD para stylesystem.spardevsvr.com

Todo push em `main` roda [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que sincroniza `index.html`, `style.css` e `app.js` para o VPS via `rsync` sobre SSH. Como é um site estático sem build, o deploy é só isso — sem etapa de compilação.

Feito o setup abaixo uma vez, todo `git push` para `main` publica sozinho.

---

## O que já foi checado

- **SSH** (`hermes@187.127.24.62:22`) está aberto e acessível.
- **Portas 80/443 estão fechadas/filtradas** — não há nginx (ou outro servidor web) respondendo ainda nesse IP.
- **DNS de `spardevsvr.com` ainda não existe** (não resolve nem no resolver padrão nem em `8.8.8.8`). O domínio `stylesystem.spardevsvr.com` **precisa de um registro A** apontando pro IP do VPS antes de funcionar por nome.

Ou seja: falta configurar o servidor (nginx) e o DNS. O workflow já está pronto para funcionar assim que isso existir.

---

## Setup (uma vez só)

### 1. Configurar o servidor

Foi gerado um par de chaves SSH dedicado só para o deploy do GitHub Actions (não é a sua chave pessoal). O script [`deploy/setup-vps.sh`](deploy/setup-vps.sh) já vem com a chave pública embutida — ele:

- instala o nginx (se não estiver instalado);
- cria `/var/www/stylesystem` e dá posse pro usuário `hermes`;
- escreve um server block do nginx para `stylesystem.spardevsvr.com`;
- abre as portas 80/443 no firewall (se `ufw` estiver ativo);
- autoriza a chave pública de deploy em `~hermes/.ssh/authorized_keys`.

Rode assim (do seu computador, com acesso SSH à sua chave pessoal):

```bash
scp deploy/setup-vps.sh hermes@187.127.24.62:~/
ssh hermes@187.127.24.62 'bash setup-vps.sh'
```

O script é idempotente — pode rodar de novo sem problema.

### 2. Apontar o DNS

No provedor onde `spardevsvr.com` está registrado, crie:

| Tipo | Nome         | Valor            |
| ---- | ------------ | ---------------- |
| A    | `stylesystem`| `187.127.24.62`  |

Propagação pode levar de minutos a algumas horas.

### 3. HTTPS (depois que o DNS resolver)

```bash
ssh hermes@187.127.24.62
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d stylesystem.spardevsvr.com
```

O certbot já reconfigura o nginx para redirecionar HTTP → HTTPS automaticamente.

### 4. Adicionar o secret no GitHub

O workflow precisa da **chave privada** do par gerado para o deploy (`DEPLOY_SSH_KEY`). Ela não está no repositório — foi entregue separadamente no chat que gerou este setup. Adicione em:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret           | Valor                                                    |
| ---------------- | --------------------------------------------------------- |
| `DEPLOY_SSH_KEY` | Conteúdo completo da chave privada (bloco `-----BEGIN OPENSSH PRIVATE KEY-----` … `-----END OPENSSH PRIVATE KEY-----`) |

Host, usuário e caminho (`187.127.24.62`, `hermes`, `/var/www/stylesystem`) já estão fixos no workflow como `env:` — não são segredos, mas dá pra mudá-los direto no `deploy.yml` se o servidor mudar.

> Se preferir gerar sua própria chave em vez de usar a que veio pronta, é só:
> ```bash
> ssh-keygen -t ed25519 -C "github-actions-deploy@style-system" -f deploy_key -N ""
> ```
> aí adiciona `deploy_key.pub` no `authorized_keys` do `hermes` e o conteúdo de `deploy_key` (a privada) no secret `DEPLOY_SSH_KEY`.

---

## Testando

Depois do secret configurado:

```bash
git push origin main
```

ou dispare manualmente em **Actions → Deploy to VPS → Run workflow**. Acompanhe o log — o último passo é o `rsync`; se passar, o site já está no ar (por IP direto enquanto o DNS não resolve: `http://187.127.24.62/`, desde que o `Host` header bata, então melhor testar já com `curl -H "Host: stylesystem.spardevsvr.com" http://187.127.24.62/` até o DNS propagar).

---

## Rollback

Não há histórico de releases no servidor (rsync sobrescreve direto). Para reverter, dê `git revert` do commit problemático e faça push — o workflow re-publica o estado anterior. Se quiser manter backups automáticos das versões antigas, dá pra estender `deploy.yml` para copiar `$DEPLOY_PATH` para `$DEPLOY_PATH.bak` antes do rsync.
