import type {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context} from 'aws-lambda';
import {GetSessionRouteController} from './endpoints/get-session-route-controller';
import type {ApiResult, Router} from '../shared/endpoint-types';
import {apiGatewayHandler} from '../shared/api-gateway-handler';

const router: Router = {
    'GET /session': GetSessionRouteController,
};

export const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<ApiResult> => await apiGatewayHandler(event, context, router);
