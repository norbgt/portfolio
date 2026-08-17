# Portfolio — Amanda Noronha

Site estático responsivo construído a partir do Figma *Portfolio - Amanda Noronha - 2025*.
Sem build, sem dependências: é só abrir o `index.html` no navegador.

```
portfolio/
├── index.html          → About me (Home)
├── cases.html          → Cases
├── assets/
│   ├── css/styles.css  → design system + layout responsivo
│   ├── js/main.js      → menu mobile
│   └── img/            → (vazio) imagens dos cards
└── README.md
```

## Design system

Tudo vem das variáveis do Figma e vive no topo do `styles.css`, em `:root`.
Mudar uma cor ou um tamanho ali muda o site inteiro.

| Token | Valor | Onde aparece |
| --- | --- | --- |
| `--c-black` | `#000000` | texto principal, bordas de nav |
| `--c-ink` | `#242424` | títulos de seção |
| `--c-divider` | `#575757` | divisórias dos cards |
| `--c-accent` | `#2200FF` | tags e notas dos cards |
| `--c-muted` | `#696969` | autoria dos depoimentos |
| `--c-footer` | `#6B7280` | rodapé |

Fontes (carregadas do Google Fonts):
Instrument Sans (base), Encode Sans Semi Condensed (títulos de case),
DM Sans (títulos de card), Encode Sans Expanded (textos pequenos de card).

Tipografia e espaçamentos usam `clamp()`, então escalam sozinhos entre
320 px e 1440 px — sem saltos bruscos entre breakpoints.

## Responsividade

| Faixa | Comportamento |
| --- | --- |
| < 768 px | menu vira hambúrguer; cards e projetos em coluna única; currículo empilhado |
| 768–991 px | cards em 2 colunas; depoimentos e projetos empilhados |
| ≥ 992 px | 3 colunas de cards; coluna lateral dos cases fica *sticky* |
| ≥ 1440 px | trava em 1440 px centralizado, com 80 px de margem lateral |

Cuidados específicos de celular: `viewport-fit=cover` + `env(safe-area-inset-*)`
para o notch do iPhone, `overflow-x: hidden` para nunca ter rolagem lateral,
alvos de toque de no mínimo 44 px, e `prefers-reduced-motion` respeitado.

## Imagens

Basta colocar o arquivo em `assets/img/` com o nome certo. **Não precisa
editar HTML.** O JS confere cada slot: imagem presente aparece com um
fade suave; imagem ausente, o bloco some sozinho e o card fica só com
texto — sem ícone de imagem quebrada, sem buraco no layout.

Nomes esperados (formato `.webp`):

| Home | Cases |
| --- | --- |
| `home-entrepreneurship.webp` | `case-cashout-workshop.webp` |
| `home-cash-out.webp` | `case-cashout-concepts.webp` |
| `home-transaction-flows.webp` | `case-flows-critique.webp` |
| `home-ey.webp` | `case-flows-standard.webp` |
| `home-accenture.webp` | `case-backoffice-blueprint.webp` |
| `home-xp.webp` | `case-backoffice-opportunity.webp` |
| | `case-mgm.webp` |

Tamanhos de exibição: cards da Home são servidos em 854 px de largura,
linhas dos Cases em 1388 px (ambos 2x do tamanho em tela).

Se preferir usar PNG ou JPG, troque a extensão no `src` da imagem
correspondente no HTML — o resto continua funcionando igual.

Os textos `alt` foram escritos a partir do contexto do case. Vale revisar:
descrição de imagem é o que uma pessoa cega ouve e o que o Google lê.

## Pontos para revisar

- **Home, card "Cash-out experience"**: a descrição está com o texto de trabalho
  do Figma (`Pegar os 3 pilares de valor da apresentação`) — marcado com `TODO` no HTML.
- **Cases, "# Member get member"**: o status está em português (`Despriorizado`)
  numa página em inglês — marcado com `TODO` no HTML.
- Corrigidos em relação ao Figma: `Enterpreneurship` → `Entrepreneurship`,
  `responsabilities` → `responsibilities`, `backlog itens` → `backlog items`,
  `Critiques sessions` → `Critique sessions`.
- Os links de empresa apontam para os sites oficiais; no Figma estavam todos
  em `figma.com/sites` (placeholder).

## Publicar

Qualquer host de site estático serve, sem configuração:

- **Netlify / Vercel**: arraste a pasta na interface de deploy.
- **GitHub Pages**: suba a pasta num repositório e ative Pages na branch `main`.
