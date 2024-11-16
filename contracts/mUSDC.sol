// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // Mint 1,000,000 mUSDC to the deployer
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // Set the same decimals as USDC (6 decimals)
    }
}
