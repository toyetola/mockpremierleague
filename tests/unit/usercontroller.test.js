const userController = require('../../app/controllers/userController')
const supertest = require('supertest');
const app = require('../../test-server');
const request = supertest(app)
const mongoose = require('mongoose')
const databaseName = 'test'
var token = "";


describe('Test if team is register can go', () => {

    it("should test if user can be registered", async done => {
      beforeEach(async () => {
        const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
        await mongoose.connect(url, { useNewUrlParser: true })
      })
  
      const response = await request.post('/api/user/register').send({name:"menoni", email:"meuser@gmail.com", password:"qwerty12", confirm_password:"qwerty12", role:"user"})
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
  
      const response = await request.post('/api/user/login').send({email:"meuser@gmail.com", password:"qwerty12"})
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login successful');
      if(expect(response.body.message).toBe('Login successful')){
          token = response.body.token
      } 
      done();
    }, 10000)
  
  });

describe('Test if team can be fetched', () => {
    //jest.useFakeTimers()
    beforeEach(async () => {
      const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
      await mongoose.connect(url, { useNewUrlParser: true })
    })
  
    it("should test if teams fetched", async done => {
  
      const response = await request.post('/api/user/dashboard/retrieveAllTeams').set('auth-token', token)
  
        expect(response.status).toBe(200);
    // expect(response.body.status).toBe('success');
        done();
        
    }, 30000);
  })