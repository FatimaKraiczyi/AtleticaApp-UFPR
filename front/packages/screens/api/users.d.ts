import type { IResponse } from "../interfaces";
import type { UserNovaSenha, UserProps } from "../interfaces/users";
export declare const userAuthentication: (email: string, senha: string) => Promise<IResponse.Default<any>>;
export declare const sendEmailRequest: (email: string, nome: string) => Promise<IResponse.Default<null>>;
export declare const validateUserToken: (token: string) => Promise<IResponse.Default<UserNovaSenha>>;
export declare const resetPasswordRequest: (email: string) => Promise<IResponse.Default<null>>;
export declare const newPassword: (senha: string, repSenha: string) => Promise<IResponse.Default<null>>;
export declare const createUser: (user: UserProps) => Promise<IResponse.Default<UserProps>>;
