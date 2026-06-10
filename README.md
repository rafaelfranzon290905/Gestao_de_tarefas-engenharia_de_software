
# Gestão de Tarefas Colaborativas 🚀

Este projeto consiste em uma aplicação web full-stack voltada para a **Gestão de Tarefas Colaborativas**. Desenvolvido como o Trabalho do Grau B (GB) para a disciplina de Engenharia de Software da UNISINOS, o sistema foi projetado sob rigorosos padrões arquiteturais, com forte foco em segurança, modularidade e garantia de qualidade através de testes automatizados.

---

## 🛠️ Stack Tecnológica

A stack do projeto foi selecionada estrategicamente visando produtividade, forte tipagem e alta manutenibilidade:

### Frontend
🎯 Interfaces ricas, responsivas e fortemente tipadas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

> **Nota:** Gerenciamento de notificações assíncronas implementado através da biblioteca **Sonner** (Toasts).

### Backend & API
⚡ Servidor robusto estruturado sob o padrão MVC.

![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Banco de Dados & ORM
🗄️ Persistência de dados relacional com provisionamento em nuvem.

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)

### Testes Automatizados
🧪 Garantia de qualidade, segurança e integridade das rotas.

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📌 Funcionalidades Principais

* **Autenticação Segura:** Sistema de login com validação de campos obrigatórios, criptografia de senhas via `bcrypt` e gerenciamento de sessões utilizando tokens JWT injetados em Cookies `HTTPOnly` (`tk`).
* **Gerenciamento de Usuários:** Cadastro, listagem e controle detalhado de perfis de usuários com suporte a desativação lógica (*soft delete*).
* **Painel de Tarefas (Dashboard):** Visualização unificada e intuitiva sobre o andamento e distribuição das demandas.
* **Gestão de Tarefas:** Criação, edição, atribuição e atualização de status (Pendente, Em Andamento, Concluída) de tarefas vinculadas diretamente aos usuários.

---

## 📐 Arquitetura do Sistema

A aplicação adota o padrão de arquitetura **MVC (Model-View-Controller)** de forma distribuída:

1. **Model:** Camada sob responsabilidade do Prisma ORM, mapeando as entidades do banco de dados e gerenciando as comunicações com o PostgreSQL.
2. **Controller:** Controladores robustos no Express (`auth.ts`, `tarefas.ts`, `usuarios.ts`) que validam os dados recebidos, orquestram as regras de negócio e formulam a resposta da API.
3. **View:** Uma interface rica e responsiva em React que consome os endpoints expostos pelo servidor.

---

## 🗄️ Modelagem do Banco de Dados

O banco de dados relacional PostgreSQL possui duas entidades principais correlacionadas:

### Tabela `usuarios`
* `id` (PK, Integer, Auto-incremento)
* `nome` (String)
* `email` (String, Único)
* `senha` (String, Hash criptografado)
* `createdAt` / `updatedAt` (Timestamps)

### Tabela `tarefas`
* `id` (PK, Integer, Auto-incremento)
* `nome` (String)
* `descricao` (Text)
* `status` (String)
* `deUsuario` (FK, referenciando `usuarios.id`)
* `createdAt` / `updatedAt` (Timestamps)

---

## 🛣️ Endpoints da API

A API está estruturada em três domínios principais. Todas as requisições protegidas esperam a validação do token JWT injetado de forma segura no navegador.

### 🔐 Autenticação

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Realiza a autenticação do usuário. Valida o e-mail/senha e retorna o token JWT estruturado dentro de um cookie seguro (`HTTPOnly`). |
| `POST` | `/auth/logout` | Revoga a sessão atual do usuário limpando o cookie de autenticação. |

### 👥 Usuários

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/usuarios` | Cria um novo usuário no sistema. Valida duplicidade de e-mail e armazena a senha com criptografia `bcrypt`. |
| `GET` | `/usuarios/{id}` | Retorna os dados cadastrais (exceto a senha) de um usuário específico através do ID fornecido. |
| `PUT` | `/usuarios/{id}` | Atualiza informações cadastrais do usuário correspondente ao ID. |
| `DELETE` | `/usuarios/{id}` | Remove o usuário do sistema através de política de *soft delete* (mantendo o histórico no banco de dados). |

### 📋 Tarefas

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/tasks` | Cria uma nova tarefa associada a um usuário responsável. |
| `GET` | `/tasks/{id}` | Recupera os detalhes completos de uma tarefa específica. |
| `GET` | `/tasks?assignedTo={userId}` | Filtra e lista todas as tarefas ativas atribuídas a um determinado ID de usuário. |
| `PUT` | `/tasks/{id}` | Atualiza as propriedades da tarefa (como título, descrição ou alteração do estado atual do `status`). |
| `DELETE` | `/tasks/{id}` | Exclui permanentemente uma tarefa do banco de dados. |

