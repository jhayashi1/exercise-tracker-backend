import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument, type GetCommandInput, type GetCommandOutput, type QueryCommandInput, type QueryCommandOutput} from '@aws-sdk/lib-dynamodb';

const dynamoDbClient = new DynamoDBClient({
    region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamoDbClient);

export const getDynamoDb = async (args: GetCommandInput): Promise<GetCommandOutput> => (
    await documentClient.get(args)
);

export const queryDynamoDb = async (args: QueryCommandInput): Promise<QueryCommandOutput> => (
    await documentClient.query(args)
);
