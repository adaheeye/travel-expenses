import {HttpParams} from "@angular/common/http";

export const createParams = (params?: any): HttpParams => {
  return new HttpParams({fromObject: params});
};
