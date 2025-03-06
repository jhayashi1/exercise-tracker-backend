import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import Joi from 'joi';
import {listFriendsRoute} from './list-friends-route';

export const ListFriendsRouteController = {
    validator: async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<[ListFriendsQuery]> => [
        await Joi
            .object<ListFriendsQuery>()
            .keys({
                username: Joi.string().required(),
            })
            .validateAsync(event.queryStringParameters),
    ],
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<ListFriendsResp> => {
        return await listFriendsRoute(event, context);
    },
};

export interface ListFriendsQuery {
    username: string;
}

export interface ListFriendsResp {
    friends: string[];
}
