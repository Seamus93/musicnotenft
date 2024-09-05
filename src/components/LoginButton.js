import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        checkConnection();
    }, []);

    // Funzione per verificare se l'utente è già connesso
    const checkConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                onLogin(accounts[0], web3); // Comunica l'account e web3 al componente padre
            }
        }
    };

    // Funzione per gestire il login e l'eventuale switch di account
    const handleLogin = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    onLogin(accounts[0], web3); // Comunica l'account e web3 al componente padre
                }
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    return (
        <button onClick={handleLogin}>
            {account ? `Connected: ${account}` : 'Login with MetaMask'}
        </button>
    );
};

export default LoginButton;
