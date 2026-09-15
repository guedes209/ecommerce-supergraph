# Relatório de Arquitetura Sênior: E-Commerce Distribuído

Este relatório documenta as decisões arquiteturais tomadas durante a construção da prova de conceito do E-commerce Supergraph. O projeto foi desenhado para simular os desafios e soluções adotados por grandes empresas de tecnologia (como Netflix, Uber e Spotify) ao escalar suas operações.

---

## 1. Backend: Apollo Federation (Microservices)

A arquitetura de backend tradicional (Monolito) sofre com gargalos de deploy e acoplamento. Para resolver isso, implementamos o **Apollo GraphQL Federation v2**.

### O Diferencial
Em vez de um único servidor GraphQL gigante, dividimos o domínio da empresa em microsserviços autônomos (Subgrafos). O Frontend não precisa saber que existem vários serviços; ele se comunica apenas com um API Gateway unificado (o Supergraph).

### A Mágica do `@key` (Exemplo de Código)
O serviço de **Reviews** precisa relacionar uma Avaliação com um Produto e um Usuário. Porém, o banco de Avaliações *não guarda* os dados do Produto, apenas o `productId`. O Gateway faz a junção das partes automaticamente.

```graphql
# services/reviews/index.ts
const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  # Estendemos os tipos que vivem em outros microsserviços!
  type Product @key(fields: "id") {
    id: ID!
    reviews: [Review!]!
  }

  type User @key(fields: "id") {
    id: ID!
  }

  type Review {
    id: ID!
    body: String!
    author: User!
  }
`;
```
**Impacto:** Se o serviço de Catálogo (Produtos) cair, o serviço de Avaliações continua de pé. O Gateway orquestra o tráfego e isola falhas (resiliência).

---

## 2. Padrão Database-per-service (Isolamento de Dados)

Um antipadrão clássico em microsserviços é fazer múltiplos serviços apontarem para o mesmo banco de dados (Shared Database). Para garantir verdadeira independência, adotamos a regra: **1 Microsserviço = 1 Banco de Dados**.

### O Desafio com Prisma no Monorepo
Ao usar o Prisma ORM, o padrão é gerar os clientes de tipagem em `node_modules/@prisma/client`. Como temos múltiplos esquemas, um sobrescreveria o outro, causando erros de TypeScript.

### A Solução
Forçamos a geração do motor de banco de dados e das tipagens estritamente para dentro da pasta de cada serviço.

```prisma
// services/catalog/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client" // O pulo do gato!
}
```
**Impacto:** O time de Catálogo pode atualizar a versão do Prisma ou quebrar seu schema sem afetar a tipagem e o build do time de Usuários.

---

## 3. Frontend: Module Federation (Micro-frontends)

O React tradicional gera um grande bloco de código (Single Page Application). Quando 10 times mexem no mesmo Frontend, o tempo de build explode e os conflitos são diários. Implementamos a solução **Vite Module Federation**.

### O Diferencial
Quebramos o frontend em uma "Casca" (`Host`) e "Pedaços Injetáveis" (`Remotes`). O `catalog-ui` é compilado de forma independente e hospedado em seu próprio servidor.

### A Injeção Assíncrona no Host
O Host baixa o código do Catálogo *em tempo de execução* usando a própria internet, embutindo-o suavemente com o `React.Suspense`.

```tsx
// apps/host/src/App.tsx
import React, { Suspense } from 'react'

// O Host sequer tem o código do Catálogo no seu bundle de build.
// Ele faz o download dinâmico do servidor do MFE!
const CatalogRemote = React.lazy(() => import('catalog/Catalog'))

function App() {
  return (
    <div>
      <h1>E-commerce Shell (Host)</h1>
      <Suspense fallback={<p>Baixando Catálogo via rede...</p>}>
        <CatalogRemote currentUser={{ id: "123" }} />
      </Suspense>
    </div>
  )
}
```

### Autonomia de Estado
Mesmo renderizado dentro do Host, o Micro-frontend Remoto (`catalog-ui`) mantém total controle sobre o seu próprio estado e requisições HTTP (com seu próprio ApolloProvider conectado ao Gateway).

**Impacto:** Um deploy com bug feito no frontend do Catálogo não quebra o cabeçalho e o carrinho de compras mantidos pelo Shell. Além disso, o deploy do MFE é feito em segundos, não precisando recompilar o resto do site.

---

## Conclusão
O resultado deste projeto é uma estrutura digna de *Big Techs*:
1. Times independentes podem fazer deploys diários sem medo de quebrar os outros.
2. A aplicação não sofre "Cold Starts" pesados, pois o frontend é quebrado em blocos menores que são cacheados independentemente no navegador.
3. Se um microsserviço (ex: Catálogo) falhar, o Gateway protege a arquitetura e continua devolvendo os dados dos usuários intactos.
