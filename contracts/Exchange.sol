// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Exchange {
    address public owner;
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _owner, address _feeAccount, uint256 _feePercent) {
        owner = _owner;
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}
