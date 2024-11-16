"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWeb3React } from "@web3-react/core";
import { Proposal, ProposalStatus, BurnOption } from "@/types";
import { ProposalCard } from "@/components/ProposalCard";

// Mock data
const mockProposals: Proposal[] = [
  {
    id: "1",
    name: "Community Garden Project",
    content: "Creating a sustainable garden for the local community with organic vegetables and educational programs.",
    applicantInfo: {
      name: "John Doe",
      address: "0x1234...5678",
    },
    burnOption: BurnOption.GCC,
    status: ProposalStatus.ACTIVE,
    creatorId: "user1",
    donations: [
      {
        id: "1",
        amount: 0.5,
        donor: {
          name: "Alice Smith",
          address: "0xabcd...1234"
        },
        message: "Great initiative!",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    ],
    artifacts: [],
    votes: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Tech Education Program",
    content: "Providing coding bootcamps and tech education for underprivileged youth.",
    applicantInfo: {
      name: "Sarah Wilson",
      address: "0x5678...9012",
    },
    burnOption: BurnOption.BACK,
    status: ProposalStatus.VOTING,
    creatorId: "user2",
    donations: [
      {
        id: "2",
        amount: 1.2,
        donor: {
          name: "Bob Johnson",
          address: "0xefgh...5678"
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ],
    artifacts: [],
    votes: [],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Local Art Gallery",
    content: "Supporting local artists by creating a community art gallery space.",
    applicantInfo: {
      name: "Emma Brown",
      address: "0x9012...3456",
    },
    burnOption: BurnOption.ADDRESS,
    burnAddress: "0x1234...5678",
    status: ProposalStatus.COMPLETED,
    creatorId: "user3",
    donations: [],
    artifacts: [],
    votes: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
];

export default function Home() {
  const router = useRouter();
  const { active } = useWeb3React();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-bold">ProposalHub</div>
          <ConnectWallet />
        </div>
      </header>

      <main className="container mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
              <Button onClick={() => router.push("/proposals/create")}>
                Create Proposal
              </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onClick={() => router.push(`/proposals/${proposal.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}