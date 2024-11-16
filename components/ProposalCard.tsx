"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Proposal } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ProposalCardProps {
  proposal: Proposal;
  onClick: () => void;
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
  const totalDonations = proposal.donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{proposal.name}</CardTitle>
          <Badge>{proposal.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {proposal.content}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created by</span>
            <span className="font-medium">{proposal.applicantInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total donations</span>
            <span className="font-medium">{totalDonations} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}