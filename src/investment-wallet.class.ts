import { CONSTANT } from "@/common/constant";
import { OPERATION_TYPE } from "@/enums/operation-type.enum";
import { IInvestmentPortfolio } from "@/interfaces/investment-portifolio.interface";
import { IStockOperation } from "@/interfaces/stock-operation.interface";

const { LIMIT_VALUE_FOR_EVADING_TAXES, TAX_RATE, ZERO_NUMERIC_VALUE, ZERO_VALUE_STR, NEGATIVE_CONSTANT_VALUE } = CONSTANT.WALLET
const { ERROR_RETURN_OBJECT } = CONSTANT.RETURN


export class InvestmentWallet {
    private wallet: IInvestmentPortfolio;

    constructor(stockOps: IStockOperation[]) {
        this.formatStockOperations(stockOps)
    }

    getWallet() {
        return this.wallet
    }

    executeTradingHistory() {
        this.wallet.history.map((operation: IStockOperation) => {
            if (this.isPurchase(operation)) {
                this.handlePurchaseOperation(operation)
                this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
                return;
            }

            if (this.isSellNotAlowedByStockQuantity(operation)) {
                this.setErrorReturnForOperation()
                return;
            }

            if (this.isOperationNotProfitable(operation)) {
                this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
                return;
            }

            if (this.isOperationProfitable(operation) && this.canOperationBeTaxed(operation.unitcost, operation.quantity)) {
                const currentProfit = this.calculateOperationProfit(operation.unitcost, operation.quantity)
                this.updateStockQuantity(operation.quantity * NEGATIVE_CONSTANT_VALUE)

                if (currentProfit < ZERO_NUMERIC_VALUE) {
                    this.handleProfitShortage(operation)
                    return;
                }

                if (!this.hasDebtToBeCharged()) {
                    this.handleTaxReturn(currentProfit)
                    return;
                }

                const remainingProfit = this.chargeDebt(currentProfit)
                if (this.hasNoRemainingProfit(remainingProfit)) {
                    this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
                    return;
                }

                this.handleTaxReturn(remainingProfit)
                return;
            }
            this.handleProfitShortage(operation)
            return;
        })
    }

    //Factory 
    private formatStockOperations(stockOpsJsonList: IStockOperation[]): void {
        const history = stockOpsJsonList.map((item) => {
            const { operation, quantity, ...cost } = item
            return {
                operation,
                quantity,
                unitcost: cost['unit-cost']
            }
        })
        this.wallet = {
            stockQuantity: ZERO_NUMERIC_VALUE,
            mediumStockPrice: ZERO_VALUE_STR,
            lastPurchasePrice: ZERO_NUMERIC_VALUE,
            lastPurchaseQuantity: ZERO_NUMERIC_VALUE,
            debtValue: ZERO_NUMERIC_VALUE,
            history,
            taxCost: []
        }
    }

    //Validators
    private isOperationProfitable(operation: IStockOperation): boolean {
        return this.wallet.mediumStockPrice < operation.unitcost.toString()
    }

    private isOperationNotProfitable(operation: IStockOperation): boolean {
        return this.wallet.mediumStockPrice === operation.unitcost.toString()
    }

    private isSellNotAlowedByStockQuantity(operation: IStockOperation) {
        return operation.quantity > this.wallet.stockQuantity
    }

    private hasNoRemainingProfit(value: number): boolean {
        return value === ZERO_NUMERIC_VALUE || value < ZERO_NUMERIC_VALUE
    }

    private isPurchase(stockOperation: IStockOperation): boolean {
        return stockOperation.operation === OPERATION_TYPE.BUY
    }

    private canOperationBeTaxed(stockCost: number, stockQuantity: number): boolean {
        return stockCost * (stockQuantity) > (LIMIT_VALUE_FOR_EVADING_TAXES)
    }

    private hasDebtToBeCharged(): boolean {
        return this.wallet.debtValue < ZERO_NUMERIC_VALUE
    }

    //Setters
    private setTaxReturnForOperation(taxValue: number): void {
        this.wallet.taxCost.push({ tax: taxValue })
    }

    private setErrorReturnForOperation(): void {
        this.wallet.taxCost.push(ERROR_RETURN_OBJECT)
    }

    private setWalletDebit(value: number): void {
        this.wallet.debtValue = value
    }

    private setDebtValue(value: number): void {
        this.wallet.debtValue = value
    }

    private setLastPurchaseValues(operation: IStockOperation): void {
        this.wallet.lastPurchasePrice = operation.unitcost
        this.wallet.lastPurchaseQuantity = operation.quantity
    }

    //Calculator
    private calculateMediumStockPrice(operation: IStockOperation): void {
        this.wallet.mediumStockPrice = this.calculateNewPriceAverage(operation.unitcost, operation.quantity)
    }

    private calculateOperationCost(operation: IStockOperation): number {
        return operation.unitcost * operation.quantity;
    }

    private calculateOperationShortage(operation: IStockOperation): number {
        return (this.wallet.lastPurchasePrice * operation.quantity - this.calculateOperationCost(operation)) * NEGATIVE_CONSTANT_VALUE
    }

    private calculateNewPriceAverage(operation: IStockOperation) {
        const currentPurchaseCost = this.calculateOperationCost(operation)
        const lastPurchaseCost = (this.wallet.lastPurchaseQuantity * this.wallet.lastPurchasePrice)

        const totalStockPurchaseAmount = operation.quantity + this.wallet.lastPurchaseQuantity
        const totalPurchaseCost = currentPurchaseCost + lastPurchaseCost;

        const newPriceAverage = totalPurchaseCost / totalStockPurchaseAmount

        return parseFloat(newPriceAverage.toString()).toFixed(2)
    }

    private calculateOperationProfit(sellPrice: number, currentQuantity: number): number {
        const valueWithPreviousPrice = this.wallet.lastPurchasePrice * currentQuantity
        const currentSellValue = sellPrice * currentQuantity
        const profit = valueWithPreviousPrice - currentSellValue

        return parseFloat(profit.toString()) * NEGATIVE_CONSTANT_VALUE
    }

    private calculateTaxForOperation(value: number): number {
        return value * (TAX_RATE)
    }

    //Handlers
    private updateStockQuantity(quantity: number): void {
        this.wallet.stockQuantity += quantity
    }

    private handlePurchaseOperation(operation: IStockOperation): void {
        this.calculateMediumStockPrice(operation)
        this.setLastPurchaseValues(operation)
        this.updateStockQuantity(operation.quantity)
    }

    private handleTaxReturn(profit: number): void {
        const tax = this.calculateTaxForOperation(profit)
        this.setTaxReturnForOperation(tax)
    }

    private handleProfitShortage(operation: IStockOperation) {
        const currentDebt = this.calculateOperationShortage(operation)
        this.setWalletDebit(currentDebt)
        this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
    }

    private chargeDebt(currentProfit: number): number {
        const existingDebt: number = this.wallet.debtValue
        const remaining = currentProfit + existingDebt

        if (remaining >= ZERO_NUMERIC_VALUE) {
            this.setDebtValue(ZERO_NUMERIC_VALUE)
            return remaining
        }

        this.setDebtValue(remaining)
        return this.wallet.debtValue;
    }

}