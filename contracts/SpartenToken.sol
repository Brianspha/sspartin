
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract SpartenToken is ERC721URIStorage, Ownable {
    using Address for address;
    using Strings for uint256;
    using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping (uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping (address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

     
    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor (string memory name_, string memory symbol_)  ERC721(name_,symbol_){
        _name = name_;
        _symbol = symbol_;
    }

   /**
   @dev mints a new token
    */
 function mintToken (string memory tokenData, address to) external returns (uint256){
    tokenIds.increment();
    _mint(to,tokenIds.current());
    _setTokenURI(tokenIds.current(), tokenData);
    return  tokenIds.current();

 }
 
 /**
 @dev checks if a given token exists
  */
 function tokenExists (uint256 tokenId) public view returns(bool){
    return _exists(tokenId);
  }

/**
@dev returns the total supply of issued tokens
 */
 function totalSupply() public view returns (uint256) {
        // _tokenOwners are indexed by tokenIds, so .length() returns the number of tokenIds
        return tokenIds.current();
    }

 
}
