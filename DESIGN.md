# Elite AI Solutions — Identidade

## Posicionamento
**Alfaiataria digital.** A Elite AI Solutions não vende software de prateleira: tira as medidas do negócio,
corta e costura sistemas, automações e IA sob medida, e entrega algo que veste perfeitamente.

- Promessa: *Sistemas feitos sob medida para o seu negócio.*
- Metáfora central: o processo de alfaiataria — **Medida → Molde → Prova → Entrega**.
- Voz: segura, discreta, precisa. Frases curtas. Nada de exageros, jargão vazio ou exclamações.

## Paleta — Noir & Champagne
| Token | Hex | Uso |
|---|---|---|
| `--noir` | `#0B0B0C` | Fundo principal |
| `--noir-2` | `#141414` | Superfícies elevadas, cards |
| `--line` | `#2A2723` | Linhas finas, divisores |
| `--ivory` | `#F4EFE6` | Texto principal |
| `--ivory-dim` | `#A39C90` | Texto secundário |
| `--champagne` | `#C9A86A` | Acento: CTAs, detalhes, monograma |
| `--bronze` | `#6E6658` | Apoio, estados inativos |

Regra: o champanhe é escasso — no máximo um elemento dourado forte por tela. Luxo é contenção.

## Tipografia
- **Cormorant Garamond** (serifada, 300–500): títulos, números, citações.
- **Inter** (300–500): textos, navegação, botões.
- Rótulos e navegação em caixa alta com espaçamento largo (`letter-spacing: .25em`).

## Marca
Monograma **E** serifado dentro de um losango fino, com uma linha de costura tracejada — o ponto da alfaiataria.

## Motion
- Rolagem suave (Lenis) e revelações ao rolar (GSAP ScrollTrigger).
- Cursor personalizado: ponto + anel champanhe que cresce sobre links.
- Luz que segue o mouse no hero; cards com inclinação 3D e brilho no hover.
- Botões magnéticos (puxam levemente em direção ao cursor).
- Tudo respeita `prefers-reduced-motion`.
