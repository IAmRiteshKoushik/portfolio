---
title: "Bytecode to World State: A Dummies Guide to Ethereum"
description: ""
date: "November 11 2025"
---

# Quick Recap of Blockchains

A blockchain is decentralized and distributed **ledger** technology which 
records transactions across multiple computers in such a way that the 
records cannot be changed unless one has access to more than 51% of the 
network.

The ledger keeps track of different transactions that happen in the network 
which are collected and kept in **blocks**. These blocks are linked together 
in massively long chains.

The network is created by bringing together machines that perform **work** 
and are rewarded for it by taking a small percentage of the transaction's 
amount as a fee (gas fees). The `work` is subjective from blockchain to 
blockchain. 

A few popular examples are:

- Proof of Work - Bitcoin

- Proof of Stake - Ethereum

- Proof of History - Solana

# Ethereum and the World State

Whenever a blockchain is to be created, there is a **genesis block**. This is 
the first block that consists of a signed transaction which is mined. 

![Genesis Block Diagram](https://media.geeksforgeeks.org/wp-content/uploads/20240505002041/Genesis-Block-(1).png)

The `world state` refers to a mapping of all account addresses to their current 
state. In Ethereum there are - 

1. Externally owned accounts (EOAs)

2. Contract accounts

Over the years, more and more accounts joined Ethereum and the world state grew 
many-fold.

```js
// Let's assume the world state looks like this
"account 1": "10 ETH"
"account 2": "0.57 ETH"
...
"account n": "23.45 ETH"
```

Therefore, ethereum is a state machine whose state changes as more and more 
blocks are added the blockchain. In order to add new blocks, all miners (machines) need to keep a consistent 
snapshot of the world state.

If a new miner is to join the network, it can either capture a snapshot of the 
blockchain, or execute each transaction from the genesis block to catch-up to 
the current state of all accounts on the chain.

## Types of Accounts

Ethereum is the first-blockchain to introduce the concept of smart contracts.
The moat of ethereum was to allow people to deploy code on the blockchain 
and build applications which would be known as **dApps** (decentralized apps).

So, there are two types of accounts

### 1. Externally Owned Accounts (EOA)

An account that is controlled by a user using a private key. You can view 
it's balance through it's public key on [etherscan.io](https://etherscan.io/)

```js
// Try going to Etherscan and find the balance of this account
// Public Key (or) Address
0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97
```

- If you have the private key to an EOA, you can initiate trasactions from that 
account such as sending ETH or interacting with smart contracts.

- EOAs are not assocaited with code or logic. Their only purpose is to store 
and transact with other EOAs and Contract Accounts.

- It is the only account type that is allowed to **initiate** a transaction.

- It can initiate transactions to move or use the balance of transaction 
account based on code/logic.

- It must pay transaction fees (a.k.a gas fees) for any transactions they 
send. This is used to incentivise miners or validators to process and validate 
the transaction.

### 2. Contract Accounts (owned by smart contracts)

An account controlled by a smart contract code that was deployed on the chain 
rather than a private key.

- Contract accounts are only allowed to **respond** to transactions from 
either an EOA or another contract. They cannot start their own.

- Once a contract account is invoked, it can perform various actions like 
executing functions, modifying its internal state, or calling other contracts.

- It holds code that can execute arbitrary logic that can include but is not 
limited to business rules and financial applications. The code is written in 
[Solidity](https://www.soliditylang.org/) and deployed on Ethereum.

- Similar to EOA, contract accounts can hold ETH. The **balance** of a contract 
can be used to pay for operations or transferred when certain contract 
conditions are met.

- Contract accounts require gas fees to execute their functions. The gas fee 
is paid by the EOA that initiates the transaction. If the contract calls 
other contracts, it may use up more gas fees which must be paid by the EOA.

- Once a smart contract is deployed on the ethereum blockchain, it's immutable
but there is a concept of **upgradability.**

```json
// Data model of the accounts
"EOA address": {
    "nonce": ...
    "balance": ...
}

"Contract address": {
    "nonce": ...
    "balance": ...
    "storage hash": ... // relevant contract data
    "code hash": ...
}
```

This introduces a few terms which we will try to understand now.

## What is a nonce ?

### EOA

- Nonce is the number of transactions sent by the EOA. It is a counter that 
increases after each transaction.

- It ensures unique transaction ordering and prevents double-spending, replay 
attacks etc.

### Contract Accounts

- The number of contracts created by the account is the nonce. It is again a 
counter. (NOTE: contract creating other contracts)

- It ensures unique contract addresses and helps in determining the address 
of newly created accounts by being an offset.

## What is balance ?

It is the amount of ETH held by the accounts. EOA transacts and pays gas fees 
using its available balance. Contracts move around ETH from its total 
balance based on code but charges the EOA for gas fees.

## What is Storage Hash ?

Each smart contract can store some data in a key-value storage unit. This 
usually consists of variables and flags defined in the code of the contract.

The storage **hash** is the root hash of the contract's **storage tree**. This 
tree is a compact cryptographic data structure used to store key-value pairs.
The underlying data structure is a **Merkle-Patricia Tree** which combines :

1. [Merkle Tree](https://vaktibabat.github.io/posts/merkletrees/) for secure and efficient verification and 

2. [Patricia Tree](https://medium.com/blockchain-stories/patricia-trie-a-predestined-blockchain-thing-fddeb1a12b0) for space-efficiency and fast lookups.

## What is Code Hash ?

Smart Contracts are written in Solidity but compiled to EVM bytecode to be 
executed by the Ethereum Virtual Machine (EVM).

The code hash is a cryptographic hash, usually **SHA-3** of the contract's 
bytecode. It unique identifies the code of the contract.

```
Once a smart contract is deployed in Ethereum, its code hash is 
permanent fixed unless you destroy the contract.
```

# The Ethereum Virtual Machine (EVM)

The EVM, while being similar to Java Virtual Machine serving the purpose of 
"Write Once, Run Anywhere", has significant differences in design and 
execution policies.

There are many implementations of this in different languages like C++ and Go
and they are deployed in the wild. The reason for adopting this approach is 
if one of the implementations has some buggy code, then it only affects a 
sub-set of nodes and not all the nodes in the world.

```
The first implementation was written by Vitalik Buterin who proposed 
the Ethereum paper at the age of 19 and gained a Thiel Fellowship.
```

Before we dive into the architecture, let's go through the required taxonomy.

## Bytecode and Opcode

When writing contracts, the solidity compiler can compile a smart contract in 
two forms:

- Bytecode

- ABI

Bytecode is the low-level code that is generated after a smart contract written
in a high-level language like Solidity is compiled. It is a sequence of 
**instructions** that can be executed by the Ethereum Virtual Machine. This 
is what gets deployed and run by the EVM.

In the context of EVM, opcodes are low-level instructions that the EVM 
executes. Each opcode corresponds to a specific operation. Essentially, your 
bytecode is a **series of opcodes**.

Checkout the [playground](https://evm.codes/playground). There is a sample 
contract whose Bytecode and Solidity Code is visible along with the 
corresponding opcode. An exhaustive list of opcodes is available 
[here](https://evm.codes). When you do gas optimizations, this comes in handy.

## Application Binary Interface (ABI)

In Ethereum, an ABI is a standardized way for interacting with a smart 
contract. It defines how data should be serialized and deserialized when being 
sent to and from a contract on the blockchain.

Here's an example:

```solidity
pragma solidity ^0.8.0

contract Sum {
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }
}
```

The ABI is as follows:

```json
[
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "b",
                "type": "uint256"
            }
        ]
    },
    "name": "add",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "pure",
    "type": "function"
]
```

This JSON can now be used to:

1. Test the smart contract programatically

2. Understand the structure of the smart contract, without reading solidity

3. Autogenerate UIs to interact with the contract (Remix IDE)

## Finally, The EVM Architecture

![EVM diagram](https://ethereum.org/content/developers/docs/evm/evm.png)

When you are invoking a smart contract, you send it a transaction object:

```json
// inputs

"to": "address of the contract",
"data": "encoded inputs",
"gas limit": "max amount of gas you are willing to spend",
"gas price": "how much you are willing to pay for each unit of gas",
"nonce": "count of transactions from your account",
"value (optional)": "ETH you want to send with the transaction"
```

The EVM is single threaded. You have a gas limit because if your transaction 
is going on for too long and burning through gas, it'll be aborted on at 
your limit.

```
Gas Fees = Gas Limit x Gas Price

- Gas Limit is fixed
- Gas Price is variable (based on bidding)
```

Due to the EVM being slow and single-threaded, there is a **mempool** in which
all transactions are dropped and then the EVMs pick it up one by one for 
execution. 

- From the world state, the smart contract code is read into the ROM.

- The specific function call in the contract executes.

```js
// opcode schematics :: function sum(a, b)

CALLDATALOAD // Load the first argument 'a' into stack
CALLDATALOAD // Load the first argument 'b' into stack
ADD         // Pop 'a' and 'b', add them and push to stack
RETURN      // Return the result from stack

```

The EVM is a **stack** based virtual machine and not **register** based. Their 
interface remains the same but underlying structure is different.

The **memory section** of the EVM is used for arrays and collections as they 
are complicated to store and load using the stack.

---

Thanks for reading.
