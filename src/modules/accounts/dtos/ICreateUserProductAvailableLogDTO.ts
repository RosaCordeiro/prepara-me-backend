interface ICreateUserProductAvailablLogDTO {
    id?: string;
    userId: string;
    userProductsAvailableId: string;
    productIdNew: string;
    productIdOld: string;
    availableQuantity: number;
}

export { ICreateUserProductAvailablLogDTO };
