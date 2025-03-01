// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getUserDetailsFromEvent = (event) => {
    return {
        username : event.requestContext.authorizer.jwt?.claims.username,
        client_id: event.requestContext.authorizer.jwt?.claims.client_id,
    };
};
