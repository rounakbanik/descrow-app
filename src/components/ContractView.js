import { useCallback, useEffect, useState } from 'react';
import './ContractView.css';
import { factoryAbi, factoryAddress } from '../contracts/contractData';
import { ethers } from 'ethers';
import Contract from './Contract';

const ContractView = (props) => {

    const [contractAddressList, setContractAddressList] = useState(null);

    // Get data for all the user's contracts
    const getAllContracts = useCallback(async (accountAddr) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);
        let contractAddresses = await factoryContract.getContractsByParty(accountAddr);

        setContractAddressList(contractAddresses.slice().reverse());

        // Set up event listener for factory contract
        factoryContract.on('ContractCreated', (buyer, seller, price, addr) => {

            if (props.currentAccount.toLowerCase() === buyer.toLowerCase() ||
                props.currentAccount.toLowerCase() === seller.toLowerCase()) {
                console.log("Hey oh!");
                console.log(buyer, seller, price, addr);
                setContractAddressList(prevState => {
                    if (!prevState.includes(addr)) return [addr, ...prevState];
                    return prevState;
                })

            }

        });

    }, [props.currentAccount]);

    // Load contract data when component loads
    useEffect(() => {
        getAllContracts(props.currentAccount);
    }, [props.currentAccount, getAllContracts]);

    return (
        <div className='contract-container'>
            <h2>My Contracts</h2>
            <div className='contract-list-container'>
                {!contractAddressList && <div className='contract-loader'>
                    <i className="fa fa-circle-o-notch fa-spin"></i>
                </div>}
                {contractAddressList && contractAddressList.length === 0 &&
                    <div className='no-contracts'>
                        <p>Oops! It looks like you have no contracts yet.</p>
                    </div>}
                {contractAddressList && contractAddressList.length > 0 &&
                    <div className='contract-list'>
                        {contractAddressList.map(contractAddress => <Contract key={contractAddress}
                            contractAddress={contractAddress}
                            currentAccount={props.currentAccount} />)}
                    </div>}
            </div>
        </div>
    )

}

export default ContractView;

