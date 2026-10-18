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
