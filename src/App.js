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
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Load OpenSea assets on component mount
    loadOpenSeaAssets();
  }, []);

  const loadOpenSeaAssets = async () => {
    // Implement this function if needed
  };

  const handleMintComplete = (ipfsUri, txHash, fileMetadata) => {
    setIpfsUri(ipfsUri);
    setTxHash(txHash);
    setFileMetadata(fileMetadata);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Funzione per gestire il login
  const handleLogin = (account, contract, web3) => {
    setAccount(account);
    setContract(contract);
    setWeb3(web3);
    console.log('Logged in:', account);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">My NFT App</div>
        <div className="navbar-links">
          <LoginButton className="login-button" onLogin={handleLogin} />
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="mint-merge-container">
          <div className="mint-section">
            <h2>Mint Your NFT</h2>
            <MintButton
              web3={web3}
              account={account}
              contract={contract}
              onMintComplete={handleMintComplete} // Passa la funzione per gestire il completamento del mint
            />
          </div>

          <div className="merge-section">
            <h2>Merge Your NFTs</h2>
            <MergeButton
              web3={web3}
              account={account}
              contract={contract}
              setTxHash={setTxHash}
            />
          </div>
        </div>

        {/* Pop-up */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button className="popup-close-button" onClick={handleClosePopup}>X</button>
              <FileMetadata metadata={fileMetadata} />
              <div className="transaction-info">
                <p><strong>IPFS URI:</strong> {ipfsUri}</p>
                <p><strong>Transaction Hash:</strong> {txHash}</p>
              </div>
            </div>
          </div>
        )}

        <OpenSeaAssets collectionSlug="musicnotenft" />
      </div>
    </div>
  );
}

export default App;
