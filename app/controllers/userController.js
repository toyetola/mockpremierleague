const Team = require('../models/teamModel')
const Fixture = require('../models/fixturesModel')

const userController = {
    viewSingleTeam : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "user"){
                  //return res.json({'id':req.params.TeamId});
                  Team.findById(req.params.TeamId)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.TeamId + "not found."
                      });            
                    }
                    res.send(team);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
    },


    //user view single team

    viewTeams : (req, res) => {
        try{
            session = req.session
            // if(session.theuser){
                if(req.session.theuser.role == "user"){
                  Team.find().populate('fixtures')
                  .then(teams => {
                      res.send(teams);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            // }
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },


    viewFixtures : (req, res) => {
        try{
            session = req.session
            // if(session.theuser){
                if(req.session.theuser.role == "user"){
                  Fixture.find().populate('team')
                  .then(fixtures => {
                      res.send(fixtures);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving fixtures."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            // }
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
    },
    
    viewSingleFixture : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "user"){
                  //return res.json({'id':req.params.TeamId});
                  Fixture.findOne({unique_link_id: req.params.FixtureId})
                  .then(fixture => {
                    if(!fixture) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.FixtureId + "not found."
                      });            
                    }
                    res.send(fixture);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error.message});
        }
    },

    fetchFutureFixtures: (req, res) => {
        try{
            session = req.session
                //if(session.theuser){
            if(req.session.theuser.role == "user"){
                Fixture.find({"start_time": {$gte: new Date()}}, (err, fx)=>{
                    if (err) throw err
                    return res.json({'fixtures': fx})
                })
                .catch(error => {
                    return res.json({'error': error.message})
                })
                
            }else{
                return res.status(401).json({'error': 'You seem to be accessing a route you do not have access to.'});
            }
        }catch(error){
            return res.status(500).json({'error': error.message});
        }
    },


    fetchCompletedFixtures: (req, res) => {
        try{
            session = req.session
                //if(session.theuser){
            if(req.session.theuser.role == "user"){
                Fixture.find({"start_time": {$lt: new Date()}}, (err, fx)=>{
                    if (err) {throw err}
                    else{
                        return res.json({'fixtures': fx})
                    }
                })
                .catch(error => {
                    return res.json({'error': error.message})
                })
            }else{
                return res.status(401).json({'error': 'You seem to be accessing a route you do not have access to.'});

            }
        }catch(error){
            return res.status(500).json({'error': error.message});
        }
    },

    search : (req, res) => {
        try{
            let hold;
            if(!req.query.searchText){
                res.send({'error': 'Nothing was inputed'})
            }else{
                //return res.send({'query':req.query.searchText});
                // Fixture.find({team1: { $regex: '/^'+req.query.searchText+'$/', $options: "i" }, team2: { $regex: '/^'+req.query.searchText+'/', $options: "i" }})
                Fixture.find({$or: [{team1: new RegExp(req.query.searchText, 'i')}, {team2: new RegExp(req.query.searchText, 'i')}]}, (fixture) => {
                    //console.log("Partial Search Begins");
                    hold = fixture;
                })
                .catch((e)=>{
                    return res.json({'error': e.message});
                })
                
            
                Team.find({ name:  new RegExp(req.query.searchText, 'i') }, (err, result) => {
                    //console.log("Partial Search Begins");
                    if (err) throw err
                    //console.log(req.query.searchText);
                    result['fixtures'] = hold;
                    return res.json({'result': result, fixtures: hold});
                })
                .catch((e)=>{
                    return res.json({'error': e.message});
                })
            }
        }catch(err){
            res.json({'error':err.message})
        }    
    }
}

module.exports = userController

