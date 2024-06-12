import * as express from "express";
import * as path from "path";
import { prisma } from "./prisma";
import { wehpController } from "./core/controllers/wehpcontroller";
import { WEHPError } from "./core/errors/WEHPError";

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.get('/api/signup', (req, res, next) => {
  wehpController.createAccount(req.body)
  .then((createdUser) => res.json(createdUser))
  .catch((err) => next(err))
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {  
  if (error?.statusCode) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
