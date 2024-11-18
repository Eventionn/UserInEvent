import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import routes from "./routes/routes.js";
import swaggerUi from "swagger-ui-express"; // Adicione esta linha

const app = express()
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use("/api", routes);
const prisma = new PrismaClient();

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('docs/swagger.json')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json('hello there')
})

app.get('/userinevents', async (req, res) => {
  try {
    const userinevents = await prisma.userinevent.findMany();
    res.json(userinevents);
  } catch (err) {
    console.log(err);
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
