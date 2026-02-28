import { Link } from './link';

export interface Owner {
    __typename?: string;
    id: string;
    name?: string;
    email: string;
    links?: Link[];
    createdAt?: Date;
    updatedAt?: Date;
}