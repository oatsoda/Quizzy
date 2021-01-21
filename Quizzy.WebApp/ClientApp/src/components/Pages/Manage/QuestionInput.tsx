import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Button, Col, CustomInput, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import { QuizQuestion } from '../../../api/quizTypes';
import { hasPropError, IValidationErrors } from '../../../api/validationTypes';
import { ParamError } from '../../General/ParamError';


export function QuestionInput(props: { disabled: boolean, validationErrors?: IValidationErrors, questionIndex: number; questions: QuizQuestion[]; setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>; onRemove: (i: number) => void; }) {
  const { disabled, validationErrors, questionIndex, questions, setQuestions, onRemove } = props;
  const [question, setQuestion] = useState(questions[questionIndex]);
  const parentTypeName = "questions";

  useEffect(() => {
    setQuestion(questions[questionIndex]);
  }, [questions, questionIndex]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name as keyof QuizQuestion;

      let val: any = (name === "correctA")
        ? Number(e.target.value)
        : e.target.value;

      let q = {
        ...question,
        [name]: val
      };
      setQuestion(q);

      let qs = questions;
      qs[questionIndex] = q;
      setQuestions(qs);
    },
    [question, questionIndex, questions, setQuestions]
  );

  function answerDisplay(n: number) {
    let a = n === 1
      ? question.a1
      : n === 2
        ? question.a2
        : n === 3
          ? question.a3
          : question.a4;
      
    return `${'ABCD'[n-1]}. ${a}`;
  }

  return (
    <>
      <Row form>
        <Col>
          <FormGroup>
            <Label for="q" className="font-weight-bold">Question {questionIndex + 1}</Label>
            <Input invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].q`)} type="text" name="q" value={question.q} placeholder="Question" onChange={handleInputChange} disabled={disabled} />
            <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].q`} />
          </FormGroup>
        </Col>
      </Row>
      <div className="pl-3 mb-3 border-left">
        <Row form className="mb-1">
          <Col lg={6} className="mb-lg-0 mb-1">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>A</InputGroupText>
              </InputGroupAddon>
              <Input invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].a1`)} type="text" name="a1" value={question.a1} placeholder="Answer A" onChange={handleInputChange} className="A" disabled={disabled} />
              <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].a1`} />
            </InputGroup>
          </Col>
          <Col lg={6}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>B</InputGroupText>
              </InputGroupAddon>
              <Input invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].a2`)} type="text" name="a2" value={question.a2} placeholder="Answer B" onChange={handleInputChange} className="B" disabled={disabled} />
              <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].a2`} />
            </InputGroup>
          </Col>
        </Row>
        <Row form className="mb-1">
          <Col lg={6} className="mb-lg-0 mb-1">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>C</InputGroupText>
              </InputGroupAddon>
              <Input invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].a3`)} type="text" name="a3" value={question.a3} placeholder="Answer C" onChange={handleInputChange} className="C" disabled={disabled} />
              <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].a3`} />
            </InputGroup>
          </Col>
          <Col lg={6}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>D</InputGroupText>
              </InputGroupAddon>
              <Input invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].a4`)} type="text" name="a4" value={question.a4} placeholder="Answer D" onChange={handleInputChange} className="D" disabled={disabled} />
              <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].a4`} />
            </InputGroup>
          </Col>
        </Row>
        <Row form>
          <Col lg={4}>
            <CustomInput invalid={hasPropError(validationErrors, `${parentTypeName}[${questionIndex}].correctA`)} type="select" name="correctA" id="correctA" value={question.correctA} onChange={handleInputChange} disabled={disabled}>
              <option value={0}>Select Correct Answer</option>
              { [1,2,3,4].map(n => <option key={n} value={n}>{answerDisplay(n)}</option>) }
            </CustomInput>
            <ParamError validationErrors={validationErrors} param={`${parentTypeName}[${questionIndex}].correctA`} />
          </Col>
          {questionIndex > 0 &&
            <Col><Button color="link" onClick={() => onRemove(questionIndex)} disabled={disabled}>Delete Question</Button></Col>}
        </Row>
      </div>
    </>
  ); // TODO: Change correct question assignment to use addon inlay radios: https://getbootstrap.com/docs/4.5/components/input-group/#checkboxes-and-radios
}
