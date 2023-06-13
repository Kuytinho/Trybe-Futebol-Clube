import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import tokenAuth from '../middlewares/TokenAuthenticator';

const route = Router();
const matchesController = new MatchesController();

route.get('/', matchesController.getAllMatches);
route.patch('/:id/finish', tokenAuth.tokenAuth, matchesController.finishMatch);
route.patch('/:id', tokenAuth.tokenAuth, matchesController.updateMatch);
route.post('/', tokenAuth.tokenAuth, matchesController.createMatch);

export default route;
