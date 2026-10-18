# Prontifica Flow

Fundação full-stack em Next.js + TypeScript para substituir o controle comercial em Excel.

## Dados de origem

As abas `LEADS 2025` e `LEADS 2026` possuem a mesma estrutura: data de contato, nome do cliente, telefone, corretor, imobiliária, status e observações. A aplicação consolida as duas abas na tabela `leads`, mantendo `source` e `sourceRowKey` para rastreabilidade e idempotência. `DASHBOARD` e `BASE_DASH` são derivados por fórmulas e não devem ser importados como leads.

## Execução

1. Copie `.env.example` para `.env.local` e configure o Neon.
2. Instale dependências com `pnpm install`.
3. Gere/aplique migrations com Drizzle.
4. Execute `pnpm dev`.

O dashboard já possui a navegação principal. As próximas etapas são conectar as consultas, autenticação Better Auth e o fluxo de importação Excel em lotes.

## Operação e deploy

O projeto usa `DATABASE_URL` para consultas do Neon e `DIRECT_DATABASE_URL` para operações administrativas/migrations. A Vercel deve manter essas variáveis em Development, Preview e Production, além de `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e `NEXT_PUBLIC_APP_URL`.

Para preparar o banco: `npx drizzle-kit push`. Para inserir os status padrão: `npm run db:seed`. O login está em `/login`; o primeiro usuário administrador deve ser criado por procedimento controlado da organização antes de liberar o ambiente, sem cadastro público de administradores.

Rotas funcionais: `/api/health`, `/api/leads`, `/api/import`, `/api/follow-ups`, `/api/reports/leads`, `/api/auth/*`, `/api/brokers` e `/api/agencies`.
