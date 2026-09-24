# LearningLanguage — Documentação do Projeto

Aplicação Angular para aprendizado de idiomas: cadastro de **categorias/palavras**,
registro de **anotações** e **diálogos**, além de telas de **histórico** agrupadas por dia.

---

## 1. Visão geral

- **Framework:** Angular 21 (standalone components, signals, Control Flow `@for`/`@if`).
- **UI:** Angular Material (sidenav, toolbar, list, icon) + CDK (text-field).
- **Estado:** Signals nativos do Angular (`signal`, `asReadonly`).
- **Reatividade/HTTP:** RxJS (`Observable`) + `HttpClient`.
- **Testes:** Vitest (`vi.fn()`, `TestBed`) com jsdom.
- **Idioma da UI:** Português (pt-BR).

### Pré-requisitos
- Node.js 20+ (recomendado) e npm.
- Backend em execução no endereço configurado em `src/environments`.

### Scripts (package.json)
| Comando | Descrição |
|---|---|
| `npm start` | Sobe o servidor de desenvolvimento (`ng serve`). |
| `npm run build` | Build de produção (`ng build`). |
| `npm run watch` | Build em modo watch (development). |
| `npm test` | Executa os testes unitários (`ng test`). |

---

## 2. Arquitetura

O projeto separa **cinco responsabilidades** por feature:

```
Entities (modelo de domínio)  →  Services (HTTP)  →  Mapper (transformação pura)
                                   ↓
                             Facade (estado + casos de uso)
                                   ↓
                          Component (view/UI)
```

- **Entities** (`src/app/entities`): modelo de domínio + DTOs + `fromDTO`.
- **Services** (`src/app/services`): acesso HTTP (um por recurso).
- **Mapper** (`*.mapper.ts`): funções puras que convertem DTO → entidade.
- **Facade** (`*.facade.ts`): mantém o estado reativo (signals) e orquestra os serviços.
- **Component** (`*.component.ts`): componente "magro"; apenas injeta a facade e expõe signals à view.

### Módulos completos (padrão Facade + Mapper)
- `category/`
- `annotation-history/`

Cada um contém `*.component.ts`, `*.facade.ts`, `*.mapper.ts`, `*.messages.ts` e testes em `spec/`.

### Módulos legados (lógica ainda no componente)
- `annotation/`, `dialog/`, `dialog-history/` — contêm lógica de negócio/HTTP diretamente no componente e são candidatos a migrar para o padrão Facade + Mapper.

---

## 3. Estrutura de pastas

```
src/
├── main.ts                       # Bootstrap da aplicação
├── styles.css                    # Estilos globais
├── environments/
│   ├── environment.ts            # Produção
│   └── environment.development.ts# Desenvolvimento
└── app/
    ├── app.ts / app.html         # Componente raiz (router-outlet)
    ├── app.config.ts             # Providers globais (router)
    ├── app.routes.ts             # Rotas
    ├── app.spec.ts               # Teste do componente raiz
    ├── entities/                 # Modelo de domínio
    │   ├── category.ts           # Category + CategoryDTO
    │   ├── word.ts               # Word + WordDTO
    │   ├── text-small.ts         # TextSmall + TextSmallDTO
    │   ├── text_small_info.ts    # Agrupamento (dia) de TextSmall
    │   ├── text-long.ts          # TextLong
    │   └── text_long_info.ts     # Agrupamento (dia) de TextLong
    ├── services/                 # Acesso HTTP
    │   ├── category.service.ts
    │   ├── word.service.ts
    │   ├── text-small.servie.ts  # (nome do arquivo tem typo: "servie")
    │   ├── text-long.service.ts
    │   └── toast.service.ts
    ├── component/modal/          # Componente de modal reutilizável
    │   ├── modal.component.ts
    │   ├── modal.contract.ts     # Interface OpenableModal
    │   └── toast-container.component.ts
    ├── home/                     # Layout com sidenav + navegação
    ├── category/                 # Feature: categorias/palavras (padrão)
    ├── annotation-history/       # Feature: histórico de anotações (padrão)
    ├── annotation/               # Feature legada: anotações
    ├── dialog/                   # Feature legada: diálogo
    └── dialog-history/           # Feature legada: histórico de diálogo
```

---

## 4. Rotas

Definidas em `src/app/app.routes.ts`:

| Rota | Componente | Descrição |
|---|---|---|
| `` (raiz) | redireciona para `/home` | — |
| `/home` → `/category` | `Home` + `CategoryComponent` | Lista de categorias/palavras. |
| `/dialog` | `DialogComponent` | Registro de diálogo. |
| `/annotation` | `AnnotationComponent` | Registro de anotações. |
| `/dialog-history` | `DialogHistoryComponent` | Histórico de diálogos. |
| `/annotation-history` | `AnnotationHistoryComponent` | Histórico de anotações. |

`Home` (`src/app/home`) é o shell com `mat-sidenav` e itens de navegação.

---

## 5. Entidades (modelo de domínio)

### Category / Word
```ts
class Category { id: number; name: string; words: Word[]; static fromDTO(dto): Category }
class Word     { id: number; name: string; idCategory: number; get isNew(): boolean; static fromDTO(dto): Word }
```
- `Word.isNew` → `true` quando `idCategory === -1` (palavra ainda não persistida).

### TextSmall / TextSmallInfo
```ts
class TextSmall     { id; value; creation?; static fromDTO(dto); static toDay(iso); get day() }
class TextSmallInfo { creation: string; textSmalls: TextSmall[] }
```
- `TextSmall.toDay` normaliza o timestamp ISO (`YYYY-MM-DDTHH:mm:ss`) para apenas o dia (`YYYY-MM-DD`).

