
export interface IValidationErrors {
  [index: string]: string[];
}

export function hasPropError(e: IValidationErrors | undefined, propName: string) : boolean {
  return e && e[propName] ? true : false;
}

export function propFirstError(e: IValidationErrors | undefined, propName: string) : string | undefined {
  return hasPropError(e, propName) ? e![propName][0] : undefined;
}