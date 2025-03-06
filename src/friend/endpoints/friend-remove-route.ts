import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {getUserDetailsFromEvent, parseEventBody} from '../../shared/utils';
import {notFound} from '@hapi/boom';
import {getFriend, removeFriend} from '../../shared/ddb-friends';
import type {FriendRemoveBody, FriendRemoveResp} from './friend-remove-route-controller';
import {getUserByUsername} from '../../shared/list-cognito-users';

export const friendRemoveRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<FriendRemoveResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const {friendUsername} = parseEventBody<FriendRemoveBody>(event);

    if (!friendUsername || !(await getUserByUsername(friendUsername))) {
        throw notFound(`user with username ${friendUsername} could not be found`);
    }

    const request = await getFriend(username, friendUsername);

    if (!request) {
        throw notFound(`user ${username} and ${friendUsername} are not friends`);
    }

    await removeFriend(username, friendUsername);

    console.log(`${username} and ${friendUsername} are no longer friends`);

    return {
        username,
        friendUsername,
    };
};
