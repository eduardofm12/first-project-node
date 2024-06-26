const express = require("express");
const app = express();
const port = 3000;
const uuid = require('uuid');

// Adicione o middleware express.json() para analisar o corpo da requisição como JSON
app.use(express.json());

const users = []

const checkUserId = (request, response, next) => {

    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0) {

        return response.status(404).json({ Error: "User not found" })
    }
    request.userIndex =   index
    request.userId = id
    next()
}



app.get('/users', (request, response) => {
    return response.json(users);
});

app.post('/users', (request, response) => {
    const { name, age } = request.body;
    const newUser = { id: uuid.v4(), name, age };
    users.push(newUser);
    return response.status(201).json(newUser);
});

app.put('/users/:id',checkUserId, (request, response) => {

    const index = request.userIndex
    const id = request.userId
    
    const { name, age } = request.body

    const updateUser = { id, name, age }



    users[index] = updateUser
    return response.json(updateUser)
});

app.delete('/users/:id', checkUserId,(request, response) => {
    const index = request.userIndex
   
    users.slice(index, 1)

    return response.status(204).json()
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
