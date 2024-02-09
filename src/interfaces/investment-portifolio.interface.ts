import { IStockOperation } from "@/interfaces/nested/stock-operation.interface";
import { ITax } from "@/interfaces/nested/tax.interface";

export interface IInvestmentPortfolio {
    purchaseMediumPrice: string
    lastPurchasePrice: number,
    lastPurchaseQuantity: number;
    debtValue: number;
    stockQuantity: number;
    history: IStockOperation[];
    taxCost: ITax[];
}