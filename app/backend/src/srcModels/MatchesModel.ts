import CreateMatch from '../interfaces/ICreateMatch';
import Team from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import Match from '../interfaces/IMatch';
import Score from '../interfaces/IScore';
import IMatchesGoals from '../interfaces/IMatchesGoals';

export default class MatchesModel {
  public model = MatchModel;

  public async findAllTeams(): Promise<Match[]> {
    const result = await this.model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return result;
  }

  public async queryAllTeams(inProgress: boolean): Promise<Match[]> {
    const result = await this.model.findAll({
      where: { inProgress },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return result;
  }

  public async createMatch(match: CreateMatch): Promise<Match> {
    const result = await this.model.create({ ...match, inProgress: 'true' });
    return result;
  }

  public async finishMatch(id: string): Promise<string> {
    await this.model.update({ inProgress: false }, { where: { id } });
    return 'Finished';
  }

  public async updateMatch(goals: Score): Promise<string> {
    const { id, homeTeamGoals, awayTeamGoals } = goals;
    await this.model.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return 'Updated';
  }

  public async queryAllHomeMatches(): Promise<IMatchesGoals[]> {
    const result = await this.model.findAll({
      where: { inProgress: false },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
      ],
    });

    const homeMatches = result.map(MatchesModel.generateHomeMatch);
    console.log('model homeMatches: ', homeMatches);
    return homeMatches;
  }

  public async queryAllAwayMatches(): Promise<IMatchesGoals[]> {
    const result = await this.model.findAll({
      where: { inProgress: false },
      include: [
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    const awayMatches = result.map(MatchesModel.generateAwayMatch);
    return awayMatches;
  }

  private static generateHomeMatch = (match: Match) => ({
    teamName: match.homeTeam?.teamName,
    teamGoals: match.homeTeamGoals,
    rivalTeamGoals: match.awayTeamGoals,
  });

  private static generateAwayMatch = (match: Match) => ({
    teamName: match.awayTeam?.teamName,
    teamGoals: match.awayTeamGoals,
    rivalTeamGoals: match.homeTeamGoals,
  });
}
