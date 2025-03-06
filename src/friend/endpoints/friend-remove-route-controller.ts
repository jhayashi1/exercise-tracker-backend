import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import Joi from 'joi';
import {parseEventBody} from '../../shared/utils';
import {friendRemoveRoute} from './friend-remove-route';


export const FriendRemoveRouteController = {
    validator: async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<[FriendRemoveBody]> => [
        await Joi
            .object<FriendRemoveBody>()
            .keys({
                friendUsername: Joi.string().required(),
            })
            .validateAsync(parseEventBody<FriendRemoveBody>(event)),
    ],
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<FriendRemoveResp> => {
        return await friendRemoveRoute(event, context);
    },
};

export interface FriendRemoveBody {
    friendUsername: string;
}

export interface FriendRemoveResp {
    username: string;
    friendUsername: string;
}
