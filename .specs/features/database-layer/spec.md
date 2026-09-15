# Especificação (EARS) - Camada de Banco de Dados e Mutations

## Objetivo
Substituir os dados "mockados" em memória por bancos de dados reais. Para respeitar a arquitetura de Microsserviços e Federação, adotaremos o padrão "Database-per-service" (um banco de dados independente para cada serviço), utilizando Prisma ORM com SQLite.

## Requisitos (EARS)
1. **[Ubiquitous]** O sistema DEVE utilizar `Prisma ORM` com `SQLite` para garantir persistência local, tipagem TypeScript estrita e custo zero (ideal para portfólio).
2. **[Ubiquitous]** CADA subgrafo (`catalog`, `users`, `reviews`) DEVE possuir seu próprio banco de dados isolado (ex: `catalog.db`) para evitar acoplamento no nível de dados.
3. **[Event-driven]** QUANDO o GraphQL Gateway receber uma requisição, os resolvers DEVEM interagir com os bancos de dados via `Prisma Client`.
4. **[State-driven]** ENQUANTO o Gateway estiver operante, o subgrafo de Catálogo DEVE possuir a mutation `createProduct(name, price)`.
5. **[State-driven]** ENQUANTO o Gateway estiver operante, o subgrafo de Reviews DEVE possuir a mutation `createReview(productId, authorId, body)`.

## Critérios de Aceite
- [ ] Cada um dos 3 serviços possui um `schema.prisma` e seu respectivo arquivo SQLite.
- [ ] As queries (`products`, `me`) buscam dados do banco.
- [ ] O frontend consegue disparar mutations para criar produtos e adicionar avaliações, persistindo os dados entre reinicializações do servidor.

