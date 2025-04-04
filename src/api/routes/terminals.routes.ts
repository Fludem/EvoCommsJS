import express from 'express';
import { TerminalsController } from '../controllers/terminals.controller';

const router = express.Router();

// GET all terminals
router.get('/', TerminalsController.getAllTerminals);

// GET terminal by serial number (must come before the /:id route)
router.get('/serial/:serialNumber', TerminalsController.getTerminalBySerialNumber);

// GET terminal by ID
router.get('/:id', TerminalsController.getTerminalById);

export default router; 