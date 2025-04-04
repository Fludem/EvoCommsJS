import express from 'express';
import { ClockingsController } from '../controllers/clockings.controller';

const router = express.Router();

// GET all clockings
router.get('/', ClockingsController.getAllClockings);

// GET clockings by employee ID (must come before the /:id route)
router.get('/employee/:employeeId', ClockingsController.getClockingsByEmployee);

// GET clocking by ID
router.get('/:id', ClockingsController.getClockingById);

export default router; 