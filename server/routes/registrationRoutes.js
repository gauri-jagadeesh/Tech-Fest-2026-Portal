import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
} from '../controllers/registrationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);

// Admin endpoints
router.get('/', protect, adminOnly, getAllRegistrations);
router.put('/:id', protect, adminOnly, updateRegistrationStatus);

export default router;
