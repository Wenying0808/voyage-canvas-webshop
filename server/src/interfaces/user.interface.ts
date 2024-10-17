import * as mongodb from 'mongodb';

export interface User {
    _id?: mongodb.ObjectId;
    name: string;
    email: string;
    provider: string;
    providerId: string;
}