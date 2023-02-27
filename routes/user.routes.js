const { Router } = require('express');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require('../controllers/users.controllers');
const { protectAccountOwner } = require('../middlewares/auth.middlewares');
const { validUserById } = require('../middlewares/user.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validUserById, findUser);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    validUserById,
    protectAccountOwner,
  ],
  updateUser
);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'the current password must be mandatory')
      .not()
      .isEmpty(),
    check('newPassword', 'the new password must be mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner,
  ],
  updatePassword
);

router.delete('/:id', validUserById, protectAccountOwner, deleteUser);

module.exports = {
  userRouter: router,
};
