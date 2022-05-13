   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./GameOwnerUpgradeable.sol";
import "./FFFToken.sol";
import "./TestToken.sol";


contract TestBank is GameOwnerUpgradeable, UUPSUpgradeable {

    FunflowerFarmToken private fffToken;
    TestToken private testToken;

    function initialize() public override initializer {
        GameOwnerUpgradeable.initialize();
        gameRoles[msg.sender] = true;
    }

    function setTokens(FunflowerFarmToken _fffToken, TestToken _testToken) public onlyOwner {
        fffToken = _fffToken;
        testToken = _testToken;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function withdraw(uint256 fff, uint256 ttt) public returns (bool) {
        fffToken.gameMint(_msgSender(), fff);
        testToken.gameMint(_msgSender(), ttt);
        return true;
    }

}