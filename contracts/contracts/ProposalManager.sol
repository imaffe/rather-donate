// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProposalManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _proposalIds;

    enum BurnOption { GCC, BACK, ADDRESS }
    enum ProposalStatus { ACTIVE, VOTING, COMPLETED, CANCELLED }

    struct Proposal {
        uint256 id;
        string name;
        string content;
        address creator;
        BurnOption burnOption;
        address burnAddress;
        ProposalStatus status;
        uint256 totalDonations;
        uint256 createdAt;
        uint256 updatedAt;
        string[] deliverables;
        bool isCreatorVoted;
        uint256 donorApprovalCount;
        uint256 donorRejectionCount;
    }

    struct Donation {
        address donor;
        uint256 amount;
        bool hasVoted;
        bool vote; // true for approve, false for reject
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Donation)) public donations;
    mapping(uint256 => address[]) public proposalDonors;

    uint256 public constant VOTING_DURATION = 7 days;
    uint256 public constant MIN_DONATION = 0.01 ether;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed creator);
    event DonationMade(uint256 indexed proposalId, address indexed donor, uint256 amount);
    event ProposalStatusChanged(uint256 indexed proposalId, ProposalStatus status);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool approved);
    event FundsDistributed(uint256 indexed proposalId, address indexed recipient, uint256 amount);

    modifier onlyProposalCreator(uint256 proposalId) {
        require(proposals[proposalId].creator == msg.sender, "Not proposal creator");
        _;
    }

    modifier onlyDonor(uint256 proposalId) {
        require(donations[proposalId][msg.sender].amount > 0, "Not a donor");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= _proposalIds.current(), "Invalid proposal");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createProposal(
        string memory name,
        string memory content,
        BurnOption burnOption,
        address burnAddress,
        string[] memory deliverables
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(content).length > 0, "Content required");
        require(deliverables.length > 0, "Deliverables required");
        
        if (burnOption == BurnOption.ADDRESS) {
            require(burnAddress != address(0), "Burn address required");
        }

        _proposalIds.increment();
        uint256 newProposalId = _proposalIds.current();

        proposals[newProposalId] = Proposal({
            id: newProposalId,
            name: name,
            content: content,
            creator: msg.sender,
            burnOption: burnOption,
            burnAddress: burnAddress,
            status: ProposalStatus.ACTIVE,
            totalDonations: 0,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            deliverables: deliverables,
            isCreatorVoted: false,
            donorApprovalCount: 0,
            donorRejectionCount: 0
        });

        emit ProposalCreated(newProposalId, msg.sender);
        return newProposalId;
    }

    function donateToProposal(uint256 proposalId) external payable proposalExists nonReentrant {
        require(proposals[proposalId].status == ProposalStatus.ACTIVE, "Proposal not active");
        require(msg.value >= MIN_DONATION, "Donation too small");

        if (donations[proposalId][msg.sender].amount == 0) {
            proposalDonors[proposalId].push(msg.sender);
        }

        donations[proposalId][msg.sender].amount += msg.value;
        donations[proposalId][msg.sender].donor = msg.sender;
        proposals[proposalId].totalDonations += msg.value;
        proposals[proposalId].updatedAt = block.timestamp;

        emit DonationMade(proposalId, msg.sender, msg.value);
    }

    function completeProposal(uint256 proposalId) external onlyProposalCreator(proposalId) {
        require(proposals[proposalId].status == ProposalStatus.ACTIVE, "Invalid status");
        proposals[proposalId].status = ProposalStatus.VOTING;
        proposals[proposalId].updatedAt = block.timestamp;
        
        emit ProposalStatusChanged(proposalId, ProposalStatus.VOTING);
    }

    function voteByCreator(uint256 proposalId, bool approve) external onlyProposalCreator(proposalId) {
        require(proposals[proposalId].status == ProposalStatus.VOTING, "Not in voting phase");
        require(!proposals[proposalId].isCreatorVoted, "Already voted");

        proposals[proposalId].isCreatorVoted = true;
        emit VoteCast(proposalId, msg.sender, approve);
    }

    function voteByDonor(uint256 proposalId, bool approve) external onlyDonor(proposalId) {
        require(proposals[proposalId].status == ProposalStatus.VOTING, "Not in voting phase");
        require(!donations[proposalId][msg.sender].hasVoted, "Already voted");

        donations[proposalId][msg.sender].hasVoted = true;
        donations[proposalId][msg.sender].vote = approve;

        if (approve) {
            proposals[proposalId].donorApprovalCount++;
        } else {
            proposals[proposalId].donorRejectionCount++;
        }

        emit VoteCast(proposalId, msg.sender, approve);
    }

    function distributeByAdmin(uint256 proposalId) external onlyOwner proposalExists {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.VOTING, "Not in voting phase");
        
        uint256 totalVotes = proposal.donorApprovalCount + proposal.donorRejectionCount;
        require(totalVotes > 0, "No votes cast");

        uint256 approvalPercentage = (proposal.donorApprovalCount * 100) / totalVotes;
        
        if (approvalPercentage >= 51) {
            // Transfer funds to creator
            uint256 amount = proposal.totalDonations;
            proposal.totalDonations = 0;
            proposal.status = ProposalStatus.COMPLETED;
            
            (bool success, ) = proposal.creator.call{value: amount}("");
            require(success, "Transfer failed");
            
            emit FundsDistributed(proposalId, proposal.creator, amount);
        } else {
            // Handle rejection based on burn option
            handleRejection(proposalId);
        }
    }

    function handleRejection(uint256 proposalId) private {
        Proposal storage proposal = proposals[proposalId];
        uint256 amount = proposal.totalDonations;
        proposal.totalDonations = 0;
        proposal.status = ProposalStatus.CANCELLED;

        if (proposal.burnOption == BurnOption.BACK) {
            // Return funds to donors
            for (uint256 i = 0; i < proposalDonors[proposalId].length; i++) {
                address donor = proposalDonors[proposalId][i];
                uint256 donationAmount = donations[proposalId][donor].amount;
                if (donationAmount > 0) {
                    donations[proposalId][donor].amount = 0;
                    (bool success, ) = donor.call{value: donationAmount}("");
                    require(success, "Transfer failed");
                    emit FundsDistributed(proposalId, donor, donationAmount);
                }
            }
        } else if (proposal.burnOption == BurnOption.ADDRESS) {
            // Send to specified burn address
            (bool success, ) = proposal.burnAddress.call{value: amount}("");
            require(success, "Transfer failed");
            emit FundsDistributed(proposalId, proposal.burnAddress, amount);
        }
        // For BurnOption.GCC, funds remain in contract
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    function getProposalDonors(uint256 proposalId) external view returns (address[] memory) {
        return proposalDonors[proposalId];
    }

    function getDonation(uint256 proposalId, address donor) external view returns (Donation memory) {
        return donations[proposalId][donor];
    }

    function getProposalCount() external view returns (uint256) {
        return _proposalIds.current();
    }

    receive() external payable {}
} 