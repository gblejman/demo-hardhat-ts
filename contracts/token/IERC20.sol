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
     * @dev MUST trigger when tokens are transferred, including zero value transfers.
     *
     * Note A token contract which creates new tokens SHOULD trigger a Transfer event with the _from address set to 0x0 when tokens are created.
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     * @dev MUST trigger on any successful call to approve(address _spender, uint256 _value).
     */
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    /**
     * @dev OPTIONAL. Returns the name of the token - e.g. "MyToken"
     */
    function name() external view returns (string memory);

    /**
     * @dev OPTIONAL. Returns the symbol of the token. E.g. “HIX”.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev OPTIONAL. Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the total token supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the account balance of another account with address _owner.
     */
    function balanceOf(address _owner) external view returns (uint256 balance);

    /**
     * @dev Transfers _value amount of tokens to address _to, and MUST fire the Transfer event.
     * The function SHOULD throw if the message caller’s account balance does not have enough tokens to spend.
     * Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
     */
    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    /**
     * @dev Transfers _value amount of tokens from address _from to address _to, and MUST fire the Transfer event.
     * The transferFrom method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf. This can be used for example to allow a contract to transfer tokens on your behalf and/or to charge fees in sub-currencies. The function SHOULD throw unless the _from account has deliberately authorized the sender of the message via some mechanism.
     * Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    /**
     * @dev Allows _spender to withdraw from your account multiple times, up to the _value amount. If this function is called again it overwrites the current allowance with _value.
     * Note To prevent attack vectors, clients SHOULD make sure to create user interfaces in such a way that they set the allowance first to 0 before setting it to another value for the same spender. THOUGH The contract itself shouldn’t enforce it, to allow backwards compatibility with contracts deployed before.
     */
    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    /**
     * @dev Returns the amount which _spender is still allowed to withdraw from _owner.
     */
    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);
}
