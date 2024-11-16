"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Proposal } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Users, Coins, Flame } from "lucide-react";

interface ProposalInfoProps {
  proposal: Proposal;
}

export function ProposalInfo({ proposal }: ProposalInfoProps) {
  const getTotalDonations = () => {
    return proposal.donations.reduce((sum, donation) => sum + donation.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{proposal.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Donors</p>
              <p className="font-medium">{proposal.donations.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{getTotalDonations()} ETH</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Burn Option</p>
              <p className="font-medium">{proposal.burnOption}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{proposal.content}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Applicant Information</h3>
          <div className="space-y-1 text-gray-600 dark:text-gray-300">
            <p>Name: {proposal.applicantInfo.name}</p>
            <p>Address: {proposal.applicantInfo.address}</p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Created {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}