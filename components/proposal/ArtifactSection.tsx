"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Artifact } from "@/types";
import { Link, FileText, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ArtifactSectionProps {
  proposalId: string;
  artifacts: Artifact[];
  isCreator: boolean;
}

export function ArtifactSection({ proposalId, artifacts, isCreator }: ArtifactSectionProps) {
  const [newArtifactUrl, setNewArtifactUrl] = useState("");

  const handleAddArtifact = () => {
    // TODO: Implement artifact addition
    setNewArtifactUrl("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifacts</CardTitle>
      </CardHeader>
      <CardContent>
        {isCreator && (
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Enter URL"
              value={newArtifactUrl}
              onChange={(e) => setNewArtifactUrl(e.target.value)}
            />
            <Button onClick={handleAddArtifact}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {artifact.type === "LINK" ? (
                  <Link className="h-5 w-5 text-gray-500" />
                ) : (
                  <FileText className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium">{artifact.name}</p>
                  <p className="text-sm text-gray-500">
                    Added {formatDistanceToNow(new Date(artifact.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => window.open(artifact.url, "_blank")}>
                View
              </Button>
            </div>
          ))}

          {artifacts.length === 0 && (
            <p className="text-center text-gray-500">No artifacts added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}