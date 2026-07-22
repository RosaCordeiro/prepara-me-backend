import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { ProductBestSellerEnum } from "@modules/products/enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "@modules/products/enums/ProductStatusEnum";
import { ProductTypeEnum } from "@modules/products/enums/ProductTypesEnum";
import { ProductContentsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductContentsRepositoryInMemory";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { ProductsSpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/ProductsSpecialistsRepositoryInMemory";
import { CreateProductUseCase } from "../createProduct/CreateProductUseCase";
import { ListProductUseCase } from "../listProduct/ListProductUseCase";
import { RemoveProductUseCase } from "./RemoveProductUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let productContentsRepositoryInMemory: ProductContentsRepositoryInMemory;
let productsSpecialistsRepositoryInMemory: ProductsSpecialistsRepositoryInMemory;
let listProductUseCase: ListProductUseCase;
let createProductUseCase: CreateProductUseCase;
let removeProductUseCase: RemoveProductUseCase;

describe("Remove Products", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        productContentsRepositoryInMemory =
            new ProductContentsRepositoryInMemory();
        productsSpecialistsRepositoryInMemory =
            new ProductsSpecialistsRepositoryInMemory();
        listProductUseCase = new ListProductUseCase(productsRepositoryInMemory);
        createProductUseCase = new CreateProductUseCase(
            productsRepositoryInMemory
        );
        removeProductUseCase = new RemoveProductUseCase(
            productsRepositoryInMemory,
            productContentsRepositoryInMemory,
            productsSpecialistsRepositoryInMemory
        );
    });

    it("should be able to delete a product", async () => {
        const product1: ICreateProductDTO = {
            name: "Product One",
            bestSeller: ProductBestSellerEnum.BEST_SELLER,
            status: ProductStatusEnum.ACTIVE,
            type: ProductTypeEnum.SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "One",
        };

        await createProductUseCase.execute(product1);

        const product2: ICreateProductDTO = {
            name: "Product Two",
            bestSeller: ProductBestSellerEnum.BEST_SELLER,
            status: ProductStatusEnum.ACTIVE,
            type: ProductTypeEnum.SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "One",
        };

        const productCreated = await createProductUseCase.execute(product2);

        await removeProductUseCase.execute(productCreated.id);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: "",
            type: "",
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });
});