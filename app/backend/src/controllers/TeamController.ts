import { RequestHandler, Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamsController {
  constructor(private service = new TeamService()) { }

  public findAllTeams:RequestHandler = async (_req: Request, res: Response) => {
    const result = await this.service.findAllTeams();
    return res.status(200).json(result);
  };

  public findTeamById:RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.service.findTeamById(id);
    return res.status(200).json(result);
  };
}
