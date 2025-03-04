import {GetSessionRouteController} from './endpoints/get-session-route-controller';
import type {Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';
import {StartSessionRouteController} from './endpoints/start-session-route-controller';
import {StopSessionRouteController} from './endpoints/stop-session-route-controller';
import {ListSessionsRouteController} from './endpoints/list-sessions-route-controller';
import {GetSessionsOverviewRouteController} from './endpoints/get-sessions-overview-route-controller';

const router: Router = {
    'GET /session'         : GetSessionRouteController,
    'GET /session/list'    : ListSessionsRouteController,
    'GET /session/overview': GetSessionsOverviewRouteController,
    'POST /session/start'  : StartSessionRouteController,
    'POST /session/stop'   : StopSessionRouteController,
};

export const handler = apiGatewayHandler({router});
