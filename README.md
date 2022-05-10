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

FFFTOKEN_CONTRACT=[0xD1f9c58e33933a993A3891F8acFe05a68E1afC05](https://rinkeby.etherscan.io/token/0x4388528987490e680fa424be3058cecdba695be7) in rinkeby
          
## Architecture

Funflower farm  uses an off-chain architecture to allow players to store data off-chain without the need to transact on the Blockchain after every action.

**Data Storage**
_Contracts that hold the core data in the game_

- `FFFToken.sol` - FFF ERC20 token


