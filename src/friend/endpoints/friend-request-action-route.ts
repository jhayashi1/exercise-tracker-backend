import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {putDynamoDb, updateDynamoDb} from '../../shared/dynamo';
import {getUserDetailsFromEvent, parseEventBody} from '../../shared/utils';
import {conflict, unauthorized} from '@hapi/boom';
import {FriendRequestStatus, getFriendRequest} from '../../shared/ddb-friends';
import type {FriendRequestActionBody, FriendRequestActionResp} from './friend-request-action-route-controller';

export const friendRequestActionRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<FriendRequestActionResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const {guid, action} = parseEventBody<FriendRequestActionBody>(event);
    const updatedTimestamp = new Date().toISOString();
    const request = await getFriendRequest(guid);
    const status = request.status;
    const requesterUsername = request.username;
    const requesteeUsername = request.friendUsername;

    if (username !== requesteeUsername) {
        throw unauthorized(`user ${username} is not authorized to accept this request`);
    }

    if (status !== FriendRequestStatus.PENDING) {
        throw conflict(`request status is ${status}`);
    }

    const requestParams = {
        TableName: 'exercise-tracker-friend-requests',
        Key      : {
            username: requesterUsername,
            guid,
        },
        UpdateExpression         : 'set #status = :status, updatedTimestamp = :updatedTimestamp',
        ExpressionAttributeValues: {
            ':status'          : action,
            ':updatedTimestamp': updatedTimestamp,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ReturnValues: 'ALL_NEW' as const,
    };

    const requestResult = await updateDynamoDb(requestParams);

    console.log(`updated ${guid} in friend requests table`);

    if (action === FriendRequestStatus.ACCEPTED) {
        const friendParams1 = {
            TableName: 'exercise-tracker-friends',
            Item     : {
                username,
                friendUsername  : requesterUsername,
                createdTimestamp: updatedTimestamp,
            },
        };

        const friendParams2 = {
            TableName: 'exercise-tracker-friends',
            Item     : {
                username        : requesterUsername,
                friendUsername  : username,
                createdTimestamp: updatedTimestamp,
            },
        };

        const _friendResult1 = await putDynamoDb(friendParams1);
        const _friendResult2 = await putDynamoDb(friendParams2);
    }

    console.log(`successfully ${action} friend request: ${guid}`);

    return requestResult.Attributes as unknown as FriendRequestActionResp;
};
