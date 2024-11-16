import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { CONTRACT_ADDRESSES } from "@/config/contracts";
import ProposalManagerABI from "@/contracts/ProposalManager.json";
import { Proposal } from "@/types";

export function useProposalManager() {
  const { provider, account } = useWeb3React();
  const [contract, setContract] = useState<Contract | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (provider) {
      const proposalManager = new Contract(
        CONTRACT_ADDRESSES.PROPOSAL_MANAGER,
        ProposalManagerABI,
        provider
      );
      setContract(proposalManager);
    }
  }, [provider]);

  const fetchProposals = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const count = await contract.getProposalCount();
      const proposalPromises = [];

      for (let i = 1; i <= count; i++) {
        proposalPromises.push(contract.getProposal(i));
      }

      const proposalsData = await Promise.all(proposalPromises);
      const formattedProposals: Proposal[] = proposalsData.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        content: p.content,
        applicantInfo: {
          name: "", // This info might need to come from a different source
          address: p.creator
        },
        burnOption: p.burnOption,
        status: p.status,
        creatorId: p.creator,
        donations: [], // You might want to fetch this separately
        artifacts: [],
        votes: [],
        createdAt: new Date(p.createdAt * 1000),
        updatedAt: new Date(p.updatedAt * 1000)
      }));

      setProposals(formattedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    proposals,
    loading,
    refetch: fetchProposals
  };
} 