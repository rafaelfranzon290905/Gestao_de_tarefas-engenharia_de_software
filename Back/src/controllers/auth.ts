import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_EXPIRES_IN = "2h";
const COOKIE_NAME = "_tk";

// POST /auth/login  Autenticação do usuário
const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body;

        if (!JWT_SECRET) {
            console.error("ERRO DE CONFIGURAÇÃO: JWT_SECRET não foi definido no arquivo .env");
            res.status(500).json({ error: true, message: "Erro de configuração no servidor." });
            return;
        }

        // Validação de campos obrigatórios
        if (!email || !senha) {
            res.status(400).json({ error: true, message: "E-mail e senha são obrigatórios." });
            return;
        }

        // Busca o usuário apenas se ele NÃO estiver excluído (soft delete)
        const usuario = await prisma.usuario.findFirst({
            where: { 
                email,
                deletedAt: null
            },
        });

        if (!usuario) {
            res.status(401).json({ error: true, message: "Credenciais inválidas." });
            return;
        }

        // Comparação da senha plano-texto (Nota: adicione criptografia se necessário no futuro)
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            res.status(401).json({ error: true, message: "Credenciais inválidas." });
            return;
        }

        // Geração do Token JWT mapeando a estrutura atual do banco de tarefas
        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        // Define o token nos cookies HTTPOnly do navegador
        const umaHoraEmMs = 60 * 60 * 1000;
        res.cookie("_tk", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            error: false,
            message: "Login realizado com sucesso!",
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: true, message: "Erro interno no servidor ao tentar logar." });
    }
};

// POST /auth/logout → Logout do usuário
const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Limpa o cookie de autenticação zerando o tempo de vida (maxAge: 0)
        res.clearCookie(COOKIE_NAME, getCookieOptions(0));
        
        res.status(200).json({
            error: false,
            message: "Logout realizado com sucesso."
        });
    } catch (error) {
        console.error("Erro no logout:", error);
        res.status(500).json({ error: true, message: "Erro ao tentar realizar logout." });
    }
};

export default {
    login,
    logout
};