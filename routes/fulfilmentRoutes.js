const express = require("express");
const router = express.Router();

const {WebhookClient} = require('dialogflow-fulfillment');
const Demand = require("../models/Demand");
const Coupons = require("../models/Coupons");


router.post('/', (request, response) => {
    const agent = new WebhookClient({ request, response });

    function snoopy(agent) {
        agent.add(`Welcome to my Snoopy fulfillment!`);
    }

    async function learn(agent) {
        Demand.findOne( {course: agent.parameters.course}, (err, course) => {
            if(!course) {
                const demand = new Demand( {course: agent.parameters.course} )
                demand.save();
            } else {
                course.counter++;
                course.save();
            }
        });

        let responseText = `You want to learn about ${agent.parameters.course}, 
            Here is a link to all of  my courses https://gamefc.com`;

        let coupon = await Coupons.findOne( {course: agent.parameters.course} );
        if(coupon) {
            responseText = `You want to learn about ${agent.parameters.course}, 
            Here is a link ${coupon.link}`;
        }

        agent.add(responseText);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set('Snoopy', snoopy);
    intentMap.set('LearnCourses', learn);
    intentMap.set('Default Fallback Intent', fallback);

    agent.handleRequest(intentMap);
});

    module.exports = router;
