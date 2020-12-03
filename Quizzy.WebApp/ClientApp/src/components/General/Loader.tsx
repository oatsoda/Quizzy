import React from 'react';
import { Spinner } from 'reactstrap';

export function Loader(props: { isLoading: boolean }) {
  const { isLoading } = props;

  return (
    <>
      { isLoading &&
        <div className={`loading d-flex justify-content-center`} >
          <div className="spinners align-self-center">
            <Spinner color="success" />
            <Spinner color="danger" >Loading</Spinner>
            <Spinner color="warning" />
          </div>
        </div>
      }
    </>
  );
}