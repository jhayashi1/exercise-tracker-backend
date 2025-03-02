import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import Joi from 'joi';
import type {SessionMetadata} from '../../shared/ddb-sessions';
import {listSessionsRoute} from './list-sessions-route';

export const ListSessionsRouteController = {
    validator: async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<[ListSessionsQuery]> => [
        await Joi
            .object<ListSessionsQuery>()
            .keys({
                username : Joi.string().required(),
                startTime: Joi.string().optional(),
                endTime  : Joi.string().optional(),
            })
            .and('startTime', 'endTime')
            .validateAsync(event.queryStringParameters),
    ],
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<ListSessionsResp> => {
        return await listSessionsRoute(event, context);
    },
};

export interface ListSessionsQuery {
    username: string;
    startTime?: string;
    endTime?: string;
}

export interface ListSessionsResp {
    sessions: SessionMetadata[];
}
