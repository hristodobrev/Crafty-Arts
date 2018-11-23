let Project = require('mongoose').model('Project')

module.exports = {
  index: (req, res) => {
      Project
        .find({})
        .exec((err, projects) => {
            if (err) return res.json({ success: false, errorMessage: 'Something went wrong. Try again later.' })
            
            return res.json({ success: true, projects })
            /*res.render('home/index', {
                projects: projects
            })*/
        })
    }
}