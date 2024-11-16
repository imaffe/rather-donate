export enum BurnOption {
  GCC,
  BACK,
  ADDRESS
}

export enum ProposalStatus {
  ACTIVE,
  VOTING,
  COMPLETED,
  CANCELLED
}

export interface Proposal {
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
  artifacts: string[];
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Vote {
  voter: string;
  approved: boolean;
  timestamp: Date;
} 