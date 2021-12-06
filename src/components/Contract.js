import './Contract.css';
import { MUMBAI as NETWORK } from '../data/networks';
import Party from './Party';

const Contract = (props) => {

    const getStatus = () => {
        if (props.contract.active) return 'Active';
        else if (props.contract.cancelled) return 'Cancelled';
        return 'Completed';
    }

    return (
        <div className='contract'>
            <div className='con-addr-active'>
                <p className='addr'>
                    <span>Contract&nbsp;&nbsp;</span>
                    0x{props.contract.address.slice(2, 10)}&nbsp;&nbsp;
                    <a href={`${NETWORK.blockExplorerUrls[0]}/address/${props.contract.address}`}
                        target='_blank' rel='noreferrer'>
                        <i className="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </p>
                <p><span className={`online-status ${getStatus()}`}></span>{getStatus()}</p>
            </div>
            <div className='con-price'>
                <p>{props.contract.price} MATIC</p>
            </div>
            <div className='contract-parties'>
                <Party partyClasses='party buyer'
                    partyText='Buyer'
                    party={props.contract.buyer}
                    currentAccount={props.currentAccount}
                    staked={props.contract.buyerStake}
                    cancelled={props.contract.buyerCancel}
                />

                <Party partyClasses='party seller'
                    partyText='Seller'
                    party={props.contract.seller}
                    currentAccount={props.currentAccount}
                    staked={props.contract.sellerStake}
                    cancelled={props.contract.sellerCancel}
                />
            </div>
        </div>
    )
}

export default Contract;