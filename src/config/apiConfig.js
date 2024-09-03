// apiConfig.js

// Configurazione delle chiavi API e delle connessioni
const CONFIG = {
    pinata: {
        apiKey: '9d3c938006bc9e539714',
        secretApiKey: 'ece5fa5589a0b70530e6c91d4803c7550115a6c9f660645fbdd7eb2edaf0671b'
    },
    replit: {
        apiKey: '9a5f591a-757a-4f14-b087-be44ec6f9d8f-00-37x90b1i3z4t0'
    },
    contract: {
        abiUrl: '/artifacts/MyNFT.json',
        // La chiave "contractAddress" sarà gestita attraverso l'ABI JSON
        contractAddress: '' // Questo sarà caricato dal file ABI JSON
    },
    opesea: {
        
    },
    baseJSON: {
        primaryNoteImgCID: 'QmdHbohgqxPMUafj1DXeigmwu57q8DSufQB8byVh9NfHZ7',
        mergedNoteImgCID: 'QmbLkM3JSKvZULRPiYey41wPAWCbTPXGQ84nZcAqAHuL7P',
        metadataNoteJSONCID: 'QmPhvtt5qv1fp97toGt6EiSRur45SGm25ENNTVx4ggQiU1',
        metadataFileJSONCID: 'QmPhvtt5qv1fp97toGt6EiSRur45SGm25ENNTVx4ggQiU1'
    }
};

// Carica l'ABI e l'indirizzo del contratto
async function loadContractConfig() {
    try {
        const response = await fetch(CONFIG.contract.abiUrl);
        const data = await response.json();
        return {
            abi: data.abi,
            contractAddress: data.contract_address
        };
    } catch (error) {
        console.error('Error loading contract configuration:', error);
        return null;
    }
}

// Esportiamo la configurazione
export { CONFIG, loadContractConfig };
