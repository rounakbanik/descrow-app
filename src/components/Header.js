import './Header.css';

const Header = (props) => {

    return (
        <header>
            <div>
                <span className={`online-status ${props.currentAccount ? 'online' : 'offline'}`}></span>
                {props.currentAccount ? props.currentAccount.slice(0, 7) : "Not Connected"}
            </div>

        </header>
    )
}

export default Header;