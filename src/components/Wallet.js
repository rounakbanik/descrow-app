import { useCallback } from 'react';
import { Fragment, useEffect } from 'react';
import { MUMBAI as NETWORK } from '../data/networks';
import './Wallet.css';

const Wallet = (props) => {

    const checkIfWalletIsConnected = useCallback(async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        } else {
            console.log("Wallet exists! We're ready to go!")
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);

            // Switch network if it's not the correct chain
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: NETWORK.chainId }],
                });
                props.accountHandler(account);
            } catch (err) {
                console.log(err);
            }

        } else {
            console.log("No authorized account found");
        }
    }, [props])

    const connectWallet = async () => {

        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install the Metamask Extension!");
        }

        // Get wallet address
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account! Address: ", accounts[0]);

            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: NETWORK.chainId }],
            });

            props.accountHandler(accounts[0]);

        } catch (err) {
            console.log(err);

            // If user doesn't have network configured, add it
            if (err.code === 4902) {
                try {
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [NETWORK],
                    });
                    props.accountHandler(accounts[0]);
                } catch (err) {
                    alert(err.message);
                }
            }
        }


    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [checkIfWalletIsConnected])

    return (
        <Fragment>
            {!props.currentAccount && <button className='cta-button cw-theme' onClick={connectWallet}>
                Connect Wallet
            </button>}
        </Fragment>
    )

}

export default Wallet;