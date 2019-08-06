const logger = require('./logger');
const authenticate = require('./authenticate');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('@hapi/joi');
const app = express();
const port = process.env.PORT || 3000;

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`); // dev if NODE_ENV not defined


app.use(express.json());
app.use(express.urlencoded({extended: true})); // key=vale&key=value and poplates req.body
app.use(express.static('public'));
app.use(helmet());
// app.use(morgan('tiny'));
app.use(logger);
app.use(authenticate);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled....');
}


const genres = [
    {id: 1, name: "first genre"},
    {id: 2, name: "second genre"},
    {id: 3, name: "third genre"}
]


app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre)
        return res.status(404).send("The genre with the given ID was not found");
        res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
      return res
        .status(404)
        .send("The genre with the given ID was not found")
        .res.send(genre);
  
    // validate if invalid, return 400 - bad request
   
    // if (error) res.sendStatus(400).send(result.error.details);
  
    //update genre and return the updated genre
    genre.name = req.body.name;
    res.send(genre);
});


app.post("/api/genres", (req, res) => {
    const { error } = validateGenre(req.body);
 
    if (error) return res.status(400).send(error.details[0].message);

     const genre = {
      id: genres.length + 1,
      name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
  });


app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
      return res
        .status(404)
        .send("The genre with the given ID was not found")
        .res.send(genre);
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);   
});

function validateGenre(genre) {
    const schema = Joi.object().keys({
        name: Joi.string()
            .min(3)
            .required()
    });
    return Joi.validate(genre, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}...`));
