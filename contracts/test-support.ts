import Web3 from "web3";
import { AbiItem } from "web3-utils";
import abijson from "../bin/contracts/combined.json";

export const gasLimit = 6721975;

export class TestAccount {
  static readonly TEAM = new TestAccount( // ganache-cli account number (0)
    "0x17e0cC27d7030de22b01a0c235abbb0F99f641ba",
    "0x50a9586d7081c9d61233bcb23853e10bb4c97fdfc4212b8c050fd90d92e65c20"
  );

  static readonly PLAYER = new TestAccount( // ganache-cli account number (2)
    "0xAcA6b82bd697EDCa9F2fe497D55fd9F787E92e5f",
    "0xe25bed314a90ea95134f0936045598867491c4c0ac83b22b7965165d31ef961d"
  );

  private constructor(
    public readonly address: string,
    public readonly privateKey: any
  ) {}
}

export async function deploySFLContracts(web3: Web3) {
  const [fffToken] = await Promise.all([

    deployContract(
      web3,
      abijson.contracts["contracts/FFFToken.sol:FunflowerFarmToken"],
      TestAccount.TEAM.address,
    ),
  ]);

  return { fffToken };
}

async function deployContract(
  web3: Web3,
  contract: { abi: {}; bin: string },
  address: string,
  args: any[] = []
) {
  const contractToDeploy = new web3.eth.Contract(contract.abi as AbiItem[]);

  return contractToDeploy
    .deploy({
      data: contract.bin,
      arguments: args,
    })
    .send({
      from: address,
      gasPrice: await web3.eth.getGasPrice(),
      gas: gasLimit,
    });
}
