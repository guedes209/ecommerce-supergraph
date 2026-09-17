# Tasks - Arquitetura Micro-Frontend (Module Federation)

## Fase 1: Specify & Design
- [x] Especificar requisitos (EARS) para o Module Federation.
- [x] Obter aprovação do usuário para este plano.

## Fase 2: Setup do Remote (Catalog UI)
- [x] Task 2.1: Criar o novo workspace React (`apps/catalog-ui`) usando Vite.
- [x] Task 2.2: Instalar e configurar o plugin `@originjs/vite-plugin-federation` no `catalog-ui`.
- [x] Task 2.3: Configurar o Remote no `vite.config.ts` para expor o componente principal e compartilhar as dependências do React/Apollo.
- [x] Task 2.4: Mover a lógica de visualização de produtos do `Host` para o `catalog-ui`.

## Fase 3: Setup e Integração no Host
- [x] Task 3.1: Instalar e configurar o plugin de federação no `vite.config.ts` do `Host`.
- [x] Task 3.2: Declarar o `catalog-ui` como um `remotes` no Host e mapear o endereço do arquivo `remoteEntry.js`.
- [x] Task 3.3: Implementar a importação dinâmica (`React.lazy` + `Suspense`) do Remote no `App.tsx` do Host.
- [x] Task 3.4: Atualizar o root `package.json` para adicionar o novo serviço na pipeline do `npm run dev`.

