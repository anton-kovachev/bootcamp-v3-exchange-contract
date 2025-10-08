// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {Token} from "./Token.sol";
import {Exchange} from "./Exchange.sol";
import {IFlashLoanReceiver} from "./FlashLoanProvider.sol";

event FlashLoanReceived(
    address indexed user,
    address indexed token,
    uint256 amount
);

contract FlashLoanUser is IFlashLoanReceiver {
    address owner;
    address exchange;

    constructor(address _exchange) {
        owner = msg.sender;
        exchange = _exchange;
    }

    function getFlashLoan(address _token, uint256 _amount) external {
        // require(
        //     msg.sender == owner,
        //     "FlashLoanUser: Only owner can request flash loans"
        // );
        Exchange(exchange).flashLoan(_token, _amount, "");
    }

    function receiveFlashLoan(
        address _token,
        uint256 _amount,
        bytes memory /*data*/
    ) external {
        require(msg.sender == exchange, "FlashLoanUser: Not Exchange contract");
        emit FlashLoanReceived(address(this), _token, _amount);

        Token(_token).transfer(exchange, _amount);
    }
}
