import { RequestHandler, Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(private service = new MatchesService()) { }

  public getAllMatches:RequestHandler = async (req: Request, res: Response) => {
    const { inProgress } = req.query;
    const result = await this.service.getAllTeams(inProgress as string);
    return res.status(200).json(result);
  };

  public createMatch:RequestHandler = async (req: Request, res: Response) => {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const match = { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals };
    const { status, message, result } = await this.service.createMatch(match);
    if (!result) {
      return res.status(status).json({ message });
    }
    return res.status(status).json(result);
  };

  public finishMatch:RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const message = await this.service.finishMatch(id);
    return res.status(200).json({ message });
  };

  public updateMatch:RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const goals = { id, homeTeamGoals, awayTeamGoals };
    const message = await this.service.updateMatch(goals);
    return res.status(200).json({ message });
  };
}
