import Axios, { AxiosResponse } from 'axios'

const apiBaseUrl = "https://localhost:5001/api/";

export class QuizzesApi {

  async getQuiz(code: string, onError: (error: string) => void) : Promise<Quiz | undefined> {

    const url = `${apiBaseUrl}quizzes/${code}`;

    return await Axios.get<Quiz>(url, { validateStatus: _ => true })
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
}

const quizzesApi = new QuizzesApi();

export default quizzesApi;


export function processResponseAxios<T>(response: AxiosResponse<T>) : Promise<ProcessedResponseOf<T>> {

  return new Promise((resolve, reject) => {
    // will resolve or reject depending on status, will pass both "status" and "data" in either case
    let func : any;
    console.log (`response status: ${response.status}`);
    response.status < 400 ? func = resolve : func = reject;
    func({ ok: response.status >= 200 && response.status < 300, status: response.status, data: response.data});
  });
}

export interface ProcessedResponse {
  ok: boolean, // Whether within 200 range (useful for resolved response which is in 100 or 300)
  status: number;
  data: any
}

export interface ProcessedResponseOf<T> {
  ok: boolean, // Whether within 200 range (useful for resolved response which is in 100 or 300)
  status: number;
  data: T
}

export function getProblemDetailErrors(response: ProcessedResponse) {

  console.log( response.data);

  let errMsg : string[] = []
  for (let [propName, errors] of Object.entries( response.data.errors)) {
    console.log(errors);
    errMsg.push(`${propName}: ${errors}`) // TODO: errors is actually Array
  }

  return errMsg.join("; "); 
}

export function flattenApiError(response: ProcessedResponse) : string {

  // repsonses with status >= 400 get rejected
  if (response.status === 400) {
      let err = getProblemDetailErrors(response);
      return `Bad Request: ${response.status}: ${err}`;
  } else {
      console.log(response);
      return `Request failed: ${response.status}`;
  }        
}

export type Quiz = {
  code: string,
  name: string,
  creatorEmail: string,
  creatorName: string
}