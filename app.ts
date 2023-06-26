import Redis from "redis";
import Express from "express";
import bodyParser from "body-parser";

const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.raw());
const port = 4000;
app.listen(port, () => {
  console.log("server :- ", port);
});
