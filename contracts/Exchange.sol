// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Token} from "./Token.sol";

contract Exchange {
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

    event OrderCreated(
        address indexed user,
        address indexed tokenGet,
        uint256 amountGet,
        address indexed tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event OrderCancelled(
        address indexed user,
        address indexed tokenGet,
        uint256 amountGet,
        address indexed tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    address public owner;
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256))
        private userTotalTokenBalance;

    mapping(address => mapping(address => uint256))
        private userActiveTotalBalance;

    struct Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orderBook;
    mapping(address => uint256[]) userOrders;
    mapping(uint256 => bool) public isOrderCancelled;

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

    function activeBalanceOf(
        address _token,
        address _user
    ) public view returns (uint256 activeAmount) {
        return userActiveTotalBalance[_user][_token];
    }

    function depositToken(address _token, uint256 _amount) public {
        Token token = Token(_token);
        userTotalTokenBalance[msg.sender][_token] += _amount;

        emit TokensDeposited(
            _token,
            msg.sender,
            _amount,
            userTotalTokenBalance[msg.sender][_token]
        );

        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Exchange: Token transfer failed."
        );
    }

    function withdrawToken(address _token, uint _amount) public {
        require(
            totalBalanceOf(_token, msg.sender) -
                activeBalanceOf(_token, msg.sender) >=
                _amount,
            "Exchange: Insufficient token balance."
        );

        userTotalTokenBalance[msg.sender][_token] -= _amount;
        emit TokensWithdraw(
            _token,
            msg.sender,
            _amount,
            userTotalTokenBalance[msg.sender][_token]
        );

        Token token = Token(_token);
        require(
            token.transfer(msg.sender, _amount),
            "Exchange: Token transfer failed."
        );
    }

    //Make & Cancel Orders
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(
            totalBalanceOf(_tokenGive, msg.sender) >=
                activeBalanceOf(_tokenGive, msg.sender) + _amountGive,
            "Exchange: Insufficient token balance."
        );

        orderCount += 1;
        orderBook[orderCount] = Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        userActiveTotalBalance[msg.sender][_tokenGive] += _amountGive;

        emit OrderCreated(
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        // userOrders[msg.sender].push(orderCount);
    }

    function cancelOrder(uint256 _id) public {
        Order storage order = orderBook[_id];
        require(order.id == _id, "Exchange: Order does not exists.");
        require(
            order.user == msg.sender,
            "Exchange: Not the owner of the order."
        );
        require(
            isOrderCancelled[_id] == false,
            "Exchange: Order already cancelled."
        );

        isOrderCancelled[_id] = true;
        userActiveTotalBalance[msg.sender][order.tokenGive] -= order.amountGive;

        emit OrderCancelled(
            msg.sender,
            order.tokenGet,
            order.amountGet,
            order.tokenGive,
            order.amountGive,
            block.timestamp
        );
    }
}
