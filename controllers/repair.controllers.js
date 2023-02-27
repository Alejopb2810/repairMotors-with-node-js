const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.findPendings = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    where: {
      status: ['pending', 'completed'],
    },
    include: [
      {
        model: User,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Repairs found successfully',
    repairs,
  });
});

exports.findPending = catchAsync(async (req, res, next) => {
  const { repair } = req;

  res.status(200).json({
    status: 'success',
    message: 'Repair found successfully',
    repair,
  });
});

exports.createDate = catchAsync(async (req, res, next) => {
  //1. OBTENER LA INFORMACION DE LA REQ.BODY
  const { date, userId, description, motorsNumber } = req.body;
  //2. CREAR EL USUARIO CON LA INFORMACION DE LA REQ.BODY
  const newRepair = await Repair.create({
    date,
    userId,
    description,
    motorsNumber,
  });
  //3. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(201).json({
    status: 'success',
    message: 'Repair created successfully',
    newRepair,
  });
});

exports.updateRepair = catchAsync(async (req, res, next) => {
  // 2. OBTENER LA INFORMACION A ACTUALIZAR DE LA REQ.BODY
  // const { status } = req.body;
  const { repair } = req;

  // 5. REALIZAR LA ACTUALIZACIÓN DEL USUARIO, CAMPOS USERNAME, EMAIL
  await repair.update({ status: 'completed' });

  // 6. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'Repair updated successfully',
  });
});

exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  // 4. REALIZAR LA ACTUALIZACIÓN DEL STATUS DEL USUARIO ENCONTRADO ANTERIORMENTE
  await repair.update({ status: 'cancelled' });
  // 5. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'Repair deleted successfully',
  });
});
