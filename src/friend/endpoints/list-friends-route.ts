import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {queryDynamoDb} from '../../shared/dynamo';
import type {ListFriendsQuery, ListFriendsResp} from './list-friends-route-controller';

export const listFriendsRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<ListFriendsResp> => {
    const {username} = event.queryStringParameters as unknown as ListFriendsQuery;

    const params = {
        TableName                : 'exercise-tracker-friends',
        KeyConditionExpression   : 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        },
    };

    const result = await queryDynamoDb(params);
    const friendUsernames = result.Items?.map((friend) => friend.friendUsername) ?? [];

    return {friends: friendUsernames};
};
