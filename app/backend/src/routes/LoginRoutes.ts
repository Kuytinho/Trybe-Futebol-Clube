import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import tokenAuth from '../middlewares/TokenAuthenticator';

const route = Router();
const loginController = new LoginController();

route.post('/', loginController.login);
route.get('/role', tokenAuth.tokenAuth, loginController.getUserRole);

export default route;
