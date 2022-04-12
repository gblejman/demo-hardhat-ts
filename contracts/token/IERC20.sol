//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 * Note EIP: https://eips.ethereum.org/EIPS/eip-20
 * Note
 * Note Callers MUST handle false from returns (bool success). Callers MUST NOT assume that false is never returned!
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when `owner` approves the allowance `value` amount for a `spender`.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the name of the token - E.g. "MyToken"
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token - E.g. “HIX”.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token - e.g. if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed  as `5.05` (`505 / 10 ** 2`).
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     * @param account the owner account.
     * @return balance the account balance.
     */
    function balanceOf(address account) external view returns (uint256 balance);

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
        external
        returns (bool success);

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
    ) external returns (bool success);

    /**
     * @dev Allows `spender` to withdraw from your account multiple times, up to the `amount` tokens. Calling overrides previous value.
     * @return success a boolean value indicating whether the operation succeeded.
     *
     * Note Emits the `Approval` event on success.
     * Note Beware racing condition https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     */
    function approve(address spender, uint256 amount)
        external
        returns (bool success);

    /**
     * @dev Returns the remaining `amount` that spender is still allowed to spend on behalf of owner. Defaults to 0.
     *
     * Note This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256 remaining);
}
