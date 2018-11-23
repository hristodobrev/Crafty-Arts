let User = require('mongoose').model('User')
let encryption = require('../helpFunctions/encryption')
const jswt = require('jsonwebtoken')

module.exports = {
  registerGet: (req, res) => {
      res.render('users/register')
  },
  registerPost: (req, res) => {
    let userData = req.body

    //check if the user already exists
    User.findOne({email: userData.email})
    .then(existingUser => {
      if(existingUser) {
        userData.errorMessage = 'This email address is already registered.'
        return res.json({success:false, errorMessage: 'This email address is already registered.'})
        //res.render('users/register', userData)
      } /*else if (userData.password !== userData.repeatedPassword) {
        userData.errorMessage = 'Your passwords do not match.'
        res.render('users/register', userData)
      } */ else {
        userData.salt = encryption.generateSalt()
        userData.password = encryption.generateHashedPassword(userData.salt, userData.password)

        if(userData.selectType === 'tl') {
          userData.type = true
        }
        
        User
          .create(userData)
          .then(user => {
            req.logIn(user, (err) => {
              if (err) {
                user.errorMessage = 'Something went wrong. Try to register again.'
                return res.json({success:false, errorMessage: 'Something went wrong. Try to register again.'})
                //res.render('users/register', user)
                //return
              }
              
              //res.redirect('/')
              return res.json({success: true, user})
            })
          })
        }
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let userData = req.body

    User.findOne({email: userData.email})
    .then(user => {
      if (!user || !user.authenticate(userData.password)) {
        //userData.errorMessage = 'Invalid password or username.'
        //res.render('users/login', userData)
        return res.json({success:false, errorMessage: 'Invalid password or username.'})
      } else {
        req.logIn(user, (err) => {
          if (err) {
            //user.errorMessage = 'Something went wrong. Try to login again.'
            //res.render('users/login', user)
            //return
            return res.json({success: false, errorMessage: 'Something went wrong. Try to login again.'})
          }

          //res.redirect('/')
          const token = jswt.sign({data: user}, 'MichaelaAdmin', { expiresIn: 60*60*12 })
          return res.json({ success: true, token:'JWT ' + token, user })
        })
        
      }
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  userProfile: (req, res) => {
    let _id = req.params.id

    User.findById(_id)
    .then(user => {
      if (!user) {
        return res.json({success: false, errorMessage: 'This user is not found.'})
      }

      return res.json({success: true, user})
      //res.render('users/profile', {user: user})
    })
    .catch(err => {
      return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  imgupload: (req, res, next) => {
    let image
    let uploadedImage = req.body
    let userId = req.params.id
    if (!req.files) {
      //res.render('users/profile')
      return res.json({success: false, errorMessage: 'You have not selected an image'})
    }
    

    image = req.files.image
    uploadedImage.image = req.files.image.name
    console.log('newcreatedImage: ', uploadedImage)
    
    if (uploadedImage.image !== '') {
        image.mv('./public/images/' + req.files.image.name, (err) => {
          if (err) {
            res.status(500).send(err)
          } else {
            User
            .findByIdAndUpdate(userId, {
              $set: {
                image: uploadedImage.image
              },
            new: true
          })
          .exec()
          .then(updatedUser => {
            return res.json({success: true, updatedUser})
            //res.redirect('/')
          })
        }
      })
    }
  },
  userCheck: (req, res) => {
    let userId = req.params.id
    
    User
    .findById(userId)
    .then(user => {
      if (!user) {
        return res.json({success: false, errorMessage: 'This user is not found.'})
      }
      
      return res.json({success: true, user})
    })
    .catch(err => {
      return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  }
}