const crypto = require('crypto');
class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const content = this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce;
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join('0'); // ví dụ: '0000'
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`✅ Block mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newData) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(Date.now().toString(), newData, previousBlock.hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];

            if (curr.hash !== curr.calculateHash()) {
                return false;
            }

            if (curr.previousHash !== prev.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = {
    Block,
    Blockchain
};