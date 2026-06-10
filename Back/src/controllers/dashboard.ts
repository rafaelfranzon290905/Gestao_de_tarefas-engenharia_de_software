import { Request, Response } from "express"
import prisma from "../prisma";


// GET /tasks/metrics?usuarioId=1
const getMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioId } = req.query;
        const targetUserId = usuarioId ? Number(usuarioId) : undefined;

        // Contagem geral por Status (Geral ou filtrado por Usuário)
        const totalPorStatus = await prisma.tarefas.groupBy({
            by: ['status'],
            where: targetUserId ? { deUsuario: targetUserId } : {},
            _count: { id: true }
        });

        const statusData = { pendente: 0, em_andamento: 0, concluida: 0 };

        totalPorStatus.forEach(item => {
            if (!item.status) return;
            
            // Transforma "Em Andamento" ou "CONCLUÍDA" em algo limpo para o JS
            const statusNormalizado = item.status
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos (concluída -> concluida)
                .replace(/\s+/g, "_");           // Troca espaços por underscore

            if (statusNormalizado === "concluido" || statusNormalizado === "concluida") {
                statusData.concluida += item._count.id;
            } else if (statusNormalizado === "em_andamento") {
                statusData.em_andamento += item._count.id;
            } else if (statusNormalizado === "pendente") {
                statusData.pendente += item._count.id;
            }
        });

        // 2. Tarefas por Usuário (Quantas tarefas totais cada usuário ativo possui)
        const usuariosComTarefas = await prisma.usuario.findMany({
            where: { deletedAt: null },
            select: {
                nome: true,
                _count: {
                    select: { tarefas: true }
                }
            }
        });
        const distribuicaoPorUsuario = usuariosComTarefas.map(u => ({
            nome: u.nome,
            totalTarefas: u._count.tarefas
        }));

        // 3. As 3 tarefas mais recentes (Se houver filtro de usuário, traz dele)
        const tarefasRecentes = await prisma.tarefas.findMany({
            where: targetUserId ? { deUsuario: targetUserId } : {},
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
                usuario: { select: { nome: true } }
            }
        });

        // 4. [Sugestão Extra] Taxa de Eficiência/Conclusão Geral em %
        const totalTarefas = Object.values(statusData).reduce((a, b) => a + b, 0);
        const taxaConclusao = totalTarefas > 0 
            ? Math.round((statusData.concluida / totalTarefas) * 100) 
            : 0;

        // Envia o payload consolidado pro Dashboard
        res.status(200).json({
            error: false,
            data: {
                porStatus: statusData, // Perfeito para Doughnut/Pie chart
                porUsuario: distribuicaoPorUsuario, // Perfeito para Bar chart
                tarefasRecentes, // Perfeito para renderizar um mini feed/list cards
                insights: {
                    totalGeral: totalTarefas,
                    taxaConclusaoGeral: `${taxaConclusao}%`
                }
            }
        });

    } catch (error) {
        console.error("Erro ao gerar métricas do dashboard:", error);
        res.status(500).json({ error: true, message: "Erro interno ao processar painel de métricas." });
    }
};

export default {
  getMetrics,
}