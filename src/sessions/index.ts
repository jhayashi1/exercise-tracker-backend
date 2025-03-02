import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {getUserDetailsFromEvent} from '../shared/utils';

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<string> => {
    return JSON.stringify(getUserDetailsFromEvent(event), null, 4);
};
