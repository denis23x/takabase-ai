/** @format */
import { ParamsId } from '../params/params-id';

export interface QuerystringScope extends ParamsId {
  Querystring: {
    scope?: string[];
  };
}
