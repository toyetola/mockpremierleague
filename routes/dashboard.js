const express = require("express")
const router = require("express").Router();
const userController = require('../app/controllers/userController');
var session ;


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

router.get("/teams", userController.viewTeams);
router.get("/team/:TeamId", userController.viewSingleTeam);
router.get("/fixtures", userController.viewFixtures);
router.get("/fixture/:FixtureId", userController.viewSingleFixture);

router.get("/completedFixtures", userController.fetchCompletedFixtures);
router.get("/futureFixtures", userController.fetchFutureFixtures);

module.exports = router;