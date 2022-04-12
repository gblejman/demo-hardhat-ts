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

    /**
     * @dev Sets the values for {name}, {symbol}, {decimals}, {totalSupply}.
     *
     * All are immutable and can only be set during construction.
     */
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

    /**
     * @dev Returns the name of the token.
     */
    function name() public view override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the decimals places of the token.

     * NOTE: This information is only used for _display_ purposes, does not affect the arithmetic of the contract.
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns the amount of tokens owned by `account`.
     * @param account the owner account.
     * @return balance the account balance.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev Transfers `amount` tokens from caller's account to `to`.
     * @param to the to address. Must not be the zero address.
     * @param amount the amount of tokens. Caller must have a balance of at least `amount`. 0 amount is valid.
     * @return success a boolean value indicating whether the operation succeeded.
     *
     * Note Emits the `Transfer` event on success.
     * Note Throws if caller’s account balance does not have enough tokens
     */
    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        address from = msg.sender;
        return _transfer(from, to, amount);
    }

    /**
     * @dev Transfers `amount` tokens from `from` address to `to` address using the allowance mechanism.
     * @param from the from address. Must not be the zero address.
     * @param to the to address. Must not be the zero address.
     * @param amount the amount of tokens. Caller must have an allowance of at least `amount`. 0 amount is valid.
     *
     * Note Emits the `Transfer` event on success.
     * Note Throws unless the `from` address has deliberately authorized the caller to transfer `allowance` amount.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        address spender = msg.sender;
        uint256 currentAllowance = allowance(from, spender);
        require(currentAllowance >= amount, "Insuficient allowance");

        _approve(from, spender, currentAllowance - amount);
        return _transfer(from, to, amount);
    }

    /**
     * @dev Allows `spender` to withdraw from your account multiple times, up to the `amount` tokens. Calling overrides previous value.
     * @return success a boolean value indicating whether the operation succeeded.
     *
     * Note Emits the `Approval` event on success.
     * Note Beware racing condition https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     */
    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        address from = msg.sender;
        return _approve(from, spender, amount);
    }

    /**
     * @dev Returns the remaining `amount` that spender is still allowed to spend on behalf of owner. Defaults to 0.
     *
     * Note This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    /**
     * @dev Internal transfer
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal returns (bool) {
        require(from != address(0), "From address can not be the zero address");
        require(to != address(0), "To address can not be the zero address");

        uint256 fromBalance = _balances[from];

        require(fromBalance >= amount, "Insufficient balance");

        _balances[from] = fromBalance - amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        return true;
    }

    /**
     * @dev Internal approve
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal returns (bool) {
        _allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);

        return true;
    }
}
