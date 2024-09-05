import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        checkConnection();
        // Imposta un listener per gestire il cambio di account
        window.ethereum?.on('accountsChanged', handleAccountChange);
        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountChange);
        };
    }, []);

    const checkConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsLogged(true);
                setAccountsList(accounts);
                onLogin(accounts[0], web3); // Comunica l'account e web3 al componente padre
            }
        }
    };

    const handleLogin = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsLogged(true);
                    setAccountsList(accounts);
                    onLogin(accounts[0], web3); // Comunica l'account e web3 al componente padre
                }
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    const handleAccountChange = (accounts) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsLogged(true);
            setAccountsList(accounts);
            onLogin(accounts[0], new Web3(window.ethereum)); // Aggiorna il web3 con il nuovo account
        } else {
            setAccount(null);
            setIsLogged(false);
            setAccountsList([]);
            onLogin(null, null); // Notifica il componente padre che l'utente si è disconnesso
        }
    };

    const handleAccountSelect = (account) => {
        setAccount(account);
        setMenuOpen(false); // Chiude il menu a discesa
        onLogin(account, new Web3(window.ethereum)); // Aggiorna il web3 con il nuovo account
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="login-button-container">
            <button onClick={isLogged ? toggleMenu : handleLogin}>
                {isLogged ? account : 'Login with MetaMask'}
            </button>
            {isLogged && menuOpen && (
                <div className="account-menu">
                    {accountsList.map((acc) => (
                        <div
                            key={acc}
                            className="account-menu-item"
                            onClick={() => handleAccountSelect(acc)}
                        >
                            {acc}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LoginButton;