   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./GameOwnerUpgradeable.sol";
import "./FFFToken.sol";

contract Bank is GameOwnerUpgradeable, UUPSUpgradeable {

    using ECDSA for bytes32;

    event SessionChanged(address indexed owner, bytes32 indexed sessionId, bytes32 indexed thxId);

    mapping(bytes32 => bool) public executed;

    mapping(address => bytes32) public sessions;
    mapping(address => uint) public syncedAt;

    uint private withdrawFee;
    address private withdrawFeeWallet;
    address private signer;


    FunflowerFarmToken private fffToken;

    function initialize() public override initializer {
        GameOwnerUpgradeable.initialize();
        gameRoles[msg.sender] = true;
        withdrawFee = 1 * (10 ** 17); //0.1
        withdrawFeeWallet = _msgSender();
        signer = _msgSender();
    }

    function setTokens(FunflowerFarmToken _fffToken) public onlyOwner {
        fffToken = _fffToken;
    }

    function setWithdrawFee(uint _fee) public onlyOwner {
        withdrawFee = _fee;
    }

    function transferSigner(address _signer) public onlyOwner {
        signer = _signer;
    }

    function transferWithdrawFeeWallet(address _team) public onlyOwner {
        withdrawFeeWallet = _team;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function getSessionId(address _address) public view returns(bytes32) {
        bytes32 id = sessions[_address];

        if (id == 0) {
            // First ID is based on the unique contract
            id = keccak256(abi.encode(address(this)));
        }

        return id;
    }

    function isTransactionExecuted(bytes32 txHash) public view returns(bool) {
        return executed[txHash];
    }

        // A unique nonce identifer for the account
    function generateSessionId(address _address) private view returns(bytes32) {
        return keccak256(abi.encodePacked(_msgSender(), sessions[_address], block.number)).toEthSignedMessageHash();
    }

    function verify(bytes32 hash, bytes memory signature) private view returns (bool) {
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        return ethSignedHash.recover(signature) == signer;
    }

    function withdraw (
        bytes memory signature,
        bytes32 sessionId,
        uint256 fff,
        uint deadline) 
        payable public returns (bool) {
        require(msg.value >= withdrawFee, "Funflower Farm: Missing fee");
        require(deadline >= block.timestamp, "Funflower Farm: Deadline Passed");

        // Check the session is new or has not changed (already saved or withdrew funds)
        bytes32 userSessionId = getSessionId(_msgSender());
        require(
            userSessionId == sessionId,
            "Funflower Farm: Session has changed"
        );

        // Start a new session
        bytes32 newSessionId = generateSessionId(_msgSender());
        sessions[_msgSender()] = newSessionId;
        syncedAt[_msgSender()] = block.timestamp;

        // Verify
        bytes32 txHash = keccak256(abi.encode(sessionId,  _msgSender(), fff, deadline));
        require(!executed[txHash], "Funflower Farm: Tx Executed");
        require(verify(txHash, signature), "Funflower Farm: Unauthorised");
        executed[txHash] = true;


        fffToken.gameMint(msg.sender, fff);
        (bool teamSent,) = withdrawFeeWallet.call{value: msg.value}("");
        require(teamSent, "Funflower Farm: Fee Failed");

        emit SessionChanged(_msgSender(), newSessionId, txHash);

        return true;
    }

    function deposit (
        bytes memory signature,
        bytes32 sessionId,
        uint256 fff,
        uint deadline) 
        public returns (bool) {
        require(deadline >= block.timestamp, "Funflower Farm: Deadline Passed");

        // Check the session is new or has not changed (already saved or withdrew funds)
        bytes32 userSessionId = getSessionId(_msgSender());
        require(
            userSessionId == sessionId,
            "Funflower Farm: Session has changed"
        );

        // Start a new session
        bytes32 newSessionId = generateSessionId(_msgSender());
        sessions[_msgSender()] = newSessionId;
        syncedAt[_msgSender()] = block.timestamp;

        // Verify
        bytes32 txHash = keccak256(abi.encode(sessionId,  _msgSender(), fff, deadline));
        require(!executed[txHash], "Funflower Farm: Tx Executed");
        require(verify(txHash, signature), "Funflower Farm: Unauthorised");
        executed[txHash] = true;


        fffToken.gameTransfer(_msgSender(), withdrawFeeWallet, fff);

        emit SessionChanged(_msgSender(), newSessionId, txHash);

        return true;
    }

}