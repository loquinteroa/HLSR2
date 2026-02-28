import { GraphQLErrors } from "@apollo/client/errors";
import { Link } from "./link";

export interface GraphQLMeResults {
    me?: Me,
    error?: GraphQLErrors,
    loading: boolean,
}

export interface Me {
    id: String,
    name: String,
    email: String,
    links?: Link[],
    createdAt: Date,
}