export interface IMssqlBodyData {
  valid: boolean;
  decoded: {
    aud: string;
    sub: string;
    name: string;
    idUser: number;
    iat: number;
    exp: number;
    data: any;
  };
}