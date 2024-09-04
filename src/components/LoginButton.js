import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { loadContractConfig } from '../config/apiConfig.js';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    // Funzione per verificare se l'account è già connesso
    const checkConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (error) {
                console.error('Error checking account:', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    useEffect(() => {
        checkConnection(); // Controlla la connessione quando il componente viene montato
    }, []);

    const initializeWeb3AndContract = async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed');
            setLoading(true);
            try {
                // Chiedi di aprire MetaMask per la selezione o riconnessione dell'account
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAccount = accounts[0];
                setAccount(userAccount);

                const contractConfig = await loadContractConfig();
                if (contractConfig) {
                    const { abi, contractAddress } = contractConfig;
                    const contract = new web3.eth.Contract(abi, contractAddress);
                    console.log('Contract initialized:', contract);

                    if (typeof onLogin === 'function') {
                        onLogin(userAccount, contract, web3);
                    } else {
                        console.error('onLogin is not a function');
                    }
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
            {loading ? 'Connecting...' : account ? `Connected: ${account}` : 'Login with MetaMask'}
        </button>
    );
};

export default LoginButton;
