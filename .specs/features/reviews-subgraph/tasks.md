# Tasks - Subgrafo de Avaliações (Reviews)

## Fase 1: Specify & Design
- [x] Especificar requisitos (EARS) e modelagem dos grafos cruzados.
- [x] Obter aprovação do usuário para este plano.

## Fase 2: Infraestrutura do Subgrafo
- [x] Task 2.1: Criar a pasta `services/reviews` e inicializar seu `package.json` definindo o nome `@ecommerce/reviews`.
- [x] Task 2.2: Instalar as dependências do Apollo (`@apollo/server`, `graphql`, `@apollo/subgraph`) no workspace de reviews.

## Fase 3: Implementação do Schema e Resolvers
- [x] Task 3.1: Criar `index.ts` do serviço `reviews`.
- [x] Task 3.2: Definir o GraphQL Schema: Criar o tipo `Review`, e estender `User` e `Product` usando as diretivas do Federation (`@key`).
- [x] Task 3.3: Implementar os resolvers locais para buscar os reviews baseados no ID do Produto ou do Usuário.

## Fase 4: Integração no Supergraph
- [x] Task 4.1: Atualizar o arquivo `services/gateway/index.ts` incluindo o novo subgrafo (`url: 'http://localhost:4003'`).
- [x] Task 4.2: Atualizar o script `dev` no `package.json` raiz para subir o serviço `reviews` junto com o restante da stack.
- [x] Task 4.3: Atualizar o Host Frontend (`App.tsx`) para puxar a lista de reviews dentro de cada produto e exibir na tela.

