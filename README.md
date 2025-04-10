# Grayola

✨ Grayola is ready ✨.

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

