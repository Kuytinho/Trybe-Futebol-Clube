import { Request, Response } from 'express';
import LoginService from '../services/LoginService';
import UserModel from '../database/models/UserModel';

class LoginController {
  public userModel = UserModel;
  constructor(private loginService = new LoginService()) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (!password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const result = await this.loginService.login(email, password);

    if (result === 'Invalid email or password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ token: result });
  };

  public getUserRole = async (req: Request, res: Response): Promise<Response> => {
    const { user } = res.locals;
    console.log('controller: ', user);
    return res.status(200).json({ role: user.user.role });
  };
}

export default LoginController;
