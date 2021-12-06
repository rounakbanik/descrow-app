import './Contract.css';
import { MUMBAI as NETWORK } from '../data/networks';
import Party from './Party';
import { descrowAbi } from '../contracts/contractData';
import { ethers } from 'ethers';
import { Fragment, useEffect, useState } from 'react';
import FlashMessage from 'react-flash-message';

const Contract = (props) => {

    const [contractState, setContractState] = useState(null);
    const [mineStatus, setMineStatus] = useState(null);

    const isBuyer = contractState ?
        props.currentAccount.toLowerCase() === contractState.buyer.toLowerCase() : null;
    const isLocked = contractState ?
        contractState.buyerStake && contractState.sellerStake : null;
    const noCancel = contractState ?
        !contractState.buyerCancel && !contractState.sellerCancel : null;


    const getStatus = () => {
        if (contractState.active && isLocked) return 'Active';
        else if (contractState.active && !isLocked) return 'Unlocked';
        else if (contractState.cancelled) return 'Cancelled';
        return 'Completed';
    }

    const isStaked = () => {
        if (isBuyer && contractState.buyerStake) return true;
        if (!isBuyer && contractState.sellerStake) return true;
        return false;
    }

    const isCancelled = () => {
        if (isBuyer && contractState.buyerCancel) return true;
        if (!isBuyer && contractState.sellerCancel) return true;
        return false;
    }

    const btnConfirm = contractState && isBuyer && isLocked && noCancel;
    const btnStake = contractState && !isLocked && !isStaked();
    const btnRevokeStake = contractState && !isLocked && isStaked();
    const btnCancel = contractState && isLocked && !isCancelled();
    const btnRevokeCancel = contractState && isLocked && isCancelled();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const descrowContract = new ethers.Contract(props.contractAddress, descrowAbi, signer);

    const stake = async () => {
        setMineStatus('mining')
        let txn;
        try {
            let stake = Number(contractState.price);
            if (isBuyer) stake = stake * 2;
            const formattedPrice = ethers.utils.parseEther(String(stake));
            txn = await descrowContract.stake({ value: formattedPrice });
            await txn.wait();
            setMineStatus('success')

        } catch (err) {
            setMineStatus('error')
            console.log(err)
        }
    }

    const withdrawStake = async () => {
        setMineStatus('mining')
        let txn;
        try {
            txn = await descrowContract.revokeStake();
            await txn.wait();
            setMineStatus('success')

        } catch (err) {
            setMineStatus('error')
            console.log(err)
        }
    }

    const cancel = async () => {
        setMineStatus('mining')
        let txn;

        try {
            txn = await descrowContract.cancel();
            await txn.wait();
            setMineStatus('success')

        } catch (err) {
            setMineStatus('error')
            console.log(err);
        }
    }

    const revokeCancel = async () => {
        setMineStatus('mining')
        let txn;

        try {
            txn = await descrowContract.revokeCancellation();
            await txn.wait();
            setMineStatus('success')

        } catch (err) {
            setMineStatus('error')
            console.log(err);
        }
    }

    const confirm = async () => {
        setMineStatus('mining')
        let txn;

        try {
            txn = await descrowContract.confirm();
            await txn.wait();
            setMineStatus('success')

        } catch (err) {
            setMineStatus('error')
            console.log(err);
        }
    }



    useEffect(() => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const descrowContract = new ethers.Contract(props.contractAddress, descrowAbi, signer);

        const cleanContract = (contractDetails) => {
            let cleanContract = {
                active: contractDetails.active,
                cancelled: contractDetails.cancelled,
                buyer: contractDetails.buyer,
                seller: contractDetails.seller,
                buyerCancel: contractDetails.buyerCancel,
                sellerCancel: contractDetails.sellerCancel,
                buyerStake: contractDetails.buyerStake,
                sellerStake: contractDetails.sellerStake,
                address: contractDetails.conAddr,
                price: ethers.utils.formatEther(contractDetails.salePrice),
            }
            return cleanContract;
        }

        const getLatestData = async () => {
            let contractDetails = await descrowContract.getStatus();
            setContractState(cleanContract(contractDetails));
        };

        getLatestData();

        descrowContract.on('ContractStateChanged', (buyer, seller, state) => {
            setContractState(cleanContract(state))
        });
    }, [props.contractAddress])

    return (
        <Fragment>
            {contractState && <div className='contract'>
                <div className='con-addr-active'>
                    <p className='addr'>
                        <span>Contract&nbsp;&nbsp;</span>
                        0x{props.contractAddress.slice(2, 10)}&nbsp;&nbsp;
                        <a href={`${NETWORK.blockExplorerUrls[0]}/address/${props.contractAddress}`}
                            target='_blank' rel='noreferrer'>
                            <i className="fa fa-external-link" aria-hidden="true"></i>
                        </a>
                    </p>
                    <p><span className={`online-status ${getStatus()}`}></span>{getStatus()}</p>
                </div>
                <div className='con-price'>
                    <p>{contractState.price} MATIC</p>
                </div>
                <div className='contract-parties'>
                    <Party partyClasses='party buyer'
                        partyText='Buyer'
                        party={contractState.buyer}
                        currentAccount={props.currentAccount}
                        staked={contractState.buyerStake}
                        cancelled={contractState.buyerCancel}
                    />

                    <Party partyClasses='party seller'
                        partyText='Seller'
                        party={contractState.seller}
                        currentAccount={props.currentAccount}
                        staked={contractState.sellerStake}
                        cancelled={contractState.sellerCancel}
                    />
                </div>
                {contractState.active &&
                    <div className='action-button-container'>
                        {btnStake && <button onClick={stake}>Stake</button>}
                        {btnRevokeStake && <button onClick={withdrawStake}>Withdraw Stake</button>}
                        {btnCancel && <button onClick={cancel}>Cancel</button>}
                        {btnRevokeCancel && <button onClick={revokeCancel}>Revoke Cancel</button>}
                        {btnConfirm && <button onClick={confirm}>Finish</button>}
                    </div>
                }
            </div>}
            {mineStatus === 'success' && <FlashMessage duration={2000}>
                <div className={`form-submission ${mineStatus}`}>
                    <p>Transaction successful!</p>
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
        </Fragment>
    )
}

export default Contract;