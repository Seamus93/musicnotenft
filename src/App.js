import React, { useState, useEffect } from 'react';
import LoginButton from './components/LoginButton';
import MintButton from './components/MintButton';
import MergeButton from './components/MergeButton';
import FileMetadata from './components/FileMetadata';
import OpenSeaAssets from './components/OpenSeaAssets';

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
    // Questa funzione potrebbe non essere necessaria se OpenSeaAssets gestisce autonomamente il caricamento
  };

  return (
    <div>
      <LoginButton
        setWeb3={setWeb3}
        setAccount={setAccount}
        setContract={setContract}
      />
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
  );
}

export default App;
