# API de Tarefas

## Modelo Task (em memória por enquanto)

Campos:

- `id`: string (uuid)
- `title`: string (obrigatório)
- `description`: string (opcional)
- `done`: boolean (default: false)
- `createdAt`: Date

---

## Rotas

### POST /tasks
- Cria uma nova tarefa.
- Body (JSON):
  - `title` (obrigatório)
  - `description` (opcional)
- Respostas:
  - 201: tarefa criada (retorna objeto Task)
  - 400: se faltar `title`

### GET /tasks
- Lista todas as tarefas.
- Respostas:
  - 200: array de Task

### GET /tasks/:id
- Busca uma tarefa pelo `id`.
- Respostas:
  - 200: objeto Task
  - 404: se não encontrar

### PUT /tasks/:id
- Atualiza uma tarefa existente.
- Body (JSON) – todos opcionais:
  - `title`
  - `description`
  - `done`
- Respostas:
  - 200: tarefa atualizada (Task)
  - 400: body inválido (se vier vazio, por exemplo)
  - 404: se não encontrar

### DELETE /tasks/:id
- Deleta uma tarefa pelo `id`.
- Respostas:
  - 204: deletado com sucesso (sem corpo)
  - 404: se não encontrar
