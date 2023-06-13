import ITeam from './ITeam';

export default interface Match {
  id?: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress?: number | boolean;
  homeTeam?: ITeam;
  awayTeam?: ITeam;
}
