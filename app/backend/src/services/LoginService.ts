import { compare } from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
// import { raw } from 'express';
import IUser from '../interfaces/IUser';
import IToken from '../interfaces/IToken';
import UserModel from '../database/models/UserModel';

const secret = 'jwt_secret';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // https://www.abstractapi.com/guides/email-validation-regex-javascript
const passLength = 6;
// const ets = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i; // https://pt.stackoverflow.com/questions/1386/express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-e-mail
class LoginService {
  public model = UserModel;

  public login = async (email: string, password: string): Promise<IToken | string> => {
    const emailVerification = emailRegex.test(email);
    console.log(emailVerification);
    const user = await this.model.findOne({ where: { email }, raw: true }) as IUser; // https://www.tabnine.com/code/javascript/functions/sequelize/Model/findOne
    if (!user || emailVerification === false || password.length < passLength) {
      console.log([user, emailVerification, password.length]);
      return 'Invalid email or password';
    }

    const passwordValidation = await compare(password, user.password);
    if (!passwordValidation) {
      return 'Invalid email or password';
    }
    const token = Jwt.sign({ user }, secret, {
      expiresIn: '2d',
    });
    return token as unknown as IToken; // https://mariusschulz.com/blog/the-unknown-type-in-typescript
  };
}

export default LoginService;
