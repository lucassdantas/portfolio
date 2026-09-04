import { render } from "@testing-library/react";
import { LanguageProvider } from "@/contexts/LanguageContext";

/** Renderiza um componente dentro do provider de idioma. */
export function renderWithProviders(ui: React.ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
