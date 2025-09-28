// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {Token} from "./Token.sol";

interface IFlashLoanReceiver {
    function receiveFlashLoan(
        address token,
        uint256 amount,
        bytes memory data
    ) external;
}

abstract contract FlashLoanProvider {
    event FlashLoan(address token, uint256 amount, uint256 timestamp);
    function flashLoan(
        address _token,
        uint256 _amount,
        bytes memory _data
    ) public {
        Token token = Token(_token);
        require(
            token.balanceOf(address(this)) >= _amount,
            "FlashLoanProvider: Insufficient funds to loan."
        );

        require(
            token.transfer(msg.sender, _amount),
            "FlashLoanProvider: Transfer failed."
        );

        IFlashLoanReceiver(msg.sender).receiveFlashLoan(_token, _amount, _data);

        emit FlashLoan(_token, _amount, block.timestamp);
    }
}
