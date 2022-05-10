
   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./GameOwner.sol";

contract FunflowerFarmToken is ERC20Pausable, GameOwner {
  address private team;

  uint256 private TEAM_INITIAL_MINT = 500000*10**18; // 500000 FFF

  constructor() payable ERC20("Funflower Farm", "FFF") {
      team = msg.sender;
      gameRoles[msg.sender] = true;
      _mint(team, TEAM_INITIAL_MINT);
  }

  function passTeamRole(address _team) public onlyOwner returns (bool) {
    team = _team;
    return true;
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
