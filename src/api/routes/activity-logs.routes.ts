import express from 'express';
import { ActivityLogsController } from '../controllers/activity-logs.controller';

const router = express.Router();

// GET all activity logs with optional filtering
router.get('/', ActivityLogsController.getAllActivityLogs);

// GET activity logs by actor ID
router.get('/actor/:actorId', ActivityLogsController.getActivityLogsByActor);

// GET activity logs by target type and ID
router.get('/target/:targetType/:targetId', ActivityLogsController.getActivityLogsByTarget);

// GET activity log by ID (must come after more specific routes)
router.get('/:id', ActivityLogsController.getActivityLogById);

export default router; 