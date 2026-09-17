# Especificação (EARS) - Configuração Inicial (Setup)

## Objetivo
Configurar a base do monorepo, infraestrutura inicial de microsserviços e a federação GraphQL.

## Requisitos (EARS)
1. **[Ubiquitous]** O sistema DEVE utilizar um gerenciador de pacotes moderno (npm/yarn/pnpm) com suporte a workspaces (monorepo).
2. **[Ubiquitous]** O sistema DEVE possuir um Apollo Gateway rodando localmente na porta 4000.
3. **[Event-driven]** QUANDO o Gateway for iniciado, ele DEVE conseguir compor o schema a partir de pelo menos dois subgrafos mockados (ex: Users e Products).
4. **[Ubiquitous]** O código DEVE estar padronizado com ESLint e Prettier na raiz do projeto.

## Critérios de Aceite
- [x] Monorepo configurado com sucesso.
- [x] Gateway GraphQL consegue ser iniciado sem erros de composição.
- [x] Subgrafos respondem a queries simples no Apollo Studio / Playground.
