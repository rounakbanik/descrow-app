import './ContractCreation.css';
import { Fragment } from 'react';

const ContractCreation = (props) => {

    return (
        <Fragment>
            {props.currentAccount && <button className='cta-button cnc-button'>
                Create New Contract
            </button>}
        </Fragment>
    )

}

export default ContractCreation;