import * as express from "express";
import * as path from "path";
import { prisma } from "./prisma";
import { authController } from "./core/controllers/authcontroller";
import { WEHPError } from "./core/errors/WEHPError";
import { authMiddleware } from "./core/middelware/auth";
import { toUserDTO } from "./core/dtos/dto";
import { streepjeController } from "./core/controllers/steepjescontroller";

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

const authRouter = express.Router()
const publicRouter = express.Router()

authRouter.use(authMiddleware)





app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');


publicRouter.post('/', (req, res) => {
  res.json({"msg": "Hello world"});
});

publicRouter.post('/signup', (req, res, next) => {
  authController.createAccount(req.body)
  .then((createdUser) => res.json(createdUser))
  .catch((err) => next(err))
});
publicRouter.post('/login', (req, res, next) => {
  authController.login(req.body)
  .then((token) => res.json(token))
  .catch((err) => next(err))
});
authRouter.get('/me', [authMiddleware],(req: express.Request, res, next) => {
  try {
    const user = req.user;
    res.json(toUserDTO(user))
  } catch (error) {
    next(error)
  }

});

authRouter.post('/streepjes', [authMiddleware], async (req: express.Request, res, next) => {
  try {
    const createdStreepje = await streepjeController.createStreepje(req.body);
    res.json(createdStreepje);
  } catch (error) {
    next(error);
  }
});
authRouter.get('/streepjes/:userId', [authMiddleware], async (req: express.Request, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const streepjes = await streepjeController.getStreepjesByUserId(userId);
    res.json(streepjes);
  } catch (error) {
    next(error);
  }
});
authRouter.delete('/streepjes/:streepjeId', [authMiddleware], async (req: express.Request, res, next) => {
  try {
    const streepjeId = parseInt(req.params.streepjeId, 10);
    
    const deleted = await streepjeController.deleteStreepje(streepjeId);
    
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});
authRouter.put('/streepjes/:streepjeId', [authMiddleware], async (req: express.Request, res, next) => {
  try {
    const streepjeId = parseInt(req.params.streepjeId, 10);

    const updatedStreepje = await streepjeController.updateStreepje(streepjeId, req.body);
    
    res.json(updatedStreepje);
  } catch (error) {
    next(error);
  }
});


app.use('/api/', publicRouter)
app.use('/api/', authRouter)

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

