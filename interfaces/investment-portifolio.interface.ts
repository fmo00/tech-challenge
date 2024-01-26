import { IStockOperation } from "./stock-operation.interface";

export interface IInvestmentPortfolio {
    lastPurchasePrice: number,
    lastPurchaseQuantity: number;
    debitValue: number;
    history: IStockOperation[]
    taxByOperation: []
}