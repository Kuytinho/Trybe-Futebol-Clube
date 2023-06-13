import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import ITeam from '../interfaces/ITeam';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const teams: ITeam[] = [
    {
      id: 1,
      teamName: 'Avaí/Kindermann',
    },
    {
      id: 2,
      teamName: 'Bahia',
    },
    {
      id: 3,
      teamName: 'Botafogo',
    },
  ];

describe('Verifica a rota Teams', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(TeamModel, "findAll")
      .resolves({ ...teams } as TeamModel[]);
  });

  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  it('Verifica o retorno correto da rota Teams', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams');

    expect(chaiHttpResponse.body).to.be.deep.equal(teams);
  });
});