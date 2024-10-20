const express = require('express')
const cors = require('cors')
const { createAuthenticatedClient } = require('@interledger/open-payments');
const { createClient } = require("@libsql/client");

require('dotenv').config();

process.env.OPEN_API

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

let importantData = {};

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_API }); // openai 
const app = express()
const port = 3000
app.use(cors());

app.get('/payment', (req, res) => {
  handlePayment(res, req.query.amount, req.query.from, req.query.to, req.query.dog, req.query.recurring);
})

app.get('/completePayment', (req, res) => {
    completePayment(req.query.nonce, req.query.interact_ref, res)
  })

app.get('/generateBio', (req, res) => {
    let name = req.query.name;
    let breed = req.query.breed;
    let hobby = req.query.hobby;
    let type = req.query.type;
    generateBio(name, breed, hobby, type, res);
})

app.get('/', (req, res) => {
    res.send("Hello World");
})

// app.get('/completePayment' (req, res) => {
//     const interactionReference = req.query.interaction_ref
// })

async function generateBio(name, breed, hobbies,type,  res){
    const prompt = `Generate a bio for a ${type} named ${name}, and breed ${breed} with hobbies ${hobbies} , less than 50 words.`
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });
    res.send(completion.choices[0].message.content);
}

async function handlePayment(res, amount, wallet_from, wallet_to, id, recurring) {
    // 1. Get a grant for an incoming payment
    console.log(amount);
    console.log(wallet_from);
    console.log(wallet_to);
    const client = await createAuthenticatedClient({
        walletAddressUrl: "https://ilp.rafiki.money/fakecompany",
        privateKey:"private.key",
        keyId: "884142b6-cd4d-4cc6-8e13-f9c13042e704"
    })

    const receivingWalletAddress = await client.walletAddress.get({
        url: wallet_to
    })

    const sendingWalletAddress = await client.walletAddress.get({
        url:wallet_from
    })

    const incomingPaymentGrant = await client.grant.request({
        url: receivingWalletAddress.authServer
    }, 

    {access_token: {
        access: [{
            type: "incoming-payment",
            actions: ['create'] // just want to create
        }]
    }})

    // 2. Create an incoming payment
    const incomingPayment = await client.incomingPayment.create({
        url: receivingWalletAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value
    }, {
        walletAddress: receivingWalletAddress.id,
        incomingAmount:{
            assetCode: receivingWalletAddress.assetCode,
            assetScale: receivingWalletAddress.assetScale,
            value: amount,
        }
    });

    // 3. Get a grant for a quote
    const quoteGrant = await client.grant.request({
        url: sendingWalletAddress.authServer
    }, {
        access_token:{
            access:[{
                type: "quote",
                actions:['create']
            }]
        }
    })

    // 4. Create a quote
    const quote = await client.quote.create({
        url: sendingWalletAddress.resourceServer,
        accessToken: quoteGrant.access_token.value
    }, {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id,
        method:'ilp'
    })

    let nonce = Math.floor(Math.random()*1000000).toString();

    console.log(recurring, recurring === "true" ? `R/${new Date().toISOString()}/P1M` : undefined);
    
    // 5. Get a grant for an outgoing payment
    const outgoingPaymentGrant = await client.grant.request({
        url: sendingWalletAddress.authServer
    }, {
        access_token:{
            access:[{
                type: "outgoing-payment",
                actions:['create'],
                limits: {
                    debitAmount: quote.debitAmount,
                    interval: recurring === "true" ? `R/${new Date().toISOString()}/P1M` : undefined,
                },
                identifier: sendingWalletAddress.id,
            }]
        },
        interact:{
            start: ["redirect"],
            finish: {
            method: "redirect",
            uri: `http://localhost:5173/thankyou?nonce=${nonce}`,
            nonce: nonce,
            },
        }
    })

    // 6. User interaction send back the redirect uri

    res.json(outgoingPaymentGrant.interact.redirect);

    let outgoingPaymentGrantURL = outgoingPaymentGrant.continue.uri;
    let outgoingPaymentGrantAccessToken = outgoingPaymentGrant.continue.access_token.value;
    let sendingWalletAddressResourceServer = sendingWalletAddress.resourceServer;
    let sendingWalletAddressID = sendingWalletAddress.id;
    let quoteId = quote.id;

    importantData[nonce] = {
        "outgoingPaymentGrantURL" : outgoingPaymentGrantURL,
        "outgoingPaymentGrantAccessToken" : outgoingPaymentGrantAccessToken,
        "sendingWalletAddressResourceServer" : sendingWalletAddressResourceServer,
        "sendingWalletAddressID" : sendingWalletAddressID,
        "quoteId" : quoteId,
        "amount" : amount,
        "id" : id,
    }

    // // 7. Continue outgoing payment grant 
    // await retryCompletePayment(client, outgoingPaymentGrant, sendingWalletAddress, quote, id);
}

async function completePayment(nonce, interactionReference, res) {
    const client = await createAuthenticatedClient({
        walletAddressUrl: "https://ilp.rafiki.money/fakecompany",
        privateKey:"private.key",
        keyId: "884142b6-cd4d-4cc6-8e13-f9c13042e704"
    })
    const outgoingPaymentGrantURL = importantData[nonce]["outgoingPaymentGrantURL"]
    const outgoingPaymentGrantAccessToken = importantData[nonce]["outgoingPaymentGrantAccessToken"];
    const sendingWalletAddressResourceServer = importantData[nonce]["sendingWalletAddressResourceServer"]
    const sendingWalletAddressID = importantData[nonce]["sendingWalletAddressID"];
    const quoteId = importantData[nonce]["quoteId"];
    const amount = importantData[nonce]["amount"];
    const id = importantData[nonce]["id"];

    // Your async task here, e.g., making an API call
    const finalisedOutgoingPayment = await client.grant.continue({
        url: outgoingPaymentGrantURL,
        accessToken: outgoingPaymentGrantAccessToken,
    }, {
        interact_ref: interactionReference
    } );

    if(!finalisedOutgoingPayment.access_token){
        throw new Error("Not yet accepted");
    }
    else{
        // finalise payment here // 
        // console.log("Grant received");
        // console.log(finalisedOutgoingPayment)
        // console.log("Quote:");
        // console.log(quote);

        const outgoingPayment = await client.outgoingPayment.create({
            url: sendingWalletAddressResourceServer,
            accessToken: finalisedOutgoingPayment.access_token.value,
        }, {
            walletAddress: sendingWalletAddressID,
            quoteId: quoteId,
        })

        console.log(outgoingPayment);
        console.log("Payment confirmed");
        res.send({ dog: id });

        await turso.execute({
            sql: 'UPDATE dogs SET account = account + ? WHERE id = ?;' ,
            args: [Math.floor(parseFloat(amount)/100), id],
        })
    }
  }
  
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function retryCompletePayment(client, outgoingPaymentGrant, sendingWalletAddress, quote, id) {
    await wait(2000);   // Wait for 1 second (1000 ms)
        await completePayment(client, outgoingPaymentGrant, sendingWalletAddress, quote, id);
  }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
