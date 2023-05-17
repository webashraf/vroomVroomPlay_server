const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;


//------------Middel were -----------//
//------------Middel were -----------//
app.use(cors());
app.use(express.json());
//------------------------------------//
//-----------------------------------//


app.get("/", (req, res) => {
    res.send("<h1>TOY MARKETPLACE IS RUNING</h1>");
  });
  
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });