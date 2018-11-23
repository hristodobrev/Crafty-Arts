let Project = require('mongoose').model('Project')
let User = require('mongoose').model('User')
const passport = require('passport');
const LocalPassport = require('passport-local')
const auth = require('../helpFunctions/authentication')

module.exports = {
    createGet: (req, res) => {
        User
        .find({})
        .exec((err, users) => {
            if (err) {
                console.log(err)
                return res.json({success: false, errorMessage: 'Something went wrong. Try to login again.'})
            }
            
            //res.render('projects/create', {users: users})
            return res.json({success: true, users})
        })
    },
    createPost: (req, res) => {
    let projctData = req.body
    let projectId = ''

    //check if the JN already exists
    Project.findOne({jobNumber: projctData.jobNumber})
    .then(existingJN => {
      if(existingJN) {
          User
          .find({})
          .exec((err, users) => {
              if (err) {
                  console.log(err)
                  return res.json({success: false, errorMessage: 'Something went wrong. Try to login again.'})
              }
              
              //res.render('projects/create', {users: users, errorMessage: 'A project with this job number already exists.'})
              return res.json({success: false, users, errorMessage: 'A project with this job number already exists.'})
            })
      } else {
          User.findOne({email: projctData.selectWorker})
          .then(existingUser => {

            let projectObject = {
                title: projctData.title,
                jobNumber: projctData.jobNumber,
                creator: projctData.creatorId,
                worker: existingUser._id
            }

              let checkUser = 0
              
              //check if the new project is assigned to the current logged user
              if(projctData.selectWorker === projctData.creator) {
                checkUser += 1
              }
              
              //create the new project
              Project.create(projectObject)
              .then(project => {
                  //update the Users table with the id of the created project
                  User.findOneAndUpdate({ email: projctData.creator },
                    {
                        $push: { 'createdProjects': project._id},
                        new: true
                    })
                    .exec()

                  /*req.user.createdProjects.push(project._id)
                  req.user.save(err => {
                    if (err) {
                        res.redirect('/', {errorMessage: 'Something went wrong. Please try to create the poject again.'})
                    }
                  })*/

                  /*if (checkUser > 0) {
                    User.findByIdAndUpdate({ _id: req.user.id },
                    {
                        $push: { 'projects': project._id},
                        new: true
                    })
                    .exec()
                    .then(
                        res.redirect('/')
                    )
                  } else {}*/
                      User.findOneAndUpdate({email: projctData.selectWorker},
                      {
                          $push: { 'projects': project._id},
                          new: true
                      })
                    .exec()
                    /*.then(
                        res.redirect('/')
                    )*/
              })
           })
        }
    })
    return res.json({success: true})
  },
  ownProjectsGet: (req, res) => {
      let loggedUser = req.params.id
      
      Project
        .find({ $or: [ { creator: loggedUser }, { worker: loggedUser } ] })
        .exec()
        .then((projects, err) => {
          if (err) {
              console.log(err)
              return res.json({success: false, errorMessage: 'Something went wrong. Try to login again.'})
          }
          return res.json({success: true, projects})
      })
      .catch((error) => {
          return res.json({ success: false, errorMessage: '404 Page Not Found' })
        })
  },
  details: (req, res) => {
    let projectId = req.params.id
    let populateQuery = [{path:'creator'}, {path:'worker'}]
    
    Project.findById(projectId)
    .populate(populateQuery)
    .then(project => {
        //res.render('projects/details', {project: project})  
        return res.json({ success: true, project })
    })
    .catch((error) => {
        console.log('not found')
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  edit: (req, res) => {
      let projectId = req.params.id
      let populateQuery = [{path:'creator'}, {path:'worker'}]
      
      /*if (!auth.isAssignedOrCreator(req, res, projectId)) {
          let returnUrl = `/projects/edit/${projectId}`
            req.session.returnUrl = returnUrl

            res.redirect('/users/login')
            return
      }*/
      
      Project.findById(projectId)
      .populate(populateQuery)
      .then(project => {
          User.findOne({email: project.worker.email})
          .exec((err, foundWorker) => {
              if (err) console.log(err)
              
              User.find({ email: { $nin: foundWorker.email} })
              .exec((err, users) => {
                  if (err) console.log(err)
                  
                  /*res.render('projects/edit', {
                      foundWorker: foundWorker,
                      users: users,
                      project: project 
                  })*/
                  return res.json({ success: true, foundWorker, users, project })
              })
          })
      })
      .catch((error) => {
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  commentGet: (req, res) => {
    let projectId = req.params.id
    let populateQuery = [{path:'creator'}, {path:'worker'}]
    
    Project.findById(projectId)
    .populate('comments.email')
    .populate(populateQuery)
    .then((project, err) => {
        if (err) {
            console.log('not found')
            return res.json({ success: false, errorMessage: '404 Page Not Found' })
        }
        
        User
        .find({})
        .exec((err, users) => {
            if (err) {
                console.log(err)
                return res.json({ success: false, errorMessage: 'Something went wrong. Try to login again.' })
            }

            /*res.render('projects/comments', {
                users: users,
                project: project
            })*/
            return res.json({ success: true, users, project})
        })
    })
    .catch((error) => {
        console.log('not found')
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  commentPost: (req, res) => {
      //req.body.project = {id: req.params.id}
      let commentArgs = req.body
      let projectId = req.params.id
      let currentUserEmail = commentArgs.commentAuthor
      let commentContent = commentArgs.content
      
      
      /*Project.update({ _id: projectId },
        { $push: 
            { comments: 
                {
                    email: currentUserEmail,
                    content: commentContent,
                    commentDate: new Date()
                } 
            } 
        })*/

        Project.findByIdAndUpdate(projectId, {
            $push: {'comments':
                      {   email: currentUserEmail,
                          content: commentContent,
                          commentDate: new Date()
                      }
                  },
            new: true
          })
          .exec()

          Project.findById(projectId)
          .then(foundOne => {
            return res.json({ success: true, foundOne })
          })
  },
  update: (req, res) => {
    let updatedProject = req.body
    let projectID = req.params.id
    let populateQuery = [{path:'createdProjects'}, {path:'projects'}]

    Project.findById(projectID)
    .then(foundProject => {
        User.findOneAndUpdate({_id: foundProject.worker}, {
            $pull: {
                projects: projectID
            },
            new: true
        })
        .exec()
    })
    
    
    User.findOne({email: updatedProject.selectWorker})
    .populate(populateQuery)
    .then(existingUser => {

        //update the project
        Project.findByIdAndUpdate(projectID, {
            $set: {
                title: updatedProject.title,
                worker: existingUser._id,
                status: updatedProject.status,
                updatedDate: new Date()
            },
            new: true
        })
        .exec()
        .then(project => {
            //update the Users table with the id of the worker
            let index = existingUser.projects.indexOf(project._id)
            if (index < 0) {
                existingUser.projects.push(project._id)
                existingUser.save(err => {
                    if (err) {
                        return res.json({success: false, errorMessage: 'Something went wrong. Please try to create the poject again.'})
                        //res.redirect('/', {errorMessage: 'Something went wrong. Please try to create the poject again.'})
                    }
                })
            }
            console.log('Successfuly updated')
            return res.json({success: true})
            //res.redirect('/')
        })
    })
  },
  deleteGet: (req, res) => {
    let projectId = req.params.id
    let populateQuery = [{path:'creator'}, {path:'worker'}]

    if (!auth.isCreatorOrAdmin(req, res, projectId)) {
        let returnUrl = `/projects/delete/${projectId}`
        req.session.returnUrl = returnUrl

        res.redirect('/users/login')
        return
    }
    
    Project.findById(projectId)
    .populate(populateQuery)
    .then(project => {
        res.render('projects/delete', { project: project })
    })
    .catch((error) => {
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  deletePost: (req, res) => {
      let projectId = req.params.id
      let populateQuery = [{path:'creator'}, {path:'worker'}]

      Project.findOneAndRemove({_id: projectId})
        .populate(populateQuery)
        .then(projectToDelete => {
            User.findOneAndUpdate({_id: projectToDelete.worker}, {
            $pull: {
                projects: projectId
            },
            new: true
        })
        .exec()
        
        User.findOneAndUpdate({_id: projectToDelete.creator}, {
            $pull: {
                createdProjects: projectId
            },
            new: true
        })
        .exec()

          return res.json({success: true})
        //res.redirect('/')
    }) 
  },
  commentEditGet: (req, res) => {
    let commentId = req.params.commentId
    let projectId = req.params.projectId

    Project
    .find(
        {_id: projectId},
        {
            comments: { $elemMatch: { _id: commentId } }
        },
        { 'comments.$': 1 }
    )
    .then((commentData, err) => {
        if(err) return res.json({success: false, errorMessage: 'Something went wrong. Please try to create the poject again.'})

        return res.json({success: true, commentData})
    })
    .catch((error) => {
        console.log('not found')
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  commentEditPost: (req, res) => {
    let commentId = req.params.commentId
    let projectId = req.params.projectId
    let commentArgs = req.body
    let commentContent = commentArgs.content
    let currentUserEmail = commentArgs.commentAuthor

    Project.updateOne(
        { _id: projectId, "comments._id": commentId },
        { $set: { "comments.$.content" : commentContent,
                  "comments.$.email" : currentUserEmail,
                  "comments.$.commentDate" : new Date()
                }
        }
     )
    .exec()
    .then((result, err) => {
        if(err) return res.json({success: false, errorMessage: 'Something went wrong. Please try to create the poject again.'})

        return res.json({success: true, result})
    })
    .catch((error) => {
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  },
  commentDelete: (req, res) => {
    let commentId = req.params.commentId
    let projectId = req.params.projectId

    Project.findOneAndUpdate({_id: projectId},
        {
          $pull: {
             "comments": { "_id": commentId }
          }
        },
        { safe: true, multi:true }
    )
    .exec()
    .then((result, err) => {
        if(err) return res.json({success: false, errorMessage: 'Something went wrong. Please try to create the poject again.'})

        return res.json({success: true})
    })
    .catch((error) => {
        return res.json({ success: false, errorMessage: '404 Page Not Found' }) 
    })
  }
}