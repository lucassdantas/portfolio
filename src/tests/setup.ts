import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom não implementa APIs de layout/observação usadas pelos componentes
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

// Sem rede em testes: cada teste que precisar de fetch deve mockar explicitamente
vi.stubGlobal(
  "fetch",
  vi.fn(() => Promise.reject(new Error("fetch desabilitado em testes")))
);
