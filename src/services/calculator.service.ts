import { CONSTANT } from "@/common/constant";
import { IStockOperation } from "@/interfaces/nested/stock-operation.interface";

const { TAX_RATE, NEGATIVE_CONSTANT_VALUE } = CONSTANT.WALLET

export class StockTradingCalculatorService {
    constructor() { }

    calculateMediumStockPrice(operation: IStockOperation, lastPurchase: IStockOperation): string {
        return this.calculateNewPriceAverage(operation.unitcost, operation.quantity, lastPurchase)
    }

    private calculateOperationCost(operation: IStockOperation): number {
        return operation.unitcost * operation.quantity;
    }

    calculateOperationShortage(currentOperation: IStockOperation, lastPurchaseCost: number): number {
        const possibleProfit = lastPurchaseCost * currentOperation.quantity
        return (possibleProfit - this.calculateOperationCost(currentOperation)) * NEGATIVE_CONSTANT_VALUE
    }

    private calculateNewPriceAverage(unitCost: number, quantity: number, lastPurchase: IStockOperation): string {
        const operation = this.mountOperation(unitCost, quantity)
        const currentPurchaseCost = this.calculateOperationCost(operation)
        const lastPurchaseCost = this.calculateOperationCost(lastPurchase)

        const totalStockPurchaseAmount = quantity + lastPurchase.quantity
        const totalPurchaseCost = currentPurchaseCost + lastPurchaseCost;

        const newPriceAverage = totalPurchaseCost / totalStockPurchaseAmount

        return parseFloat(newPriceAverage.toString()).toFixed(2)
    }

    private mountOperation(unitCost: number, quantity: number): IStockOperation {
        return { 'unitcost': unitCost, 'quantity': quantity, 'operation': 'undefined' }
    }

    calculateOperationProfit(sellPrice: number, currentQuantity: number, lastPurchase: IStockOperation): number {
        const valueWithPreviousPrice = lastPurchase.unitcost * currentQuantity
        const currentSellValue = sellPrice * currentQuantity
        const profit = valueWithPreviousPrice - currentSellValue

        return parseFloat(profit.toString()) * NEGATIVE_CONSTANT_VALUE
    }

    calculateTaxForOperation(value: number): number {
        return value * (TAX_RATE)
    }
}