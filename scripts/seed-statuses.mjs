import { neon } from "@neondatabase/serverless";
const DEFAULT_STATUSES = [["SEM RETORNO INICIAL","#64748b",false,false],["NÃO PREENCHEU O LINK","#f59e0b",false,false],["SIMULAÇÕES ENVIADAS","#2563eb",false,false],["AGUARDANDO ENVIO DA DOCUMENTAÇÃO","#f97316",false,false],["ENTRAR EM CONTATO NOVAMENTE","#eab308",false,false],["NÃO DESEJA SEGUIR NO MOMENTO","#ef4444",false,true],["VIROU NEGOCIO","#16a34a",true,true]];
const sql = neon(process.env.DATABASE_URL);
for (const [name, color, isConversion, isFinal] of DEFAULT_STATUSES) await sql`insert into lead_statuses (name,color,is_conversion,is_final,sort_order) values (${name},${color},${isConversion},${isFinal},${DEFAULT_STATUSES.findIndex(s => s[0] === name)}) on conflict (name) do update set color=excluded.color,is_conversion=excluded.is_conversion,is_final=excluded.is_final`;
console.log(`Seeded ${DEFAULT_STATUSES.length} statuses`);
