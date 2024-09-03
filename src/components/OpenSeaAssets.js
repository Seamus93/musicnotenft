// OpenSeaAssets.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenSeaAssets = ({ collectionSlug }) => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const loadOpenSeaAssets = async () => {
            const assets = await fetchOpenSeaCollection(collectionSlug);
            setAssets(assets);
        };
        loadOpenSeaAssets();
    }, [collectionSlug]);

    const fetchOpenSeaCollection = async (slug) => {
        try {
            console.log('Fetching OpenSea collection with slug:', slug);
            const url = `https://testnets-api.opensea.io/api/v2/collection/${slug}/nfts`;
            console.log(`Using URL: ${url}`);

            const response = await axios.get(url);
            console.log('API Response:', response);

            if (response.data && response.data.nfts) {
                return response.data.nfts.filter(nft => nft.name && nft.image_url && nft.metadata_url);
            } else {
                console.error('No assets found in the response');
                return [];
            }
        } catch (error) {
            console.error('Error occurred while fetching collection from OpenSea:', error.message);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            return [];
        }
    };

    return (
        <div id="opensea-assets">
            {assets.map(asset => (
                <div key={asset.id} className="asset">
                    <img src={asset.image_url} alt={asset.name} className="asset-image" />
                    <h3 className="asset-name">{asset.name}</h3>
                    <p className="asset-description">
                        {asset.description ? asset.description : 'No description available'}
                    </p>
                    <a href={asset.opensea_url} target="_blank" rel="noopener noreferrer" className="asset-link">
                        View on OpenSea
                    </a>
                </div>
            ))}
        </div>
    );
};

export default OpenSeaAssets;
