# Reglas, Principios de Desarrollo y Convención de Arquitectura (Orquestador de Ecommerce)

Toda nueva función, módulo, servicio, componente, refactorización o cambio de código en este proyecto DEBE cumplir de forma estricta con las reglas de **Clean Architecture**, **Clean Code** y los **8 Principios Mandatorios** heredados del ecosistema.

---

## 1. Los 8 Principios Mandatorios de Desarrollo

1. **No mantener compatibilidad hacia atrás.**
   - Lo obsoleto se borra directamente.
   - Prohibido agregar capas de compatibilidad, shims temporales o dejar fallbacks obsoletos.

2. **Elegir la implementación más simple que satisfaga la necesidad actual (KISS / YAGNI).**
   - Nada de abstracciones preventivas ni capas de configuración innecesarias.
   - Escribe el código necesario para resolver el caso de uso real de hoy.

3. **Dividir el sistema en capas largas (End-to-End First).**
   - Primero hacer funcionar una versión mínima de extremo a extremo (Wizard -> Dominio -> Infraestructura -> Deploy), luego pulir y expandir.
   - Nunca desmantelar un flujo que ya funciona por una refactorización a medias.

4. **Separación estricta de responsabilidades (Clean Architecture / Puertos y Adaptadores).**
   - Estricta separación entre:
     - **Dominio** (Reglas de negocio puras, tipos, puertos/interfaces, errores de dominio). Sin dependencias de frameworks.
     - **Servicios / Casos de Uso** (Orquestación del flujo de aprovisionamiento, validaciones de aplicación).
     - **Infraestructura** (Implementaciones de puertos: Cloudflare API, GitHub Octokit, Vercel API, DB Local).
     - **Presentación / UI** (Next.js App Router, componentes React, Zustand para UI state).

5. **Priorizar bibliotecas maduras y mantenidas.**
   - No reinventar clientes HTTP, parsers ni utilidades complejas que ya están resueltas por paquetes oficiales y estables.

6. **Primero revisar qué pueden hacer las dependencias ya existentes en el proyecto.**
   - Antes de añadir un paquete nuevo o escribir 200 líneas de código, revisar si las librerías instaladas ya lo resuelven de forma idiomática.

7. **Tomar decisiones de arquitectura a largo plazo.**
   - No aceptar atajos del tipo *"después lo emparchamos"*. Los contratos de interfaces y separación de capas deben ser limpios desde el día 1.

8. **Mirar primero cómo resuelven el mismo problema los productos maduros.**
   - Usar patrones validados en la industria (Ports & Adapters, DTOs, Result Pattern, Repository Pattern).

---

## 2. Convención de Clean Architecture (Capas y Dependencias)

La regla de oro de dependencias: **Las capas internas NUNCA conocen a las capas externas.**

```text
[ Presentación (Next.js UI / Routes) ]
              ↓
[ Servicios / Casos de Uso (Application) ]
       ↓                     ↓
[ Dominio Puro (Core) ] ← [ Infraestructura (Adapters) ]
```

### Reglas por Capa:

### Capa 1: Dominio (`src/domain/`)
- **Responsabilidad:** Define las entidades de negocio (Comercio, Tenant, Tienda, Configuración inicial), los tipos puros, las reglas de validación de negocio y las **interfaces de puertos (`ports/`)**.
- **Restricción absoluta:** CERO dependencias de Next.js, React, Node.js internals o librerías de infraestructura como Octokit o Cloudflare SDK. Solo TypeScript estándar y tipos puros.

### Capa 2: Servicios y Casos de Uso (`src/services/` o `src/application/`)
- **Responsabilidad:** Coordina el flujo de aprovisionamiento.
  - Ejemplo: `ProvisionStoreUseCase` recibe `CreateStoreDTO`, valida con el dominio, llama al puerto de base de datos (`IDatabaseProvisionerPort`), luego al puerto de repositorio (`IGitProvisionerPort`), luego al puerto de hosting (`IHostingDeployerPort`).
- **Restricción:** Solo depende de los Puertos del Dominio. No conoce si el deploy se hace en Cloudflare Workers, Vercel o Docker.

### Capa 3: Infraestructura (`src/infra/`)
- **Responsabilidad:** Implementa los contratos definidos en los puertos del dominio.
  - `CloudflareD1ProvisionerAdapter` implementa `IDatabaseProvisionerPort`.
  - `GitHubOctokitProvisionerAdapter` implementa `IGitProvisionerPort`.
  - `CloudflareWorkerDeployerAdapter` implementa `IHostingDeployerPort`.
- **Modo Simulación (Mock):** Cada puerto DEBE contar con un adaptador mock/in-memory para desarrollo local y tests rápidos sin requerir credenciales reales.

### Capa 4: Presentación (`src/app/` y `src/components/`)
- **Responsabilidad:** Next.js App Router (páginas, server actions, route handlers) y componentes visuales en React (Tailwind).
- **Restricción:** Los componentes UI no tocan directamente llamadas a GitHub o Cloudflare. Invocan server actions o endpoints de la API que ejecutan los Casos de Uso.

---

## 3. Convenciones de Nomenclatura y Clean Code

* **Archivos y Directorios:** `kebab-case.ts` (ej: `store-provisioner.port.ts`, `github-provisioner.adapter.ts`).
* **Interfaces y Tipos:**
  * Puertos: `I{Nombre}Port` (ej: `IGitProvisionerPort`, `IDatabaseProvisionerPort`).
  * Entidades / Modelos: `StoreTenant`, `ProvisionJob`, `StoreBranding`.
  * DTOs: `{Accion}{Entidad}Dto` (ej: `CreateStoreDto`, `ProvisionResultDto`).
* **Manejo de Errores:**
  * Uso de clases de error de dominio tipadas (`DomainError`, `SlugAlreadyExistsError`, `ProvisioningFailedError`) en lugar de arrojar `strings` genéricos o `any`.
  * Retornos controlados con objetos estructurados `{ success: true, data } | { success: false, error }`.

---

## 4. Protocolo de Análisis Mandatorio para Cada Cambio

Antes de emitir o modificar código, verificar siempre este checklist:
- [ ] **Check de dependencias existentes:** ¿Ya existe una librería o utilidad instalada en el proyecto que resuelva esto?
- [ ] **Limpieza de obsolescencia:** ¿Reemplaza código previo? Si es así, se elimina lo anterior sin fallbacks ni compatibilidad hacia atrás.
- [ ] **Simplicidad y modularidad:** ¿Es la implementación más simple posible? ¿Respeta la separación de capas sin abstracciones preventivas?
- [ ] **Extremo a extremo:** ¿Mantiene el flujo funcional sin romper lo que ya opera?
- [ ] **Patrón maduro y decisión a largo plazo:** ¿Sigue soluciones validadas en la industria y sostenibles a largo plazo?

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
