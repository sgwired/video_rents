const express = require('express');
const Joi = require('@hapi/joi');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
