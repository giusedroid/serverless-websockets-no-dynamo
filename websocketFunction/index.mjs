// Import the necessary AWS SDK clients and commands for JavaScript v3
import { 
  ApiGatewayManagementApiClient, 
  PostToConnectionCommand 
} from "@aws-sdk/client-apigatewaymanagementapi"

const {WEBSOCKET_ENDPOINT} = process.env

// Initialize the ApiGatewayManagementApiClient
const apiClient = new ApiGatewayManagementApiClient({
  endpoint: WEBSOCKET_ENDPOINT
})

export const handler = async (event) => {
    console.log(event)

    const route = event.requestContext.routeKey
    const connectionId = event.requestContext.connectionId

    switch (route) {
        case '$connect':
            console.log('Connection occurred')
            break
        case '$disconnect':
            console.log('Disconnection occurred')
            break
        case 'message':
            console.log('Received message:', event.body)
            await replyToMessage(Math.floor(Math.random() * 151), connectionId)
            break
        default:
            console.log('Received unknown route:', route)
    }

    return {
      statusCode: 200
    }
}

async function replyToMessage(response, connectionId) {
    const data = { message: response, connectionId }
    const params = {
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(data))
    }

    // Use the PostToConnectionCommand to send a message to the connection
    const command = new PostToConnectionCommand(params)
    return apiClient.send(command)
}
