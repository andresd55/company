export interface CustomerAddress {
    customerId: number;
    addressId: number;
    sourceAddress: number | null;
    addressTypeId: number;
    finalClient: string;
    contactName: string;
    birthDate: string | null;
    presetBillingAddress: string;
    presetShippingAddress: string;
    rfc: string;
    immex: string;
    immexLegend: string;
    shipViaId: number;
    tradeTermsId: number | null;
    destinationPortId: number;
    paymentMethodId: number | null;
    freightPurchaseOrder: number | null;
    remoteClientCode: string;
    remoteAddress: number | null;
    customerPlant: string;
    registerStatusId: number;
    createdByUser: string;
    creationDate: string;
    modifiedByUser: string;
    modifiedDate: string;
}