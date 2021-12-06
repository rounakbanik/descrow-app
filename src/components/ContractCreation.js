import './ContractCreation.css';
import { Fragment, useState } from 'react';
import { factoryAbi, descrowAbi, factoryAddress } from '../contracts/contractData';
import ContractForm from './ContractForm';
import { ethers } from 'ethers';
import FlashMessage from 'react-flash-message';

const ContractCreation = (props) => {

    const [createForm, setCreateForm] = useState(false);
    const [mineStatus, setMineStatus] = useState(null);

    const showContractForm = () => {
        setCreateForm(true);
        setMineStatus(null);
        console.log(factoryAbi, descrowAbi, factoryAddress);
    }

    const cancelFormHandler = () => {
        setCreateForm(false);
    }

    const formSubmitHandler = async (data) => {
        setCreateForm(false);
        setMineStatus('mining');

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);

        let txn;

        try {
            const formattedPrice = ethers.utils.parseEther(data.price);
            txn = await factoryContract.createContract(data.buyer, data.seller, formattedPrice);
            await txn.wait();
            setMineStatus('success');

        } catch (err) {
            console.log(err);
            setMineStatus('error');
        }
    }

    return (
        <Fragment>
            {props.currentAccount && !createForm && mineStatus !== 'mining' &&
                <button className='cta-button cnc-button' onClick={showContractForm}>
                    Create New Contract
                </button>}
            {props.currentAccount && createForm && !mineStatus &&
                <ContractForm onCancel={cancelFormHandler}
                    onFormSubmit={formSubmitHandler} />}
            {!createForm && <div>
                {mineStatus === 'success' && <FlashMessage duration={2000}>
                    <div className={`form-submission ${mineStatus}`}>
                        <p>Contract successfully created!</p>
                    </div>
                </FlashMessage>}
                {mineStatus === 'mining' &&
                    <div className={`form-submission ${mineStatus}`}>
                        <p>
                            <i className="fa fa-spinner fa-spin"></i>
                            &nbsp;Transaction is mining
                        </p>
                    </div>}
                {mineStatus === 'error' && <FlashMessage duration={2000}>
                    <div className={`form-submission ${mineStatus}`}>
                        <p>Transaction failed. Please try again.</p>
                    </div>
                </FlashMessage>}
            </div>}

        </Fragment>
    )

}

export default ContractCreation;