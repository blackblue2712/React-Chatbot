const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const configDialogFlow = require("../config/key");

const projectID = configDialogFlow.projectID;
const credentials = {
    client_email: configDialogFlow.googleProjectID,
    private_key: configDialogFlow.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient( {projectID, credentials} );
const sessionPath = sessionClient.sessionPath(configDialogFlow.googleProjectID, configDialogFlow.dialogFlowSessionID);

module.exports = {
    textQuery: async (text, parameters = {}) => {
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

    eventQuery: async function(event,  parameters = {}) {
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
        return responses;
    }
}