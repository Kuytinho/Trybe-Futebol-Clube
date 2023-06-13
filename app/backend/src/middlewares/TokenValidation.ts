import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const validation = (token: string): JwtPayload => { // https://learn.microsoft.com/en-us/dotnet/api/system.identitymodel.tokens.jwt.jwtpayload?view=msal-web-dotnet-latest
  const decoded = jwt.verify(token, JWT_SECRET); // https://www.npmjs.com/package/jsonwebtoken
  return decoded as JwtPayload;
};

export default { validation };
