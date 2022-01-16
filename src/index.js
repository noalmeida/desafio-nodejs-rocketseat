const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');
const { header } = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) { 
  const { username } = request.headers;
  const user =  users.find((user)=> user.username === username);
  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }
  request.user = user;
  return next();
}

   


app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const userExist = users.find((user) => user.username === username);
  if (userExist) {
    return response.status(400).json({ error: "Already exist username" });
  }
  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };
  users.push(user);
  return response
    .status(201)
    .json({ message: "User was created success", User: user });

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  
  return response.json({
    message: "Lista de tarefas do usuário",
    ListTask: user.todos,
  });

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user} = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  response.status(201).json({message: "succes todo inclued", todos : user.todos})
  
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    const { title } = request.body;
    const {deadline} = request.body;
    const  { id } = request.params;

    const todo = user.todos.find(todo => todo.id === id);
    if (!todo) {
      response.status(404).json({error : "TODO not exist"});
    } 
    todo.title = title;
    todo.deadline = new Date(deadline);
    response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
     const { user } = request;
     const { id } = request.params;
      const todo = user.todos.find((todo) => todo.id === id);
      todo.done = true;
      response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
   const todoIndex = user.todos.findIndex((todo) => todo.id === id);
   user.todos.splice(todoIndex, 1); 
   
   response.json( { message: "TODO deleted success"})
});

module.exports = app;