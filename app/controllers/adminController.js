const Team = require('../models/teamModel')
const Fixture = require('../models/fixturesModel')
const Joi = require("@hapi/joi");

const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    location: Joi.string().min(3).max(255)
  });
  
  const checkFixture = Joi.object({
    team1: Joi.string().required(),
    team2: Joi.string().disallow(Joi.ref('team1')).required(),
    start_time : Joi.date().required(),
    end_time : Joi.date().required(),
  });

  function genString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


const adminController = {

    createTeam : async (req, res) => {
        try{
          session = req.session
        if(session.theuser){
          const { error } = schema.validate(req.body);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }
          const isTeamExist = await Team.findOne({ name: req.body.name });
          if(isTeamExist){
              res.json({'error': 'Name already exists! Two clubs cannot bear the same name in this league'});
          }
          if(req.session.theuser.role == "admin"){
              const team = new Team({
                  name : req.body.name,
                  location : req.body.location || null
              });
      
              const teamCreated = team.save();
              res.json({success: '1', message:'team successfully saved'});
          }else{
            res.json({'error': 'You not authorised to perform this action.'});
          }
        }
        res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': "bad request"});
        }
          
      
    },


    //retreive all existing teams
    retreiveAllTeams: (req, res) => {
        try{
            session = req.session
            // if(session.theuser){
                if(req.session.theuser.role == "admin"){
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
    
      //retriev a single team with the id as param
    retrieveOneTeam: (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
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
      
      
      //updateTeam
      updateTeam : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).send({
                      message: "Data to update can not be empty!"
                    });
                  }
                  Team.findByIdAndUpdate(req.params.TeamId, req.body, { useFindAndModify: false })
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.TeamId + "not found."
                      });            
                    }else{
                      team.name = req.body.name ? req.body.name : team.name
                      team.location = req.body.location ? req.body.location : team.location
                      res.send({message:"successfully updated",team});
                    }
                    
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


      //delete a single team
      deleteTeam : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).send({
                      message: "Data to update can not be empty!"
                    });
                  }
                  Team.findOneAndRemove(req.params.TeamId)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team was successfully deleted"
                      });            
                    }else{
                      team.name = req.body.name ? req.body.name : team.name
                      team.location = req.body.location ? req.body.location : team.location
                      res.send({message:"successfully deleted"});
                    }
                    
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


    //a new fixture  
    createFixtures : async (req, res) => {
        try{
          session = req.session
          x = req.body.team1 ; y = req.body.team2
        // if(session.theuser){
          if(x == y){
            console.log('gotten');
            return res.json({'error': 'The same team cannot play each other, think about it !'});
          }
          const { error } = checkFixture.validate(req.body);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }
          
          
          //return res.json({"kl":x, "k2":y});
          const isTeam1Exist = await Team.findOne({name: req.body.team1 });
          const isTeam2Exist = await Team.findOne({name: req.body.team2 });
      
          //return res.json({"kl":isTeam2Exist, "k2":isTeam1Exist});
          if(!isTeam1Exist || !isTeam2Exist){
            return res.json({'error': 'One of two of the teams you provide does not exist'});
          }
          
          if(new Date(req.body.start_time) < new Date() || new Date(req.body.end_time) >= new Date(new Date(req.body.end_time).getTime()+ 90*60000)){
             return res.json({'error': 'match can only be in a future date and match cannot be less than 90 minutes'})
          }
          if(req.session.theuser.role == "admin"){
              const fixture = new Fixture({
                  team1 : req.body.team1,
                  team2 : req.body.team2,
                  start_time : new Date(req.body.start_time),
                  end_time : new Date(req.body.end_time),
                  unique_link_id : genString(10)
              });
      
      
              const teamCreated = fixture.save();
              res.json({success: '1', message:'fixture successfully saved'});
          }else{
            res.json({'error': 'You not authorised to perform this action.'});
          }
        /* }else{
          res.json({'Access denied': 'Please login again'});
        } */
        
        }catch(error){
          return res.status(400).json({'error': error.message});
        }      
    },

    //retrieveAll Fixture
    retreiveAllFixture : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  Fixture.find()
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
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
    },

    retrieveOneFixture : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  Fixture.findById(req.params.FixtureId)
                  .then(fixture => {
                    if(!fixture) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.FixtureId + " not found."
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
          return res.status(400).json({'error': error});
        }
    },

    //unique link for fixtures
    uniquelink : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
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

    //update
    updateFixture : (req, res) => {
        try{
            session = req.session
            
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).json({
                      message: "Data to update can not be empty!"
                    });
                  }
                  
                  var fx
                  Fixture.findOne({_id:req.params.FixtureId})
                  .then((fixture) => {
                    if(fixture){
                      fx = fixture
                      const gh = Team.findOne({name: req.body.team1})
                      const rf = Team.findOne({name: req.body.team2})
                      if(!gh || !rf){
                        return res.status(400).json({message: "Team you are trying to insert deos not exist"});
                      }
                      if((req.body.team1 && req.body.team1 != fixture.team1 || req.body.team2 && req.body.team2 != fixture.team2) && new Date(fixture.start_time) < new Date()){
                        return res.status(400).json({
                          message: "Data cannot be updated! The game has taken place"
                        });
                      }else{
                        fixture.team1 = req.body.team1,
                        fixture.team2 = req.body.team2,
                        fixture.team1_score =  req.body.team1_score ? req.body.team1_score : fixture.team1_score,
                        fixture.team2_score = req.body.team2_score ? req.body.team2_score : fixture.team2_score,
                        fixture.start_time = req.body.start_time ? new Date(req.body.start_time) : fixture.start_time,
                        fixture.end_time = req.body.end_time ? new Date(req.body.end_time) : fixture.end_time,
                        fixture.save();
                      }
                      return res.json({'success':1, 'message':'Fixture updated successfully', 'fixture':fx})
                    }else{
                      return res.json({'error': 'Item Not found.'});
                    }
                  }).catch(error => {
                    return res.json({'error': error.message});
                  });
                  
                }else{
                    return res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error.message});
        }
    },


    //delete fixture 
    deleteFixture : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).send({
                      message: "Data to update can not be empty!"
                    });
                  }
                  Fixture.findOneAndRemove(req.params.FixtureId, {useFindAndModify:false})
                  .then(fixture => {
                    if(!fixture) {
                      return res.status(404).send({
                          message: "Fixture was successfully deleted"
                      });            
                    }else{
                      res.send({'message':"Fixture was successfully deleted"});
                    }
                    
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


    //fetch future fixtures
    fetchFutureFixtures: (req, res) => {
        try{
            session = req.session
                //if(session.theuser){
            if(req.session.theuser.role == "admin"){
                Fixture.find({"start_time": {"$gte": new Date()}}, (err, fx)=>{
                    if (err) throw err
                    return res.json({'fixtures': fx})
                }).catch(error => {
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
            if(req.session.theuser.role == "admin"){
                Fixture.find({"start_time": {"$lt": new Date()}}, (err, fx)=>{
                    if (err) throw err
                    return res.json({'fixtures': fx})
                }).catch(error => {
                    return res.json({'error': error.message})
                })
                
            }else{
                return res.status(401).json({'error': 'You seem to be accessing a route you do not have access to.'});
            }
        }catch(error){
            return res.status(500).json({'error': error.message});
        }
    }
}

module.exports = adminController