---
title: "From Bytecode to World State: A Dummies Guide to Ethereum"
description: ""
date: "November 11 2025"
---

## Quick Recap of Blockchain

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

## Ethereum and the World State

Whenever a blockchain is to be created, there is a **genesis block**. This is 
the first block that consists of a signed transaction which is mined. 

![Genesis Block Diagram](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.geeksforgeeks.org%2Fwp-content%2Fuploads%2F20240505002041%2FGenesis-Block-(1)-1024.png&f=1&nofb=1&ipt=cb2a822ee370437593351ef0f5253cebfda22b5ad3c25e909253731c4a35fdbf)

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
