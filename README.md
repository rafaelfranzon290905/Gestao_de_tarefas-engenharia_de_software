# Gestao_de_tarefas-engenharia_de_software
As equipes deverão desenvolver uma API para um sistema de Gestão de tarefas Colaborativas, permitindo que usuários criem, editem, atribuam e concluam tarefas.

## Estrutura do Projeto
* Back: API restuful construída com Node.js, Typescript e Prisma
* Front: Aplicação contruída com React, Typescript, Vite e Tailwind

## Tecnologias e padrões utilizados
* Backend: Express, Prisma ORM, Neon com PostgreSQL
* Frontend: React, Typescript, Vite, TalwindCss
* Arquitetura: Separação em camadas

## Como Configurar e Rodar o Ambiente

### 1. Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* [Git](https://git-scm.com/)

---

### 2. Configuração do Backend

1. Abra o terminal na pasta **back**:
   ```bash
   cd back
   ```

2. Instale as dependências do servidor
    ```
    npm install
    ```

3. Crie um arquivo .env na raiz da pasta back e insira a string de conexão do Neon DB 
    ```
    DATABASE_URL="postgresql://neondb_owner:npg_BU6VyC9bkMDh@ep-bitter-term-aq1ghqy9-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    PORT = 3000

    ```

4. Dê run no servidor
    ```
    npm run dev
    ```

### 3. Configuração do FrontEnd

1. Abra um terminal na pasta do react dentro da pasta front
    ```
    cd Front
    cd gestaoTarefas
    ```

2. Instale as dependências
    ```
    npm install
    ```

3. Inicialize o servidor e clique no link
    ```
    npm run dev
    ```