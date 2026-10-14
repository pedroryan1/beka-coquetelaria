# Béka Coquetelaria

Protótipo local em React 19, TypeScript e Vite, com Lucide React para ícones. Não possui backend, serviços externos, autenticação ou pagamentos. Imagens e fontes são servidas pelo próprio projeto.

## Iniciar

Nesta máquina, com as dependências já instaladas, abra `Iniciar-Beka.cmd`. Mantenha a janela aberta e visite **http://127.0.0.1:5173/**. Se a porta estiver ocupada, o Vite exibirá outra porta: utilize o endereço informado no terminal.

Em um ambiente com Node.js 22+ e pnpm disponíveis:

```sh
pnpm install
pnpm dev
```

Alternativamente, `npm install` e `npm run dev`. Para gerar a versão de distribuição: `pnpm build`. Para visualizar esse build: `pnpm preview` (porta padrão 4173). O servidor que hospedar `dist/` precisa redirecionar rotas da aplicação para `index.html`.

## Roteiro para a apresentação

1. `/` — identidade e proposta da marca; apresentação tipográfica temporária, substituível.
2. `/servicos` — três pacotes fictícios e adicionais editáveis.
3. `/contratacao` — sete etapas de preenchimento/revisão e oitava etapa de sucesso; use dados fictícios e uma data futura. A solicitação aparece no painel.
4. `/cardapio` — busca por nome/ingredientes, filtros, detalhes e receitas sem álcool.
5. `/me-surpreenda` — selecione perfil, álcool e ingredientes; apenas receitas disponíveis e compatíveis são recomendadas. Há resultados alternativos e estado sem correspondências.
6. `/evento-demo` — alterne open bar/pedidos individuais; monte um pedido, selecione retirada/entrega e informe uma identificação fictícia. O pedido pode ser acompanhado em “Meu pedido”.
7. `/admin` — solicitações, agenda mensal/lista, drinks, ingredientes, pacotes/adicionais, pedidos e configuração do evento. Altere o status de um pedido e volte ao evento para ver o acompanhamento. Não há login.

Antes da reunião, use **Restaurar demonstração**, no painel. A ação pede confirmação e repõe os dados iniciais. Solicitações aprovadas são estados demonstrativos: não bloqueiam datas nem representam confirmação financeira.

## Organização

- `src/data.ts`: tipos e dados demonstrativos centralizados.
- `src/store.tsx`: estado compartilhado, persistência em localStorage, sincronização entre abas do mesmo navegador por evento `storage` e restauração.
- `src/logic.mjs`: recomendação, disponibilidade, validação de evento e totais, testáveis sem navegador.
- `src/main.tsx`: navegação, página inicial e serviços.
- `src/experiences.tsx`: catálogo, descoberta e experiência do evento.
- `src/booking.tsx`: contratação e validação por etapa.
- `src/admin.tsx`: operações administrativas locais.
- `src/ui.tsx`: componentes reutilizáveis, modais com foco contido e fechamento por Escape.
- `src/styles.css`: identidade visual e layouts responsivos; respeita preferência por movimento reduzido.
- `src/motion.ts` e `src/motion.css`: entradas ao rolar, transições curtas nos fluxos e feedback de toque/hover. Usa APIs nativas, sem biblioteca adicional; cancela os efeitos quando a preferência por movimento reduzido é ativada, inclusive durante o uso. No celular, os movimentos são menores e mais rápidos.

O roteamento usa History API; todas as rotas têm acesso direto no servidor Vite. Os formulários preservam informações ao voltar entre etapas; o rascunho da contratação e o carrinho são mantidos apenas enquanto suas respectivas páginas estão abertas. Cadastros, configuração, solicitações enviadas e pedidos persistem no localStorage. O último pedido da aba é identificado em sessionStorage.

## Testes

```sh
pnpm test
pnpm build
```

Para testes de navegador, é necessário Playwright e Microsoft Edge. `tests/browser.mjs` cobre os principais fluxos e rotas em 1440, 768 e 390 px. `tests/admin-browser.mjs` cobre CRUD e configurações, teclado, estado vazio e áreas administrativas no celular. Eles podem usar o Playwright fornecido pelo ambiente, através de `BEKA_PLAYWRIGHT_PATH`, ou uma instalação local de `playwright`.

```sh
node tests/browser.mjs
node tests/admin-browser.mjs
node tests/sync-browser.mjs
node tests/motion-browser.mjs
```

Os testes usam contextos isolados e restauram seus dados locais. As capturas e relatório são salvos em `test-results/` (ignorado no Git).

Validação realizada em 14/10/2026: TypeScript e build de produção aprovados; 6 testes unitários aprovados; as três suítes de navegador acima aprovadas no Microsoft Edge headless. Foram verificadas as sete rotas em 1440, 768 e 390 px, os fluxos de contratação, recomendação, pedidos e gestão, persistência, restauração, navegação por teclado e sincronização local entre abas. A checagem de console e rede das abas de gestão/evento não registrou erros nem requisições externas. Isso não equivale a uma auditoria formal de acessibilidade ou testes em dispositivos físicos.

## Limites da demonstração

- Dados fictícios e valores ilustrativos; nenhuma política comercial definitiva foi presumida.
- Armazenamento local sujeito à quota e às permissões do navegador. Uploads de imagem aceitam PNG/JPEG/WebP até 2 MB; caso a quota seja excedida, um aviso informa que a persistência não está disponível.
- Não há controle de acesso nem segurança de produção. Não armazene informações reais.
- Não há sincronização entre computadores/dispositivos, notificações ou processamento real. Alterações aparecem na mesma aplicação e em abas da mesma origem/navegador.
- Não são realizadas cobranças, reservas reais, envio de mensagens ou chamadas de IA. O modo individual informa que o pagamento futuro está indisponível.
- O QR Code é uma representação ilustrativa, explicitamente não escaneável. O link funciona localmente neste computador; não é uma página pública para convidados externos.
- O catálogo usa fotografias de referência, não fotografias das receitas oficiais. Disponibilidade de ingredientes não representa informação médica ou garantia alimentar.
- A validação de horário deste protótipo considera início e fim no mesmo dia; eventos que atravessam a madrugada precisam ser combinados com a equipe.
- A experiência atende a boas práticas de foco, teclado, labels e contraste, mas não recebeu auditoria formal de conformidade WCAG.

## Antes de uma versão de produção

Validar identidade oficial, receitas, imagens, preços, formatos, duração, equipe e capacidade com a empresa. Definir regras de pagamento, reserva, cancelamento e reembolso. Projetar backend, autenticação, autorização, proteção de dados, auditoria, sincronização e integrações apenas depois desses acordos. Publicação e QR Code real dependem de hospedagem acessível aos convidados.

## Ativos de referência

Fotografias ilustrativas do Unsplash, armazenadas em `public/images/`:

- Hero: `photo-1470337458703-46ad1756a187`.
- Rosé: `photo-1536935338788-846bb9981813`.
- Cítricos: `photo-1551024709-8f23befc6f87`.
- Tropical: `photo-1544145945-f90425340c7e`.
- Clássicos: `photo-1514362545857-3bc16c4c7d1b`.

Fontes DM Sans e Playfair Display, obtidas do Google Fonts e armazenadas localmente. São fontes abertas sob a SIL Open Font License. A marca tipográfica deste protótipo não constitui um logotipo oficial.

