import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderBoardController';

const route = Router();
const leaderboardController = new LeaderboardController();

route.get('/home', leaderboardController.getHomeLeaderBoard);
route.get('/away', leaderboardController.getAwayLeaderBoard);
route.get('/', leaderboardController.getCompleteLeaderBoard);

export default route;
