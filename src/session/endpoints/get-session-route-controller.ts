import type {APIGatewayProxyEventV2, Context} from 'aws-lambda';
import {getSessionRoute} from './get-session-route';
import Joi from 'joi';

export const GetSessionRouteController = {
    validator: async (event: APIGatewayProxyEventV2): Promise<[GetSessionQuery]> => [
        await Joi
            .object<GetSessionQuery>()
            .keys({
                username: Joi.string().required(),
                guid    : Joi.string().required(),
            })
            .validateAsync(event.queryStringParameters),
    ],
    handler: async (event: APIGatewayProxyEventV2, context: Context): Promise<GetSessionResp> => {
        return await getSessionRoute(event, context);
    },
};

export interface GetSessionQuery {
    username: string;
    guid: string;
}

export interface GetSessionResp {
    session: any;
}