---

## 📁 Estrutura de Diretórios

```text
Gestao_de_tarefas-engenharia_de_software-main/
├── Back/                          # Servidor e regras de negócio da API
│   ├── prisma/                    # Arquivos do ORM e Migrações
│   │   ├── schema.prisma          # Definição e relacionamentos do banco
│   │   └── migrations/            # Histórico estrutural de scripts SQL
│   ├── src/
│   │   ├── controllers/           # Controladores (auth, tarefas, usuarios)
│   │   ├── router/                # Definição e mapeamento de rotas
│   │   ├── prisma.ts              # Instanciação do Cliente Prisma
│   │   └── server.ts              # Inicialização e escuta do servidor Express
│   ├── package.json
│   └── tsconfig.json
├── Front/                         # Interface de Usuário (SPA)
│   └── gestaoTarefas/
│       ├── src/
│       │   ├── components/        # Componentes estruturados por contexto (ui, tarefas, usuarios, login)
│       │   ├── lib/               # Configurações utilitárias (Tailwind/Shadcn)
│       │   ├── App.tsx            # Componente raiz global
│       │   ├── layout.tsx         # Estrutura de posicionamento (Sidebar, Header)
│       │   └── main.tsx           # Ponto de montagem do React na DOM
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
└── README.md                      # Documentação oficial do repositório

```

---

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos

* **Node.js** (versão LTS) instalado localmente.
* Uma instância ativa de banco de dados PostgreSQL (ou credenciais do Neon Database).

### 1. Configurando o Backend (API)

```bash
# Navegar até o diretório do backend
cd Back

# Instalar as dependências do ecossistema Node
npm install

```

Crie uma cópia do arquivo `.env.example` na raiz da pasta `Back` e altere seu nome para `.env`.

Execute as migrações estruturais do Prisma e inicie o servidor local:

```bash
# Rodar migrações do Prisma para estruturar as tabelas
npx prisma migrate dev

# Iniciar o servidor em ambiente de desenvolvimento
npm run dev

```

### 2. Configurando o Frontend

Em uma nova janela do terminal, acesse a pasta da aplicação cliente:

```bash
# Navegar até o diretório do frontend
cd Front/gestaoTarefas

# Instalar as dependências necessárias
npm install

# Iniciar a aplicação local com o Vite
npm run dev

```

A aplicação estará disponível em `http://localhost:5173`.

---

### 📈 Diagrama de Sequência

```mermaid

%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#E3F2FD', 'primaryTextColor': '#000000', 'primaryBorderColor': '#2196F3', 'lineColor': '#1976D2', 'actorBkg': '#FFFFFF', 'actorBorder': '#1976D2', 'noteBkgColor': '#FFFFFF', 'noteBorderColor': '#2196F3'}}}%%
sequenceDiagram
    autonumber
    actor U as Usuário
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Banco de Dados (PostgreSQL)

    U->>F: Preenche e-mail e senha
    U->>F: Clica no botão "Entrar"
    F->>F: Valida formato de e-mail e campos obrigatórios
    F->>B: POST /auth/login {email, senha}
    B->>B: Valida presença de e-mail, senha e JWT_SECRET
    B->>DB: prisma.usuario.findFirst(email, deletedAt: null)
    DB-->>B: Retorna usuário (ou nulo)
    
    alt Usuário não encontrado
        B-->>F: 401 Credenciais inválidas
        F-->>U: Exibe notificação (toast) de erro
    else Usuário encontrado
        B->>B: bcrypt.compare(senha, usuario.senha)
        alt Senha incorreta
            B-->>F: 401 Credenciais inválidas
            F-->>U: Exibe notificação (toast) de erro
        else Senha correta
            B->>B: jwt.sign(payload, secret)
            B->>B: Define Cookie HTTPOnly (_tk)
            B-->>F: 200 OK com dados do usuário (id, nome, email)
            F->>F: Salva dados no localStorage ("currentUser")
            F-->>U: Exibe notificação de sucesso e Redireciona para "/"
        end
    end
```

---

### Testes

Foram executados testes automatizados na aplicação utilizando-se da tecnologia Jest.

```bash
# No backend
npm run test

```
Será retornado uma bateria de testes automátizados 

## 👥 Autores

Trabalho prático desenvolvido por:

* **Artur Brenner**
* **Bianca Franzon**
* **Tobias Klein**

