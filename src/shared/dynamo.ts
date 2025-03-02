import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument, type DeleteCommandInput, type DeleteCommandOutput, type GetCommandInput, type GetCommandOutput, type PutCommandInput, type PutCommandOutput, type QueryCommandInput, type QueryCommandOutput, type UpdateCommandInput, type UpdateCommandOutput} from '@aws-sdk/lib-dynamodb';

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

export const putDynamoDb = async (args: PutCommandInput): Promise<PutCommandOutput> => (
    await documentClient.put(args)
);

export const updateDynamoDb = async (args: UpdateCommandInput): Promise<UpdateCommandOutput> => (
    await documentClient.update(args)
);

export const deleteDynamoDb = async (args: DeleteCommandInput): Promise<DeleteCommandOutput> => (
    await documentClient.delete(args)
);
