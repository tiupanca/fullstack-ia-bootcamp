# 🧠 Fullstack Task Manager with AI (Bootcamp Project)

Projeto fullstack desenvolvido como estudo autodidata, focado na construção de uma API robusta e interface moderna integradas a análises inteligentes com IA. Atualmente implementa um gerenciador de tarefas com persistência real em banco PostgreSQL e módulo de priorização automática via OpenAI. A arquitetura está preparada para evolução futura com recursos de **RAG**, automações e IA contextual.

---

## 🚀 Tech Stack

### **Backend**
- Fastify
- TypeScript
- Prisma ORM
- OpenAI SDK Integration
- REST API Architecture

### **Database**
- PostgreSQL
- Tasks persistence with UUID
- Schema managed via Prisma Migrations
- Structured for future vector embeddings (RAG-ready)

### **Frontend**
- Next.js 14+ (App Router)
- TailwindCSS
- Server & Client Components
- Real-time data refresh via `router.refresh()`
- AI suggestions UI block

---

## ✅ Implemented Features

### **Task CRUD**
- Create task (POST `/tasks`)
- List tasks (GET `/tasks`)
- Get task by ID (GET `/tasks/:id`)
- Update task including `done` status (PUT `/tasks/:id`)
- Delete task (DELETE `/tasks/:id`)

### **AI Task Prioritization**
- Smart ranking via `GET /tasks/ai/priority`
- Returns structured JSON with:
  - `id`
  - `priority score`
  - `reason for ranking`
  - `overview summary`

### **Developer Experience**
- Full workflow versioned with Git
- Modular routes layer
- API consumable via any HTTP client
- CORS configured for dev environment
- Clean code with error fallbacks and UI resilience

---

## 🔮 Future IA & RAG (Planned Architecture)

O projeto já está estruturado para receber:

### **RAG – Retrieval Augmented Generation**
- Conversão das tasks em embeddings vetoriais (ex: OpenAI, Supabase Vector, Pinecone, ou Postgres + pgvector)
- Busca semântica para tarefas (ex: "quais tasks envolvem aprendizado de IA?")
- Chat contextualizado baseado no histórico de tarefas e preferências de estudo

### **IA Features previstos**
- **Plano inteligente do dia** (time blocking com prioridades)
- **Sugestões automáticas de estudo fullstack**
- **Resumo semanal com insights**
- **Agente IA pessoal** baseado no perfil do usuário
- **Notificações e automações futuras**
- **Busca semântica + armazenamento vetorial**

> Status: A fundação da arquitetura está pronta. As próximas camadas serão implementadas sem comprometer a estrutura atual.

---

## 🔌 How to Run Locally

### **1. Clone & setup**

git clone <https://github.com/tiupanca/fullstack-ia-bootcamp.git>

cd fullstack-ia-bootcamp

### **2. Install dependencies**

npm install

### **3. Setup database**

Crie o .env na raiz:

DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/fullstack_ia?schema=public"

OPENAI_API_KEY="sk-SUA_CHAVE_AQUI"

### **4. Generate Prisma Client**

npx prisma generate

### **5. Apply migrations**

npx prisma migrate dev --name init

### **6. Run backend**

npm run dev

#### API: http://localhost:3333

### **7. Run frontend**

cd web
npm run dev

#### Front: http://localhost:3000/tasks


## 📌 Project Status

Backend API	✅ Operational

PostgreSQL Persistence	✅ Synced

Frontend UI	✅ Integrated

CRUD Routes	✅ Complete

AI Priority Ranking	✅ Live

RAG Foundation	🔮 Vector-ready (next step)


## 🤝 Ready for Presentation

Este projeto servirá como portfólio demonstrável para habilidades:

Desenvolvimento fullstack moderno

APIs tipadas e persistência de dados

Ready for AI & RAG architecture

Consumo resiliente de rotas assíncronas

Integração com modelos de linguagem

Versionamento profissional e experiência de dev

Construído com foco em evolução contínua e boas práticas.
Road to Fullstack + AI Specialist 👊🔥
