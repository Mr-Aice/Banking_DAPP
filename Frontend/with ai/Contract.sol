// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    // Struct to represent a withdrawal transaction
    struct Withdrawal {
        uint256 amount;     // Amount withdrawn in wei
        address to;         // Recipient address
        uint256 timestamp;  // Time of withdrawal
    }

    // Struct to represent a campaign
    struct Campaign {
        address owner;          // Address of the campaign creator
        string title;           // Title of the campaign
        string description;     // Description of the campaign
        uint256 target;         // Funding goal in wei
        uint256 deadline;       // Deadline timestamp for the campaign
        uint256 amountCollected; // Total amount collected in wei
        uint256 amountWithdrawn; // Total amount withdrawn by the owner in wei
        string image;           // URL or IPFS hash of the campaign image
        address[] donators;     // List of donator addresses
        uint256[] donations;    // List of donation amounts
        Withdrawal[] withdrawals; // List of withdrawal transactions
    }

    // Mapping to store campaigns, with campaign ID as the key
    mapping(uint256 => Campaign) public campaigns;

    // Counter for the total number of campaigns
    uint256 public numberOfCampaigns = 0;

    // Event Declarations for Transparency
    event CampaignCreated(uint256 indexed campaignId, address owner, uint256 target, uint256 deadline);
    event DonationReceived(uint256 indexed campaignId, address donator, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address to, uint256 amount);

    // Function to create a new campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.amountWithdrawn = 0;
        campaign.image = _image;

        emit CampaignCreated(numberOfCampaigns, _owner, _target, _deadline);
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    // Function to donate to a specific campaign
    function donateToCampaign(uint256 _id) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign has ended.");

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    // Function to withdraw funds in chunks to different wallets
    function withdrawFunds(
        uint256 _id,
        uint256 _amount,
        address payable _to
    ) public {
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds.");
        require(_amount > 0, "Withdrawal amount must be greater than 0.");

        uint256 availableFunds = campaign.amountCollected - campaign.amountWithdrawn;
        require(_amount <= availableFunds, "Insufficient funds available for withdrawal.");

        campaign.amountWithdrawn += _amount;
        campaign.withdrawals.push(Withdrawal(_amount, _to, block.timestamp));

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        emit FundsWithdrawn(_id, _to, _amount);
    }

    // Function to get the available withdrawable amount
    function getAvailableWithdrawableAmount(uint256 _id) public view returns (uint256) {
        Campaign storage campaign = campaigns[_id];
        return campaign.amountCollected - campaign.amountWithdrawn;
    }

    // Function to get withdrawal transaction records
    function getWithdrawals(uint256 _id) public view returns (Withdrawal[] memory) {
        return campaigns[_id].withdrawals;
    }

    // Function to get total amount collected
    function getTotalCollected(uint256 _id) public view returns (uint256) {
        return campaigns[_id].amountCollected;
    }

    // Function to get donators and their donations
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // Function to get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    // Receive function to reject direct Ether transfers without data
    receive() external payable {
        revert("Please specify a campaign ID");
    }

    // Fallback function to handle direct Ether transfers with campaign ID in data
    fallback() external payable {
        require(msg.data.length == 32, "Invalid data length");
        uint256 campaignId = abi.decode(msg.data, (uint256));
        require(campaignId < numberOfCampaigns, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Donation amount must be greater than 0");

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }
}