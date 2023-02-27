const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.findUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'available',
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Users found successfully',
    users,
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    message: 'User was found successfully',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // 2. OBTENER LA INFORMACION A ACTUALIZAR DE LA REQ.BODY
  const { user } = req;
  const { name, email } = req.body;

  // 5. REALIZAR LA ACTUALIZACIÓN DEL USUARIO, CAMPOS USERNAME, EMAIL
  await user.update({ name, email });

  // 6. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  // 4. REALIZAR LA ACTUALIZACIÓN DEL STATUS DEL USUARIO ENCONTRADO ANTERIORMENTE
  await user.update({ status: 'disabled' });
  // 5. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('incorrect password', 401));
  }
  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'User password was updated successfully',
  });
});
