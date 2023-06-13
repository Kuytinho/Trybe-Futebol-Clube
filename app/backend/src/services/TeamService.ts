import TeamsModel from '../database/models/TeamModel';
import ITeam from '../interfaces/ITeam';

export default class TeamsService { // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
  public model = TeamsModel;

  public async findAllTeams(): Promise<ITeam[]> {
    const result = await this.model.findAll();
    return result;
  }

  public async findTeamById(id: number | string): Promise<ITeam> {
    const result = await this.model.findByPk(id);
    return result as ITeam;
  }
}
