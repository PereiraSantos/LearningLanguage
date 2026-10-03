import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

/**
 * Agrupa os providers essenciais da aplicação (camada `core`).
 *
 * Mantém o `app.config.ts` limpo e declarativo: aqui ficam os provedores
 * globais (HTTP, interceptors, initializers, etc.) que são instanciados
 * uma única vez no nível da raiz.
 */
export function provideCore(): (Provider | EnvironmentProviders)[] {
    return [
        provideHttpClient(),
        // Outros providers do core (interceptors, APP_INITIALIZER...) entram aqui.
    ];
}
