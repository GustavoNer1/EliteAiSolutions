# Elite AI Solutions · Progresso e próximos passos

Atualizado em 16/11/2026.

Site no ar: https://gustavoner1.github.io/EliteAiSolutions/
Cada envio para a branch `main` publica pelo GitHub Pages em cerca de 1 minuto.

---

## O que já está pronto

### Site
- Página inicial com:
  - banner;
  - vídeo de apresentação (Remotion e narração ElevenLabs, código em `video/`);
  - serviços e lista "Onde isso entra no seu dia";
  - vitrine em carrossel com 3 demonstrações: painel, atendimento e integração;
  - processo, comparativo e dúvidas.
- Formulário de análise em 2 etapas (`apply.js`): nome, empresa e segmento; depois equipe, principal desafio e faixa de faturamento. As respostas abrem prontas no WhatsApp (11) 97029-9201.
- Chamadas para ação pedem uma "análise do negócio", que filtra clientes, e não uma "conversa de 30 minutos".
- Animações dos cards funcionando também no celular.
- Botões de ação em destaque: o principal e o do topo são preenchidos em dourado; os links secundários têm sublinhado.
- Política de privacidade (`privacidade.html`) e aviso de cookies em conformidade com a LGPD.

### Páginas de serviço (SEO)
- `atendimento-automatico-whatsapp.html`: atendimento automático no WhatsApp com agente de IA.
- `agendamento-automatico-whatsapp.html`: agendamento automático pelo WhatsApp.
- `sistemas-sob-medida.html`: sistemas sob medida, integrações e painéis de gestão.

As páginas estão ligadas pelos cards da página inicial, pelo rodapé de todas as páginas e pelo sitemap.

### SEO técnico
- Títulos, descrições e textos escritos com os termos que o público pesquisa.
- Dados estruturados (schema.org):
  - página inicial: empresa, serviços, vídeo e dúvidas;
  - páginas de serviço: o serviço e o caminho de navegação.
- `sitemap.xml` com as 4 páginas e `robots.txt`.
- Google Search Console:
  - verificado por meta tag no `index.html` (não remover);
  - sitemap enviado;
  - indexação solicitada para as 4 páginas.

### Medição
- Google Analytics 4, código `G-GZE64RHTKJ` em `analytics.js`.
- Só carrega depois que o visitante aceita os cookies.
- Eventos medidos:
  - `section_view`: até onde cada pessoa rolou, em 9 seções numeradas, de `1_inicio` a `9_formulario`;
  - `cta_click` e `whatsapp_click`: cliques nos botões, com o local do clique;
  - `form_start`, `form_step` e `generate_lead`: uso do formulário;
  - `video_start`, `video_progress` e `video_complete`: uso do vídeo;
  - `faq_open` e `showcase_view`: dúvidas abertas e demonstrações vistas.
- Dados guardados por 14 meses.
- Analytics vinculado ao Search Console.

---

## Próximos passos

### Depende do dono do negócio
- [ ] **Microsoft Clarity:** criar a conta grátis em clarity.microsoft.com e enviar o código do projeto. Ele vai no campo `CLARITY_ID` de `analytics.js`.
- [ ] **Domínio próprio:** comprar no registro.br (por exemplo, eliteaisolutions.com.br). Depois disso:
  - ligar o domínio ao GitHub Pages;
  - atualizar os endereços canônicos e o sitemap;
  - criar a propriedade de domínio no Search Console.
- [ ] **Perfil da Empresa no Google:** informar a cidade e se o atendimento é presencial ou só online, para montar o perfil e o SEO local.
- [ ] **Link do site nos perfis:** colocar o endereço no WhatsApp Business e no Instagram.
- [ ] **Prova no site:** enviar 1 ou 2 casos ou resultados de clientes e uma foto com nome e experiência, para criar uma seção de prova e autoridade.
- [ ] **Revisar os textos:** dúvidas, "O que avaliamos", política de privacidade e páginas de serviço, principalmente os segmentos atendidos e a cobrança da Meta na API oficial.
- [ ] **Triagem no WhatsApp:** definir as faixas reais de equipe e faturamento, os requisitos de cada faixa e qual produto oferecer a cada perfil. É a base da automação com a API oficial.

### Ajustes no site
- [ ] Testar um título com o resultado concreto na primeira tela, como "Seu WhatsApp atendendo e agendando sozinho, 24 horas".
- [ ] Criar a seção de prova (casos e depoimentos) e o bloco "quem está por trás".
- [x] Trocar "conversa de 30 min" na demonstração do chat (`showcase.js`).
- [x] Atualizar a última cena do vídeo, que ainda fala em "conversa de 30 minutos". Exige regenerar a narração, o que gasta créditos do ElevenLabs.

### Acompanhamento
- [ ] Conferir em 1 ou 2 dias se o sitemap passou para "Sucesso" no Search Console.
- [ ] Quando chegar o primeiro formulário, marcar `generate_lead` como evento principal no Analytics: Administrador → Exibição de dados → Eventos → estrela.
- [ ] Depois de algumas centenas de visitas, analisar até onde as pessoas rolam e onde desistem do formulário, e ajustar o site com base nisso.

### Mais adiante
- [ ] Automação de triagem no WhatsApp com a API oficial (WhatsApp Business Platform).
- [ ] Teste A/B do título e da primeira dobra, quando houver tráfego suficiente.
