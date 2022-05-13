// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract GameOwnerUpgradeable is OwnableUpgradeable {
  mapping (address => bool) gameRoles;

  function initialize() virtual public initializer  {
    OwnableUpgradeable.__Ownable_init();
  }

  function addGameRole(address _game) public onlyOwner {
      gameRoles[_game] = true;
  }

  function removeGameRole(address _game) public onlyOwner {
      gameRoles[_game] = false;
  }

  modifier onlyGame {
    require(gameRoles[_msgSender()] == true, "Funflower Farm: You are not the game");
    _;
  }

}