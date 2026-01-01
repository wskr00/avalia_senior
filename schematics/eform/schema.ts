export interface Schema {
  /**
   * O nome técnico fornecido pelo usuário via CLI.
   * Usado para: nomes de arquivos, seletores CSS, nomes de classes e IDs.
   * Exemplo: 'moca', 'katz-form'
   */
  name: string;

  /**
   * O nome amigável para exibição na interface.
   * Usado para: Títulos do Header e label dos botões na Home.
   * Se não for fornecido, a lógica no index.ts deverá usar o 'name'.
   * Exemplo: 'Escala de Lawton'
   */
  label?: string;
}
