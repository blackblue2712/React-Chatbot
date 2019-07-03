const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const configDialogFlow = require("../config/key");
const Registration = require("../models/Registration");

const projectID = configDialogFlow.googleProjectID;
const credentials = {
    client_email: configDialogFlow.googleClientEmail,
    private_key: configDialogFlow.googlePrivateKey.replace(/\\n/g, '\n')
}

const sessionClient = new dialogflow.SessionsClient( {projectID, credentials} );

module.exports = {
    textQuery: async (text, userId, parameters = {}) => {
        const sessionPath = sessionClient.sessionPath(configDialogFlow.googleProjectID, configDialogFlow.dialogFlowSessionID + userId);
        const self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: text,
                    languageCode: configDialogFlow.dialogFlowSessionLanguageCode,
                },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            } 
        };
         // Send request and log result
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },

    eventQuery: async function(event, userId, parameters = {}) {
        const sessionPath = sessionClient.sessionPath(configDialogFlow.googleProjectID, configDialogFlow.dialogFlowSessionID + userId);
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: configDialogFlow.dialogFlowSessionLanguageCode,
                },
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = self.handleAction(responses);
        return responses;

    },


    handleAction: responses => {
        const self = module.exports;
        let queryResult = responses[0].queryResult;
        switch(queryResult.action) {
            case 'RecommendCourses-yes': 
                if(queryResult.allRequiredParamsPresent) {
                    self.saveRegistration(queryResult.parameters.fields);
                }
            break;

        }

        return responses;
    },

    saveRegistration: async (fields) => {
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
        });
        try {
            let res = await registration.save();
            console.log(res);
        } catch(err) {
            console.log(err);
        }
    }
}