import {queryDynamoDb} from './dynamo';

export interface FriendMetadata {
    username: string;
    friendUsername: string;
    createdTimestamp: string;
}

export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}

export interface FriendRequestMetadata {
    username: string;
    guid: string;
    friendUsername: string;
    status: FriendRequestStatus;
    createdTimestamp: string;
    updatedTimestamp?: string;
}

export const getFriends = async (username: string): Promise<string[]> => {
    const params = {
        TableName                : 'exercise-tracker-friends',
        KeyConditionExpression   : 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items?.map((friend) => friend.friendUsername) ?? [];
};

export const getFriendRequests = async (friendUsername: string): Promise<FriendRequestMetadata[]> => {
    const params = {
        TableName                : 'exercise-tracker-friend-requests',
        IndexName                : 'friend-username-index',
        KeyConditionExpression   : 'friend_username = :friend_username',
        ExpressionAttributeValues: {
            ':friend_username': friendUsername,
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items as unknown as FriendRequestMetadata[] ?? [];
};
