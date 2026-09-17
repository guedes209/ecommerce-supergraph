# Tasks - Configuração Inicial (Setup)

## Fase 1: Specify & Design
- [x] Levantar requisitos iniciais da estrutura do projeto.
- [x] Definir arquitetura de alto nível (Supergraph + Micro-frontends).
- [x] Obter aprovação do usuário para este plano.

## Fase 2: Estrutura do Monorepo
- [x] Task 2.1: Inicializar o `package.json` root com suporte a Workspaces (usaremos npm ou yarn?).
- [x] Task 2.2: Criar estrutura de pastas `apps/` (para os frontends) e `services/` (para os subgrafos GraphQL).
- [x] Task 2.3: Configurar TypeScript, ESLint e Prettier na raiz para compartilhar com todo o monorepo.

## Fase 3: Gateway e Subgrafos (Backend)
- [x] Task 3.1: Criar `services/catalog` (Subgrafo de Produtos) com Apollo Server.
- [x] Task 3.2: Criar `services/users` (Subgrafo de Usuários) com Apollo Server.
- [x] Task 3.3: Criar `services/gateway` configurado com `@apollo/gateway` para unir Catalog e Users.
- [x] Task 3.4: Criar script root para rodar todos os serviços simultaneamente (ex: usando `concurrently`).

## Fase 4: Micro-frontend Host (Frontend)
- [x] Task 4.1: Criar `apps/host` usando React + Vite (ou Webpack com Module Federation).
- [x] Task 4.2: Integrar o Apollo Client no app host apontando para a URL do Gateway.
