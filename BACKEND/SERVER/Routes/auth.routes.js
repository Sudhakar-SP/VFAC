import express from 'express';
import {
  signup,
  login,
  logout,
  approveMember,
  rejectMember,
  getAdminStats,
} from '../Controllers/auth.Controller.js';
import { requireAuth, requireAdmin } from '../Middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/approve/:id', requireAuth, requireAdmin, approveMember); // duplicate
router.put('/approve-member/:id', requireAuth, requireAdmin, approveMember);
router.put('/reject-member/:id', requireAuth, requireAdmin, rejectMember);

router.get('/admin/stats', requireAuth, requireAdmin, getAdminStats);

export default router;
