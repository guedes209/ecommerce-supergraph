# Tasks - Camada de Banco de Dados e Mutations

## Fase 1: Specify & Design
- [x] Especificar requisitos (EARS) e padrão de Database-per-service com Prisma.
- [ ] Obter aprovação do usuário para este plano.

## Fase 2: Infraestrutura de Banco de Dados (Prisma)
- [ ] Task 2.1: Instalar `prisma` (devDependencies) e `@prisma/client` nos três serviços (`catalog`, `users`, `reviews`).
- [ ] Task 2.2: Inicializar o Prisma e definir os schemas (`Product`, `User`, `Review`) independentemente em cada serviço.
- [ ] Task 2.3: Rodar as migrations iniciais (`npx prisma migrate dev`) para gerar os arquivos `.db`.

## Fase 3: Refatoração dos Subgrafos (Backend)
- [ ] Task 3.1: **Catalog:** Substituir array de mocks pelo Prisma Client. Implementar a mutation `createProduct`.
- [ ] Task 3.2: **Users:** Substituir mocks pelo Prisma Client. (Injetar um usuário padrão no banco se ele estiver vazio para facilitar testes).
- [ ] Task 3.3: **Reviews:** Substituir mocks pelo Prisma Client. Implementar a mutation `createReview` e ajustar as resoluções de referência (`__resolveReference`).

## Fase 4: Integração com o Frontend (UI)
- [ ] Task 4.1: Atualizar o arquivo `App.tsx` para usar o hook `useMutation`.
- [ ] Task 4.2: Criar um mini-formulário no React para o usuário cadastrar um Produto.
- [ ] Task 4.3: Criar um input simples ao lado de cada produto para enviar uma nova Avaliação, recarregando a tela.

