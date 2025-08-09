import express from 'express';
import { applyToEvent ,removeApplication} from '../controllers/applyController.js';

const router = express.Router();

// ✅ This route must exist
router.post('/apply/:eventId', applyToEvent);

// DELETE /api/apply/:eventId
router.delete('/apply/:eventId', removeApplication);

// router.get('/applied-students', getAppliedStudents);



export default router;
