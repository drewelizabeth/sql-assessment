var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres@localhost/Assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);
    
    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });

    // endpoints
    app.get('/api/users', function(req, res) {
      db.getAllUsers(function(err, users) {
        if (!err) {
          res.status(200).send(users);
        }
      })
    });
    app.get('/api/vehicles', function(req, res) {
      db.getAllVehicles(function(err, cars) {
        if (!err) {
          res.status(200).send(cars);
        }
      })
    });
    app.post('/api/users', function(req, res) {
      var newUser = [req.body.firstname, req.body.lastname, req.body.email];
      db.addNewUser(newUser, function(err, sqlResponse) {
        if (!err) {
          res.status(200).send(sqlResponse);
        }
      })
    });
    app.post('/api/vehicles', function(req, res) {
      var newCar = [req.body.make, req.body.model, req.body.year, req.body.ownerId];
      db.addNewCar(newCar, function(err, sqlResponse) {
        if (!err) {
          res.status(200).send(sqlResponse);
        }
      })
    });
    app.get('/api/user/:userId/vehiclecount', function(req, res) {
      var userId = req.params.userId;
      console.log('id:' + userId);
      db.countCars([userId], function(err, count){
        if (!err) {
          res.status(200).send({count});
        }
      })
    });
    app.get('/api/user/:userId/vehicle', function(req, res) {
      var userId = req.params.userId;
      db.findCarById([userId], function(err, cars) {
        if (!err) {
          res.status(200).send(cars);
        }
      })
    });
    app.get('/api/vehicle', function(req, res) {
      if (req.query.UserEmail) {
        var email = [req.query.UserEmail];
        db.getCarByEmail(email, function(err, cars) {
            res.status(200).send(cars);
        })
      } else if (req.query.userFirstStart) {
        var letters = req.query.userFirstStart;
        db.getCarByLetters([letters + "%"], function(err, cars) {
          if(!err) {
            res.status(200).send(cars);
          }
        })
      }
    });
    app.get('/api/newervehiclesbyyear', function(req, res) {
      db.getNewCars(function(err, cars) {
        if(!err) {
          res.status(200).send(cars);
        }
      })
    });
    app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res) {
      var carId = req.params.vehicleId;
      var userId = req.params.userId;
      db.changeOwner([carId, userId], function(err, newOwner) {
        if(!err) {
          res.status(200).send(newOwner);
        }
      })
    });
    app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res) {
      var owner = req.params.userId;
      var car = req.params.vehicleId;
      db.removeOwner([owner, car], function(err, noOwner) {
        if(!err) {
          res.status(200).send(noOwner);
        }
      })
    });
    app.delete('/api/vehicle/:vehicleId', function(req, res) {
      var car = req.params.vehicleId;
      db.deleteCar([car], function(err, noCar) {
        if (!err) {
          res.status(200).send(noCar);
        }
      })
    });


})

app.listen(3001, function(){
  console.log("Successfully listening on : 3001")
})

module.exports = app;
