import './Contract.css';
import { MUMBAI as NETWORK } from '../data/networks';
import Party from './Party';

const Contract = (props) => {

    const isBuyer = props.currentAccount.toLowerCase() === props.contract.buyer;
    const isLocked = props.contract.buyerStake && props.contract.sellerStake;
    const isActive = props.contract.active;
    const noCancel = !props.contract.buyerCancel && !props.contract.sellerCancel;

    const getStatus = () => {
        if (props.contract.active && isLocked) return 'Active';
        else if (props.contract.active && !isLocked) return 'Unlocked';
        else if (props.contract.cancelled) return 'Cancelled';
        return 'Completed';
    }

    const isStaked = () => {
        if (isBuyer && props.contract.buyerStake) return true;
        if (!isBuyer && props.contract.sellerStake) return true;
        return false;
    }

    const isCancelled = () => {
        if (isBuyer && props.contract.buyerCancel) return true;
        if (!isBuyer && props.contract.sellerCancel) return true;
        return false;
    }


    const btnConfirm = isBuyer && isLocked && noCancel;
    const btnStake = !isLocked && !isStaked();
    const btnRevokeStake = !isLocked && isStaked();
    const btnCancel = isLocked && !isCancelled();
    const btnRevokeCancel = isLocked && isCancelled();

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
            {isActive &&
                <div className='action-button-container'>
                    {btnStake && <button>Stake</button>}
                    {btnRevokeStake && <button>Withdraw Stake</button>}
                    {btnCancel && <button>Cancel</button>}
                    {btnRevokeCancel && <button>Revoke Cancel</button>}
                    {btnConfirm && <button>Finish</button>}
                </div>

            }
        </div>
    )
}

export default Contract;