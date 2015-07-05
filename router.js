var routes = require('i40')(),
    fs = require('fs'),
    db = require('monk')('localhost/projects'),
    qs = require('qs'),
    mime = require('mime'),
    view = require('./view')
    movies = db.get('movies')

routes.addRoute('/', function (req, res, url) {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./home.html', function (err, file) {
      if (err) {
        res.setHeader('Content-Type', 'text/html');
        res.write('404')
      }
      res.end(file);
  })
})
routes.addRoute('/movies', function(req, res, url){
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html')
    movies.find({}, function (err, docs) {
      if (err) throw err
      var template = view.render('/movies/index', {movies:docs})
      res.end(template)
    })
  }
  if(req.method === 'POST'){
    var data = ''
    req.on('data', function(chunk){
      data += chunk
    })
    req.on('end',function(){
        var movie = qs.parse(data)
        movies.insert(movie, function(err, doc){
          if(err) throw err
          res.writeHead(302,{'Location': '/movies'})
          res.end()
        })
    })
  }
})

routes.addRoute('/movies/new', function(req, res, url){
  res.setHeader('Content-Type', 'text/html')
  if(req.method === 'GET'){
    movies.find({}, function (err, docs) {
      if (err) throw err
      var template = view.render('/movies/new', {movies:docs})
      res.end(template)
    })
  }
  if(req.method === 'POST'){
    var data = ''
    req.on('data', function(chunk){
      data += chunk
    })
    req.on('end',function(){
        var movie = qs.parse(data)
        movies.insert(movie, function(err, doc){
          if(err) throw err
          res.writeHead(302,{'Location': '/movies'})
          res.end()
        })
    })
  }
})

routes.addRoute('/movies/:id', function(req, res, url){
  if(req.method === 'GET'){
    res.setHeader('Content-Type', 'text/html')
    movies.findOne({_id: url.params.id}, function(err, docs){
      if (err) throw err
      var template = view.render('/movies/show', {movies:docs})
      res.end(template)
    })
  }
})
routes.addRoute('/movies/:id/delete', function(req, res, url){
  if(req.method === 'POST'){
    res.setHeader('Content-Type', 'text/html')
    movies.remove({_id: url.params.id}, function(err, docs){
      if (err) throw err
      res.writeHead(302,{'Location': '/movies'})
      res.end()
    })
  }
})
routes.addRoute('/movies/:id/edit', function(req, res, url){
  if(req.method === 'GET'){
      movies.findOne({_id: url.params.id}, function(err, docs){
        if(err) throw err
        var template = view.render('/movies/edit', docs)
        res.end(template)
    })
  }
})
routes.addRoute('/movies/:id/update', function(req, res, url){
  if(req.method === 'POST'){
    var data = ''
    req.on('data', function(chunk){
      data += chunk
    })
    req.on('end',function(){
        var movie = qs.parse(data)
        movies.update({_id: url.params.id}, movie, function(err, movie){
          if (err) throw err
          res.writeHead(302,{'Location': '/movies'})
          res.end()
        })
      })
    }
  })
routes.addRoute('/public/*', function(req, res, url){
  res.setHeader('Content-Type', mime.lookup(req.url))
  fs.readFile('.' + req.url, function(err, file){
    if(err){
      res.setHeader('Content-Type', 'text/html')
      res.end('404')
    }
    res.end(file)
  })
})

module.exports = routes
