# Especificação (EARS) - Subgrafo de Avaliações (Reviews)

## Objetivo
Criar o microsserviço de Avaliações (Reviews) para demonstrar a orquestração distribuída do Apollo Federation. Este serviço será responsável por guardar os reviews, mas estenderá magicamente os tipos `Product` e `User` que vivem em outros microsserviços.

## Requisitos (EARS)
1. **[Ubiquitous]** O sistema DEVE possuir um subgrafo `reviews` rodando independentemente na porta `4003`.
2. **[Ubiquitous]** O Gateway DEVE ser atualizado para rotear tráfego para este novo subgrafo.
3. **[State-driven]** ENQUANTO o Gateway estiver operante, o tipo `Review` DEVE conseguir retornar seu `Author` (resolvido pelo serviço Users) e seu `Product` (resolvido pelo serviço Catalog).
4. **[State-driven]** ENQUANTO o Gateway estiver operante, os tipos `Product` e `User` DEVEM ganhar um novo campo chamado `reviews` (injetado por este subgrafo).
5. **[Event-driven]** QUANDO o frontend consultar a tela inicial, ele DEVE ser capaz de pedir os produtos e, na mesma query, trazer as avaliações de cada produto sem saber que os dados vêm de servidores diferentes.

## Critérios de Aceite
- [ ] Serviço `reviews` criado e rodando na porta 4003.
- [ ] Gateway reconhece o novo schema.
- [ ] Uma query GraphQL no Apollo Playground consegue buscar um `Product`, suas `reviews` e o `username` do autor de cada review de forma aninhada.

