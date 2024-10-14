export const createUserError = (error) => {
    let errorMessage = "Erro inesperado";
    let status = 500;
    if (error.response) {
        status = error.response.status;
        switch (status) {
            case 400:
                errorMessage = "Campos obrigatórios não preenchidos";
                break;
            case 401:
                errorMessage = "Token inválido ou expirado";
                break;
            case 409:
                errorMessage = "Usuário já existente";
                break;
            case 422:
                errorMessage = "Senhas diferentes";
                break;
            case 500:
            default:
                errorMessage = "Erro no servidor";
                break;
        }
    }
    return { errorMessage, status };
};
