export function formatString(str: string) {
    // Substituir espaços por vazio
    let resultado = str.replace(/\s+/g, "");

    // Remover caracteres especiais
    resultado = resultado.replace(/[^\w\s]/gi, "");

    return resultado;
}
