const homeController = require('./controllers/home')
const userController = require('./controllers/user')
const projectController = require('./controllers/project')
const auth = require('./helpFunctions/authentication')

module.exports = (app) => {

  app.get('/', homeController.index)

  //registration
  app.get('/users/register', userController.registerGet)
  app.post('/users/register', userController.registerPost)

 //login / logout
  app.get('/users/login', userController.loginPost)
  app.post('/users/login', userController.loginPost)
  app.get('/users/logout', userController.logout)

  //user profile
  app.get('/users/profile/:id', userController.userProfile)
  app.get('/users/:id', userController.userCheck)
  app.post('/users/profile/:id', userController.imgupload)

  //projects
  //app.get('/projects/create', auth.isTeamLeader(true), projectController.createGet)
  app.get('/projects/create', projectController.createGet)
  app.post('/projects/create', projectController.createPost)

  app.get('/projects/ownProjects/:id', projectController.ownProjectsGet)
  //app.get('/projects/details/:id', auth.isAuthenticated, projectController.details)
  app.get('/projects/details/:id', projectController.details)

  app.get('/projects/edit/:id', projectController.edit)
  app.put('/projects/edit/:id', projectController.update)

  //app.get('/projects/comments/:id', auth.isAuthenticated, projectController.commentGet)
  app.get('/projects/comments/:id', projectController.commentGet)
  app.post('/projects/comments/:id', projectController.commentPost)
  app.get('/projects/comments/:projectId/editComment/:commentId', projectController.commentEditGet)
  app.put('/projects/comments/:projectId/editComment/:commentId', projectController.commentEditPost)
  app.put('/projects/comments/:projectId/deleteComment/:commentId', projectController.commentDelete)
  
  app.get('/projects/delete/:id', projectController.deleteGet)
  app.delete('/projects/delete/:id', projectController.deletePost)


  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}