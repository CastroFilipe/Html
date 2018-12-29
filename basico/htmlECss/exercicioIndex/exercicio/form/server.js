const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//Faz o bodyparser em todas as requisições.
app.use(bodyParser.urlencoded({extended: true}))

app.post('/usuarios', (req, res, next)=>{
    console.log(req.body)
    console.log(typeof req.body)
    res.send('<h1>Parabéns!</h1>')

})

app.post('/usuarios/:id', (req, res, next)=>{
    console.log(req.params.id);
    console.log(req.body)
    console.log(typeof req.body)
    res.send('<h1>Parabéns. Usuário alterado</h1>')

})

app.listen('3003')