"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote, Donation } from "@/types";

interface VotingSectionProps {
  proposalId: string;
  votes: Vote[];
  donations: Donation[];
  isCreator: boolean;
  currentUserId: string;
  currentUserAddress: string;
}

export function VotingSection({
  proposalId,
  votes,
  donations,
  isCreator,
  currentUserId,
  currentUserAddress,
}: VotingSectionProps) {
  const [isVoting, setIsVoting] = useState(false);

  const isDonor = donations.some(
    donation => donation.donor.address.toLowerCase() === currentUserAddress.toLowerCase()
  );

  const hasVoted = votes.some(
    vote => vote.voterAddress.toLowerCase() === currentUserAddress.toLowerCase()
  );

  const handleVote = async (vote: boolean) => {
    try {
      setIsVoting(true);
      // TODO: Implement voting logic here
      
      // Mock implementation
      console.log(`Voted ${vote ? 'Yes' : 'No'} on proposal ${proposalId}`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = votes.length;
  const yesVotes = votes.filter(vote => vote.vote).length;
  const noVotes = totalVotes - yesVotes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{yesVotes}</p>
              <p className="text-sm text-muted-foreground">Yes Votes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{noVotes}</p>
              <p className="text-sm text-muted-foreground">No Votes</p>
            </div>
          </div>

          {isDonor && !hasVoted && !isCreator && (
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleVote(true)}
                disabled={isVoting}
              >
                Vote Yes
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleVote(false)}
                disabled={isVoting}
              >
                Vote No
              </Button>
            </div>
          )}

          {!isDonor && !isCreator && (
            <p className="text-center text-muted-foreground">
              Only donors can vote on this proposal
            </p>
          )}

          {hasVoted && (
            <p className="text-center text-muted-foreground">
              You have already voted on this proposal
            </p>
          )}

          {isCreator && (
            <p className="text-center text-muted-foreground">
              Creators cannot vote on their own proposal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}