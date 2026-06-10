import { Request, Response } from "express"
import prisma from "../prisma"; // Import correto do default do Prisma 7
import bcrypt from "bcrypt";


// Get/usuarios pega todos os usuários
const getUsuarios = async (req: Request, res: Response): Promise<void> => {
    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
            nome: true,
            email: true
        },
        orderBy: {
            nome: 'asc'
        },
    });

    if (usuarios.length < 1) {
        res.status(404).json({ 
          error: true, 
          message: "Nenhum usuário encontrado." 
        });
    }

    res.status(200).json({ 
        error: false, 
        data: usuarios 
      });

};

// Get/usuario/id - lista um usuário unico baseado pelo id
const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: { id: true, nome: true, email: true }
        });

        if (!usuario) {
            res.status(404).json({ error: true, message: "Usuário não encontrado." });
            return;
        }

        res.status(200).json({ error: false, data: usuario });
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor." });
    }
};

// post /usuarios Cria um novo usuário
const postUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, email, senha } = req.body;

        // Validação simples de campos obrigatórios
        if (!nome || !email || !senha) {
            res.status(400).json({ error: true, message: "Campos obrigatórios ausentes (nome, email ou senha)." });
            return;
        }

        // Validação de e-mail duplicado
        const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExiste) {
            res.status(400).json({ error: true, message: "E-mail já cadastrado." });
            return;
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: { nome, email, senha: senhaCriptografada },
            select: { id: true, nome: true, email: true } // Não retorna a senha por segurança
        });

        res.status(201).json({ error: false, data: novoUsuario });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: true, message: "Erro interno ao criar usuário." });
    }
};

// Put /usuarios/:id  Atualiza informações do usuário com o id
const putUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        // Verifica se o usuário existe e está ativo antes de atualizar
        const usuarioExiste = await prisma.usuario.findFirst({
            where: { id: Number(id), deletedAt: null }
        });

        if (!usuarioExiste) {
            res.status(404).json({ error: true, message: "Usuário não encontrado ou inativo." });
            return;
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: { nome, email },
            select: { id: true, nome: true, email: true }
        });

        res.status(200).json({ error: false, data: usuarioAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: true, message: "Erro interno ao atualizar usuário." });
    }
};

// Delete /usuarios/id - Remover um usuário (Soft Delete)
const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const usuarioExiste = await prisma.usuario.findFirst({
            where: { id: Number(id), deletedAt: null }
        });

        if (!usuarioExiste) {
            res.status(404).json({ error: true, message: "Usuário não encontrado ou já removido." });
            return;
        }

        // Soft Delete: preenche campo deletedAt em vez de apagar o registro
        await prisma.usuario.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });

        res.status(200).json({ error: false, message: "Usuário removido com sucesso (soft delete)." });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ error: true, message: "Erro interno ao remover usuário." });
    }
};

export default {
    getUsuarios,
    getUsuarioById,
    postUsuario,
    putUsuario,
    deleteUsuario,
}