// Eventos globais entre componentes que não compartilham estado.
// Ficam aqui, e não no componente, para quem só dispara o evento (Navbar)
// não carregar o módulo inteiro de quem escuta (Terminal) no script inicial.

/** A Navbar dispara no botão `_shell`; o Terminal abre em tela cheia. */
export const TERMINAL_OPEN_EVENT = "ld:terminal-open";
