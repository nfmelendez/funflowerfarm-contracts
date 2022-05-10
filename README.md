# Funflower Farm Contracts

This repo includes the contracts used in [Funflower land](https://funflowerfarm.com/) along with a suite of tests.

## Prerequisites

- make
- solc (brew install solidity)
- nodejs
- docker-compose

## Getting Started with this repo

Run `make` to see full list of commands.

## Testing

1. Open docker (if not already running)
2. Start ganache - `docker-compose up eth`
3. `make test`

## Contract Addresses

FFFTOKEN_CONTRACT=[0x47466739ce3ae36fdb7c1a0419a5fdc862c666b2](https://rinkeby.etherscan.io/token/0x47466739ce3ae36fdb7c1a0419a5fdc862c666b2) in rinkeby
          
## Architecture

Funflower farm  uses an off-chain architecture to allow players to store data off-chain without the need to transact on the Blockchain after every action.

**Data Storage**
_Contracts that hold the core data in the game_

- `FFFToken.sol` - FFF ERC20 token


