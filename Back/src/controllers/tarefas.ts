import { Request, Response } from "express"
import prisma from "../prisma";

// GET /tasks?assignedTo={userId} - Listaa tarefas de um usuário tal
const getTarefas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assignedTo } = req.query; 

        let filtro: any = {};

        if (assignedTo) {
            filtro.deUsuario = Number(assignedTo);
        }

        const tarefas = await prisma.tarefas.findMany({
            where: filtro,
            include: {
                usuario: { select: { id: true, nome: true, email: true } }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({ error: false, data: tarefas });
    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        res.status(500).json({ error: true, message: "Erro interno ao buscar tarefas." });
    }
};

// Get/task/id - lista uma task unica baseado pelo id
const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tarefa = await prisma.tarefas.findUnique({
            where: { id: Number(id) },
            include: {
                usuario: { select: { id: true, nome: true, email: true } }
            }
        });

        if (!tarefa) {
            res.status(404).json({ error: true, message: "Tarefa não encontrada." });
            return;
        }

        res.status(200).json({ error: false, data: tarefa });
    } catch (error) {
        console.error("Erro ao buscar tarefa por ID:", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor." });
    }
};

// post /tasks Cria uma  nova tarefa
const postTarefa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { titulo, descricao, status, deUsuario } = req.body;

        // Validação simples de campos obrigatórios
        if (!titulo || !descricao) {
            res.status(400).json({ error: true, message: "Campos obrigatórios ausentes (título e descrição são necessários)." });
            return;
        }

        if (deUsuario) {
            const usuarioExiste = await prisma.usuario.findFirst({
                where: { id: Number(deUsuario), deletedAt: null }
            });

            if (!usuarioExiste) {
                res.status(404).json({ error: true, message: "Não é possível atribuir a tarefa. Usuário não encontrado ou inativo." });
                return;
            }
        }

        const novaTarefa = await prisma.tarefas.create({
            data: { titulo, descricao, status, deUsuario },
            include: {
                usuario: { select: { id: true, nome: true, email: true } } // dados do usuário associado
            }
        });

        res.status(201).json({ error: false, data: novaTarefa });
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        res.status(500).json({ error: true, message: "Erro interno ao criar usuário." });
    }
};

// Put /tasks/:id  Atualiza informações da task com o id
const putTarefa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, deUsuario } = req.body;

        // Verifica se a tarefa existe antes de tentar atualizar 
        const tarefaExiste = await prisma.tarefas.findUnique({ where: { id: Number(id) } });
        if (!tarefaExiste) {
            res.status(404).json({ error: true, message: "Tarefa não encontrada." });
            return;
        }

        if (deUsuario) {
            const usuarioExiste = await prisma.usuario.findFirst({
                where: { id: Number(deUsuario), deletedAt: null }
            });

            if (!usuarioExiste) {
                res.status(404).json({ error: true, message: "Usuário responsável inválido ou inativo." });
                return;
            }
        }

        const tarefaAtualizada = await prisma.tarefas.update({
            where: { id: Number(id) },
            data: { titulo, descricao, status, deUsuario },
            include: {
                usuario: { select: { id: true, nome: true, email: true } }
            }
        });

        res.status(200).json({ error: false, data: tarefaAtualizada });
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ error: true, message: "Erro interno ao atualizar usuário." });
    }
};

// Delete /tasks/id - Remover um usuário (Soft Delete)
const deleteTarefas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const tarefaExiste = await prisma.tarefas.findUnique({ where: { id: Number(id) } });
        if (!tarefaExiste) {
            res.status(404).json({ error: true, message: "Tarefa não encontrada." });
            return;
        }

        await prisma.tarefas.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ error: false, message: "Usuário removido com sucesso (soft delete)." });
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        res.status(500).json({ error: true, message: "Erro interno ao remover tarefa." });
    }
};

export default {
    postTarefa,
    getTarefas,
    getTaskById,
    putTarefa,
    deleteTarefas,
}