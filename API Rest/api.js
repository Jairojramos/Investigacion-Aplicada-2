const express = require('express');
const parser = require('body-parser');
const puerto = 8080;

var api = express();
api.use(parser.json());

api.listen(puerto,() => console.log('Servidor escuchando en puerto ' + puerto));

var indice = 0;
var mapaNotas = new Map();

const mensajeErroneo = {mensaje:"Petición no válida"};
const mensajeCorrecto = {mensaje:"Petición procesada correctamente"};
const mensajeNoEncontrado = {mensaje:"Elemento no encontrado"};

api.get('/api/notas',(req,res)=> {
  var resultado = getNotas();
  res.send(resultado);
});

api.post('/api/notas',(req,res)=>{
  if (!validarBody(req.body.nota)){
    res.status(400).send(mensajeErroneo);
  }
  guardarNota(req.body.nota);
  res.send(mensajeCorrecto);
});

api.put('/api/notas/:id',(req,res)=>{
  if (!validarBody(req.body.nota)){
    res.status(400).send(mensajeErroneo);
  }
  else if (!validarId(req.params.id)){
    res.status(404).send(mensajeNoEncontrado);
  }
  else{
    actualizarNota( req.params.id ,req.body.nota);
    res.send(mensajeCorrecto);
  }
});

api.delete('/api/notas/:id',(req,res)=>{
  if (!validarId(req.params.id)){
    res.status(404).send(mensajeNoEncontrado);
  }
  else{
    eliminarNota(req.params.id);
    res.send(mensajeCorrecto);
  }
});

function getNotas(){
  var listaResultado = [];
  Object.keys(mapaNotas).forEach((key)=>{
    listaResultado.push({id:key,nota:mapaNotas[key]});
  });
  return listaResultado;
}

function guardarNota(nota){
  mapaNotas[indice] = nota;
  indice++;
}

function actualizarNota(clave,nota){
  mapaNotas[clave] = nota;
}

function eliminarNota(clave){
  delete mapaNotas[clave];
}

function validarBody (nota){
  return nota != null;
}

function validarId (id){
  return id && mapaNotas[id];
}
