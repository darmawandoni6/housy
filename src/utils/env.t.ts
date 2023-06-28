import { Op } from "sequelize";

type Pagination = {
  page: number;
  limit: number;
  totalPage: number;
  count: number;
};

export type MarkeplaceQueryParam = {
  page: number;
  limit: number;
  typeOfRent?: string;
  bedroom?: number;
  bathroom?: number;
  furnished?: string;
  petAllowed?: string;
  sharedAccomodation?: string;
  price?: number;
  search?: string;
};

export interface PropertyWhere {
  id?: number;
  name?: string | { [Op.like]: string };
  address?: string;
  bedroom?: number | { [Op.gte]: number };
  bathroom?: number | { [Op.gte]: number };
  area?: number;
  description?: string;
  userId?: number;
}

export interface AmenityWhere {
  id?: number;
  furnished?: boolean;
  petAllowed?: boolean;
  sharedAccomodation?: boolean;
  propertyId?: number;
}

export interface TypeOfRentWhere {
  id?: number;
  type?: string | { [Op.in]: string[] };
  propertyId?: number;
  price?: number | { [Op.lte]: number };
  isSoldOut?: string;
}

export interface ResponseBody {
  status: number;
  message: string;
  data: any;
  pagination?: Pagination;
}
