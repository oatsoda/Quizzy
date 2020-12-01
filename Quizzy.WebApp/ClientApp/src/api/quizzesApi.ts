import Axios from 'axios'
import { Competition, Participant, ParticipantNew } from './competitionTypes';
import { processResponseAxios, flattenApiError } from './apiHelpers';
import { Quiz, QuizNew } from './quizTypes';

const apiBaseUrl = "api/";

export class QuizzesApi {

  async getCompetition(code: string, onError: (error: string) => void) : Promise<Competition | undefined> {

    const url = `${apiBaseUrl}competitions/${code}`;

    return await Axios.get<Competition>(url, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {
                        if (error.status === 404) {
                            onError("Invalid Code");
                        }
                        else {
                            const errMsg = flattenApiError(error)
                            onError(`Oops, something went wrong [${error.status} - ${errMsg}]`);
                        }
                        return undefined;
                      });
  }

  async putParticipant(code: string, participant: ParticipantNew, onError: (error: string) => void) : Promise<Participant | undefined> {

    const url = `${apiBaseUrl}competitions/${code}/participants/`;

    return await Axios.put<Participant>(url, participant, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        const errMsg = flattenApiError(error);
                        onError(`Oops, something went wrong [${error.status} - ${errMsg}]`);                        
                        return undefined;
                      });
  }


  async postQuiz(participant: QuizNew, onError: (error: string) => void) : Promise<Quiz | undefined> {

    const url = `${apiBaseUrl}quizzes/`;

    return await Axios.post<Quiz>(url, participant, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        const errMsg = flattenApiError(error);
                        onError(`Oops, something went wrong [${error.status} - ${errMsg}]`);                        
                        return undefined;
                      });
  }

}

const quizzesApi = new QuizzesApi();

export default quizzesApi;