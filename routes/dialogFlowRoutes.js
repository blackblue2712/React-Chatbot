const express = require("express");
const {textQuery, eventQuery} = require("../chatbot/chatbot");
const router = express.Router();


router.get("/", (req, res) => {
    res.send( {"Hello": "there"} )
})

router.post("/api/df_text_query", async (req, res) => {
    const result = await textQuery(req.body.text, req.body.userId, req.body.parameters)    
    res.send(result);
})
router.post('/api/df_event_query', async (req, res) => {
    let responses = await eventQuery(req.body.event, req.body.userId, req.body.parameters);
    res.send(responses[0].queryResult);
});


module.exports = router;