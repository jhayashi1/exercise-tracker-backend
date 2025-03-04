import {AdminGetUserCommand, CognitoIdentityProviderClient, type AdminGetUserCommandOutput} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({region: 'us-east-1'});

export const getUserByUsername = async (username: string): Promise<AdminGetUserCommandOutput | undefined> => {
    const command = new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_POOL_ID,
        Username  : username,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch {
        console.log(`could not find user ${username}`);
        return undefined;
    }
};
