import React, { useState, useEffect } from 'react';
import LoginButton from './components/LoginButton';
import MintButton from './components/MintButton';
import MergeButton from './components/MergeButton';
import FileMetadata from './components/FileMetadata';
import OpenSeaAssets from './components/OpenSeaAssets';
import './styles/global.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [ipfsUri, setIpfsUri] = useState(null);

  useEffect(() => {
    // Load OpenSea assets on component mount
    loadOpenSeaAssets();
  }, []);

  const loadOpenSeaAssets = async () => {
    // Implement this function if needed
  };

  // Funzione per gestire il login
  const handleLogin = (account, contract, web3) => {
    setAccount(account);
    setContract(contract);
    setWeb3(web3);
    console.log('Logged in:', account);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">My NFT App</div>
        <div className="navbar-links">
          <LoginButton onLogin={handleLogin} />
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="main-content">
        <MintButton
          web3={web3}
          account={account}
          contract={contract}
          setIpfsUri={setIpfsUri}
          setTxHash={setTxHash}
          setFileMetadata={setFileMetadata}
        />
        <MergeButton
          web3={web3}
          account={account}
          contract={contract}
          setTxHash={setTxHash}
        />
        <FileMetadata metadata={fileMetadata} />
        <p>IPFS URI: {ipfsUri}</p>
        <p>Transaction Hash: {txHash}</p>
        <OpenSeaAssets collectionSlug="musicnotenft" />
      </div>
    </div>
  );
}

export default App;
