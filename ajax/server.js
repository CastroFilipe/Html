//arquivo que irá prover os dados estáticos e alguns serviços necessários.
//simulando um servidor

const bodyParser = require('body-parser')//usado para converter os dados vindos do navegador para o formato Json
const express = require('express')//fremawork web
const app = express()//instanciando o express


//middlewares. Ou funções que serão aplicadas quando as requisições chegarem

app.use(express.static('.'))//o servidor irá prover arquivos estaticos(.html, .js, .css etc) a partir do diretorio atual (raiz)


//Faz o bodyparser em todas as requisições que vierem de um formulário, Transformando em um objeto
app.use(bodyParser.urlencoded({extended: true}))

//Se no body da requisição vier um json, esse será o middleware aplicado e não o anterior
app.use(bodyParser.json())

//requisições get para a url /teste. Retornará um Ok
app.get('/teste', (req, res) => res.send('ok'))

//executando o servidor.
app.listen(8080, () => console.log('executando o servidor...'))




