import { Fragment, useState } from 'react';
import './App.css';
import ContractCreation from './components/ContractCreation';
import ContractView from './components/ContractView';
import Header from './components/Header';
import Jumbotron from './components/Jumbotron';
import Wallet from './components/Wallet';

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const accountHandler = (account) => {
    setCurrentAccount(account);
  }

  return (
    <Fragment>
      <Header currentAccount={currentAccount} />
      <div className="app-container">
        <Jumbotron />
        <Wallet currentAccount={currentAccount} accountHandler={accountHandler} />
        <ContractCreation currentAccount={currentAccount} />
        {currentAccount && <ContractView currentAccount={currentAccount} />}
      </div>

    </Fragment>

  );
}

export default App;