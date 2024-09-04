const MintButton = ({ account, contract }) => {
    const [isLoading, setIsLoading] = useState(false);

    const mintNFT = async () => {
        console.log("Mint button clicked");
        if (!contract) {
            console.error("Contract is null or undefined");
            return;
        }
        if (!account) {
            console.error("Account is null or undefined");
            return;
        }

        setIsLoading(true);

        try {
            const file = await promptFileUpload();
            if (!file) {
                console.error('No file selected');
                setIsLoading(false); // Termina il caricamento se non c'è file
                return;
            }
            console.log("File selected:", file);

            const [mp3CID, isValidFile] = await Promise.all([
                uploadFileToIPFS(file),
                validateAudioFile(file)
            ]);
            console.log("File uploaded to IPFS with CID:", mp3CID);
            console.log("Is the file valid?", isValidFile);

            if (!isValidFile) {
                alert('Invalid file. Please upload a valid MP3 file.');
                setIsLoading(false);
                return;
            }

            const fileUri = `ipfs://${mp3CID}`;
            console.log("File URI:", fileUri);

            const isNoteValid = await verifyNoteWithPython(fileUri);
            console.log("Is the note valid?", isNoteValid);

            if (!isNoteValid) {
                alert('Invalid note');
                setIsLoading(false);
                return;
            }

            const mp3MetadataCID = await createAndUpdateMetadata(file, true, `metadata_${file.name.replace('.mp3', '')}.json`);
            console.log("Metadata CID:", mp3MetadataCID);

            const updatedMetadataCID = await fetchAndUpdateMetadata(mp3MetadataCID, mp3CID, true, file.name);
            console.log("Updated metadata CID:", updatedMetadataCID);

            const ipfsURI = `ipfs://${updatedMetadataCID}`;
            console.log("IPFS URI for the metadata:", ipfsURI);

            try {
                const response = await axios.get(`https://ipfs.io/ipfs/${updatedMetadataCID}`);
                console.log('Metadata JSON:', response.data);
            } catch (err) {
                console.error('Error accessing JSON from IPFS:', err.message);
            }

            console.log("Sending transaction...");
            const tx = await contract.methods.mintNFTs(1, [ipfsURI]).send({ from: account });
            console.log('Transaction successful:', tx);

        } catch (error) {
            console.error('Error minting NFT:', error);
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
                    resolve(null); // Risolve con null se nessun file è stato selezionato
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