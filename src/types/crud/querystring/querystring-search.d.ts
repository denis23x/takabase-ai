/** @format */

export interface QuerystringSearch {
  Querystring: {
    name?: string;
    query?: string;
    userId?: number;
    userName?: string;
    categoryId?: number;
    orderBy?: string;
    scope?: string[];
    page: number;
    size: number;
  };
}
