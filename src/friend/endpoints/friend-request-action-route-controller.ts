import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {friendRequestRoute} from './friend-request-route';
import Joi from 'joi';
import type {FriendRequestMetadata, FriendRequestStatus} from '../../shared/ddb-friends';
import {parseEventBody} from '../../shared/utils';


export const FriendRequestActionRouteController = {
    validator: async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<[FriendRequestActionBody]> => [
        await Joi
            .object<FriendRequestActionBody>()
            .keys({
                guid: Joi.string().required(),
            })
            .validateAsync(parseEventBody<FriendRequestActionBody>(event)),
    ],
    handler: async (event: APIGatewayProxyEventV2WithJWTAuthorizer, context: Context): Promise<FriendRequestActionResp> => {
        return await friendRequestRoute(event, context);
    },
};

export interface FriendRequestActionBody {
    guid: string;
    action: FriendRequestStatus;
}

export interface FriendRequestActionResp {
    request: FriendRequestMetadata;
}
