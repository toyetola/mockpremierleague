/* this contains all route an admin in going to access: mst of them are protected with the authorized auth token */
const router = require("express").Router();
// const Joi = require("@hapi/joi");
const Team = require("../app/models/teamModel.js");
const Fixture = require("../app/models/fixturesModel");
const adminController = require('../app/controllers/adminController')

/* const schema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  location: Joi.string().min(3).max(255)
});

const checkFixture = Joi.object({
  team1: Joi.string().required(),
  team2: Joi.string().disallow(Joi.ref('team1')).required(),
  start_time : Joi.date().required(),
  end_time : Joi.date().required(),
}); */





// Admin home page
router.get("/", (req, res) => {
  session = req.session
  if(session.theuser){
      res.json({
          error: null,
          data: {
          title: "My dashboard",
          content: "dashboard content",
          user: req.user, // token payload information
          },
      });
  } else{
      res.json({'Access denied':'Login again'})
  }
});

//Create a team : strictly limited to admin
router.post("/createTeam", adminController.createTeam)

router.get("/retrieveAllTeams", adminController.retreiveAllTeams)


router.get("/retrieveOneTeam/:TeamId", adminController.retrieveOneTeam);

//Update the deatils of a team
router.put("/updateTeam/:TeamId", adminController.updateTeam)

//Delete team
router.delete("/deleteTeam/:TeamId", adminController.deleteTeam)

//Create a fixture : strictly limited to admin
router.post("/createFixture", adminController.createFixtures)


//retrieve all fixtures
router.get("/retrieveAllFixtures", adminController.retreiveAllFixture);

router.get("/retrieveOneFixture/:FixtureId", adminController.retrieveOneFixture);

router.get("/fixture/:FixtureId", adminController.uniquelink);


//Update the fixtures
router.put("/updateFixture/:FixtureId", adminController.updateFixture)


// delete fixture
router.delete("/deleteFixture/:FixtureId", adminController.deleteFixture)

router.get('/completedFixtures', adminController.fetchCompletedFixtures)
router.get('/futureFixtures', adminController.fetchFutureFixtures)

module.exports = router;