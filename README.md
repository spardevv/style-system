# Style System Editor

Um editor visual de design tokens **em tempo real**. Ajuste cores, tipografia, gradientes, sombras, espaçamento, densidade e o estilo de cada componente no painel esquerdo — o preview no painel direito atualiza instantaneamente a cada mudança, sem precisar clicar em nada. Quando o sistema estiver do jeito que você quer, exporte como **YAML**, **CSS** ou **JSON**.

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
├── index.html   # Marcação — sidebar de tokens, layout do app, imports de libs
├── style.css    # Todo o sistema visual do editor, keyframes e animações
├── app.js       # Lógica: estado dos tokens, builders de seção, exportadores, gráficos
└── README.md    # Este arquivo
```

---

## Como usar

### 1. Editar tokens

O painel esquerdo tem um formulário organizado em seções colapsáveis (Meta, Colors, Gradients, Typography, Spacing & Radius, UI Components, Effects & Motion, Component Style). **Qualquer alteração — arrastar um slider, trocar uma cor, clicar num toggle — atualiza o preview instantaneamente.** O botão **Apply ↵** (ou `Cmd/Ctrl + Enter`) continua disponível para forçar um re-render explícito.

### 2. Visualizar

O painel direito renderiza automaticamente todas as seções, usando exatamente os tokens definidos à esquerda:

| Seção                          | O que mostra                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **Hero Banner**                 | Banner de destaque com gradiente, título e CTAs                                  |
| **Palette & Brand**             | Swatches de todas as cores com hex                                               |
| **Status & Alerts**             | Badges animados de success / warning / error / info                              |
| **Alerts & Toasts**             | Alertas inline (info/success/warning/error) e pilha de toasts                    |
| **Typography Scale**            | Hierarquia completa do Display ao Micro + specimen mono                          |
| **Gradients**                   | 6 tiles com preview animado e valor do token                                     |
| **Shadows & Elevation**         | Variações de sombra com prévia visual do efeito                                  |
| **Banner Variants**             | Announcement, warning banner e banner escuro                                     |
| **Thumbnails & Media Cards**    | Grid de thumbnails com destaque                                                  |
| **UI Components**               | Botões, inputs (5 estados), progress bars, toggles, checkboxes, avatares         |
| **Form Controls Extended**      | Select, radio group, range slider, search com atalho, dropzone de upload         |
| **Navigation**                  | Navbar, tabs, segmented control, paginação                                       |
| **Window Components**           | Janela estilo OS, terminal e modal de confirmação                                |
| **Card Variants**               | Feature card, pricing card, profile card e stat cards                            |
| **Content Patterns**            | Accordion, list group, testimonial, empty state, skeleton loader, rating         |
| **Data Table**                  | Tabela de referência dos tokens                                                  |
| **Tags, Chips & Navigation**    | Tags, breadcrumb e atalhos de teclado                                            |
| **Timeline & Changelog**        | Linha do tempo de eventos                                                        |
| **Mini Screens**                | Dashboard, layout mobile e painel de notificações em miniatura                   |
| **Data Visualization**          | Line, Bar, Doughnut e Radar charts usando as cores do tema                       |
| **Spacing & Border Radius**     | Régua visual dos tokens de espaçamento e raio                                    |
| **Interaction Tokens**          | Tooltips, bloco de código com syntax highlight, atalhos de teclado               |

### 3. Importar / Exportar

- **Import** — carrega um arquivo `.yaml` ou `.yml` do disco e aplica imediatamente (restaura também os campos de Effects & Motion e Component Style).
- **Export → YAML** — baixa a configuração completa como `nome-do-projeto-vX.Y.Z.tokens.yaml`. É o formato para reabrir depois no próprio editor.
- **Export → JSON** — baixa a mesma configuração como `.tokens.json`, para consumir em pipelines/build tools.
- **Export → CSS** — gera um stylesheet standalone (`.tokens.css`) com:
  - Custom properties `:root` para cada token (cores, tipografia, espaçamento, raio, sombra, efeitos);
  - Classes de componente prontas (`.btn`, `.btn-primary/accent/ghost/soft/danger`, `.card`, `.input`, `.badge`, `.tag`, `.alert-*`, `.progress`, `.avatar`);
  - Utilitários de espaçamento/raio/sombra (`.p-md`, `.rounded-lg`, `.shadow-md`, etc.).

  O CSS exportado reflete exatamente o que está no preview no momento do export — inclusive densidade, largura de borda, velocidade de animação, formato de botão, elevação de card e estilo de input.

---

## Tokens disponíveis

```yaml
meta:
  name, version, author

