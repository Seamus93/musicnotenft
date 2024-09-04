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
        // Inserisci direttamente l'ABI del contratto qui
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "initialOwner",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "ERC721EnumerableForbiddenBatchMint",
                "type": "error"
            },
            // ... inserisci tutte le altre voci ABI qui ...
        ],
        // Inserisci direttamente l'indirizzo del contratto qui
        contractAddress: '0x19e0ce4ee4B78C112A0580133972f8C065Db8866'
    },
    opensea: {
        // Puoi aggiungere qui eventuali configurazioni per Opensea
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
        return {
            abi: CONFIG.contract.abi,
            contractAddress: CONFIG.contract.contractAddress
        };
    } catch (error) {
        console.error('Error loading contract configuration:', error);
        return null;
    }
}

// Esportiamo la configuravzione
export { CONFIG, loadContractConfig };
