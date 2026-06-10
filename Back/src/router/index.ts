import { Router } from 'express';

import usuariosController from '../controllers/usuarios'
import tarefasController from '../controllers/tarefas'
import authController from '../controllers/auth'
import dashboardController from '../controllers/dashboard'

const router = Router();

// Usuários
router.get("/usuarios", usuariosController.getUsuarios);
router.get("/usuarios/:id", usuariosController.getUsuarioById);
router.post("/usuarios", usuariosController.postUsuario);
router.put("/usuarios/:id", usuariosController.putUsuario);
router.delete("/usuarios/:id", usuariosController.deleteUsuario);

// Tarefas
router.get("/tasks", tarefasController.getTarefas);
router.get("/tasks/:id", tarefasController.getTaskById);
router.post("/tasks", tarefasController.postTarefa);
router.put("/tasks/:id", tarefasController.putTarefa);
router.delete("/tasks/:id", tarefasController.deleteTarefas);

// Autenticação
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// DashBoard
router.get("/dashboard", dashboardController.getMetrics);

export default router;