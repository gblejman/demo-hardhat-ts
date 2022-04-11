//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "hardhat/console.sol";

contract ERC20 is IERC20 {
    address private _owner;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_
    ) {
        require(bytes(name_).length > 0, "Token name must not be empty");
        require(bytes(symbol_).length > 0, "Token symbol must not be empty");
        require(decimals_ <= 18, "Token decimals must be between 0 and 18");
        require(totalSupply_ > 0, "Token total supply must be positive");

        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _totalSupply = totalSupply_;
        _owner = msg.sender;
        _balances[msg.sender] = totalSupply_;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address owner_) public view override returns (uint256) {
        return _balances[owner_];
    }

    function transfer(address to_, uint256 value_)
        public
        override
        returns (bool)
    {
        require(to_ != address(0), "To address can not be the zero address");
        require(_balances[msg.sender] >= value_, "Insufficient balance");

        _balances[msg.sender] -= value_;
        _balances[to_] += value_;

        emit Transfer(msg.sender, to_, value_);

        return true;
    }

    function transferFrom(
        address from_,
        address to_,
        uint256 value_
    ) public override returns (bool) {
        require(
            _allowances[from_][msg.sender] >= value_,
            "Insuficient allowance"
        );

        // missing approval evt
        _allowances[from_][msg.sender] =
            (_allowances[from_][msg.sender]) -
            value_;

        require(to_ != address(0), "To address can not be the zero address");
        require(_balances[from_] >= value_, "Insufficient balance");

        _balances[from_] -= value_;
        _balances[to_] += value_;

        emit Transfer(from_, to_, value_);

        return true;
    }

    function approve(address spender_, uint256 value_)
        public
        override
        returns (bool)
    {
        _allowances[msg.sender][spender_] = value_;

        emit Approval(msg.sender, spender_, value_);

        return true;
    }

    function allowance(address owner_, address spender_)
        public
        view
        override
        returns (uint256)
    {
        return _allowances[owner_][spender_];
    }
}
