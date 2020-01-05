const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(senderAddress, recipientAddress, amount, data = '') {
    this.senderAddress = senderAddress;
    this.recipientAddress = recipientAddress;
    this.amount = amount;
    this.data = data;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block Mined! ' + this.hash + '\n Nonce Number: ' + this.nonce);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('05/01/2020', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(
        null,
        miningRewardAddress,
        this.miningReward,
        'Reward from mining.'
      )
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.senderAddress === address) {
          balance -= trans.amount;
        }

        if (trans.recipientAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let blockchain = new Blockchain();

//makes sense for 'address 1' to become negative by now
blockchain.createTransaction(
  new Transaction(
    'address 1',
    'address 2',
    100,
    'Hello buddy take 100 cripto units for you...'
  )
);
blockchain.createTransaction(
  new Transaction(
    'address 2',
    'address 1',
    90,
    'Thanks Wolf, you rock!, but I just need 10...'
  )
);

console.log('\n Starting the miner...');
blockchain.minePendingTransactions('Miner Address');

console.log(
  '\n Balance of Miner is',
  blockchain.getBalanceOfAddress('Miner Address')
);
// console.log(
//   '\n Balance of address 1 is',
//   blockchain.getBalanceOfAddress('address 1')
// );
// console.log(
//   '\n Balance of address 2 is',
//   blockchain.getBalanceOfAddress('address 2')
// );

// console.dir({ Chain: blockchain.chain }, { depth: null });

console.log('\n Starting the miner again...');
blockchain.minePendingTransactions('Miner Address');

console.log(
  '\n Balance of Miner is',
  blockchain.getBalanceOfAddress('Miner Address')
);
