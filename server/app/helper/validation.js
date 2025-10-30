const Joi = require('joi')

const userValidation = () => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    area: Joi.string().required(),
  });
  return schema;
};


const bookingValidation = () => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    technicianId: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'canceled'),
    serviceTask: Joi.string().required(),
  });
  return schema;
};

const feedbackValidation = () => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    bookingId: Joi.string().required(),
    feedback: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
  });
  return schema;
};


module.exports = { userValidation, bookingValidation, feedbackValidation }