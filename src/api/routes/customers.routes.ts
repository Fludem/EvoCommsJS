import express from 'express';
import { CustomersController } from '../controllers/customers.controller';

const router = express.Router();

// GET all customers
router.get('/', CustomersController.getAllCustomers);

// GET customer by ID
router.get('/:id', CustomersController.getCustomerById);

export default router; 