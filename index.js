// const notes = require('./notes');

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
morgan.token('body', function (req, res) { 
    const bodyJson = JSON.stringify(req.body);
    return bodyJson; 
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        id: 1,
        name: "HTML is easy",
        number: "2019-05-30T17:30:31.098Z"
    },
    {
        id: 2,
        name: "Browser can execute only Javascript",
        number: "2019-05-30T18:39:34.091Z"
    },
    {
        id: 3,
        name: "GET and POST are the most important methods of HTTP protocol",
        number: "2019-05-30T19:20:14.298Z"
    }
];


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    
});

app.get('/info', (request, response) => {

    const infoPhonebook = `<h2>Phonebook has info for ${persons.length} people</h2><br />
        <p>${new Date()}`;
    response.send(infoPhonebook);
    
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
});

const generateId = () => {
    const randomRange = 10000;
    const randomId = Math.floor(Math.random() * randomRange);
    return randomId;
};

const checkPersonName = (name) => persons.find(person => person.name === name);
  
app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    };

    if (checkPersonName(body.name)) {
        return response.status(422).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
        name: body.name,
        number: body.number,
        // date: new Date(),
        id: generateId(),
    };
  
    persons = persons.concat(person);
  
    response.json(person);
});
  
  
  
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  
