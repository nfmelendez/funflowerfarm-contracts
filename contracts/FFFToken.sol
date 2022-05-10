
   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./GameOwner.sol";

contract FunflowerFarmToken is ERC20Pausable, GameOwner {

  uint256 private TEAM_INITIAL_MINT = 500000*10**18; // 500000 FFF

  constructor() payable ERC20("Funflower Farm", "FFF") {
      gameRoles[msg.sender] = true;
      _mint(msg.sender, TEAM_INITIAL_MINT);
  }
  
  function gameMint(address account, uint256 amount) public onlyGame whenNotPaused returns (bool){
	  _mint(account, amount);
    return true;
 }

  function gameBurn(address account, uint256 amount) public onlyGame whenNotPaused returns (bool){
	  _burn(account, amount);
    return true;
  }

  function gameTransfer(address from, address to, uint256 amount) public onlyGame whenNotPaused returns (bool){
	  _transfer(from, to, amount);
    return true;
  }

  function gameApprove(address spender, uint256 amount) public onlyGame whenNotPaused returns (bool) {
    _approve(_msgSender(), spender, amount);
    return true;
  }

  function pause() public onlyGame {
    _pause();
  }

  function unPause() public onlyGame {
    _unpause();
  }

}
