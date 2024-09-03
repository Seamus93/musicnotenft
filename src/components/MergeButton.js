// MergeButton.js

import React from 'react';

const MergeButton = ({ account, contract }) => {
    const mergeNFTs = async () => {
        const tokenId1 = prompt('Enter the ID of the first NFT to merge:');
        const tokenId2 = prompt('Enter the ID of the second NFT to merge:');
        if (tokenId1 && tokenId2) {
            try {
                const tx = await contract.methods.mergeNFTs(tokenId1, tokenId2).send({ from: account });
                console.log('Merge successful:', tx);
            } catch (error) {
                console.error('Error merging NFTs:', error);
            }
        } else {
            console.error('Token IDs are required for merging.');
        }
    };

    return (
        <button onClick={mergeNFTs}>Merge NFT</button>
    );
};

export default MergeButton;
