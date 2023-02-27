const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJwt = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.createUser = catchAsync(async (req, res, next) => {
  //1. OBTENER LA INFORMACION DE LA REQ.BODY
  const { name, email, password, role } = req.body;
  //2. CREAR EL USUARIO CON LA INFORMACION DE LA REQ.BODY
  const user = new User({ name, email, password, role });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = await generateJwt(user.id);
  //3. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1 check if user exist && password is correct

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError('the user could not be found', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  // if everything ok , send token to client

  const token = await generateJwt(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
