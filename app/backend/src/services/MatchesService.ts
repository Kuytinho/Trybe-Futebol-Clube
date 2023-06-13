import MatchesModel from '../srcModels/MatchesModel';
import TeamsService from './TeamService';
import Match from '../interfaces/IMatch';
import MatchResponse from '../interfaces/IMatchResponse';
import Score from '../interfaces/IScore';
import CreateMatch from '../interfaces/ICreateMatch';

export default class MatchesService {
  public matchesModel: MatchesModel;
  public teamsService: TeamsService;

  constructor() {
    this.matchesModel = new MatchesModel();
    this.teamsService = new TeamsService();
  }

  public async getAllTeams(inProgress: string): Promise<Match[]> {
    if (inProgress) {
      const inProgressBool = JSON.parse(inProgress as string);
      const result = await this.matchesModel.queryAllTeams(inProgressBool);
      return result;
    }
    const result = await this.matchesModel.findAllTeams();
    return result;
  }

  public async createMatch(match: CreateMatch): Promise<MatchResponse> {
    if (match.homeTeamId === match.awayTeamId) {
      return {
        status: 422,
        message: 'It is not possible to create a match with two equal teams',
      };
    }

    const checkHomeTeam = await this.teamsService.findTeamById(match.homeTeamId);
    const checkAwayTeam = await this.teamsService.findTeamById(match.awayTeamId);
    if (!checkHomeTeam || !checkAwayTeam) {
      return {
        status: 404,
        message: 'There is no team with such id!',
      };
    }

    const result = await this.matchesModel.createMatch(match);
    return { status: 201, result };
  }

  public async finishMatch(id: string): Promise<string> {
    const result = await this.matchesModel.finishMatch(id);
    return result;
  }

  public async updateMatch(goals: Score): Promise<string> {
    const result = await this.matchesModel.updateMatch(goals);
    return result;
  }
}
