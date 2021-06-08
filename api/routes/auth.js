const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user');

//TODO: rewrite all of this callback mess in terms of promises lol

router.route('/users')
  .post(function(req, res, next) { //route for authenticating a user, i would use a get request but my client side doesnt allow me to send a request body through get

    console.log(req.body)

    User.findOne({email: req.body.email}, (err, user) => {

      if (err) return res.status(500).send("Server-side Error. It's not your fault.");
      if (!user) return res.status(404).send({ message: "User Not found." })

      bcrypt.compare(req.body.password, user.password, (err, same) => {

        if (err) return res.status(500).send("Server-side Error. It's not your fault.")
        if (!same)
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          })

        const token = jwt.sign({ email: user.email }, 'secret', {
          expiresIn: '7d'
        })

        res.status(200).send({
          accessToken: token
        })

      })
    })


  })

  .put( function(req, res, next) { //route for creating a user

    User.exists({email : req.body.email}, (err, doc) => {

      if (err) return res.status(500).send(err.message);
      if (doc) return res.status(400).json('Error: User Already Exists!')

      bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {

          if (err) return res.status(500).send(err.message);

          const user = new User({
            name: req.body.name,
            password: hash,
            salt: salt,
            email: req.body.email,
            membership: req.body.membership,
            dateOfCreation: Date()
          })

          user.save()
            .then(res.status(200).send())
            .catch(err => res.status(500).send(err.message))

        })
      })

    })




})


module.exports = router;
