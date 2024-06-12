import * as express from "express";
import * as path from "path";
import { prisma } from "./prisma";
import { authController } from "./core/controllers/authcontroller";
import { WEHPError } from "./core/errors/WEHPError";
import { authMiddleware } from "./core/middelware/auth";
import { toUserDTO } from "./core/dtos/dto";

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

app.post('/api/signup', (req, res, next) => {
  authController.createAccount(req.body)
  .then((createdUser) => res.json(createdUser))
  .catch((err) => next(err))
});
app.post('/api/login', (req, res, next) => {
  authController.login(req.body)
  .then((token) => res.json(token))
  .catch((err) => next(err))
});
app.get('/api/me', [authMiddleware],(req: express.Request, res, next) => {
  try {
    const user = req.user;
    res.json(toUserDTO(user))
  } catch (error) {
    next(error)
  }

});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {  
  if (error?.statusCode) {
    console.log(error);
    
    const responseData = error.data ? { error: error.message, data: error.data } : { error: error.message };
    res.status(error.statusCode).json(responseData);  
  } else {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
