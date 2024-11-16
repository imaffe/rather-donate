import { buildModule } from "@nomicfoundation/hardhat-ignition";
import { type ContractDeploymentModule } from "@nomicfoundation/hardhat-ignition/types";

export default buildModule("ProposalManager", (m): ContractDeploymentModule => {
  const proposalManager = m.contract("ProposalManager");
  
  return { proposalManager };
}); 