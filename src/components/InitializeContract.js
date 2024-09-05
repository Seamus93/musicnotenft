import React, { useEffect, useState } from 'react';
import { loadContractConfig } from '../config/apiConfig.js';

const InitializeContract = ({ web3, account, onContractInitialized }) => {

    useEffect(() => {
        if (web3 && account) {
            initializeContract();
        }
    }, [web3,account]);

    const initializeContract = async () => {
        try {
            const contractConfig = await loadContractConfig();
            if (contractConfig) {
                const { abi, contractAddress } = contractConfig;
                const contractInstance = new web3.eth.Contract(abi, contractAddress);
                onContractInitialized(contractInstance); // Comunica il contratto al componente padre
            } else {
                console.error('Contract configuration missing');
            }
        } catch (error) {
            console.error('Error initializing contract:', error);
        }
    };
};

export default InitializeContract;
