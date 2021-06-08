const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')

const User = require('../models/user');

router.get('/conferences', function(req, res, next) { //route for obtaining a list of conference IDs

      jwt.verify(req.headers.authorization, 'secret', (err, decoded) => {

          if (err) return res.status(500).send(err.message)
          User.findOne({email: decoded.email})
            .then(user => res.status(200).send(user.conferences))
            .catch(err => res.status(500).send(err.message))

      })

  })

router.route('/info')
  .get(function (req, res, next) {

    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => {

        if (err) return res.status(500).send(err.message)
        User.findOne({email: decoded.email})
          .then(user => res.status(200).json({membership: user.membership, name: user.name}))
          .catch(err => res.status(500).send(err.message))

    })


  })












module.exports = router;
