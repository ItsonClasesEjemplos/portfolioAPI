# Portfolio API — Documentación completa

API REST desarrollada con Node.js, Express y MongoDB para gestionar **usuarios y proyectos**.  
Incluye autenticación JWT, rutas públicas y protegidas.

---

## Base URL

```js
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
````

---

## Modelos

### User

```json
{
  "name": "string (min 6)",
  "email": "string (email)",
  "password": "string (min 6, solo se envía en login/register)",
  "itsonId": "string (6 caracteres numéricos)"
}
```

### Project

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "userId": "string (ObjectId del usuario)",
  "technologies": ["string", "..."],
  "repository": "string (url opcional)",
  "images": ["string (url)", "..."]
}
```

---

# Endpoints

> Las rutas mostradas son relativas a `API_BASE`.

---

## POST `/auth/register` — Registrar usuario

### Body

```json
{
  "name": "Brianda Raquel Campoy Esquer",
  "email": "brianda.pekachu@gmail.com",
  "itsonId": "216578",
  "password": "123456789"
}
```

### Respuesta (201)

```json
{
  "id": "64...abc",
  "name": "Brianda Raquel Campoy Esquer",
  "email": "brianda.pekachu@gmail.com",
  "itsonId": "216578"
}
```

### Errores comunes

* `400 Bad Request`: Faltan campos o formato incorrecto

### Ejemplo (fetch)

```js
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function register(user) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data;
}

register({
  name: "Brianda ...",
  email: "brianda.pekachu@gmail.com",
  itsonId: "216578",
  password: "125487963"
}).then(console.log).catch(console.error);
```

---

## POST `/auth/login` — Iniciar sesión

### Body

```json
{
  "email": "brianda.pekachu@gmail.com",
  "password": "123456789"
}
```

### Respuesta (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64...abc",
    "name": "Brianda ...",
    "email": "brianda.pekachu@gmail.com",
    "itsonId": "216578"
  }
}
```

### Ejemplo (fetch)

```js
function saveToken(token) {
  localStorage.setItem("authToken", token);
}

async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  saveToken(data.token);
  return data;
}

login({ email: "brianda.pekachu@gmail.com", password: "125487963" })
  .then(console.log)
  .catch(console.error);
```

---

## GET `/publicProjects/:itsonId` — Obtener proyectos públicos

### Ejemplo de solicitud

```
GET /publicProjects/216578
```

### Respuesta (200)

```json
[
  {
    "_id": "64...proj1",
    "title": "Mi proyecto",
    "description": "Descripción",
    "userId": "64...user",
    "technologies": ["JavaScript", "Node.js"],
    "repository": "https://github.com/...",
    "images": []
  }
]
```

### Ejemplo (fetch)

```js
async function getPublicProjects(itsonId) {
  const res = await fetch(`${API_BASE}/publicProjects/${itsonId}`);
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

getPublicProjects("216578").then(console.log).catch(console.error);
```

---

## GET `/projects/user/:userId` — Obtener proyectos de un usuario (protegido)

> Requiere header `auth-token: <token>`

### Ejemplo

```js
async function getProjectsByUser(userId) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/user/${userId}`, {
    headers: { auth-token: `${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}
```

---

## GET `/projects/:projectId` — Obtener proyecto por ID

### Ejemplo

```js
async function getProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error("Proyecto no encontrado");
  return res.json();
}
```

---

## POST `/projects` — Crear proyecto

### Body

```json
{
  "title": "Proyecto nuevo",
  "description": "Breve descripción",
  "userId": "64...user",
  "technologies": ["React", "Node"],
  "repository": "https://github.com/...",
  "images": []
}
```

### Ejemplo

```js
async function createProject(project) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": `${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
}
```

---

## PUT `/projects/:projectId` — Actualizar proyecto

### Ejemplo

```js
async function updateProject(projectId, updates) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": `${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("Error al actualizar");
  return res.json();
}
```

---

## DELETE `/projects/:projectId` — Eliminar proyecto

### Ejemplo

```js
async function deleteProject(projectId) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: { "auth-token": `${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar");
  return res.json();
}
```

# Buenas prácticas

1. **Guarda el token** con `localStorage.setItem("authToken", token)` o preferiblemente en cookies `HttpOnly` (producción).
2. **Usa siempre** `Content-Type: application/json` en tus solicitudes POST/PUT.
3. **Maneja errores** comprobando `if (!res.ok)` y mostrando el mensaje del backend.
4. **Protege rutas** que modifican datos con `auth-token: <token>`.
5. **Restringe CORS** en producción a los dominios que realmente usarán la API.

---

# Ejemplos con `curl`

### Registrar usuario

```bash
curl -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Brianda","email":"b@example.com","itsonId":"216578","password":"123456"}'
```

### Login

```bash
curl -X POST "${API_BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"b@example.com","password":"123456"}'
```

### Obtener proyectos públicos

```bash
curl "${API_BASE}/publicProjects/216578"
```

### Crear proyecto (requiere token)

```bash
curl -X POST "${API_BASE}/projects" \
  -H "Content-Type: application/json" \
  -H "auth-token: <TOKEN>" \
  -d '{"title":"Nuevo","description":"...","userId":"64...","technologies":["JS"]}'
```

