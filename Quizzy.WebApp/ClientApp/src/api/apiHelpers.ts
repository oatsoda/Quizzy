import { AxiosResponse } from 'axios';
import { IValidationErrors } from './validationTypes';

export function processResponseAxios<T>(response: AxiosResponse<T>): Promise<ProcessedResponseOf<T>> {

  return new Promise((resolve, reject) => {
    // will resolve or reject depending on status, will pass both "status" and "data" in either case
    let func: any;
    console.log(`response status: ${response.status}`);
    response.status < 400 ? func = resolve : func = reject;
    func({ ok: response.status >= 200 && response.status < 300, status: response.status, data: response.data });
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
      errMsg.push(`${propName}: ${errors}`) // errors is actually Array
  }

  return errMsg.join("; "); 
}

export function getProblemDetails(response: ProcessedResponse) {
  let errors : IValidationErrors = {}
  for (let [propName, propErrors] of Object.entries( response.data.errors)) {
    propName = propName.charAt(0).toLowerCase() + propName.slice(1);
    var pos = propName.indexOf('.');
    if (pos >= 0)
      propName = propName.slice(0, pos+1) + propName.charAt(pos+1).toLowerCase() + propName.slice(pos+2);
    errors[propName] = propErrors as string[];
  }
  return errors; 
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

export function handleError(response: ProcessedResponse, onError: (error: string) => void, onValidationError: (errors: IValidationErrors) => void) {
  if  (response.status === 400) {
    let err = getProblemDetails(response);
    console.log(err);
    onValidationError(err);
  } else {
    onError(`Request failed: ${response.status}`);
  }
}


