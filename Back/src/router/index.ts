import { Router } from 'express';

import usuariosController from '../controllers/usuarios'

const router = Router();

// Usuários
router.get("/usuarios", usuariosController.getUsuarios);

export default router;