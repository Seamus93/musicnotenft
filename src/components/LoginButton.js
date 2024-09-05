import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { loadContractConfig } from '../config/apiConfig.js';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    // Funzione per connettere MetaMask
    const initializeWeb3AndContract = async () => {
        if (typeof window.ethereum !== 'undefined') {
            setLoading(true);
            try {
                const web3 = new Web3(window.ethereum);

                // Richiedi sempre la connessione e apri MetaMask
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAccount = accounts[0];
                setAccount(userAccount);

                const contractConfig = await loadContractConfig();
                if (contractConfig) {
                    const { abi, contractAddress } = contractConfig;
                    const contract = new web3.eth.Contract(abi, contractAddress);
                    console.log('Contract initialized:', contract);
                } else {
                    console.error('Contract configuration is missing');
                }
            } catch (error) {
                console.error('Error accessing accounts or MetaMask interaction failed:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    return (
        <button onClick={initializeWeb3AndContract} disabled={loading}>
            {loading ? 'Connecting...' : account ? account : 'Login with MetaMask'}
        </button>
    );
};

export default LoginButton;
