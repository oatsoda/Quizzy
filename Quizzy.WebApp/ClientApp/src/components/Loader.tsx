import React from 'react';
import { Spinner } from 'reactstrap';

export function Loader(props: { isLoading: boolean }) {

    return (
        <div className={`loading ${props.isLoading ? "" : "in"}visible d-flex justify-content-center`} >
            <div className="spinners align-self-center">
                <Spinner color="success" />
                <Spinner color="danger" >Loading</Spinner>
                <Spinner color="warning" />
            </div>
        </div>
    );    
}