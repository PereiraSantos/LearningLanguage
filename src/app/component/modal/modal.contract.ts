/**
 * Contrato mínimo que o componente espera de um modal.
 * Permite tipar as chamadas (antes `any`) e criar falsos/espies em testes.
 */
export interface OpenableModal {
    abrir(): void;
    fechar(): void;
}
