import request from "supertest";
import app from "../app";
import prisma from "../prisma";

describe("Testes Completos do Controller de Tarefas", () => {
  let usuarioTesteId: number;
  let tarefaTesteId: number;

  // Antes de rodar os testes, criamos um usuário temporário no banco para vincular às tarefas
  beforeAll(async () => {
    const usuario = await prisma.usuario.create({
      data: {
        nome: "Usuário Teste Jest",
        email: `jest.${Date.now()}@teste.com`,
        senha: "senha_de_teste_1234",
      },
    });
    usuarioTesteId = usuario.id;
  });

  // Limpeza total após os testes para liberar o Jest
  afterAll(async () => {
    // Apaga a tarefa e o usuário criados no teste para não poluir o banco
    if (tarefaTesteId) {
      await prisma.tarefas.deleteMany({ where: { id: tarefaTesteId } });
    }
    if (usuarioTesteId) {
      await prisma.usuario.deleteMany({ where: { id: usuarioTesteId } });
    }
    await prisma.$disconnect();
  });

  // --- 1. TESTES DE LISTAGEM (GET) ---
  test("Deve listar todas as tarefas com sucesso", async () => {
    const response = await request(app).get("/tasks").expect(200);
    expect(response.body).toHaveProperty("error", false);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("Deve filtrar tarefas por usuário e status corretamente", async () => {
    await request(app)
      .get(`/tasks?usuarioId=${usuarioTesteId}&status=Pendente`)
      .expect(200);
  });

  // --- 2. TESTES DE CRIAÇÃO (POST) ---
  test("Deve criar uma nova tarefa com sucesso", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        titulo: "Tarefa criada no teste automatizado",
        descricao: "Criando cobertura de código com Jest",
        status: "Pendente",
        deUsuario: usuarioTesteId,
      })
      .expect(201);

    expect(response.body.error).toBe(false);
    expect(response.body.data).toHaveProperty("id");
    tarefaTesteId = response.body.data.id; // Guarda o ID para usar nos testes de PUT e DELETE
  });

  test("Deve retornar 400 se faltar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        descricao: "Esqueci o título de propósito",
      })
      .expect(400);

    expect(response.body.error).toBe(true);
  });

  test("Deve retornar 404 se atribuir a tarefa a um usuário inexistente", async () => {
    await request(app)
      .post("/tasks")
      .send({
        titulo: "Tarefa Fantasma",
        descricao: "Usuário não existe",
        deUsuario: 999999,
      })
      .expect(404);
  });

  // --- 3. TESTES DE BUSCA POR ID (GET/:ID) ---
  test("Deve buscar uma tarefa específica pelo ID", async () => {
    const response = await request(app)
      .get(`/tasks/${tarefaTesteId}`)
      .expect(200);

    expect(response.body.data.titulo).toBe("Tarefa criada no teste automatizado");
  });

  test("Deve retornar 404 ao buscar ID de tarefa inexistente", async () => {
    await request(app).get("/tasks/999999").expect(404);
  });

  // --- 4. TESTES DE ATUALIZAÇÃO (PUT) ---
  test("Deve atualizar uma tarefa com sucesso", async () => {
    const response = await request(app)
      .put(`/tasks/${tarefaTesteId}`)
      .send({
        titulo: "Título atualizado pelo teste",
        status: "Em Andamento",
      })
      .expect(200);

    expect(response.body.data.status).toBe("Em Andamento");
  });

  test("Deve retornar 404 ao tentar atualizar tarefa inexistente", async () => {
    await request(app)
      .put("/tasks/999999")
      .send({ titulo: "Inexistente" })
      .expect(404);
  });

  // --- 5. TESTES DE DELEÇÃO (DELETE) ---
  test("Deve deletar uma tarefa com sucesso", async () => {
    const response = await request(app)
      .delete(`/tasks/${tarefaTesteId}`)
      .expect(200);

    expect(response.body).toHaveProperty("error", false);
  });

  test("Deve retornar 404 ao tentar deletar tarefa inexistente", async () => {
    await request(app).delete("/tasks/999999").expect(404);
  });
});