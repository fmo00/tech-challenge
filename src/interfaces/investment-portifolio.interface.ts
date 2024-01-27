import { IStockOperation } from "@/interfaces/stock-operation.interface";
import { ITax } from "@/interfaces/tax.interface";

export interface IInvestmentPortfolio {
    mediumStockPrice: string
    lastPurchasePrice: number,
    lastPurchaseQuantity: number;
    debtValue: number;
    history: IStockOperation[];
    taxCost: ITax[];
}