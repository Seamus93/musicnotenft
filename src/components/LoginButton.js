import React, { useState } from 'react';
import Web3 from 'web3';
import { loadContractConfig } from '../config/apiConfig.js';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const initializeWeb3AndContract = async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed');
            setLoading(true);  // Inizia il caricamento
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const userAccount = accounts[0];
                setAccount(userAccount);

                const contractConfig = await loadContractConfig();
                if (contractConfig) {
                    const { abi, contractAddress } = contractConfig;
                    const contract = new web3.eth.Contract(abi, contractAddress);
                    console.log('Contract initialized:', contract);
                    
                    // Esegui la funzione onLogin con i dati
                    if (typeof onLogin === 'function') {
                        onLogin(userAccount, contract, web3);
                    } else {
                        console.error('onLogin is not a function');
                    } 
                } else {
                    console.error('Contract configuration is missing');
                }
            } catch (error) {
                console.error('User denied account access or an error occurred:', error);
            } finally {
                setLoading(false);  // Fine del caricamento
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
