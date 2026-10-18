import { describe, expect, it } from "vitest";
import { normalizePhone, normalizeText } from "../src/lib/normalization";
describe("normalização",()=>{it("normaliza telefone",()=>expect(normalizePhone("(61) 98564-1018")).toBe("61985641018"));it("remove espaços",()=>expect(normalizeText("  Maria   José ")).toBe("Maria José"));});
