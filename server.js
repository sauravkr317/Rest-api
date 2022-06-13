import express from 'express';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import './db/db_conn';
import path from 'path';
import { APP_PORT } from './config';


global.rootDir = path.resolve(__dirname);
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);
app.use('/uploads', express.static('uploads'));
// require("./routes/route")(app);

app.listen(APP_PORT, () =>{
    console.log(`server is running on ${APP_PORT} port`);
})
