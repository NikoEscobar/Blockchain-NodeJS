const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '05/01/2020', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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

blockchain.addBlock(
  new Block(1, '06/01/2020', {
    data: 'Test info data',
    value: 500
  })
);

blockchain.addBlock(
  new Block(2, '10/01/2020', {
    data: 'Test info data',
    value: 1000
  })
);

// console.dir({ Chain: blockchain.chain }, { depth: null });

console.log('Is blockchain valid? ' + blockchain.isChainValid());

blockchain.chain[1].data.value = 999999;
blockchain.chain[1].hash = blockchain.chain[1].calculateHash();

console.log('Is blockchain valid? ' + blockchain.isChainValid());
