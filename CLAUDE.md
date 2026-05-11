# Calorie Tracker Mobile — Guía para Claude

## Descripción del Proyecto

Aplicación móvil con Tauri v2 + React 19 + TypeScript para registrar calorías y ejercicios. Conectada a una API REST en `http://localhost:8080`.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Shell de escritorio | Tauri v2 |
| Framework UI | React 19 + TypeScript |
| Build tool | Vite 7 |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite` — sin `tailwind.config.js`) |
| Librería de componentes | shadcn/ui (preset Radix Nova) |
| Estado del servidor | React Query v5 (`@tanstack/react-query`) |
| Enrutamiento | react-router-dom v7 |
| Cliente HTTP | axios con interceptores de auth |
| Formularios | react-hook-form v7 + Zod v3 + @hookform/resolvers v3 |
| Gráficas | recharts v3 |
| Utilidades de fechas | date-fns v4 |

## Comandos de Desarrollo

```bash
# Servidor de desarrollo (solo web)
pnpm dev

# Verificación TypeScript + build de producción
pnpm build

# Tauri en modo desarrollo (ventana nativa)
pnpm tauri dev

# Build de producción con Tauri
pnpm tauri build
```

## Solución SSL (Requerida en Esta Máquina)

El Node.js de esta máquina no confía en el certificado del registro de npm. Se necesitan dos soluciones:

**Para instalaciones con pnpm** — ya configurado globalmente:
```bash
pnpm config set strict-ssl false
```

**Para comandos de shadcn CLI** — prefijo con `NODE_OPTIONS`:
```bash
$env:NODE_OPTIONS = "--use-system-ca"
pnpm dlx shadcn@latest add <componente>
```

Sin esto, los comandos de shadcn fallan con errores de certificado SSL.

## Arquitectura — Clean Architecture (4 Capas)

```
src/
├── domain/          # Capa 1: reglas de negocio puras, sin dependencias externas
│   ├── entities.ts  # Todas las interfaces y enums de TypeScript
│   └── repositories/  # Interfaces puras (contratos), 1 por recurso
│
├── application/     # Capa 2: casos de uso — 1 clase, 1 método execute()
│
├── infrastructure/  # Capa 3: implementaciones concretas
│   ├── api/client.ts         # Instancia de axios con interceptores de auth y 401
│   └── repositories/         # Implementan las interfaces del dominio
│
├── di/container.ts  # Singleton a nivel de módulo — conecta repos y casos de uso
│
└── presentation/    # Capa 4: React
    ├── context/AuthContext.tsx  # Estado de auth, localStorage, evento auth:logout
    ├── hooks/                   # Hooks de React Query, 1 archivo por recurso
    ├── layouts/                 # AuthLayout + AppLayout (nav inferior)
    ├── components/              # Componentes compartidos
    └── pages/                   # Componentes de ruta
```

## Principios SOLID Aplicados

| Principio | Implementación |
|-----------|---------------|
| **S** | `AuthRepositoryImpl` solo maneja HTTP — localStorage es responsabilidad de AuthContext |
| **S** | Cada caso de uso tiene un único método `execute()` con un solo propósito |
| **O** | Nueva fuente de datos = nueva clase impl, sin cambiar casos de uso ni hooks |
| **L** | Cualquier implementación de `IFoodRepository` puede sustituir a otra |
| **I** | 9 interfaces pequeñas por recurso, no una `IRepository` god-object |
| **D** | Los casos de uso dependen de `IXxxRepository` (abstracción), nunca del impl concreto |

## Decisiones de Diseño Clave

### Flujo de Autenticación
- Token almacenado en `localStorage('auth_token')`
- Al montar `AuthContext`: lee el token → llama `GET /auth/me` → establece el usuario o limpia la auth
- El interceptor de axios emite `window.dispatchEvent(new Event('auth:logout'))` en cualquier 401
- `AuthContext` escucha ese evento con `useEffect` y llama `clearAuth()`

### Enriquecimiento de Datos
La API devuelve solo IDs en campos relacionales. Dos repositorios enriquecen sus respuestas:
- `DailyLogRepositoryImpl.getByDate()` — extrae `food_id`s únicos, obtiene detalles de comida con `Promise.allSettled`, construye un Map y adjunta el objeto `food` a cada `MealEntry`
- `ExerciseLogRepositoryImpl.getByDate()` — mismo patrón para `exercise_id` → `Exercise`

### Convenciones de Query Keys en React Query
```
['dailyLog', date]         ['exerciseLogs', date]
['foods', 'search', query] ['exercises', 'search', query, category]
['weightLogs']             ['measurements']
['goals', 'active']        ['profile']
['me']
```

### Layout Móvil
- Nav inferior: `fixed bottom-0 inset-x-0 z-50 h-16 border-t bg-background/95 backdrop-blur`
- Contenido de página: `flex-1 overflow-y-auto pb-20` (evita que el nav tape el contenido)
- Búsqueda de comida/ejercicio: `<Sheet side="bottom">` (más nativo en móvil que Dialog)

### Versiones de Dependencias — No Actualizar Sin Cuidado
- **Zod debe permanecer en v3** (`^3.23.8`) — Zod v4 es incompatible con `@hookform/resolvers` v3
- **@hookform/resolvers debe permanecer en v3** (`^3.10.0`) — v5+ requiere Zod v4

## Agregar Nuevas Funcionalidades

1. Agregar interfaz en `src/domain/entities.ts` si se necesita una nueva forma
2. Agregar/extender la interfaz de repositorio en `src/domain/repositories/`
3. Crear caso(s) de uso en `src/application/<recurso>/`
4. Implementar el repositorio en `src/infrastructure/repositories/`
5. Registrar en `src/di/container.ts`
6. Agregar hook de React Query en `src/presentation/hooks/`
7. Construir la página/componente en `src/presentation/`

## URL Base de la API

`http://localhost:8080` — configurada en `src/infrastructure/api/client.ts`. Cambiar solo ahí; todo el resto del código usa el singleton `container`.
