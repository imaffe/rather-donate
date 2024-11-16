"use client";

import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { CONTRACT_ADDRESSES } from "../../config/contracts";
import ProposalManagerABI from "../../contracts/ProposalManager.json";
import { BurnOption } from "@/types";

export default function CreateProposalPage() {
  const router = useRouter();
  const { provider, account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    burnOption: BurnOption.GCC,
    burnAddress: "",
    deliverables: [""] // At least one deliverable is required by contract
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !account) return;

    try {
      setLoading(true);
      const contract = new Contract(
        CONTRACT_ADDRESSES.PROPOSAL_MANAGER,
        ProposalManagerABI.abi,
        provider.getSigner()
      );

      // Validate burn address if burnOption is ADDRESS
      const burnAddress = formData.burnOption === BurnOption.ADDRESS 
        ? formData.burnAddress 
        : "0x0000000000000000000000000000000000000000";

      // Filter out empty deliverables
      const deliverables = formData.deliverables.filter(d => d.trim() !== "");
      if (deliverables.length === 0) {
        throw new Error("At least one deliverable is required");
      }

      const tx = await contract.createProposal(
        formData.name,
        formData.content,
        formData.burnOption,
        burnAddress,
        deliverables
      );

      await tx.wait();
      router.push("/"); // Redirect to home page after success
    } catch (error) {
      console.error("Error creating proposal:", error);
      // You might want to add proper error handling/display here
    } finally {
      setLoading(false);
    }
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, ""]
    }));
  };

  const updateDeliverable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => i === index ? value : d)
    }));
  };

  const removeDeliverable = (index: number) => {
    if (formData.deliverables.length > 1) {
      setFormData(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="container mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-8">Create Proposal</h1>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Proposal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Proposal Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              className="min-h-[200px]"
            />
          </div>

          <div>
            <Label>Burn Option</Label>
            <RadioGroup
              value={formData.burnOption.toString()}
              onValueChange={(value: string) => 
                setFormData(prev => ({ ...prev, burnOption: parseInt(value) }))}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BurnOption.GCC.toString()} id="gcc" />
                <Label htmlFor="gcc">Burn GCC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BurnOption.BACK.toString()} id="back" />
                <Label htmlFor="back">Return to Donors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={BurnOption.ADDRESS.toString()} id="address" />
                <Label htmlFor="address">Burn Address</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.burnOption === BurnOption.ADDRESS && (
            <div>
              <Label htmlFor="burnAddress">Burn Address</Label>
              <Input
                id="burnAddress"
                value={formData.burnAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData(prev => ({ ...prev, burnAddress: e.target.value }))}
                placeholder="0x..."
                required
              />
            </div>
          )}

          <div className="space-y-4">
            <Label>Deliverables</Label>
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={deliverable}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateDeliverable(index, e.target.value)}
                  placeholder={`Deliverable ${index + 1}`}
                  required
                />
                {formData.deliverables.length > 1 && (
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={() => removeDeliverable(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addDeliverable}>
              Add Deliverable
            </Button>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Proposal"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}