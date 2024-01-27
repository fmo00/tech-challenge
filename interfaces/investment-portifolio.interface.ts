import { IStockOperation } from "./stock-operation.interface";
import { ITax } from "./tax.interface";

export interface IInvestmentPortfolio {
    mediumStockPrice: string
    lastPurchasePrice: number,
    lastPurchaseQuantity: number;
    debtValue: number;
    history: IStockOperation[];
    taxByOperation: ITax[];
}