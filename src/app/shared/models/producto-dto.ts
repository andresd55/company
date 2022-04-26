export class ProductDto {
    productId: string;
    productName: string;
    image: string;
    brand: string;
    description: string;
    line: string;
    subline: string;
    sizes: string;
    width: number;
    length: number;
    cut: string;
    warp: string;
    colors: string;
    adhesive: string;
    finish: string;
    orientation: string;
    unitsPeerSleeve: number;
    quality: string;
    options: string;
    inventoryPerLocation: string;
    customerProductCode: string;
    lastestVersion: string;
    minimunOrderQuantity: number;
    customer: any;
    customerId: any;
    productPrices: any;
    price: number;
    quantity: number;
    comments: string;
    minimusStockKeepingUnit: string;
    approvedBy: string;
    approvedDate: string;
    constructionDetails: string;
    constructor(
      productId?: string,
      productName?: string,
      Image?: string,
      Brand?: string,
      Description?: string,
      Line?: string,
      Subline?: string,
      sizes?: string,
      width?: number,
      length?: number,
      cut?: string,
      warp?: string,
      colors?: string,
      adhesive?: string,
      finish?: string,
      orientation?: string,
      unitsPeerSleeve?: number,
      quality?: string,
      options?: string,
      inventoryPerLocation?: string,
      customerProductCode?: string,
      lastestVersion?: string,
      minimunOrderQuantity?: number,
      quantity?: number,
      comments?: string,
      minimusStockKeepingUnit?: string,
      approvedBy?: string,
      approvedDate?: string,
      constructionDetails?: string
      ) {
      this.productId = (productId) ? productId : '0';
      this.productName = (productName) ? productName : '';
      this.image = (Image) ? Image : '';
      this.brand = (Brand) ? Brand : '';
      this.description = (Description) ? Description : '';
      this.line = (Line) ? Line : '';
      this.subline = (Subline) ? Subline : '';
      this.sizes = (sizes) ? sizes : '';
      this.width = (width) ? width : 0;
      this.length = (length) ? length : 0;
      this.cut = (cut) ? cut : '';
      this.warp = (warp) ? warp : '';
      this.colors = (colors) ? colors : '';
      this.adhesive = (adhesive) ? adhesive : '';
      this.finish = (finish) ? finish : '';
      this.orientation = (orientation) ? orientation : '';
      this.unitsPeerSleeve = (unitsPeerSleeve) ? unitsPeerSleeve : 0;
      this.quality = (quality) ? quality : '';
      this.options = (options) ? options : '';
      this.inventoryPerLocation = (inventoryPerLocation) ? inventoryPerLocation : '';
      this.customerProductCode = (customerProductCode) ? customerProductCode : '';
      this.lastestVersion = (lastestVersion) ? lastestVersion : '';
      this.minimunOrderQuantity = (minimunOrderQuantity) ? minimunOrderQuantity : 0;
      this.quantity = (quantity) ? quantity : 0;
      this.comments = (comments) ? comments : '';
      this.minimusStockKeepingUnit = (minimusStockKeepingUnit) ? minimusStockKeepingUnit : '';
      this.approvedBy = (approvedBy) ? approvedBy : '';
      this.approvedDate = (approvedDate) ? approvedDate : '';
      this.constructionDetails = (constructionDetails) ? constructionDetails : '';
    }
  }
  