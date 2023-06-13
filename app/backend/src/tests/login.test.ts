import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const user = {
    id: 1,
    username: 'JoeDoe',
    role: 'user',
    password: 'user_passwordinho',
    email: 'userJoeDoe@email.com'
  };
const validLogin = {
  email: 'userJoeDoe@email.com',
  password: 'user_passwordinho',
}
const invalidEmail = {
  email: 'oeDoe@',
  password: 'user_passwordinho',
}
const invalidPassword = {
  email: 'userJoeDoe@email.com',
  password: 'joe',
}
const noPassword = {
    email: 'userJoeDoe@email.com'
}
const noEmail = {
    password: 'user_passwordinho'
}
describe('Verifica o funcionamento da rota login', () => {

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(user as UserModel);
  });

  afterEach(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
  })

  it('Verifica se é logado com as infrmações certas', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(validLogin)

    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).not.to.be.empty;

  });

  it('Verifica o erro quando é passado uma email inválido', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(invalidEmail);
    expect(chaiHttpResponse.status).to.be.equal(401)
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password')

  });

  it('Verifica o erro quando é passado uma senha invalida', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(invalidPassword);
    expect(chaiHttpResponse.status).to.be.equal(401)
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password')

  });

  it('Verifica o erro quando não é passada a senha', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(noPassword);
    expect(chaiHttpResponse.status).to.be.equal(400)
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled')

  });

  it('Verifica o erro quando não é passado o email', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send(noEmail);
    expect(chaiHttpResponse.status).to.be.equal(400)
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled')

  });


});