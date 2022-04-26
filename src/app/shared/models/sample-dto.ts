export class SampleDto {
    sampleId: number;
    items: string;
    requireC: string;
    customerProductCode: string;
    size: string;
    colorVariation: string;
    colorObservation: string;
    quantity: number;
    requiredDate: string;
    price: number;

    constructor(
    customerProductCode?: string,
    size?: string,
    colorVariation?: string,
    colorObservation?: string,
    quantity?: number,
    requiredDate?: string,
    price?: number
      ) {
      this.customerProductCode = (customerProductCode) ? customerProductCode : '';
      this.size = (size) ? size : '';
      this.colorVariation = (colorVariation) ? colorVariation : '';
      this.colorObservation = (colorObservation) ? colorObservation : '';
      this.quantity = (quantity) ? quantity : 0;
      this.requiredDate = (requiredDate) ? requiredDate : '';
      this.price = (price) ? price : 0;
    }
  }
  