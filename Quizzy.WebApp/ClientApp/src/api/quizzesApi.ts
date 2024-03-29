import Axios from 'axios'
import { Competition, CompetitionOnly } from './competitionTypes';
import { ParticipantNew, Participant, ParticipantResult } from './participantTypes';
import { processResponseAxios, flattenApiError, handleError } from './apiHelpers';
import { IValidationErrors } from "./validationTypes";
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
                            onError(`Oops, something went wrong [${errMsg}]`);
                        }
                        return undefined;
                      });
  }

  async putParticipant(code: string, participant: ParticipantNew, onError: (error: string) => void, onValidationError: (errors: IValidationErrors) => void) : Promise<Participant | undefined> {

    const url = `${apiBaseUrl}competitions/${code}/participants/`;

    return await Axios.put<Participant>(url, participant, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        handleError(error, onError, onValidationError);                       
                        return undefined;
                      });
  }

  async getParticipantResults(code: string, participantId: string, onError: (error: string) => void) : Promise<ParticipantResult | undefined> {

    const url = `${apiBaseUrl}competitions/${code}/participants/${participantId}/results/`;

    return await Axios.get<ParticipantResult>(url, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        const errMsg = flattenApiError(error);
                        onError(`Oops, something went wrong [${errMsg}]`);                        
                        return undefined;
                      });
  }

  async postQuiz(quiz: QuizNew, onError: (error: string) => void, onValidationError: (errors: IValidationErrors) => void) : Promise<Quiz | undefined> {

    const url = `${apiBaseUrl}quizzes/`;

    return await Axios.post<Quiz>(url, quiz, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        handleError(error, onError, onValidationError);                         
                        return undefined;
                      });
  }

  async putQuiz(id: string, quiz: QuizNew, onError: (error: string) => void, onValidationError: (errors: IValidationErrors) => void) : Promise<Quiz | undefined> {

    const url = `${apiBaseUrl}quizzes/${id}`;

    return await Axios.put<Quiz>(url, quiz, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        handleError(error, onError, onValidationError);                         
                        return undefined;
                      });
  }

  async getQuiz(id: string, onError: (error: string) => void) : Promise<Quiz | undefined> {

    const url = `${apiBaseUrl}quizzes/${id}`;

    return await Axios.get<Quiz>(url, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {
                        if (error.status === 404) {
                            onError("Quiz does not exist.");
                        }
                        else {
                            const errMsg = flattenApiError(error)
                            onError(`Oops, something went wrong [${errMsg}]`);
                        }
                        return undefined;
                      });
  }

  async postQuizCompetition(quizId: string, onError: (error: string) => void) : Promise<CompetitionOnly | undefined> {

    const url = `${apiBaseUrl}quizzes/${quizId}/competitions/`;

    return await Axios.post<CompetitionOnly>(url, {}, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        const errMsg = flattenApiError(error);
                        onError(`Oops, something went wrong [${errMsg}]`);                        
                        return undefined;
                      });
  }

  async getQuizCompetition(quizId: string, code: string, onError: (error: string) => void) : Promise<CompetitionOnly | undefined> {

    const url = `${apiBaseUrl}quizzes/${quizId}/competitions/${code}/`;

    return await Axios.get<CompetitionOnly>(url, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return response.data;
                      }) 
                      .catch(error => {                        
                        if (error.status === 404) {
                          onError("Quiz does not exist.");
                        }
                        else {
                            const errMsg = flattenApiError(error)
                            onError(`Oops, something went wrong [${errMsg}]`);
                        }                        
                        return undefined;
                      });
  }

  async postQuizCompetitionStatusChange(quizId: string, code: string, status: "open" | "start", onError: (error: string) => void) : Promise<boolean> {

    const url = `${apiBaseUrl}quizzes/${quizId}/competitions/${code}/${status}`;

    return await Axios.post<string>(url, {}, { validateStatus: _ => true })
                      .then(processResponseAxios)
                      .then(response => {
                        // repsonses with status < 400 get resolved
                        return true;
                      })
                      .catch(error => {                        
                        const errMsg = flattenApiError(error);
                        onError(`Oops, something went wrong [${errMsg}]`);                        
                        return false;
                      });
  }
}

const quizzesApi = new QuizzesApi();

export default quizzesApi;