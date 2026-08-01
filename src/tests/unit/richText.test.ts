import { describe, it, expect } from "vitest";
import { parseMarks, stripMarks } from "@/lib/richText";

describe("richText", () => {
  it("separa o trecho destacado do resto da linha", () => {
    expect(parseMarks("Busca em **JetEngine** e mais")).toEqual([
      { text: "Busca em ", strong: false },
      { text: "JetEngine", strong: true },
      { text: " e mais", strong: false },
    ]);
  });

  it("aceita destaque no início e vários por linha", () => {
    expect(parseMarks("**PHP** puro com **MySQL**")).toEqual([
      { text: "PHP", strong: true },
      { text: " puro com ", strong: false },
      { text: "MySQL", strong: true },
    ]);
  });

  it("linha sem marcação vira um único segmento", () => {
    expect(parseMarks("Landing page simples")).toEqual([
      { text: "Landing page simples", strong: false },
    ]);
  });

  it("stripMarks devolve o texto puro", () => {
    expect(stripMarks("**Next.js** com deploy em **VPS**")).toBe("Next.js com deploy em VPS");
  });
});
