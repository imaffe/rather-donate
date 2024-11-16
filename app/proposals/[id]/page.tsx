"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Proposal, ProposalStatus } from "@/types";
import { ArtifactSection } from "@/components/proposal/ArtifactSection";
import { DonationSection } from "@/components/proposal/DonationSection";
import { VotingSection } from "@/components/proposal/VotingSection";
import { ProposalInfo } from "@/components/proposal/ProposalInfo";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data fetching
const mockProposal: Proposal = {
  id: "1",
  name: "Community Garden Project",
  content: "Creating a sustainable garden...",
  applicantInfo: {
    name: "John Doe",
    address: "0x1234...5678",
  },
  burnOption: "GCC",
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
      message: "Great initiative! Happy to support.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "2",
      amount: 1.0,
      donor: {
        name: "Bob Johnson",
        address: "0xefgh...5678"
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  ],
  artifacts: [],
  votes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProposalDetail({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<Proposal>(mockProposal);
  const router = useRouter();
  
  // Mock user data - replace with actual auth
  const currentUserId = "user1";
  const currentUserAddress = "0x1234...5678"; // Replace with actual user's ETH address
  const isCreator = currentUserId === proposal.creatorId;

  const handleComplete = async () => {
    setProposal((prev) => ({
      ...prev,
      status: ProposalStatus.VOTING,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <Badge className="text-lg">{proposal.status}</Badge>
        </div>

        <ProposalInfo proposal={proposal} />

        <div className="mt-8 space-y-6">
          <ArtifactSection 
            proposalId={proposal.id} 
            artifacts={proposal.artifacts}
            isCreator={isCreator}
          />

          <DonationSection
            proposalId={proposal.id}
            donations={proposal.donations}
          />

          {proposal.status === ProposalStatus.VOTING && (
            <VotingSection
              proposalId={proposal.id}
              votes={proposal.votes}
              donations={proposal.donations}
              isCreator={isCreator}
              currentUserId={currentUserId}
              currentUserAddress={currentUserAddress}
            />
          )}

          {isCreator && proposal.status === ProposalStatus.ACTIVE && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Proposal</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleComplete}
                  className="w-full"
                >
                  Mark as Complete
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}