import React from 'react';
import { FormFeedback } from 'reactstrap';
import { hasPropError, IValidationErrors, propFirstError } from "../../api/validationTypes";


export function ParamError(props: { validationErrors?: IValidationErrors; param: string; }) {
  const { validationErrors, param } = props;
  return (
    <>
      {hasPropError(validationErrors, param) && <FormFeedback>{propFirstError(validationErrors, param)}</FormFeedback>}
    </>
  );
}
