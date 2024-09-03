// LoginButton.js

import React, { useState } from 'react';
import Web3 from 'web3';
import { loadContractConfig } from './connections.js';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);

    const initializeWeb3AndContract = async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed');
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                setAccount(account);

                const contractConfig = await loadContractConfig();
                if (contractConfig) {
                    const { abi, contractAddress } = contractConfig;
                    const contract = new web3.eth.Contract(abi, contractAddress);
                    console.log('Contract initialized:', contract);
                    onLogin(account, contract, web3);
                } else {
                    console.error('Contract configuration missing');
                }
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    return (
        <button onClick={initializeWeb3AndContract}>
            {account ? 'Connected' : 'Login with MetaMask'}
        </button>
    );
};

export default LoginButton;
