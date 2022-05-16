   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./GameOwnerUpgradeable.sol";
import "./FFFToken.sol";

contract Bank is GameOwnerUpgradeable, UUPSUpgradeable {

    FunflowerFarmToken private fffToken;

    function initialize() public override initializer {
        GameOwnerUpgradeable.initialize();
        gameRoles[msg.sender] = true;
    }

    function setTokens(FunflowerFarmToken _fffToken) public onlyOwner {
        fffToken = _fffToken;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function withdraw(
       // bytes memory signature,
       // bytes32 sessionId,
        uint256 fff) 
        payable public returns (bool) {
        fffToken.gameMint(msg.sender, fff);
        return true;
    }

}