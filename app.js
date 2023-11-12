import *  as hg from "@hashgraph/sdk";
import express from 'express';
import * as fs from "fs";


let address = "0xd4ffbd59002da68642d3907c885c54ab669d6ae0"
let a = "0.0.5872775"
let k = process.env.PK;
const operatorId = hg.AccountId.fromString(a);
const operatorPrivateKey = hg.PrivateKey.fromString(k);
const client = hg.Client.forTestnet();
var newContractID = new hg.ContractId(0,0,5873045)

client.setOperator(operatorId, operatorPrivateKey);

var app = express();

const newContractId = "0xf5a4b96759ac034816aB910163918F8c5F4966A4";

app.listen(3000, () => {
    console.log("Server running on port 3000");
});




app.get("/increment", async (req, res, next) => { 

    const transaction = new hg.ContractExecuteTransaction()
        .setContractId(newContractID)
        .setGas(100000)
        .setFunction("seeMove", new hg.ContractFunctionParameters()
            .addAddress(address))

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction


    res.json({ "done": true })

});


app.get("/nft", async (req, res, next) => {
    const contractCall = await new hg.ContractCallQuery()
    .setContractId(newContractID)
    .setFunction('getNFT')
    .setGas(100000)
    .execute(client);
    
    var ret = contractCall.getString();
    res.json({ "ans": ret })

});

app.get("/setNFT", async (req, res, next) => {
    console.log("The transaction consensus status is " + transactionStatus);
    const transaction = new ContractExecuteTransaction()
        .setContractId(newContractID)
        .setGas(100_000_000)
        .setFunction("setNFT", new hg.ContractFunctionParameters().addAddress(address).addString(req.params.newNFT))

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);
    res.json({ "done": true })

});


app.get("/numbers", async (req, res,next) => {
    const contractCall = await new hg.ContractCallQuery()
    .setContractId(newContractID)
    .setFunction('getCount', new hg.ContractFunctionParameters().addAddress(address))
    .setGas(100000)
    .execute(client);
    
    var ret = contractCall.getInt256();
    res.json({ "ans": ret })


});




