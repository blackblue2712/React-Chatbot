const express = require("express");
const dialogflow = require("dialogflow");
const router = express.Router();

const configDialogFlow = require("../config/key");

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(configDialogFlow.googleProjectID, configDialogFlow.dialogFlowSessionID);



router.get("/", (req, res) => {
    res.send( {"Hello": "there"} )
})

router.post("/api/df_text_query", async (req, res) => {

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.text,
                // The language used by the client (en-US)
                languageCode: configDialogFlow.dialogFlowSessionLanguageCode,
            },
        },
    };
     // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }

    res.send(result);
})
router.post("/api/df_event_query", (req, res) => {
    res.send( {do: "event_query"} )
})



module.exports = router;