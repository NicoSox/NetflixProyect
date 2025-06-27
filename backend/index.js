const express = require('express');

const app=express();

app.use(express.json())

app.get("/",(req,res)=>{
  res.send ("Bienvenido a mi API")
})

app.listen(5000,(err)=>{
  if (err) throw err
  console.log("Servidor corriendo en el puerto 5000")
})
