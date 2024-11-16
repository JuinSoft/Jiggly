// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract RedeemableLink {
    IERC20 public usdcToken;
    address public owner;

    // Store deposits with unique IDs
    struct Deposit {
        address sender;
        uint256 amount;
        bool redeemed;
    }

    // Mapping of unique ID to Deposit
    mapping(string => Deposit) public deposits;

    // Events
    event LinkCreated(string indexed id, address indexed sender, uint256 amount);
    event Redeemed(string indexed id, address indexed redeemer, uint256 amount);

    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
        owner = msg.sender;
    }

    // Create a redeemable link by depositing USDC with a unique ID
    function createLink(string memory id, uint256 amount) external firewallProtected {
        require(deposits[id].sender == address(0), "ID already exists");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer USDC from sender to contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        // Store the deposit details
        deposits[id] = Deposit({
            sender: msg.sender,
            amount: amount,
            redeemed: false
        });

        emit LinkCreated(id, msg.sender, amount);
    }

    // Redeem the USDC associated with the unique ID
    function redeem(string memory id) external firewallProtected {
        Deposit storage deposit = deposits[id];
        require(deposit.sender != address(0), "Invalid ID");
        require(!deposit.redeemed, "Already redeemed");

        uint256 amount = deposit.amount;
        deposit.redeemed = true;

        // Transfer USDC to the redeemer
        bool success = usdcToken.transfer(msg.sender, amount);
        require(success, "Token transfer failed");

        emit Redeemed(id, msg.sender, amount);
    }

    // Allow the owner to withdraw tokens accidentally sent to the contract
    function withdrawTokens(address token, uint256 amount) external firewallProtected {
        require(msg.sender == owner, "Only owner can withdraw");
        IERC20(token).transfer(owner, amount);
    }
}
