import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import type {FriendRequestMetadata} from '../../shared/ddb-friends';
import {listFriendRequestsRoute} from './list-friend-requests-route';

export const ListFriendRequestsRouteController = {
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<ListFriendRequestsResp> => {
        return await listFriendRequestsRoute(event, context);
    },
};

export interface ListFriendRequestsResp {
    requests: FriendRequestMetadata[];
}
