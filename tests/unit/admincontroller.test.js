const adminController = require('../../app/controllers/adminController')
const supertest = require('supertest');
const app = require('../../test-server');
const request = supertest(app)
const mongoose = require('mongoose')
const databaseName = 'test'
var token = "";

/* beforeAll(async () => {
  const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
  await mongoose.connect(url, { useNewUrlParser: true })
}) */

describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
})

describe('Test if land url loads', ()=>{
  //jest.useFakeTimers()

  it("should test if app loads", async done => {

    const response = await request.get('/');
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Welcome to Premier League Mock application.')
    done()
  
  });
})


describe('Test if team is register can go', () => {

  it("should test if user can be registered", async done => {
    beforeEach(async () => {
      const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
      await mongoose.connect(url, { useNewUrlParser: true })
    })

    const response = await request.post('/api/admin/registerAdmin').send({name:"menoni", email:"ask@gmail.com", password:"qwerty12", confirm_password:"qwerty12", role:"admin"})
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    done()
  }, 10000)

});

describe('Test if login works', () => {

  it("should test if user can login", async done => {
    beforeEach(async () => {
      const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
      await mongoose.connect(url, { useNewUrlParser: true })
    })

    const response = await request.post('/api/admin/login').send({email:"askme@gmail.com", password:"qwerty12"})
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Login successful');
    if(expect(response.body.message).toBe('Login successful')){
        token = response.body.token
    } 
    done();
  }, 10000)

});

describe('Test if team is successfully created', () => {
  //jest.useFakeTimers()
  beforeEach(async () => {
    const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
    await mongoose.connect(url, { useNewUrlParser: true })
  })

  it("should test if teams can be created", async done => {

    const response = await (await request.post('/api/admin/dashboard/createTeam').set('auth-token', token).send({name:"Awe", Location:"Spain"}))

      expect(response.status).toBe(200);
  // expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('team successfully saved');
      done();
      
  }, 10000);
})

describe('Test if team can be fetched', () => {
  //jest.useFakeTimers()
  beforeEach(async () => {
    const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
    await mongoose.connect(url, { useNewUrlParser: true })
  })

  it("should test if teams fetched", async done => {

    const response = await request.post('/api/admin/dashboard/retrieveAllTeams').set('auth-token', token)

      expect(response.status).toBe(200);
  // expect(response.body.status).toBe('success');
      done();
      
  }, 30000);
})

