export const environment = {
  production: true,
  max_file_size: 12,
  pageLenght: 10,
  pageLenghtCard: 5,
  timeRefreshOrders: 120,//seconds
  refreshTokenTime: 300000,
  baseUrl: {
    url: "https://apimanagementfinotex.azure-api.net/"
  },
  methods: {
    Sketch: "SalesDev/api/V1",
    Shared: "SharedDev/api/V1",
    Product: "SalesDev/api/V1",
    Sales: "SalesDev/api/V1",
    Customer: "FinancialDev/api/V1",
    MasterSales: "SalesDev/api/V1",
    MasterProduct: "SalesDev/api/V1",
    NotificationPush: "UtilsDev/api/V1",
    Brand: "BrandDev/api/V1",
    ShippingMasters: "ShippingMastersDev/api/V1",
    CommonMasters: "FinancialDev/api/V1",
    ProductionMasters: "ProductionMastersDev/api/V1",
    Wms: "UtilsDev/api/V1",
  },
  config: {    
    urlNotifications: "https://finotexfunctionsnotificationspushdev.azurewebsites.net/api/notifications/"
  },
  auth: {
    clientId: '98c68b8e-0d50-4961-b352-5cd5040b1e1e',
    authority: 'https://login.microsoftonline.com/171cc8e3-fbee-43e4-b757-b08386005972',
    redirectUri: '/',
    cacheLocation: 'localStorage',
  },
  statusDefaultArtWorksHistory: [1, 2, 3, 6],
  productionMastersScheduleEs:
  [{ "codeSchedule": 1, "nameSchedule": "Dia" },{ "codeSchedule": 2, "nameSchedule": "Noche" }],  
  productionMastersScheduleEn:
  [{ "codeSchedule": 1, "nameSchedule": "Day" },{ "codeSchedule": 2, "nameSchedule": "Night" }],  
  productionMastersTurnsES: [    
    { "codeTurn": 1, "nameTurn": "Turno A" },
    { "codeTurn": 2, "nameTurn": "Turno B" },
    { "codeTurn": 3, "nameTurn": "Turno C" },
    { "codeTurn": 4, "nameTurn": "Turno D" },
    { "codeTurn": 5, "nameTurn": "Turno E" },
    { "codeTurn": 6, "nameTurn": "Turno F" },
    { "codeTurn": 7, "nameTurn": "Turno G" },
    { "codeTurn": 9, "nameTurn": "Turno H" },
  ],
  productionMastersTurnsEn: [    
    { "codeTurn": 1, "nameTurn": "Turn A" },
    { "codeTurn": 2, "nameTurn": "Turn B" },
    { "codeTurn": 3, "nameTurn": "Turn C" },
    { "codeTurn": 4, "nameTurn": "Turn D" },
    { "codeTurn": 5, "nameTurn": "Turn E" },
    { "codeTurn": 6, "nameTurn": "Turn F" },
    { "codeTurn": 7, "nameTurn": "Turn G" },
    { "codeTurn": 9, "nameTurn": "Turn H" },
  ],
  floorControlStateEs:
  [
    { "codeState": 1, "nameState": "A tiempo" },
    { "codeState": 2, "nameState": "En curso" },
    { "codeState": 3, "nameState": "Plazo ajustado" },
    { "codeState": 4, "nameState": "Atrasada" }    
  ],  
  floorControlStateEn:
  [
    { "codeState": 1, "nameState": "OnTime" },
    { "codeState": 2, "nameState": "InProgress" },
    { "codeState": 3, "nameState": "TightDeadLine" },
    { "codeState": 4, "nameState": "Overdue" },
  ],  
};
