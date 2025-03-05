import type {Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';
import {FriendRequestRouteController} from './endpoints/friend-request-route-controller';
import {FriendRequestActionRouteController} from './endpoints/friend-request-action-route-controller';

const router: Router = {
    // 'GET /friend/list'     : GetSessionRouteController,
    'POST /friend/request'       : FriendRequestRouteController,
    'POST /friend/request-action': FriendRequestActionRouteController,
    // 'POST /friend/decline' : StopSessionRouteController,
    // 'POST /friend/remove'  : StopSessionRouteController,
};

export const handler = apiGatewayHandler({router});
