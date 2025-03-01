import type {APIGatewayProxyEventV2} from 'aws-lambda';
import {getRoute} from './get-route';
import Joi from 'joi';

export const GetRouteController = {
    validator: async (event: APIGatewayProxyEventV2): Promise<[TodoBody]> => [
        await Joi
            .object<TodoBody>()
            .keys({
                yuh: Joi.string().optional(),
            })
            .validateAsync(JSON.parse(event.body ?? '')),
    ],
    handler: getRoute,
};

export interface TodoBody {
    yuh?: string;
}
