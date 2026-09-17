# Micro-Frontend (Remote) - Spec & Requirements

## 1. Visão Geral
O objetivo desta feature é quebrar o atual Frontend monolítico (Host) em uma arquitetura real de Micro-frontends (MFE). O `Host` (Shell) será responsável pela casca e por dados globais (ex: Usuário Logado). Criaremos um novo app chamado `catalog-ui` (Remote) que será responsável por renderizar a lista de produtos, avaliações e formulários. O Host importará o Remote em tempo de execução via Module Federation.

## 2. Requisitos (Notação EARS)
- **R1 (Feature):** Quando o usuário acessar o Host, o sistema DEVE carregar o componente `Catalog` do Micro-frontend Remoto de forma assíncrona.
- **R2 (Ubiquitous):** O Micro-frontend Remoto DEVE rodar em uma porta separada (ex: 5174) e possuir seu próprio processo de build e deploy independente.
- **R3 (Feature):** O Host DEVE compartilhar as bibliotecas principais (React, React-DOM e Apollo Client) via Module Federation para evitar downloads duplicados no navegador.
- **R4 (State):** Enquanto o componente remoto estiver sendo carregado pela rede, o Host DEVE exibir um indicador de carregamento usando React Suspense.

## 3. Critérios de Aceitação
- A aplicação `apps/host` roda na porta 5173 e não contém mais a lógica interna de renderizar produtos.
- A aplicação nova `apps/catalog-ui` roda na porta 5174 e expõe o componente de catálogo.
- A UI final no navegador parece a mesma para o usuário, mas os arquivos JS vêm de servidores diferentes em tempo real.

