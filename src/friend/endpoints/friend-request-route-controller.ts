import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {friendRequestRoute} from './friend-request-route';
import Joi from 'joi';
import type {FriendRequestMetadata} from '../../shared/ddb-friends';
import {parseEventBody} from '../../shared/utils';


export const FriendRequestRouteController = {
    validator: async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<[FriendRequestBody]> => [
        await Joi
            .object<FriendRequestBody>()
            .keys({
                friendUsername: Joi.string().required(),
            })
            .validateAsync(parseEventBody<FriendRequestBody>(event)),
    ],
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<FriendRequestResp> => {
        return await friendRequestRoute(event, context);
    },
};

export interface FriendRequestBody {
    friendUsername: string;
}

export interface FriendRequestResp {
    request: FriendRequestMetadata;
}
