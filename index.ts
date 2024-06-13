import express from 'express';
import * as path from "path";
import { prisma } from "./prisma";
import { authController } from "./core/controllers/authcontroller";
import { WEHPError } from "./core/errors/WEHPError";
import { authMiddleware, wehpMiddleware } from "./core/middelware/auth";
import { toUserDTO } from "./core/dtos/dto";
import { streepjeController } from "./core/controllers/steepjescontroller";
import 'dotenv/config'
import { boolean } from 'boolean';
import { categoryController } from './core/controllers/categorycontroller';

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

const authRouter = express.Router()
const publicRouter = express.Router()
const wehpRouter = express.Router()

authRouter.use(authMiddleware)
wehpRouter.use([authMiddleware, wehpMiddleware])

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');


publicRouter.post('/', (req, res) => {
  res.json({"msg": "Hello world"});
});

publicRouter.post('/signup', (req, res, next) => {

  if(!boolean(process.env.SIGN_UP_ENABLED)){
    next(new WEHPError(403, 'Sign up is disabled'))
  }


  authController.createAccount(req.body)
  .then((createdUser) => res.json(createdUser))
  .catch((err) => next(err))
});
publicRouter.post('/login', (req, res, next) => {
  authController.login(req.body)
  .then((token) => res.json(token))
  .catch((err) => next(err))
});
authRouter.get('/me',(req: express.Request, res, next) => {
  try {
    const user = req.user;
    res.json(toUserDTO(user))
  } catch (error) {
    next(error)
  }

});

wehpRouter.post('/streepjes', async (req: express.Request, res, next) => {
  try {
    const createdStreepje = await streepjeController.createStreepje(req.body);
    res.json(createdStreepje);
  } catch (error) {
    next(error);
  }
});
authRouter.get('/streepjes/:userId', async (req: express.Request, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const streepjes = await streepjeController.getStreepjesByUserId(userId);
    res.json(streepjes);
  } catch (error) {
    next(error);
  }
});
wehpRouter.delete('/streepjes/:streepjeId', async (req: express.Request, res, next) => {
  try {
    const streepjeId = parseInt(req.params.streepjeId, 10);
    
    const deleted = await streepjeController.deleteStreepje(streepjeId);
    
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});
wehpRouter.put('/streepjes/:streepjeId', async (req: express.Request, res, next) => {
  try {
    const streepjeId = parseInt(req.params.streepjeId, 10);

    const updatedStreepje = await streepjeController.updateStreepje(streepjeId, req.body);
    
    res.json(updatedStreepje);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/categories/:categoryId', async (req: express.Request, res, next) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const category = await categoryController.getCategoryById(categoryId);
    res.json(category);
  } catch (error) {
    next(error);
  }
});

authRouter.get('/categories', async (req: express.Request, res, next) => {
  try {
    const categories = await categoryController.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});
// Category routes
wehpRouter.post('/categories', async (req: express.Request, res, next) => {
  try {
    const createdCategory = await categoryController.createCategory(req.body);
    res.json(createdCategory);
  } catch (error) {
    next(error);
  }
});

wehpRouter.put('/categories/:categoryId', async (req: express.Request, res, next) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const updatedCategory = await categoryController.updateCategory(categoryId, req.body);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

wehpRouter.delete('/categories/:categoryId', async (req: express.Request, res, next) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const deletedCategory = await categoryController.deleteCategory(categoryId);
    res.json(deletedCategory);
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

