/*
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
*/
const accounts = {
  TEAM : {
    address : "0x17e0cC27d7030de22b01a0c235abbb0F99f641ba",
    privateKey : "0x50a9586d7081c9d61233bcb23853e10bb4c97fdfc4212b8c050fd90d92e65c20"
    
  },
  PLAYER : {
    address : "0xAcA6b82bd697EDCa9F2fe497D55fd9F787E92e5f",
    privateKey : "0xe25bed314a90ea95134f0936045598867491c4c0ac83b22b7965165d31ef961d"
  },
  WITHDRAW_WALLET : {
    address : "0x6eF5dBF9902AD320Fe49216D086B2b50AbC9328f",
    privateKey : ""
  }
}

module.exports = {
  accounts
};