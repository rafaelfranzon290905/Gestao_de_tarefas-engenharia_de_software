import { Request, Response } from "express"
import prisma from "../prisma"; // Import correto do default do Prisma 7

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

export default {
    getUsuarios,
}