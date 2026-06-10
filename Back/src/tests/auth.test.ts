import request from "supertest";
import app from "../app";
import prisma from "../prisma";

describe("Testes do Controller de Autenticação", () => {
  const emailValido = `auth.${Date.now()}@teste.com`;
  const senhaValida = "senha_secreta_123";

  // Cria um usuário real para podermos testar o login
  beforeAll(async () => {
    await request(app)
      .post("/usuarios") // Se a sua rota for diferente (ex: /register), ajuste aqui
      .send({
        nome: "Usuario Auth Teste",
        email: emailValido,
        senha: senhaValida,
      });
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: emailValido } });
    await prisma.$disconnect();
  });

  test("Deve realizar login com sucesso e retornar status 200", async () => {
    const response = await request(app)
      .post("/auth/login") // Ajuste para a sua rota real de login
      .send({
        email: emailValido,
        senha: senhaValida,
      })
      .expect(200);

    // Se o seu login retorna um token, você pode validar aqui:
    // expect(response.body).toHaveProperty("token");
  });

  test("Deve retornar 401 ou 400 ao errar a senha", async () => {
    await request(app)
      .post("auth/login")
      .send({
        email: emailValido,
        senha: "senha_errada_id",
      })
      .expect((res) => {
        // Aceita tanto 400 quanto 401, dependendo de como você tratou no controller
        if (res.status !== 400 && res.status !== 401) {
          throw new Error("Esperava status 400 ou 401 para senha incorreta");
        }
      });
  });
});