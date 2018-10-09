const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');
app.use(bodyParser.json());
app.set('view engine','hbs');

// app.get('/', (req,res)=>res.send('Hello World'));
app.post('/my-post-route',(req,res)=>res.send('Listen to post request'));

app.get('/city/:cityname',function(req,res){
  res.send(req.params.cityname)
})

app.get('/user/:username/photo-id/:id', function(req,res){
  res.send(req.params.username + req.params.id)
})

app.get('/',function(req,res){
  res.json({colour:req.query.colour,size:req.query.size})
})

app.get('/trialnerror', (req,res) => {
  try{
    const hello=hello();
    res.json(hello);
  } catch(error){
    res.status(500).json(error);
  }
})


app.post('/receive-json',(req,res) => {
  res.json(req.body);
})

app.post('/hello',(req,res) => {
  try{
      const hello={today:"tuesday"}

      function tomorrow(){
        return 1+1;
      }

      const result=tomorrow()

      const combined=Object.assign({},hello,{number:result})

      res.json(result + result)

  } catch (error){
    res.status(500).json(error);
  }
})

app.post('/handlehtml', (req,res) => {
  res.render('index', {
	"title":"hello",
	"heading":"you",
	"wording":"<ul><li>hello again</li></ul>"
});
})


app.get('/movie/page/:pagination', (req,res) => {
  return fetch(`http://www.omdbapi.com/?s=${req.query.s}&apikey=d2807699&page=${req.params.pagination}`)
  .then(response => response.json())
  .then(json => res.json(json))
  .catch(error => res.status(500).json({error:'failed to fetch movie details from api'}))
})

app.get('/average/page/:pagination',(req,res) => {
  return fetch(`http://www.omdbapi.com/?s=${req.query.s}&apikey=d2807699&page=${req.params.pagination}`)
  .then(response => response.json())
  .then(json => {
    const results=json.Search.map(obj => Number(obj.Year)).filter(year => !isNaN(year))

    const average = results.reduce((acc, item) => acc+item,0)/results.length;

    res.json(average)})
  .catch(error => res.status(500).json({error:'failed to fetch movie details from api'}))
})

app.get('/movie/:moviename/details',(req,res) => {
  return fetch(`http://www.omdbapi.com/?t=${req.params.moviename}&apikey=d2807699&plot=full`)
  .then(response => response.json())
  .then(json => {
    const movieTitle = req.params.moviename;
    const movieDetails = json.Plot;

    res.render("movieDetails", {
      "title": req.params.moviename,

      "details": movieDetails
    })

    })
  .catch(error => res.status(500).json({error:'failed to fetch movie details from api'}))
})

app.get('/sorted-movies',(req,res) => {
  return fetch(`http://www.omdbapi.com/?s=${req.query.s}&apikey=d2807699`)
  .then(response => response.json())
  .then(json => {
    const output = json.Search.sort((a,b) => Number(a.Year) - Number(b.Year))

    res.json(output)
    })
  .catch(error => res.status(500).json({error:'failed to fetch movie details from api'}))
})


app.listen(8080,()=>console.log('listen on port 8080'));
