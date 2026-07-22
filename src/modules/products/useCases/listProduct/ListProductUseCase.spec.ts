import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { ProductBestSellerEnum } from "@modules/products/enums/ProductBestSellerEnum";
import { ProductStatusEnum } from "@modules/products/enums/ProductStatusEnum";
import { ProductTypeEnum } from "@modules/products/enums/ProductTypesEnum";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductUseCase } from "../createProduct/CreateProductUseCase";
import { ListProductUseCase } from "./ListProductUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let listProductUseCase: ListProductUseCase;
let createProductUseCase: CreateProductUseCase;

describe("List Products", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        listProductUseCase = new ListProductUseCase(productsRepositoryInMemory);
        createProductUseCase = new CreateProductUseCase(
            productsRepositoryInMemory
        );
    });

    it("should be able to list products", async () => {
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
            name: "Product One",
            bestSeller: ProductBestSellerEnum.BEST_SELLER,
            status: ProductStatusEnum.ACTIVE,
            type: ProductTypeEnum.SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "One",
        };

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: "",
            type: "",
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(2);
    });

    it("should be able to list product filtered by name", async () => {
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

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "One",
            shortName: "",
            status: "",
            type: "",
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list product filtered by short name", async () => {
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
            shortName: "Two",
        };

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "Two",
            status: "",
            type: "",
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list product filtered by best seller", async () => {
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
            bestSeller: ProductBestSellerEnum.NORMAL,
            status: ProductStatusEnum.ACTIVE,
            type: ProductTypeEnum.SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "Two",
        };

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: "",
            type: "",
            bestSeller: ProductBestSellerEnum.BEST_SELLER,
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list product filtered by status", async () => {
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
            bestSeller: ProductBestSellerEnum.NORMAL,
            status: ProductStatusEnum.INACTIVE,
            type: ProductTypeEnum.SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "Two",
        };

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: ProductStatusEnum.INACTIVE,
            type: "",
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list product filtered by type", async () => {
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
            bestSeller: ProductBestSellerEnum.NORMAL,
            status: ProductStatusEnum.INACTIVE,
            type: ProductTypeEnum.NON_SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "Two",
        };

        await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: "",
            type: ProductTypeEnum.NON_SCHEDULED,
            bestSeller: "",
            id: "",
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list product filtered by id", async () => {
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
            bestSeller: ProductBestSellerEnum.NORMAL,
            status: ProductStatusEnum.INACTIVE,
            type: ProductTypeEnum.NON_SCHEDULED,
            price: 10,
            duration: 1,
            shortName: "Two",
        };

        const productCreated = await createProductUseCase.execute(product2);

        const result = await listProductUseCase.execute({
            name: "",
            shortName: "",
            status: "",
            type: "",
            bestSeller: "",
            id: productCreated.id,
            onlyAdmin: null,
        });

        expect(result).toHaveLength(1);
    });
});

