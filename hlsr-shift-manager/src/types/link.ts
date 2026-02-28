import { GraphQLErrors } from "@apollo/client/errors";
import { Owner } from "./owner";

export interface Link {
  id: string;
  shortUrl: string;
  fullUrl: string;
  owners?: Owner[];
  hits?: number;
  lastAccessedAt?: Date;
  qrCodeUrl?: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface LinkSort extends Link {
  [key: string]: any;
}

export interface LinkForCSV {
  id: string;
  shortUrl: string;
  fullUrl: string;
  owners?: string;
  hits?: string;
  lastAccessedAt?: string;
  qrCodeUrl?: string;
  updatedAt: string;
}

export interface LinkState {
  id: string;
  shortUrl: string;
  fullUrl: string;
  owners?: Owner[];
  qrCodeUrl?: string;
  editMode?: Boolean;
}

export interface DeleteLink extends Link {
  editMode?: Boolean;
}

export type LinkInput = {
  id?: string;
  fullUrl?: string;
  owners?: OwnerInput[];
  shortUrl?: string;
};

export type LinkUndoInput = {
  id?: string;
  fullUrl?: string;
  owners?: OwnerInput[];
  shortUrl?: string;
  qrCodeUrl?: string;
  hits?: number;
  lastAccessedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OwnerInput = {
  email?: string;
  id?: string;
  name?: string;
};

export interface Links {
  cursor: string;
  links: Link[];
  count: number;
}

export interface GraphQLLinkResults {
  data?: Link[],
  error?: GraphQLErrors,
  loading: boolean,
}

export interface LinksData {
  links: Links;
}

export type Order = 'asc' | 'desc';

export interface LinkQuery {
  filter?: String, 
  pageSize: number, 
  after?: String, 
  orderBy: LinkOrderByInput,
  pageNumber: number
}

export interface LinkOrderByInput {
  shortUrl?: Order,
  fullUrl?: Order,
  hits?: Order,
  lastAccessedAt?: Order,
  qrCodeUrl?: Order,
  createdAt?: Order,
  updatedAt?: Order
}

export interface LinkAdd {
  success: boolean;
  message: String;
  linkCreate: LinkCreate;
}

export interface LinkUndoDelete {
  success: boolean;
  message: String;
  linkUndoDelete: LinkUndoDelete;
}

export interface LinkChange {
  success: Boolean;
  message: String;
  linkUpdate: LinkUpdate;
}

export interface LinkUpdate {
  link: Link;
  success: Boolean;
  message: String;
}

export interface LinkCreate {
  link: Link;
  success: boolean;
  message: String;
}

export interface LinkUndoDelete {
  link: Link;
  success: boolean;
  message: String;
}

export interface LinkDelete {
  success: Boolean;
  message: String;
  id: string;
}

export interface linkReplaceOwnerBulk {
  success: boolean;
  message: string;
  linksFound: number;
  linksSkippedList: Link[];
  links: Link[];
}

export interface LinkBulkUpdateOwner {
  linkReplaceOwnerBulk: linkReplaceOwnerBulk;
}

export type LinkValidationErrors = {
  fullUrl: string;
  owners: string;
  shortUrl: string;
};