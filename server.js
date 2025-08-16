const express = require('express');
const path = require('path');
const { Blockchain, Block } = require('./blockchain');

const mongoose = require('mongoose');
const BlockModel = require('./models/BlockModel');

const app = express();
const port = 3000;
const myChain = new Blockchain();
/*
// Khởi tạo blockchain rỗng ban đầu
let myChain = null;
const connectMongo = async () => {
    await mongoose.connect('mongodb://localhost:27017/blockchain-demo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected');

    // Load blockchain từ DB
    const blocks = await BlockModel.find({});
    if (blocks.length === 0) {
        console.log('📥 DB rỗng → tạo Genesis Block');
        const Blockchain = require('./blockchain');
        myChain = new Blockchain();

        // Lưu Genesis Block vào DB
        await BlockModel.create(myChain.chain[0]);
    } else {
        console.log(`📤 Tải ${blocks.length} block từ MongoDB`);
        myChain = { chain: blocks };

        // Bổ sung các hàm isChainValid(), addBlock()
        myChain.getLatestBlock = () => myChain.chain[myChain.chain.length - 1];

        myChain.addBlock = async (data) => {
            const Blockchain = require('./blockchain'); // Dùng lại Block class
            const previous = myChain.getLatestBlock();
            const block = new Blockchain.Block(Date.now().toString(), data, previous.hash);
            block.mineBlock(4);
            myChain.chain.push(block);
            await BlockModel.create(block);
        };

        myChain.isChainValid = () => {
            for (let i = 1; i < myChain.chain.length; i++) {
                const curr = myChain.chain[i];
                const prev = myChain.chain[i - 1];

                const Blockchain = require('./blockchain');
                const temp = new Blockchain.Block(
                    curr.timestamp, curr.data, curr.previousHash
                );
                temp.nonce = curr.nonce;
                const calculatedHash = temp.calculateHash();

                if (curr.hash !== calculatedHash) return false;
                if (curr.previousHash !== prev.hash) return false;
            }
            return true;
        };
    }
};
*/
//connectMongo().then(() => {
    app.use(express.json());
    // Serve frontend
    app.use(express.static('public'));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    });

    // Xem toàn bộ blockchain
    app.get('/chain', (req, res) => {
        res.json(myChain.chain);
    });

    // Thêm block mới
    app.post('/mine', (req, res) => {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: 'Missing data' });

        myChain.addBlock(data);
        res.json({ message: 'Block added successfully', chain: myChain.chain });
    });

    // Kiểm tra tính hợp lệ
    app.get('/validate', (req, res) => {
        const valid = myChain.isChainValid();
        res.json({ valid });
    });

    app.listen(port, () => {
        console.log(`🚀 Blockchain API listening at http://localhost:${port}`);
    });
//});