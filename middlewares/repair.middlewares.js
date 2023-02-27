const Repair = require('../models/repair.model');

exports.validRepairById = async (req, res, next) => {
  try {
    // 1. OBTENER EL ID DE LOS PARAMETROS
    const { id } = req.params;
    // 2. OBTENER UN USUARIO POR SU ID Y QUE EL STATUS SEA TRUE
    const repair = await Repair.findOne({
      where: {
        id,
        status: 'pending',
      },
    });
    //3. SI NO EXISTE UN USUARIO ENVIAR UN ERROR
    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: 'Repair not found',
      });
    }

    req.repair = repair;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
