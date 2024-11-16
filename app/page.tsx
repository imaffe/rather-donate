"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { ConnectWallet } from "../components/ConnectWallet";
import { useWeb3React } from "@web3-react/core";
import { ProposalCard } from "../components/ProposalCard";
import { useProposalManager } from "./hooks/useProposalManager";
import { Skeleton } from "../components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const { active } = useWeb3React();
  const { proposals, loading } = useProposalManager();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-bold">RatherDonate</div>
          <ConnectWallet />
        </div>
      </header>

      <main className="container mx-auto p-6 pt-20">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            onClick={() => router.push("/proposals/create")}
            className="w-fit"
            disabled={!active}
          >
            Create Proposal
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onClick={() => router.push(`/proposals/${proposal.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No proposals found. Be the first to create one!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}