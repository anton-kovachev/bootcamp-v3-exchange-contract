// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0), "Token: recipient is address 0.");
        return _transfer(msg.sender, _to, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_from != address(0), "Token: sender is address 0.");
        require(_to != address(0), "Token: recipient is address 0.");
        require(balanceOf[_from] >= _value, "Token: insufficient funds.");
        require(
            allowance[_from][msg.sender] >= _value,
            "Token: funds not allowed."
        );

        allowance[_from][msg.sender] -= _value;
        return _transfer(_from, _to, _value);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal returns (bool success) {
        require(balanceOf[_from] >= _value, "Token: insufficient funds.");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        require(_spender != address(0), "Token: spender is address 0.");
        require(balanceOf[msg.sender] >= _value, "Token: insufficient funds.");
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
