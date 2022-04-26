import { BrandProductDto } from "./brandproducto-dto";

export class ProductItemCartBrandDto extends BrandProductDto{
    requiredDate: Date;
    color: string;
    size: string;
    quantity: number;
    price: number;
}
