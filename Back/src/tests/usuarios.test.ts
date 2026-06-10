import request from "supertest";
import app from "../app";
import prisma from "../prisma";

describe("Testes Completos do Controller de Usuários", () => {
  let usuarioId: number;
  const emailSucesso = `teste.${Date.now()}@user.com`;

  afterAll(async () => {
    // Limpa o usuário criado para não acumular sujeira no banco
    if (usuarioId) {
      await prisma.usuario.deleteMany({ where: { id: usuarioId } });
    }
    await prisma.$disconnect();
  });

  // --- 1. CRIAÇÃO (POST) ---
  test("Deve criar um novo usuário com sucesso", async () => {
    const response = await request(app)
      .post("/usuarios") // Ajuste para a sua rota real de cadastro
      .send({
        nome: "Admin Teste",
        email: emailSucesso,
        senha: "senha_segura_123",
      })
      .expect(201);

    expect(response.body.error).toBe(false);
    expect(response.body.data).toHaveProperty("id");
    usuarioId = response.body.data.id; // Guarda o ID para testar o GET e PUT
  });

  test("Deve retornar 400 se tentar cadastrar e-mail já existente", async () => {
    // Tenta criar com o mesmo e-mail do teste anterior
    const response = await request(app)
      .post("/usuarios")
      .send({
        nome: "Outro Nome",
        email: emailSucesso,
        senha: "outrasenhateste",
      })
      .expect(400); // Ou 409 (Conflict), dependendo de como você tratou

    expect(response.body.error).toBe(true);
  });

  // --- 2. LISTAGEM E DETALHES (GET) ---
  test("Deve listar todos os usuários", async () => {
    const response = await request(app)
      .get("/usuarios")
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("Deve buscar um usuário específico pelo ID", async () => {
    const response = await request(app)
      .get(`/usuarios/${usuarioId}`)
      .expect(200);

    expect(response.body.data.email).toBe(emailSucesso);
  });

  // --- 3. ATUALIZAÇÃO (PUT) ---
  test("Deve atualizar o nome do usuário com sucesso", async () => {
    const response = await request(app)
      .put(`/usuarios/${usuarioId}`)
      .send({
        nome: "Nome Alterado Teste",
      })
      .expect(200);

    expect(response.body.data.nome).toBe("Nome Alterado Teste");
  });
});