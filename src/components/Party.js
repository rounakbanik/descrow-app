import './Party.css';
import { MUMBAI as NETWORK } from '../data/networks';

const Party = (props) => {

    const boolToText = (x) => {
        if (x) return 'Yes';
        return 'No';
    }

    return (
        <div className={props.partyClasses}>
            <p className='party-heading'>
                {props.partyText}&nbsp;
                {props.party.toLowerCase() === props.currentAccount.toLowerCase() &&
                    <span>(You)</span>}
            </p>
            <p className='party-address'>
                {props.party.slice(0, 10)}&nbsp;&nbsp;
                <a href={`${NETWORK.blockExplorerUrls[0]}/address/${props.party}`}
                    target='_blank' rel='noreferrer'>
                    <i className="fa fa-external-link" aria-hidden="true"></i>
                </a>
            </p>
            <div className='party-statuses'>
                <div className='party-status'>
                    <p className='statusq'>Staked?</p>
                    <p>{boolToText(props.staked)}</p>
                </div>
                <div className='party-status'>
                    <p className='statusq'>Cancelled?</p>
                    <p>{boolToText(props.cancelled)}</p>
                </div>
            </div>
        </div>
    )

}

export default Party;