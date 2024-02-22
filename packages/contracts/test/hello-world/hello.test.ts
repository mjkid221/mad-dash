/* eslint-disable camelcase -- allow for tests */
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
import { deployments, ethers } from "hardhat";

describe("HelloWorld hello tests", () => {
  // let Deployer: SignerWithAddress;
  // let Alice: SignerWithAddress;
  // let Bob: SignerWithAddress;
  // let Carol: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture("testbed");
    const signers = await ethers.getSigners();
    console.log(signers);
    // [Deployer, Alice, Bob, Carol] = signers;

    // HelloWorld_Deployer = await ethers.getContract("HelloWorld", Deployer);
    // HelloWorld_Alice = HelloWorld_Deployer.connect(Alice);
    // HelloWorld_Bob = HelloWorld_Deployer.connect(Bob);
    // HelloWorld_Carol = HelloWorld_Deployer.connect(Carol);
  });

  it("Should return hello world!", async () => {
    // expect(await HelloWorld_Deployer.hello()).eq("hello world!");
  });
});