theme: light | dark          # tema do próprio editor (sidebar/preview chrome)

colors:
  primary, secondary, accent, highlight, background, surface, border, neutral
  text: { primary, secondary, muted, inverse }   # inverse = cor de texto sobre fundos coloridos
  status: { success, warning, error, info }

gradients:
  brand, neon, cyber, void, aurora, sunset       # formato: "135deg, #cor1, #cor2"

typography:
  font_family: { primary, secondary, display }
  font_size:   { xs, sm, md, lg, xl, xxl, display }
  font_weight: { regular, medium, semibold, bold, black }
  line_height: { tight, base, loose }
  letter_spacing: { tight, normal, wide, wider, widest }

spacing:   { xs, sm, md, lg, xl, xxl, xxxl }     # escalados pela densidade (effects.density)

border:
  radius: { none, sm, md, lg, xl, full }
  width:  <px>                                    # 1–6, ver Effects & Motion

shadows:
  opacity: <10–100>    # intensidade das sombras geradas
  blur:    <50–200>    # % de blur das sombras geradas

effects:
  anim_speed: <25–250>              # % de velocidade das animações CSS
  density:    compact | comfortable | spacious

ui:
  card:   { border_radius, padding, elevation: flat|low|medium|high }
  input:  { border_radius, padding, style: outline|filled|underline }
  button: { border_radius, padding, font_weight, shape: sharp|rounded|pill }
  modal:  { border_radius, padding }
```

---

## Effects & Motion / Component Style

Duas seções novas no sidebar, para além das cores/tipografia/espaçamento clássicos:

- **Effects & Motion** — intensidade e blur das sombras, espessura de borda global, velocidade das animações (0.25×–2.5×) e densidade (compact/comfortable/spacious, que escala toda a escala de espaçamento).
- **Component Style** — formato dos botões (sharp/rounded/pill), elevação dos cards (flat/low/medium/high) e estilo dos inputs (outline/filled/underline). Essas escolhas se propagam para todos os componentes do preview em tempo real.

---

## Animações

Todas as animações são CSS puro, disparadas no render, e escalam com o slider **Speed** de Effects & Motion (`--tok-anim-speed`):

- **Entrada escalonada** — seções e swatches entram com `fadeUp` em cascata
- **Status dots** — pulsam com glow infinito
- **Gradients** — fundo desliza continuamente (`gradient-shift`)
- **Shimmer** — reflexo de luz passando no Gradient Card e nos skeleton loaders
- **Progress bars** — partem de zero no render com easing cúbico
- **Contadores** — números sobem de 0 ao valor real com `ease-out`
- **Hover lift** — tiles sobem 3px com sombra ampliada
- **Avatar spread** — avatares se abrem ao hover
- **Toasts/alerts** — entram com slide-in em cascata

---

## Dependências externas (CDN)

Nenhuma instalação necessária. Carregadas via CDN no `index.html`:

- [js-yaml 4.1.0](https://github.com/nodeca/js-yaml) — parser de YAML
- [Chart.js 4.4.1](https://www.chartjs.org/) — gráficos
- [Google Fonts](https://fonts.google.com/) — JetBrains Mono, Orbitron, Space Grotesk (+ qualquer fonte customizada digitada em Typography, carregada dinamicamente)
