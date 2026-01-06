import express from 'express';
import {
    updateDeliveryEstimate,
    getDeliveryEstimate,
    getAllSystemSettings,
    addSystemSetting,
} from '@/controllers/settings.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';
import { UserRole } from '@/generated/prisma';

const router = express.Router();

// Protect subsequent routes
router.use(protect);

router.get('/', getAllSystemSettings);
router.get('/delivery-estimate', getDeliveryEstimate);

router.use(restrictTo(UserRole.ADMIN, UserRole.SUPERADMIN));
router.post('/', addSystemSetting);
router.put('/delivery-estimate', updateDeliveryEstimate);

export default router;
