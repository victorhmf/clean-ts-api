import app from './config/app'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

(async () => {
  try {
    await MongoHelper.connect(env.mongoUrl)
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  } catch (error) {
    console.error(error)
  }
})()
