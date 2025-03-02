import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import type {SessionMetadata} from '../../shared/ddb-sessions';
import {getSessionsOverviewRoute} from './get-sessions-overview-route';

export const GetSessionsOverviewRouteController = {
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<GetSessionsOverviewResp> => {
        return await getSessionsOverviewRoute(event, context);
    },
};

export interface GetSessionsOverviewResp {
    sessions: SessionMetadata[];
}
