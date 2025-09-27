// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {Token} from "./Token.sol";

abstract contract FlashLoanProvider {
    event FlashLoan(address token, uint256 amount, uint256 timestamp);
    function flashLoan(
        address _token,
        uint256 _amount,
        bytes memory data
    ) public {
        //Send the money
        Token token = Token(_token);
        token.transfer(msg.sender, _amount);

        //Ask for them back

        //Ensure that money was paid back
        emit FlashLoan(_token, _amount, block.timestamp);
    }
}
