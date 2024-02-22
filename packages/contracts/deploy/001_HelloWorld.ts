import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  await deploy("HelloWorld", {
    contract: "HelloWorld",
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default func;
func.tags = ["testbed", "_helloWorld"];
