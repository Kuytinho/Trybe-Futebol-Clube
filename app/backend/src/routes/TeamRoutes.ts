import { Router } from 'express';
import TeamsController from '../controllers/TeamController';

const route = Router();
const teamsController = new TeamsController();

route.get('/', teamsController.findAllTeams);
route.get('/:id', teamsController.findTeamById);

export default route;