### TextLong / TextLongInfo
```ts
class TextLong     { id; value; creation? }
class TextLongInfo { creation: string; textLongs: TextLong[] }
```

---

## 6. Serviços (HTTP)

Todos usam `environment.apiUrl` e são `@Injectable({ providedIn: 'root' })`.

| Serviço | Endpoints |
|---|---|
| `CategoryService` | `GET /api/category`, `POST /api/category`, `PUT /api/category` |
| `WordService` | `GET /api/word`, `POST /api/word`, `PUT /api/word`, `POST /api/word/category` |
| `TextSmallService` | `GET /api/textsmall`, `POST /api/textsmall` |
| `TextLongService` | `GET /api/textlong`, `POST /api/textlong` |
| `ToastService` | Estado local de notificações (signal `toasts`), `show`, `remove` |

### Ambientes
`src/environments/environment.ts` (produção) e `environment.development.ts` (dev) definem:
```ts
export const environment = { production: <bool>, apiUrl: 'http://192.168.1.150:3001' };
```
No build de desenvolvimento, `environment.ts` é substituído por `environment.development.ts` (ver `angular.json`).

---

## 7. Padrão Facade + Mapper (detalhado)

Exemplo — `annotation-history`:

1. **Mapper** (`annotation-history.mapper.ts`) — função pura, O(n), sem dependências de Angular:
   ```ts
   export function toTextSmallInfos(dtos: TextSmallDTO[] | null): TextSmallInfo[] {
     // agrupa por dia usando Map, preservando a ordem de primeira aparição
   }
   ```
2. **Facade** (`annotation-history.facade.ts`) — estado reativo + orquestração:
   ```ts
   @Injectable()
   export class AnnotationHistoryFacade {
     readonly textSmallInfos = this._textSmallInfos.asReadonly();
     loadHistory(): void { /* GET + set + catchError → toast */ }
   }
   ```
3. **Component** (`annotation-history.component.ts`) — apenas view:
   ```ts
   @Component({ ..., changeDetection: ChangeDetectionStrategy.OnPush, providers: [AnnotationHistoryFacade] })
   export class AnnotationHistoryComponent implements OnInit {
     readonly textSmallInfos = inject(AnnotationHistoryFacade).textSmallInfos;
     ngOnInit() { this.facade.loadHistory(); }
   }
   ```

> **Vantagem:** a lógica de agrupamento e o acesso HTTP ficam testáveis isoladamente, sem DOM/template.

### Nota histórica
O código original do `annotation-history` fazia o agrupamento com recursão + `Array.splice`
e `findIndex` dentro de um loop (O(n²)), com um bug que removia itens pelo primeiro índice
encontrado da data. A refatoração para **Mapper puro com `Map`** corrigiu isso e tornou o
fluxo testável.

---

## 8. Componentes de UI

### ModalComponent (`component/modal`)
- `@Input() titulo`, abre/fecha via `abrir()`/`fechar()`, fecha ao clicar no overlay.
- Contrato **`OpenableModal`** (`modal.contract.ts`): interface `{ abrir(): void; fechar(): void }`, usada para tipar o modal nos componentes (em vez de `any`).

### ToastContainerComponent (`component/modal`)
- Renderiza as notificações do `ToastService` (canto superior direito, some após 3s).

---

## 9. Testes

- Ferramenta: **Vitest** + **jsdom**, integrados ao Angular (`@angular/build:unit-test`).
- Convenção: arquivos `*.spec.ts` ficam na subpasta **`spec/`** de cada feature.
- Mocks de serviços via objetos com `vi.fn()` e `providers` do `TestBed`.

### Cobertura atual
| Feature | Testes |
|---|---|
| `category/spec` | `mapper`, `facade`, `component` |
| `annotation-history/spec` | `mapper`, `facade`, `component` |
| `src/app` | `app.spec.ts` (componente raiz) |

### Exemplo de execução
```bash
npm test
# ou restringindo a uma feature:
ng test --include='src/app/annotation-history/**/*.spec.ts'
```

### Boas práticas adotadas nos testes
- Testar o **mapper** como função pura (entrada DTO → saída esperada, incluindo `null`/`undefined`).
- Testar a **facade** com serviços mockados (sucesso e erro → toast).
- Testar o **componente** apenas para integração view/estado (criação, render, chamada de carga).

---

## 10. Limitações conhecidas / Próximos passos

- **Módulos legados** (`annotation`, `dialog`, `dialog-history`) ainda concentram lógica no componente: migrar para Facade + Mapper.
- **`text-small.servie.ts`**: nome de arquivo com typo ("servie" → "service"); renomear exige atualizar imports.
- **Tipagem fraca**: alguns serviços retornam `Observable<any>` (ex.: `TextSmallService`, `TextLongService`) — tipar com DTOs.
- **Entidades `creation`**: `TextLong.creation` é tipado como `Date`, mas recebe string do split — padronizar como `string` (dia), como feito em `TextSmall`.
- **Ambiente hardcoded**: `apiUrl` aponta para um IP de rede local; externalizar por variável.
- **Mensagens de erro genéricas** ("Usuário ou senha inválidos!") em telas de histórico — ajustar para mensagens de domínio.

---

## 11. Glossário

| Termo | Significado |
|---|---|
| **TextSmall** | Anotação curta (fragmento de texto). |
| **TextLong** | Diálogo/texto longo. |
| **Facade** | Camada que centraliza estado e casos de uso de uma feature. |
| **Mapper** | Transformação pura DTO ↔ entidade. |
| **DTO** | Formato cru do payload da API. |
| **Signal** | Primitivo reativo do Angular para estado. |
