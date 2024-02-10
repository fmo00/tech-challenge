import { IStockOperation } from "@/interfaces/nested/stock-operation.interface";
import { ITaxResult } from "@/interfaces/nested/tax-result.interface";

export interface IInvestmentWallet {
    purchaseMediumPrice: string
    lastPurchase: IStockOperation
    debtValue: number;
    stockQuantity: number;
    tradingHistory: IStockOperation[];
    taxByOperation: ITaxResult[];
}