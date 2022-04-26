export interface ProductPriceDto {
    customerId: number;
    productId: string;
    lowerLimit: number;
    upperLimit: number;
    salesUnit: string;
    salesPrice: number;
}
