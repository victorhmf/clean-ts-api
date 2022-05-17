import { AddSurveyRepository } from '../../../../data/use-cases/add-survey/db-add-survey-protocols'
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
