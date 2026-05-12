# Style System Editor

Um editor visual de design tokens em tempo real. Você escreve YAML no painel esquerdo, clica em **Apply** (ou `Cmd/Ctrl + Enter`), e todos os componentes da tela se atualizam instantaneamente refletindo seus tokens — cores, tipografia, gradientes, sombras, espaçamentos e muito mais.

---

## Rodando localmente

O projeto é HTML/CSS/JS puro, sem build step. Basta servir a pasta com qualquer servidor estático. A forma mais rápida:

```bash
npx serve .
```

Acesse `http://localhost:3000` no navegador.

> **Requisito:** Node.js instalado. O `npx` já vem junto com npm 5.2+.

Outras opções:

```bash
# Python
python3 -m http.server 3000

# VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

---

## Estrutura do projeto

```
style-system/
├── index.html   # Marcação — layout do app, imports de libs e scripts
├── style.css    # Todo o sistema visual, keyframes e animações
├── app.js       # Lógica: parser YAML, builders de seção, init de gráficos
└── README.md    # Este arquivo
```

---

## Como usar

### 1. Editar tokens

O painel esquerdo contém um editor YAML com os design tokens do sistema. Edite qualquer valor — cor, tamanho de fonte, raio de borda, gradiente — e pressione **Apply ↵** ou `Cmd/Ctrl + Enter`.

### 2. Visualizar

O painel direito renderiza automaticamente todas as seções:

| Seção                       | O que mostra                                                                    |
| --------------------------- | ------------------------------------------------------------------------------- |
| **Palette & Brand**         | Swatches de todas as cores com hex                                              |
| **Status & Alerts**         | Badges animados de success / warning / error / info                             |
| **Typography Scale**        | Hierarquia completa do Display ao Micro + specimen mono                         |
| **Gradients**               | 5 tiles com preview animado e valor do token                                    |
| **Shadows & Elevation**     | 6 variações com prévia visual do efeito                                         |
| **UI Components**           | Cards, botões, inputs (4 estados), progress bars, toggles, checkboxes, avatares |
| **Mini Screens**            | Dashboard, layout mobile e painel de notificações em miniatura                  |
| **Data Visualization**      | Line, Bar, Doughnut e Radar charts usando as cores do tema                      |
| **Spacing & Border Radius** | Régua visual dos tokens de espaçamento e raio                                   |
| **Interaction Tokens**      | Tooltips, bloco de código com syntax highlight, atalhos de teclado              |

### 3. Importar / Exportar

- **Import** — carrega um arquivo `.yaml` ou `.yml` do disco e aplica imediatamente.
- **Export Config** — baixa o YAML atual como `nome-do-projeto-vX.Y.Z.yaml`, usando os valores de `meta.name` e `meta.version`.

---

## Tokens disponíveis

```yaml
meta:
  name, version, author

colors:
  primary, secondary, accent, background, surface
  text: { primary, secondary, muted }
  status: { success, warning, error, info }

gradients:
  brand, warm, cool, dark, subtle        # formato: "135deg, #cor1, #cor2"

typography:
  font_family: { primary, secondary }
  font_size:   { xs, sm, md, lg, xl, display }
  font_weight: { regular, semibold, bold, black }
  line_height: { tight, base, loose }
  letter_spacing: { tight, normal, wide, wider }

spacing:   { xs, sm, md, lg, xl, xxl }

border:
  radius:  { sm, md, lg, xl, full }

shadows:   { sm, md, lg, glow, inset }

ui:
  card:   { border_radius, padding }
  input:  { border_radius, padding }
  button: { border_radius, padding, font_weight }
```

---

## Animações

Todas as animações são CSS puro, disparadas no render:

- **Entrada escalonada** — seções e swatches entram com `fadeUp` em cascata
- **Status dots** — pulsam com glow infinito
- **Gradients** — fundo desliza continuamente (`gradient-shift`)
- **Shimmer** — reflexo de luz passando no Gradient Card
- **Progress bars** — partem de zero no render com easing cúbico
- **Contadores** — números sobem de 0 ao valor real com `ease-out`
- **Hover lift** — tiles sobem 3px com sombra ampliada
- **Avatar spread** — avatares se abrem ao hover

---

## Dependências externas (CDN)

Nenhuma instalação necessária. Carregadas via CDN no `index.html`:

- [js-yaml 4.1.0](https://github.com/nodeca/js-yaml) — parser de YAML
- [Chart.js 4.4.1](https://www.chartjs.org/) — gráficos
- [Google Fonts](https://fonts.google.com/) — Syne + JetBrains Mono