import { describe, it, expect, vi } from "vitest";
import { screen, act } from "@testing-library/react";
import { LazyHydrate, HYDRATED_EVENT } from "@/components/LazyHydrate";
import { renderWithProviders } from "../helpers";

describe("LazyHydrate — hidratação preguiçosa", () => {
  it("fora da hidratação (render no cliente) mostra os filhos na hora", () => {
    renderWithProviders(
      <LazyHydrate>
        <p>conteúdo do bloco</p>
      </LazyHydrate>
    );
    expect(screen.getByText("conteúdo do bloco")).toBeInTheDocument();
  });

  it("avisa em window quando hidrata, com o elemento raiz", () => {
    const onHydrated = vi.fn();
    window.addEventListener(HYDRATED_EVENT, onHydrated);
    renderWithProviders(
      <LazyHydrate>
        <p>bloco</p>
      </LazyHydrate>
    );
    expect(onHydrated).toHaveBeenCalledTimes(1);
    const detail = (onHydrated.mock.calls[0][0] as CustomEvent<HTMLElement>).detail;
    expect(detail.textContent).toBe("bloco");
    window.removeEventListener(HYDRATED_EVENT, onHydrated);
  });

  it("reenvia o evento hydrateOn depois de hidratar, para o filho já montado ouvir", () => {
    const got = vi.fn();
    window.addEventListener("ld:abre", got);
    renderWithProviders(
      <LazyHydrate hydrateOn="ld:abre">
        <p>terminal</p>
      </LazyHydrate>
    );
    // já hidratado (render no cliente): o evento passa direto, sem duplicar
    act(() => {
      window.dispatchEvent(new CustomEvent("ld:abre"));
    });
    expect(got).toHaveBeenCalledTimes(1);
    window.removeEventListener("ld:abre", got);
  });
});
