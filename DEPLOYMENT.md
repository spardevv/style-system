# Deploy — stylesystem.spardevsvr.online

O site é estático (`index.html`, `style.css`, `app.js`), sem build. Ele roda em um container no servidor
de casa e é publicado pela Cloudflare via Tunnel. Todo push em `main` vai ao ar sozinho em até ~30 s.

```
git push origin main
        │
        ▼
GitHub (spardevv/style-system)
        │   timer no servidor: git pull --ff-only a cada 30 s
        ▼
~/projetos/style-system  ──(montada somente leitura)──▶  container "stylesystem" (Caddy)
                                                              │
                                              Cloudflare Tunnel (stylesystem:80)
                                                              ▼
                                         https://stylesystem.spardevsvr.online
```

Não há GitHub Action, chave SSH nem segredo: o servidor só *busca* o código público do repositório.

## Como publicar

```bash
git push origin main
```

Pronto. Para acompanhar no servidor:

```bash
journalctl --user -u stylesystem-sync -f     # mostra "publicado abc1234 -> def5678"
systemctl --user start stylesystem-sync      # força a verificação agora
```

## O que é servido

Só `index.html`, `style.css` e `app.js`. `.git`, `.github`, `.claude`, `deploy` e `*.md` retornam 404
(regra `hide` no `Caddyfile` do container, em `homeserver/stylesystem/Caddyfile`).

## Setup do servidor (uma vez só)

1. **Clone** em `~/projetos/style-system`.
2. **Container**: serviço `stylesystem` no `docker-compose.yml` (imagem `caddy:2-alpine`, pasta montada
   em `/srv:ro`, `Caddyfile` próprio).
3. **Cloudflare**: Zero Trust → Networks → Tunnels → o tunnel → *Public Hostname*:
   `stylesystem.spardevsvr.online` → `HTTP` · `stylesystem:80`. O DNS e o HTTPS são criados automaticamente.
4. **Timer** de atualização — `~/.config/systemd/user/stylesystem-sync.{service,timer}`:

   ```ini
   # stylesystem-sync.service
   [Unit]
   Description=Publica o Style System: git pull de spardevv/style-system
   After=network-online.target

   [Service]
   Type=oneshot
   Environment=GIT_TERMINAL_PROMPT=0
   ExecStart=/bin/bash -c 'cd %h/projetos/style-system && old=$(git rev-parse HEAD) && git pull --ff-only --quiet && new=$(git rev-parse HEAD) && { [ "$old" = "$new" ] || echo "publicado ${old:0:7} -> ${new:0:7}"; }'
   TimeoutStartSec=60
   ```

   ```ini
   # stylesystem-sync.timer
   [Unit]
   Description=Verifica novos commits do Style System a cada 30s

   [Timer]
   OnBootSec=30s
   OnUnitInactiveSec=30s
   AccuracySec=5s

   [Install]
   WantedBy=timers.target
   ```

   ```bash
   systemctl --user daemon-reload && systemctl --user enable --now stylesystem-sync.timer
   ```

   O `systemd --user` precisa de `loginctl enable-linger <usuário>` para rodar sem sessão aberta.

## Rollback

Não há releases no servidor: ele sempre espelha `main`. Para reverter, dê `git revert` do commit
problemático e faça push — o timer publica o estado anterior em até ~30 s.

## Problemas comuns

- **Push não apareceu**: `journalctl --user -u stylesystem-sync -n 20`. Um `git pull` recusado
  (`--ff-only`) quase sempre significa alteração local em `~/projetos/style-system`; descarte-a com
  `git -C ~/projetos/style-system checkout -- .`.
- **Não force push em `main`**: o `--ff-only` não aceita histórico reescrito e a publicação para até
  alguém acertar o clone no servidor.
- **Site fora do ar**: `docker ps | grep stylesystem` e `docker logs stylesystem`; depois o log do
  `cloudflared`.
