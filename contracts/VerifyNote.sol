// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol";

contract VerifyNFTNote is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    mapping(bytes32 => bool) public requestIdToStatus;

    event NoteVerificationRequested(bytes32 indexed requestId, string fileUri);
    event NoteVerificationResult(bytes32 indexed requestId, bool result);

    constructor(address _oracle, bytes32 _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function requestNoteVerification(string memory fileUri) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("fileUri", fileUri);
        requestId = sendChainlinkRequestTo(oracle, req, fee);
        emit NoteVerificationRequested(requestId, fileUri);
    }

    function fulfill(bytes32 requestId, bool result) public recordChainlinkFulfillment(requestId) {
        requestIdToStatus[requestId] = result;
        emit NoteVerificationResult(requestId, result);
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    function setJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }
}
