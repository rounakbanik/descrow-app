import { useCallback, useEffect, useState } from 'react';
import './ContractView.css';
import { factoryAbi, descrowAbi, factoryAddress } from '../contracts/contractData';
import { ethers } from 'ethers';
import Contract from './Contract';

const ContractView = (props) => {

    const [contractList, setContractList] = useState(null);

    // Get details for a particular contract
    const getContractDetails = async (conAddr) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const descrowContract = new ethers.Contract(conAddr, descrowAbi, signer);

        let contractDetails = await descrowContract.getStatus();
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

    // Get data for all the user's contracts
    const getAllContracts = useCallback(async (accountAddr) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);
        let contractAddresses = await factoryContract.getContractsByParty(accountAddr);

        let contracts = [];

        for (let conAddr of contractAddresses) {
            let cdetail = await getContractDetails(conAddr);
            contracts.push(cdetail);
        }

        contracts = contracts.reverse();
        setContractList(contracts);
    }, []);

    // Load contract data when component loads
    useEffect(() => {
        getAllContracts(props.currentAccount);
    }, [props.currentAccount, getAllContracts]);

    return (
        <div className='contract-container'>
            <h2>My Contracts</h2>
            <div className='contract-list-container'>
                {!contractList && <div className='contract-loader'>
                    <i className="fa fa-circle-o-notch fa-spin"></i>
                </div>}
                {contractList && contractList.length === 0 &&
                    <div className='no-contracts'>
                        <p>Oops! It looks like you have no contracts yet.</p>
                    </div>}
                {contractList && contractList.length > 0 &&
                    <div className='contract-list'>
                        {contractList.map(contract => <Contract key={contract.address}
                            contract={contract}
                            currentAccount={props.currentAccount} />)}
                    </div>}
            </div>
        </div>
    )

}

export default ContractView;

