import { IResponse } from "../interfaces";
import { UserProps } from "../interfaces/users";
export declare const userAuthentication: (email: string, senha: string) => Promise<IResponse.Default<UserProps>>;
