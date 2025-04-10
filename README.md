# Grayola

Grayola is ready.

# Roles y Permisos

Este documento describe los distintos roles disponibles en la plataforma y los permisos asociados a cada uno.

## Roles Disponibles

1. **Cliente**
2. **Project Manager**
3. **Diseñador**

---

## Permisos por Rol

### 1. Cliente
- [✓] Crear nuevos proyectos  
- [✗] Ver proyectos de otros usuarios  
- [✗] Editar o eliminar cualquier proyecto  
- [✗] Asignar diseñadores  

---

### 2. Project Manager
- [✓] Ver todos los proyectos  
- [✓] Asignar diseñadores a proyectos  
- [✓] Editar cualquier proyecto  
- [✓] Eliminar cualquier proyecto  
- [✓] Cambiar estados de proyectos  

---

### 3. Diseñador
- [✓] Ver proyectos asignados  
- [✗] Ver proyectos no asignados  
- [✗] Editar cualquier proyecto  
- [✗] Eliminar cualquier proyecto  
- [✗] Asignar otros diseñadores  

---

> **Nota:** Los permisos marcados con ✗ indican acciones no permitidas para el rol correspondiente.

# Project Board - Technical Overview

```sh
▾ apps/
  ▸ project-board/      # Next.js 14 application
▾ libs/
  ▸ ui/                # Shared UI components (shadcn + Framer)
  ▸ utils/             # Utilities & helpers

### Este documento describe la solución técnica desarrollada para una aplicación empresarial moderna, diseñada bajo principios de modularidad, escalabilidad y buenas prácticas de desarrollo.

---

## Descripción General

La aplicación está construida sobre un monorepo gestionado con [Nx](https://nx.dev), permitiendo la organización y desacoplamiento de funcionalidades en librerías reutilizables.

Se implementa un diseño orientado a componentes, una gestión centralizada del estado y una arquitectura de servicios para separar la lógica de negocio y comunicación con el backend.

El frontend está desarrollado con [Next.js](https://nextjs.org), aprovechando sus capacidades de Server-Side Rendering (SSR), Static Site Generation (SSG) y API Routes.

---

## Arquitectura y Librerías

### Estructura Principal

## Tecnologías Principales

| Tecnología        | Uso en el Proyecto                                          |
|------------------|-------------------------------------------------------------|
| Nx               | Monorepo management y boundaries entre librerías            |
| Next.js          | Framework SSR/SSG y estructura de rutas                     |
| Tailwind CSS     | Sistema de diseño con estilos utilitarios                   |
| Shadcn/ui        | Componentes accesibles y customizables                      |
| Framer Motion    | Animaciones declarativas y transiciones suaves              |
| Zustand          | Gestión de estado global minimalista                        |
| Supabase         | Backend-as-a-Service (Auth, Database, Storage)              |
| ESLint + Prettier| Estilo de código, reglas automáticas y formateo             |

---

## Enfoque de Desarrollo

- La lógica de comunicación con Supabase se encuentra aislada en `libs/services/`.
- Los hooks personalizados encapsulan las acciones y efectos secundarios de los componentes (`hooks/useProject.ts`, `hooks/useAuth.ts`).
- Los componentes de UI siguen un diseño desacoplado y reutilizable, con soporte para animaciones y consistencia visual utilizando `Tailwind` y `Shadcn/ui`.
- Zustand se usa para almacenar estados locales y globales de los módulos (por ejemplo: estados de filtros, paginaciones, usuario autenticado).
- La estructura de carpetas y la separación por dominio permiten escalar la aplicación sin comprometer la mantenibilidad.

---

## Estilo y Calidad de Código

El proyecto implementa un pipeline de calidad basado en:

- ESLint (Reglas específicas del equipo)
- Prettier (Formato automático)
- Convenciones de commits (opcional para futuras integraciones CI/CD)
- Modularización de código desde el primer commit
- Buenas prácticas de accesibilidad (a11y) con Shadcn/ui

---

## Objetivo Final

Crear una solución empresarial robusta, flexible y escalable, que permita:

- Crecimiento del equipo sin fricción.
- Modularización extrema.
- Reutilización de código compartido.
- Facilidad de mantenimiento.
- Escalabilidad futura a micro frontends o nuevas aplicaciones dentro del mismo monorepo.

---

## Próximos Pasos

- Integración de tests unitarios y e2e.
- Automatización de despliegues.
- Optimización de performance (lighthouse audits).
- Internacionalización (i18n).
- Diseño System evolucionado.

---


## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev project-board
```

To create a production bundle:

```sh
npx nx build project-board
```

To see all available targets to run for a project, run:

```sh
npx nx show project project-board
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

