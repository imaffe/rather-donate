import { Donation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface DonationsListProps {
  donations: Donation[];
}

export function DonationsList({ donations }: DonationsListProps) {
  if (donations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No donations yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <Card key={donation.id} className="bg-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{donation.donor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {donation.donor.address}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{donation.amount} ETH</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            {donation.message && (
              <p className="mt-2 text-sm text-muted-foreground">{donation.message}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 