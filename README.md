# E-Commerce Supergraph & Micro-frontends 🚀

Este projeto é uma prova de conceito avançada de uma arquitetura moderna, escalável e altamente distribuída. Ele demonstra a união de **Micro-frontends** no lado do cliente com **Microservices (GraphQL Federation)** e **Bancos de Dados Isolados** no lado do servidor.

## 🏗 Arquitetura do Projeto

O repositório é um monorepo dividido em duas grandes áreas: `apps/` (Frontends) e `services/` (Backends).

### 🖥 Frontend Distribuído (Vite Module Federation)
*   **`apps/host`**: O "Shell" da aplicação. Gerencia o layout principal, dados globais (como o usuário logado) e importa os micro-frontends remotamente.
*   **`apps/catalog-ui`**: Um Micro-frontend Remoto e autônomo. Possui seu próprio ciclo de build e gerencia exclusivamente a lógica e UI do Catálogo de Produtos. É injetado no Host via rede em tempo de execução.

### ⚙️ Backend Distribuído (Apollo GraphQL Federation)
*   **`services/gateway`**: O Supergraph. Atua como um API Gateway unificado. O frontend faz chamadas apenas para ele, e ele inteligentemente compõe e roteia os requests para os microsserviços corretos.
*   **`services/catalog`**: Subgrafo responsável pelos produtos (Possui seu próprio banco SQLite e Prisma Client isolado).
*   **`services/users`**: Subgrafo responsável pelos usuários (Possui seu próprio banco SQLite e Prisma Client isolado).
*   **`services/reviews`**: Subgrafo responsável pelas avaliações. Estende dados de Produtos e Usuários usando a diretiva `@key` do Apollo Federation.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
*   Node.js (v18 ou superior)
*   NPM (v9 ou superior)

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
   O projeto utiliza o ecossistema moderno de **NPM Workspaces**, o que significa que todas as dependências do Host, Remotes e Subgrafos são instaladas com um único comando na raiz do projeto.
   ```bash
   npm install
   ```

2. **Gere os clientes de Banco de Dados (Prisma):**
   Seguindo o padrão de arquitetura *Database-per-service*, nós geramos instâncias do Prisma Client isoladas dentro de cada serviço para evitar colisão de tipagens no Monorepo.
   Execute no terminal raiz:
   ```bash
   cd services/catalog && npx prisma generate
   cd ../users && npx prisma generate
   cd ../reviews && npx prisma generate
   cd ../..
   ```

3. **Inicie a aplicação:**
   Temos um script orquestrador que liga toda a malha de serviços simultaneamente. Ele sobe os bancos de dados, os 3 subgrafos GraphQL, inicia o Apollo Gateway, faz o build dos Micro-frontends e sobe os servidores de UI.
   ```bash
   npm run dev
   ```

4. **Acesse as aplicações no seu navegador:**
   *   **Frontend Principal (Host):** [http://localhost:5173](http://localhost:5173)
   *   **Apollo API Gateway (Playground):** [http://localhost:4000](http://localhost:4000)

---
*Feito com ☕ e muito código escalável.*