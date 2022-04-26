export class BrandProductDto {
    brandCatalogId: number;
    masterCustomerId: number;
    masterCustomerName: string;
    brandCatalogCode: string;
    brandCatalogName: string;
    finalDimension: string;
    groupLineName: string;   
    brandCatalogStatus: string;
    imageUrl: string;
    adobeUrl: string;
    line?: string;
    brandCustomerName?: string;
    groupLineId?: number;
    productType?: string;
    statusId?: number;
    status?: string;
    latestVersion?: string;
    moq?: number;
    minimunPerChange?: number;
    leadTime?: number;
    leadTimeUnit?: number;
    timeUnitName?: string;
    factoryLocationId?: number;
    factoryLocationName?: string;
    approvedDate?: string;
    approvedBy?: string;
    constructionDetail?: string;
    comments?: string;
    productionFacilities?: string;
    localFacility?: string;
    dimension?: string;
    imageUrlTmp: string;
    adobeUrlTmp: string;
    customerId?: number;
    constructor(
      brandCatalogId?: number,
      masterCustomerId?: number,
      masterCustomerName?: string,
      brandCatalogCode?: string,
      brandCatalogName?: string,
      finalDimension?: string,
      groupLineName?: string,
      brandCatalogStatus?: string,
      imageUrl?: string,
      adobeUrl?: string,
      line?: string,
      brandCustomerName?: string,
      groupLineId?: number,
      productType?: string,
      statusId?: number,
      status?: string,
      latestVersion?: string,
      moq?: number,
      minimunPerChange?: number,
      leadTime?: number,
      leadTimeUnit?: number,
      timeUnitName?: string,
      factoryLocationId?: number,
      factoryLocationName?: string,
      approvedDate?: string,
      approvedBy?: string,
      constructionDetail?: string,
      comments?: string,
      productionFacilities?: string,
      localFacility?: string,
      dimension?: string,
      customerId?: number,
      imageUrlTmp?: string,
      adobeUrlTmp?: string
      ) {
      this.brandCatalogId = (brandCatalogId) ? brandCatalogId : 0;
      this.masterCustomerId = (masterCustomerId) ? masterCustomerId : 0;
      this.masterCustomerName = (masterCustomerName) ? masterCustomerName : '';
      this.brandCatalogCode = (brandCatalogCode) ? brandCatalogCode : '';
      this.brandCatalogName = (brandCatalogName) ? brandCatalogName : '';
      this.finalDimension = (finalDimension) ? finalDimension : '';
      this.groupLineName = (groupLineName) ? groupLineName : '';
      this.brandCatalogStatus = (brandCatalogStatus) ? brandCatalogStatus : '';
      this.imageUrl = (imageUrl) ? imageUrl : '';
      this.adobeUrl = (adobeUrl) ? adobeUrl : '';      
      this.comments = (comments) ? comments : '';  
      this.constructionDetail = (constructionDetail) ? constructionDetail : ''; 
      this.approvedDate = (approvedDate) ? approvedDate : ''; 
      this.approvedBy = (approvedBy) ? approvedBy : ''; 
      this.line = (line) ? line : ''; 
      this.brandCustomerName = (brandCustomerName) ? brandCustomerName : ''; 
      this.groupLineId = (groupLineId) ? groupLineId : 0; 
      this.productType = (productType) ? productType : ''; 
      this.statusId = (statusId) ? statusId : 0; 
      this.status = (status) ? status : ''; 
      this.latestVersion = (latestVersion) ? latestVersion : ''; 
      this.moq = (moq) ? moq : 0; 
      this.minimunPerChange = (minimunPerChange) ? minimunPerChange : 0; 
      this.leadTime = (leadTime) ? leadTime : 0; 
      this.leadTimeUnit = (leadTimeUnit) ? leadTimeUnit : 0; 
      this.timeUnitName = (timeUnitName) ? timeUnitName : ''; 
      this.factoryLocationId = (factoryLocationId) ? factoryLocationId : 0; 
      this.factoryLocationName = (factoryLocationName) ? factoryLocationName : ''; 
      this.approvedDate = (approvedDate) ? approvedDate : ''; 
      this.approvedBy = (approvedBy) ? approvedBy : '';  
      this.comments = (comments) ? comments : '';
      this.productionFacilities = (productionFacilities) ? productionFacilities : '';
      this.localFacility = (localFacility) ? localFacility : '';
      this.dimension = (dimension) ? dimension : '';
      this.customerId = (customerId) ? customerId : 0;
      this.imageUrlTmp = (imageUrlTmp) ? imageUrlTmp : '';
      this.adobeUrlTmp = (adobeUrlTmp) ? adobeUrlTmp : '';
    }
  }
  