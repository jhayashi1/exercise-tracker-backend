import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {stopSessionRoute} from './stop-session-route';


export const StopSessionRouteController = {
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<StopSessionResp> => {
        return await stopSessionRoute(event, context);
    },
};

export interface StopSessionResp {
    session: {
        guid: string;
        startTimestamp: string;
        endTimestamp: string;
    };
}
