import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import type {ListFriendRequestsResp} from './list-friend-requests-route-controller';
import {getUserDetailsFromEvent} from '../../shared/utils';
import {getPendingRequests} from '../../shared/ddb-friends';

export const listFriendRequestsRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<ListFriendRequestsResp> => {
    const {username} = getUserDetailsFromEvent(event);

    const result = await getPendingRequests(username);

    return {requests: result};
};
