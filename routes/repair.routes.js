const { Router } = require('express');
const { check } = require('express-validator');
const {
  findPendings,
  findPending,
  createDate,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controllers');
const { protect } = require('../middlewares/auth.middlewares');
const { validRepairById } = require('../middlewares/repair.middlewares');

const router = Router();

router.use(protect);

router.get('/', findPendings);

router.get('/:id', validRepairById, findPending);

router.post(
  '/',
  [
    check('description', 'The description is required').not().isEmpty(),
    check('date', 'The date must be mandatory').not().isEmpty(),
    check('motorsNumber', 'The motorsNumber must be mandatory').not().isEmpty(),
  ],
  createDate
);

router.patch('/:id', validRepairById, updateRepair);

router.delete('/:id', validRepairById, deleteRepair);

module.exports = {
  repairRouter: router,
};
