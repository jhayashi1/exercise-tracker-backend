import type {Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';
import {FriendRequestRouteController} from './endpoints/friend-request-route-controller';
import {FriendRequestActionRouteController} from './endpoints/friend-request-action-route-controller';
import {FriendRemoveRouteController} from './endpoints/friend-remove-route-controller';
import {ListFriendsRouteController} from './endpoints/list-friends-route-controller';
import {ListFriendRequestsRouteController} from './endpoints/list-friend-requests-route-controller';

const router: Router = {
    'GET /friend/list'           : ListFriendsRouteController,
    'GET /friend/list-requests'  : ListFriendRequestsRouteController,
    'POST /friend/request'       : FriendRequestRouteController,
    'POST /friend/request-action': FriendRequestActionRouteController,
    'POST /friend/remove'        : FriendRemoveRouteController,
};

export const handler = apiGatewayHandler({router});
