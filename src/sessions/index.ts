import type {APIGatewayProxyEventV2, Context} from 'aws-lambda';
import {getUserDetailsFromEvent} from '../shared/utils';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<string> => {
    return JSON.stringify(getUserDetailsFromEvent(event), null, 4);
};
