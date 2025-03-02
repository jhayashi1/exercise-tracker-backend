import {GetSessionRouteController} from './endpoints/get-session-route-controller';
import type {Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';

const router: Router = {
    'GET /session': GetSessionRouteController,
};

export const handler = apiGatewayHandler({router});
