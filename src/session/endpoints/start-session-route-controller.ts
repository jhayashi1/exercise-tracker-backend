import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {startSessionRoute} from './start-session-route';

export const StartSessionRouteController = {
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<StartSessionResp> => {
        return await startSessionRoute(event, context);
    },
};

export interface StartSessionResp {
    session: {
        guid: string;
        startTimestamp: string;
    };
}
