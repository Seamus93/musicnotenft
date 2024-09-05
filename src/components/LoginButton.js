import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
// Material UI components
import { Button, Menu, MenuItem, Avatar } from '@mui/material';

const LoginButton = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);  // To control the Material-UI menu

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
        handleClose();  // Chiude il menu
    };

    const toggleMenu = (event) => {
        setAnchorEl(event.currentTarget);  // Apre il menu
        setMenuOpen(!menuOpen);
    };

    const handleClose = () => {
        setAnchorEl(null);  // Chiude il menu
    };

    // Funzione per abbreviare gli indirizzi
    const shortenAddress = (addr) => {
        return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
    };

    return (
        <div className="login-button-container">
            <Button onClick={isLogged ? toggleMenu : handleLogin} className="button" >
                {isLogged ? shortenAddress(account) : 'Login with MetaMask'}
            </Button>

            {isLogged && (
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {accountsList.map((acc) => (
                        <MenuItem key={acc} onClick={() => handleAccountSelect(acc)}>
                            {/* Aggiunge un avatar con le prime 2 lettere dell'account */}
                            <Avatar className="avatar"> {acc.slice(2, 4).toUpperCase()} </Avatar>
                            {shortenAddress(acc)}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    );
};

export default LoginButton;
