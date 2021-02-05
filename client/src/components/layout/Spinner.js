import React, { Fragment } from 'react';
import spinner from './spinner.gif';

function Spinner() {
    return (
        <Fragment>
            <img src={spinner} style={{width: '200px', display: 'block', margin: 'auto'}} alt='' />
        </Fragment>
    )
}

export default Spinner
