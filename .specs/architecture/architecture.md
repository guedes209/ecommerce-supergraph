# Arquitetura: E-commerce Supergraph

## Visão Geral
Este projeto utiliza uma arquitetura baseada em Micro-frontends no cliente e GraphQL Federation (Supergraph) no servidor, permitindo que múltiplos times desenvolvam e entreguem funcionalidades de forma independente.

## Tecnologias Escolhidas
- **Frontend**: React (via Webpack Module Federation ou Next.js)
- **API Gateway**: Apollo Router / Apollo Server (GraphQL Federation)
- **Subgrafos (Microsserviços)**: Node.js / TypeScript
- **Bancos de Dados**: PostgreSQL / MongoDB (a ser definido por serviço)

## Componentes Principais
1. **Supergraph Gateway**: Ponto de entrada único para o cliente. Roteia as queries para os subgrafos corretos.
2. **Subgraph - Catálogo (Catalog)**: Gerencia os produtos.
3. **Subgraph - Avaliações (Reviews)**: Gerencia as avaliações dos produtos.
4. **Subgraph - Usuários (Users)**: Gerencia a autenticação e perfis.
5. **Micro-frontend - Host (Shell)**: A aplicação principal que carrega os outros frontends.
6. **Micro-frontend - Produtos**: Interface de listagem de produtos.

*(Este documento será expandido conforme o desenvolvimento avança)*
