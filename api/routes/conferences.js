const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')

const Conference = require('../models/conference');
const User = require('../models/user');

router.route('/:id')
  .get(function(req, res, next) { //route for obtaining a conference

      Conference.findOne({_id: req.params.id})
        .then(result => {
          if (!result) return res.status(404).send('Conference not found')
          res.status(200).json(result)
        })
        .catch(err => res.status(500).send(err.message))

  })
  .delete(function(req, res, next) { //route for deleting a conference

    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => { //checks for session, if current user logged in is an owner of the conference

        if (err) return res.status(500).send(err.message)

        User.findOne({email: decoded.email})
          .then((user) => {

            if (user.conferences.includes(req.params.id))
              Conference.findByIdAndDelete(req.params.id)
                .then(() => {
                    user.conferences = user.conferences.filter(function(value, index, arr) { //removes deleted conference id from user's conferences list
                        return (value != req.params.id)
                    })
                    user.save()
                })
                .then(() => res.status(200).send())
                .catch(err => res.status(500).send(err.message))
            else res.status(401).send('Permission Denied')

          })
          .catch(err => res.status(500).send(err.message))




    })

  })
  .put(function(req, res, next) {

    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => { //checks for session, if current user logged in is an owner of the conference

        if (err) return res.status(500).send(err.message)

        User.findOne({email: decoded.email})
          .then((user) => {

            if (user.conferences.includes(req.params.id))
              Conference.findOneAndUpdate({_id: req.params.id}, req.body, null) //finds conference by ID provided in URL and updates it with data from the body of the response
                .then(result => {
                  if (!result) return res.status(404).send('Conference not found')
                  res.status(200).send()
                })
                .catch(err => res.status(500).send(err.message))
            else res.status(401).send('Permission Denied')

          })
          .catch(err => res.status(500).send(err.message))

    })


  })


router.route('/')
  .post(function(req, res, next) { //route for creating a new conferenceSchema

    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => { //checks for session, if current user logged in is an owner of the conference

      if (err) return res.status(500).send(err.message)

      const conference = new Conference({
        name: req.body.name,
        security: { enabled: req.body.security.enabled, password: ((req.body.security.enabled)?req.body.security.password:'')},
        description: req.body.description,
        dateOfCreation: Date(),
        scheduledFor: Date.parse(req.body.scheduledFor),
        status: { active: false, attendance: {planned: 0, actual: 0} }
      })

      User.findOneAndUpdate({email: decoded.email}, {$push: {conferences: conference._id.toString()}}, null) //finds user by ID provided in headers and pushes new conference's ID to conference list array
        .then(result => {
          if (!result) return res.status(404).send('User not found')
        })
        .catch(err => res.status(500).send(err.message))

      conference.save()
        .then(() => res.status(200).send(conference._id))
        .catch(err => res.status(500).send(err.message))

    })


  })










module.exports = router;
