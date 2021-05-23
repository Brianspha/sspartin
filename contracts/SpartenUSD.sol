pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";

// SPDX-License-Identifier: RANDOM_TEXT

/**
 * @dev Optional functions from the ERC20 standard.
 */
contract SpartenUSD is ERC20{
    using SafeMath
    for uint256;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    address private _owner;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    /**
     * @dev Sets the values for `name`, `symbol`, and `decimals`. All three of
     * these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name, string memory symbol, uint8 decimals, uint256 initialsupply)  ERC20(name,symbol) {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        _owner = msg.sender;
        _totalSupply = initialsupply.mul(10** decimals);
        _mint(_owner, _totalSupply);
    }

    
}