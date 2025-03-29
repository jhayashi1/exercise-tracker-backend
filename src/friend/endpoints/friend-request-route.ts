import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {putDynamoDb} from '../../shared/dynamo';
import {getUserDetailsFromEvent, parseEventBody} from '../../shared/utils';
import {getUserByUsername} from '../../shared/list-cognito-users';
import {badRequest, conflict, notFound} from '@hapi/boom';
import type {FriendRequestBody, FriendRequestResp} from './friend-request-route-controller';
import {generateGuid} from '../../shared/generate-guid';
import {FriendRequestStatus, getFriend, checkPendingRequests} from '../../shared/ddb-friends';

export const friendRequestRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<FriendRequestResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const {friendUsername} = parseEventBody<FriendRequestBody>(event);
    const createdTimestamp = new Date().toISOString();
    const guid = generateGuid();

    if (username === friendUsername) {
        throw badRequest('cannot befriend yourself!');
    }

    if (!friendUsername || !(await getUserByUsername(friendUsername))) {
        throw notFound(`user with username ${friendUsername} could not be found`);
    }

    if (await getFriend(username, friendUsername)) {
        throw conflict(`${username} is already friends with ${friendUsername}`);
    }

    if (await checkPendingRequests(username, friendUsername)) {
        throw conflict(`there is an existing friend request for ${username} and ${friendUsername}`);
    }

    const friendRequestMetadata = {
        username,
        friendUsername,
        createdTimestamp,
        guid,
        status: FriendRequestStatus.PENDING,
    };

    const params = {
        TableName: 'exercise-tracker-friend-requests',
        Item     : friendRequestMetadata,
    };

    const _result = await putDynamoDb(params);
    console.log(`successfully created friend request: ${guid}`);

    return {
        request: friendRequestMetadata,
    };
};
