// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Token} from "./Token.sol";

contract Exchange {
    address public owner;
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256))
        private userTotalTokenBalance;

    event TokensDeposited(
        address indexed token,
        address indexed user,
        uint256 amount,
        uint256 balance
    );
    event TokensWithdraw(
        address indexed token,
        address indexed user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _owner, address _feeAccount, uint256 _feePercent) {
        owner = _owner;
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function totalBalanceOf(
        address _token,
        address _user
    ) public view returns (uint256 amount) {
        return userTotalTokenBalance[_user][_token];
    }

    function depositToken(address _token, uint256 _amount) public {
        Token token = Token(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Exchange: Token transfer failed."
        );
        userTotalTokenBalance[msg.sender][_token] += _amount;

        emit TokensDeposited(
            _token,
            msg.sender,
            _amount,
            userTotalTokenBalance[msg.sender][_token]
        );
        (msg.sender, _amount);
    }

    function withdrawToken(address _token, uint _amount) public {
        require(
            userTotalTokenBalance[msg.sender][_token] >= _amount,
            "Insufficient token amount."
        );

        Token token = Token(_token);
        token.transfer(msg.sender, _amount);
        userTotalTokenBalance[msg.sender][_token] -= _amount;
        emit TokensWithdraw(
            _token,
            msg.sender,
            _amount,
            userTotalTokenBalance[msg.sender][_token]
        );
    }
}
