import React, { useState } from 'react';
import axios from 'axios';
import { uploadFileToIPFS, validateAudioFile, verifyNoteWithPython, createAndUpdateMetadata, fetchAndUpdateMetadata } from './helpers.js';

const MintButton = ({ account, contract }) => {
    const [isLoading, setIsLoading] = useState(false);

    const mintNFT = async () => {
        console.log("Mint button clicked");

        // Verifica che contract e account siano disponibili
        if (!contract) {
            console.error("Contract is null or undefined");
            alert('Contract is not initialized. Please try again later.');
            return;
        }

        if (!account) {
            console.error("Account is null or undefined");
            alert('Account is not initialized. Please log in first.');
            return;
        }

        setIsLoading(true);

        try {
            const file = await promptFileUpload();
            console.log("File selected:", file);

            // Verifica e carica il file su IPFS
            const [mp3CID, isValidFile] = await Promise.all([
                uploadFileToIPFS(file),
                validateAudioFile(file)
            ]);

            if (!isValidFile) {
                alert('Invalid file. Please upload a valid MP3 file.');
                return;
            }

            const fileUri = `ipfs://${mp3CID}`;
            console.log("File URI:", fileUri);

            // Verifica la validità del file
            const isNoteValid = await verifyNoteWithPython(fileUri);

            if (!isNoteValid) {
                alert('Invalid note');
                return;
            }

            // Crea e aggiorna i metadati
            const mp3MetadataCID = await createAndUpdateMetadata(file, true, `metadata_${file.name.replace('.mp3', '')}.json`);
            const updatedMetadataCID = await fetchAndUpdateMetadata(mp3MetadataCID, mp3CID, true, file.name);
            const ipfsURI = `ipfs://${updatedMetadataCID}`;

            console.log("IPFS URI for the metadata:", ipfsURI);

            // Mostra i metadati per verifica
            try {
                const response = await axios.get(`https://ipfs.io/ipfs/${updatedMetadataCID}`);
                console.log('Metadata JSON:', response.data);
            } catch (err) {
                console.error('Error accessing JSON from IPFS:', err.message);
            }

            // Invia la transazione di minting
            console.log("Sending transaction...");
            const tx = await contract.methods.mintNFTs(1, [ipfsURI]).send({ from: account });
            console.log('Transaction successful:', tx);

        } catch (error) {
            console.error('Error minting NFT:', error);
            alert('Error minting NFT. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const promptFileUpload = () => {
        return new Promise((resolve, reject) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/mpeg';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            fileInput.click();
        });
    };

    return (
        <div>
            <button onClick={mintNFT} disabled={isLoading}>
                {isLoading ? 'Minting...' : 'Mint NFT'}
            </button>
            {isLoading && (
                    <div className="loading-spinner"></div>
            )}
        </div>
    );
};

export default MintButton;
