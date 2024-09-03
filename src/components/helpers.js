import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import jsmediatags from 'jsmediatags';
import { CONFIG } from '../config/apiConfig.js'; // Assumendo che CONFIG sia necessario per le funzioni

export async function uploadFileToIPFS(file) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    let data = new FormData();
    data.append('file', file, file.name);

    const headers = {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': CONFIG.pinata.apiKey,
        'pinata_secret_api_key': CONFIG.pinata.secretApiKey,
    };

    const response = await axios.post(url, data, { headers });
    return response.data.IpfsHash;
}

export async function validateAudioFile(file) {
    if (!file) {
        console.error('No file selected');
        return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('File size exceeds maximum limit of 10MB');
        return false;
    }

    if (file.type !== 'audio/mpeg') {
        alert('Invalid file type. Only MP3 files are accepted');
        return false;
    }

    return new Promise((resolve, reject) => {
        try {
            jsmediatags.read(file, {
                onSuccess: function(tag) {
                    console.log('File metadata:', tag);
                    resolve(true);
                },
                onError: function(error) {
                    alert('Error reading file metadata. Please try again.');
                    console.error('Error reading file metadata:', error);
                    resolve(false);
                }
            });
        } catch (e) {
            alert('An unexpected error occurred. Please try again.');
            console.error('Exception during metadata read:', e);
            resolve(false);
        }
    });
}

  // Funzione per caricare JSON su IPFS
  export async function uploadJSONToIPFS(jsonBlob, fileName = 'metadata.json') {
    const file = new File([jsonBlob], fileName, { type: 'application/json' });

    try {
        // Riutilizzo di uploadFileToIPFS per caricare il file JSON
        const ipfsHash = await uploadFileToIPFS(file);
        console.log('Metadata uploaded JSON', ipfsHash);
        return ipfsHash;
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
}

export async function verifyNoteWithPython(fileUri) {
    const requestId = uuid.v4();
    const data = { fileUri: fileUri, requestId: requestId };
    
    const url = `https://${CONFIG.replit.apiKey}.riker.replit.dev/verify`;

    const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.replit.apiKey}`
    };

    const response = await axios.post(url, data, { headers });
    return response.data.result; // Assicurati che 'result' sia il campo corretto
}

export async function createAndUpdateMetadata(file, extractMetadata, fileName) {
    let metadata = {};
    if (extractMetadata) {
        metadata = await extractMetadataFromFile(file);
    }

    const data = {
        name: file.name,
        description: 'This NFT represents an MP3 file',
        image: `ipfs://${metadata.ipfsHash}`,
        attributes: [
            { trait_type: 'Artist', value: metadata.artist || 'Unknown' },
            { trait_type: 'Album', value: metadata.album || 'Unknown' },
            { trait_type: 'Year', value: metadata.year || 'Unknown' },
            { trait_type: 'Genre', value: metadata.genre || 'Unknown' },
            { trait_type: 'Title', value: metadata.title || 'Unknown' },
            { trait_type: 'Comment', value: metadata.comment || 'No Comments' },
        ]
    };

    try {
        // Crea un Blob con i dati dei metadati
        const metadataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        
        // Usa il nome del file passato come argomento
        const response = await uploadJSONToIPFS(metadataBlob, fileName);
        console.log("response:", response);
        return response; // Restituisce l'IPFS hash
    } catch (error) {
        console.error('Error creating metadata:', error);
        throw new Error('Failed to create metadata');
    }
}

export async function extractMetadataFromFile(file) {
    return new Promise((resolve, reject) => {
        jsmediatags.read(file, {
            onSuccess: function(tag) {
                resolve({
                    artist: tag.tags.artist,
                    album: tag.tags.album,
                    year: tag.tags.year,
                    genre: tag.tags.genre,
                    title: tag.tags.title,
                    comment: tag.tags.comment ? tag.tags.comment.text : null,
                    ipfsHash: '', // Questo sarà impostato più tardi
                });
            },
            onError: function(error) {
                console.error('Error extracting metadata:', error);
                reject(error);
            }
        });
    });
}

export async function fetchAndUpdateMetadata(mp3MetadataCID, mp3CID, isPrimaryNFT, mp3FileName) {
    const standardJsonForMp3CID = CONFIG.baseJSON.metadataNoteJSONCID;
    
    try {
        // Fetch the existing metadata template
        const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${standardJsonForMp3CID}`);
        const metadata = metadataResponse.data;

        // Define only the updates needed
        const updates = {
            description: "Testing a project for NFT Music composing tracking process",
            external_url: `ipfs://${mp3MetadataCID}`,
            image: isPrimaryNFT ? `ipfs://${CONFIG.baseJSON.primaryNoteImgCID}/` : `ipfs://${CONFIG.baseJSON.mergedNoteImgCID}/`,
            name: mp3FileName.split('.')[0],
            attributes: [
                { trait_type: 'Type', value: isPrimaryNFT ? "Music Note" : "Music EFX | Musical Bar" },
                { trait_type: 'History', value: isPrimaryNFT ? "Created by combining NFT IDs: [0x0,0x0]" : "Created by combining NFT IDs: [<NFT1_ID>, <NFT2_ID>]" }
            ],
            background_color: "000000",
            animation_url: `ipfs://${mp3CID}`,
            youtube_url: "no url"
        };

        // Merge the updates with the existing metadata
        const updatedMetadata = { ...metadata, ...updates };

        // Convert the updated metadata object to a JSON blob and upload it to IPFS
        const updatedMetadataBlob = new Blob([JSON.stringify(updatedMetadata)], { type: 'application/json' });
        const updatedMetadataCID = await uploadJSONToIPFS(updatedMetadataBlob, `${mp3FileName.split('.')[0]}.json`);
        return updatedMetadataCID;
    } catch (error) {
        console.error('Error fetching or updating metadata:', error);
        throw error;
    }
}
