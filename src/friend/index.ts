import type {Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';
import {FriendRequestRouteController} from './endpoints/friend-request-route-controller';
import {FriendRequestActionRouteController} from './endpoints/friend-request-action-route-controller';
import {FriendRemoveRouteController} from './endpoints/friend-remove-route-controller';

const router: Router = {
    // 'GET /friend/list'     : GetSessionRouteController,
    'POST /friend/request'       : FriendRequestRouteController,
    'POST /friend/request-action': FriendRequestActionRouteController,
    'POST /friend/remove'        : FriendRemoveRouteController,
};

export const handler = apiGatewayHandler({router});
