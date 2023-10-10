import Joi from "joi";

const callback = {
  body: Joi.object().keys({
    event_id: Joi.string().required(),
    event_type: Joi.string().required(),
    timestamp: Joi.number().required(),
    app_id: Joi.string().required(),
    event: Joi.object().required(),
  }),
};

export default {
  callback,
};
