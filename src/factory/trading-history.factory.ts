import { IStockOperation } from "@/interfaces/nested/stock-operation.interface";

export const tradingHistoryFactory = (stockOpsJsonList: IStockOperation[]) => {
    return stockOpsJsonList.map((stockOperation) => {
        const { operation, quantity, ...cost } = stockOperation
        return {
            operation,
            quantity,
            unitcost: cost['unit-cost']
        }
    })
}