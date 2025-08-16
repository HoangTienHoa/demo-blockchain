const crypto = require('crypto');

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const content = this.timestamp + JSON.stringify(this.data) + this.previousHash;
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
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

// Demo
const myChain = new Blockchain();

console.log('⛏️ Đang thêm block 1...');
myChain.addBlock({ from: "Alice", to: "Bob", amount: 100 });

console.log('⛏️ Đang thêm block 2...');
myChain.addBlock({ from: "Bob", to: "Charlie", amount: 50 });

console.log('\n🌐 Blockchain hiện tại:\n', JSON.stringify(myChain, null, 2));

console.log('\n✅ Blockchain hợp lệ?', myChain.isChainValid() ? "Có" : "Không");

// Thử giả mạo dữ liệu
console.log('\n⚠️ Thử thay đổi dữ liệu...');
myChain.chain[1].data.amount = 9999;

console.log('✅ Blockchain hợp lệ sau khi sửa?', myChain.isChainValid() ? "Có" : "Không");
