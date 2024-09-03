// MintButton.js

import React from 'react';
import axios from 'axios';
import { uploadFileToIPFS, validateAudioFile, verifyNoteWithPython, createAndUpdateMetadata, fetchAndUpdateMetadata } from './helpers.js';

const MintButton = ({ account, contract }) => {
    const mintNFT = async () => {
        try {
            const file = await promptFileUpload();
            const [mp3CID, isValidFile] = await Promise.all([
                uploadFileToIPFS(file),
                validateAudioFile(file)
            ]);

            if (!isValidFile) {
                alert('Invalid file. Please upload a valid MP3 file.');
                return;
            }

            const fileUri = `ipfs://${mp3CID}`;
            const isNoteValid = await verifyNoteWithPython(fileUri);

            if (!isNoteValid) {
                alert('Invalid note');
                return;
            }

            const mp3MetadataCID = await createAndUpdateMetadata(file, true, `metadata_${file.name.replace('.mp3', '')}.json`);
            const updatedMetadataCID = await fetchAndUpdateMetadata(mp3MetadataCID, mp3CID, true, file.name);

            const ipfsURI = `ipfs://${updatedMetadataCID}`;

            try {
                const response = await axios.get(`https://ipfs.io/ipfs/${updatedMetadataCID}`);
                console.log('Metadata JSON:', response.data);
            } catch (err) {
                console.error('Error accessing JSON from IPFS:', err.message);
            }

            const tx = await contract.methods.mintNFTs(1, [ipfsURI]).send({ from: account });
            console.log('Transaction successful:', tx);

        } catch (error) {
            console.error('Error minting NFT:', error);
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
        <button onClick={mintNFT}>Mint NFT</button>
    );
};

export default MintButton;
