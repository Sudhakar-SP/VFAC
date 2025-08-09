// backend/server/Routes/user.routes.js
import express from 'express';
import {
  approveMembership,
  removeMembership,
  getStudents,
  getMembers,
  listUsers,
  deleteUser,
  getStudentProfile
} from '../Controllers/user.controller.js';

import {
  requireAuth,
  requireAdmin
} from '../Middleware/auth.middleware.js'; // ✅ Make sure verifyToken is not imported if not exported

const router = express.Router();

// 🔐 Membership routes (Admin only)
router.put('/approve/:id', requireAuth, requireAdmin, approveMembership);
router.put('/remove/:id', requireAuth, requireAdmin, removeMembership);

// 👥 User listing routes (Admin only)
router.get('/list', requireAuth, requireAdmin, listUsers);
router.get('/students', requireAuth, requireAdmin, getStudents);
router.get('/members', requireAuth, requireAdmin, getMembers);

// ❌ Delete user (Admin only)
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

// 🙋‍♂️ Get current logged-in student profile (Auth required)
router.get('/me', requireAuth, getStudentProfile);

export default router;
