import mongoose from 'mongoose';
import { DB_URL } from '../config';
mongoose.connect(DB_URL, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database is Connected"))
  .catch((error) => console.log("Not Connected"));