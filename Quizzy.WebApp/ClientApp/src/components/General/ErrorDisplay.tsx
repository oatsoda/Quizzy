import React from 'react';
import { Alert } from 'reactstrap';

export function ErrorDisplay(props: { errorMessage: string | undefined }) {

    return (
        <>
        { props.errorMessage && <Alert color="danger">{props.errorMessage}</Alert> }
        </>
    );

}