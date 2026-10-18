import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { leads, leadStatuses } from "../../../../db/schema";
export async function GET(){if(!db)return NextResponse.json({error:"Banco não configurado"},{status:503});const rows=await db.select({name:leads.clientName,phone:leads.phone,date:leads.contactDate,status:leadStatuses.name}).from(leads).leftJoin(leadStatuses,eq(leads.statusId,leadStatuses.id));const wb=new ExcelJS.Workbook();const ws=wb.addWorksheet("Leads");ws.columns=[{header:"Cliente",key:"name"},{header:"Telefone",key:"phone"},{header:"Data",key:"date"},{header:"Status",key:"status"}];ws.addRows(rows);const buffer=await wb.xlsx.writeBuffer();return new NextResponse(buffer as BodyInit,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":"attachment; filename=leads.xlsx"}});}
