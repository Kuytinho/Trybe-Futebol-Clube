import { RequestHandler, Request, Response } from 'express';
import LeaderboardService from '../services/LeaderBoardService';

export default class LeaderboardController {
  public service: LeaderboardService;

  constructor() {
    this.service = new LeaderboardService();
  }

  public getHomeLeaderBoard:RequestHandler = async (_req: Request, res: Response) => {
    const result = await this.service.createHomeLeaderboard();
    return res.status(200).json(result);
  };

  public getAwayLeaderBoard:RequestHandler = async (_req: Request, res: Response) => {
    const result = await this.service.createAwayLeaderboard();
    return res.status(200).json(result);
  };

  public getCompleteLeaderBoard:RequestHandler = async (_req: Request, res: Response) => {
    const result = await this.service.createCompleteLeaderBoard();
    return res.status(200).json(result);
  };
}
