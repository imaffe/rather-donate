export type User = {
  id: string;
  email: string;
  name: string;
  ethAddress: string;
};

export enum BurnOption {
  BACK = "BACK",
  GCC = "GCC",
  ADDRESS = "ADDRESS"
}

export enum ProposalStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  VOTING = "VOTING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export type Artifact = {
  id: string;
  type: "LINK" | "FILE";
  url: string;
  name: string;
  createdAt: Date;
};

export interface Donation {
  id: string;
  amount: number;
  donor: {
    name: string;
    address: string;
  };
  message?: string;
  createdAt: Date;
}

export type Vote = {
  voterAddress: string;
  vote: boolean;
  createdAt: Date;
};

export type Proposal = {
  id: string;
  name: string;
  content: string;
  applicantInfo: {
    name: string;
    address: string;
  };
  burnOption: BurnOption;
  burnAddress?: string;
  status: ProposalStatus;
  creatorId: string;
  donations: Donation[];
  artifacts: Artifact[];
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
};