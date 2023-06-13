import TeamsModel from './TeamService';
import MatchesModel from '../srcModels/MatchesModel';
import ITeam from '../interfaces/ITeam';
import ITeamClass from '../interfaces/ITeamClass';
import IMatchesGoals from '../interfaces/IMatchesGoals';

export default class LeaderboardService {
  public teamModel: TeamsModel;
  public matchModel: MatchesModel;

  constructor() {
    this.teamModel = new TeamsModel();
    this.matchModel = new MatchesModel();
  }

  public async createAwayLeaderboard(): Promise<ITeamClass[]> {
    const awayMatches = await this.matchModel.queryAllAwayMatches();
    const teams = await this.teamModel.findAllTeams();
    const emptyLeaderboard = teams.filter((team) => awayMatches
      .some((match) => match.teamName === team.teamName))
      .map(LeaderboardService.createTeamCard);

    const leaderboard = LeaderboardService.createLeaderboard(emptyLeaderboard, awayMatches);
    const sortedLeaderboard = LeaderboardService.sortedLeaderboard(leaderboard);
    return sortedLeaderboard;
  }

  public async createHomeLeaderboard(): Promise<ITeamClass[]> {
    const homeMatches = await this.matchModel.queryAllHomeMatches();
    const teams = await this.teamModel.findAllTeams();
    const emptyLeaderboard = teams.filter((team) => homeMatches
      .some((match) => match.teamName === team.teamName))
      .map(LeaderboardService.createTeamCard);

    const leaderboard = LeaderboardService.createLeaderboard(emptyLeaderboard, homeMatches);
    console.log('service leaderboard:', leaderboard);
    const sortedLeaderboard = LeaderboardService.sortedLeaderboard(leaderboard);
    return sortedLeaderboard;
  }

  public async createCompleteLeaderBoard(): Promise<ITeamClass[]> {
    const homeMatches = await this.matchModel.queryAllHomeMatches();
    const awayMatches = await this.matchModel.queryAllAwayMatches();
    const teams = await this.teamModel.findAllTeams();
    console.log(teams);
    const teamsCards = teams.map(LeaderboardService.createTeamCard);

    const homeLeaderboard = LeaderboardService.createLeaderboard(teamsCards, homeMatches);
    const completeLeaderboard = LeaderboardService.createLeaderboard(homeLeaderboard, awayMatches);
    const sortedLeaderboard = LeaderboardService.sortedLeaderboard(completeLeaderboard);
    return sortedLeaderboard;
  }

  private static createTeamCard = (team: ITeam) => ({
    name: team.teamName,
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '',
  });

  private static getGoalsBalance = (teamCard: ITeamClass, match: IMatchesGoals) => {
    const goalsFavor = teamCard.goalsFavor + match.teamGoals;
    const goalsOwn = teamCard.goalsOwn + match.rivalTeamGoals;
    const goalsBalance = goalsFavor - goalsOwn;
    return { goalsFavor, goalsOwn, goalsBalance };
  };

  private static getPoints = (teamCard: ITeamClass, match: IMatchesGoals) => {
    const totalGames = Number(teamCard.totalGames) + 1;
    const totalDraws = teamCard.totalDraws + Number(match.teamGoals === match.rivalTeamGoals); // bool 0 ou 1
    const totalVictories = teamCard.totalVictories + Number(match.teamGoals > match.rivalTeamGoals);
    const totalLosses = teamCard.totalLosses + Number(match.teamGoals < match.rivalTeamGoals);
    const totalPoints = totalVictories * 3 + totalDraws;
    return { totalPoints, totalGames, totalDraws, totalVictories, totalLosses };
  };

  private static updateTeamCard = (teamcard: ITeamClass, match: IMatchesGoals) => {
    const { goalsFavor, goalsOwn, goalsBalance } = this.getGoalsBalance(teamcard, match);
    const { totalPoints, totalGames, totalDraws, totalVictories, totalLosses } = this
      .getPoints(teamcard, match);
    const efficiencyNumber = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    const efficiency = String(efficiencyNumber);
    return {
      ...teamcard,
      totalPoints,
      totalGames,
      totalDraws,
      totalVictories,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  };

  private static createLeaderboard(teams: ITeamClass[], matches: IMatchesGoals[]): ITeamClass[] {
    const leaderboard = teams.map((team) => matches.reduce((teamCard, match) => { // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
      if (match.teamName === team.name) {
        return LeaderboardService.updateTeamCard(teamCard, match);
      }
      return teamCard;
    }, { ...team }));
    return leaderboard;
  }

  private static sortedLeaderboard = (leaderboard: ITeamClass[]): ITeamClass[] => {
    leaderboard.sort((a, b) => { // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      if (a.goalsFavor !== b.goalsFavor) {
        return b.goalsFavor - a.goalsFavor;
      }
      return a.goalsOwn - b.goalsOwn;
    });
    return leaderboard;
  };
}
