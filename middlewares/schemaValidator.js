import _ from 'lodash';
import { validators } from '../validators/index.js';

const validationMiddleware = (useJoiError = false) => {
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
  const _supportedMethods = ['post', 'put', 'patch'];
  const _validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  return (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();

    if (_supportedMethods.includes(method) && _.has(validators, route)) {
      const _schema = _.get(validators, route);

      if (_schema) {
        // Modern Joi v17+ syntax
        const { error, value } = _schema.validate(
          _.isEmpty(req.body) ? req.query : req.body, 
          _validationOptions
        );

        if (error) {
          const JoiError = {
            success: false,
            message: error.details[0].message.replace(/['"]/g, '')
          };
          const CustomError = {
            status: 'failed',
            message: 'Invalid request data. Please review request and try again.'
          };

          return res.status(400).json(_useJoiError ? JoiError : CustomError);
        } else {
          req.body = value;
        }
      }
    }
    next();
  };
};

export default validationMiddleware;
