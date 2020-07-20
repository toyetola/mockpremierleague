const adminController = require('../../app/controllers/userController')
const supertest = require('supertest');
const app = require('../../server');
const request = supertest(app)


describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
})

/* describe('Test if team is successfully created', ()=>{
    jest.useFakeTimers()

    it("should test if teams can be created", async (done) => {

		const response = await request.get('/')

		expect(response.status).toBe(200);
		// expect(response.body.status).toBe('success');
        expect(response.body).toHaveProperty('message');
        
        done();

	});
}) */