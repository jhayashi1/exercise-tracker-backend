import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {putDynamoDb} from '../../shared/dynamo';
import {getUserDetailsFromEvent, parseEventBody} from '../../shared/utils';
import {getUserByUsername} from '../../shared/list-cognito-users';
import {notFound} from '@hapi/boom';
import type {FriendRequestBody, FriendRequestResp} from './friend-request-route-controller';
import {generateGuid} from '../../shared/generate-guid';
import {FriendRequestStatus} from '../../shared/ddb-friends';

export const friendRequestRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<FriendRequestResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const {friendUsername} = parseEventBody<FriendRequestBody>(event);
    const createdTimestamp = new Date().toISOString();
    const guid = generateGuid();

    if (!friendUsername || !getUserByUsername(friendUsername)) {
        throw notFound(`user with username ${friendUsername} could not be found`);
    }

    const friendRequestMetadata = {
        username,
        friendUsername,
        createdTimestamp,
        guid,
        status: FriendRequestStatus.PENDING,
    };

    const params = {
        TableName: 'exercise-tracker-sessions',
        Item     : friendRequestMetadata,
    };

    const _result = await putDynamoDb(params);
    console.log(`successfully created friend request: ${guid}`);

    return {
        request: friendRequestMetadata,
    };
};
