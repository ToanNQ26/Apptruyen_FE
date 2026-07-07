export interface ApiResponse<T> {

  code:number;

  message:string;

  result:T;

}

export type ApiError = ApiResponse<null>;