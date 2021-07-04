import mongoose from 'mongoose'
import {mongo} from '../../config'

mongoose.Promise = global.Promise
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

export default mongoose
