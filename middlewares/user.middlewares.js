const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validUserById = catchAsync(async (req, res, next) => {
  // 1. OBTENER EL ID DE LOS PARAMETROS
  const { id } = req.params;
  // 2. OBTENER UN USUARIO POR SU ID Y QUE EL STATUS SEA TRUE
  const user = await User.findOne({
    where: {
      id,
      status: 'available',
    },
    include: [
      {
        model: Repair,
      },
    ],
  });
  //3. SI NO EXISTE UN USUARIO ENVIAR UN ERROR
  if (!user) {
    return next(new AppError('User not found'), 404);
  }

  req.user = user;
  next();
});

exports.validIfExitUserEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user && !user.status) {
    return next(
      new AppError(
        'the user has a account, but it is desactivated please talk to the administrator to activate it',
        404
      )
    );
  }

  if (user) {
    return next(new AppError('the email user already exists', 404));
  }

  next();
});
