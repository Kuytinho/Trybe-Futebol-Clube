import { RequestHandler } from 'express';
import tokenValidation from './TokenValidation';

const tokenAuth:RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });
  try {
    const result = tokenValidation.validation(authorization);
    res.locals.user = result;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default { tokenAuth };
