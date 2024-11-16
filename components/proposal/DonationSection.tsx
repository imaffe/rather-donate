"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Donation } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { DonationsList } from "./DonationsList";

interface DonationSectionProps {
  proposalId: string;
  donations: Donation[];
}

export function DonationSection({ proposalId, donations }: DonationSectionProps) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const handleDonate = () => {
    // TODO: Implement donation logic
    setAmount("");
    setAddress("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Amount (ETH)</label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Ethereum Address</label>
            <Input
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleDonate}>
            Donate
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
          <DonationsList donations={donations} />
        </div>
      </CardContent>
    </Card>
  );
}