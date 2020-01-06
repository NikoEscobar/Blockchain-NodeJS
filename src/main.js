const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate(
  '66962753b29efcefd2b187821e71453d07faa88cdc28b14faf02d945bcd89e0b'
);
const myWalletAddress = myKey.getPublic('hex');

let blockchain = new Blockchain();

const tx1 = new Transaction(
  myWalletAddress,
  'public key goes here',
  10,
  'take 10 cripto units'
);
tx1.signTransaction(myKey);

blockchain.addTransaction(tx1);

console.log('\n Starting the miner...');
blockchain.minePendingTransactions(myWalletAddress);

console.log(
  '\n Balance of myWallet is',
  blockchain.getBalanceOfAddress(myWalletAddress)
);

console.log('Is chain valid:', blockchain.isChainValid());

console.dir({ Chain: blockchain.chain }, { depth: null });

console.log(
  '-------------------------------------------------------------------'
);

console.log('\n Starting the miner...');
blockchain.minePendingTransactions('Another Miner');

console.log(
  '\n Balance of myWallet is',
  blockchain.getBalanceOfAddress(myWalletAddress)
);

console.log('Is chain valid', blockchain.isChainValid());

console.dir({ Chain: blockchain.chain }, { depth: null });
