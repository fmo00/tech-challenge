import { CONSTANT } from "@/common/constant";
import { OPERATION_TYPE } from "@/enums/operation-type.enum";
import { IInvestmentWallet } from "@/interfaces/investment-wallet.interface";
import { IStockOperation } from "@/interfaces/nested/stock-operation.interface";
import { ITaxResult } from "@/interfaces/nested/tax-result.interface";
import { StockTradingCalculatorService } from "./services/calculator.service";

const { LIMIT_VALUE_FOR_EVADING_TAXES, ZERO_NUMERIC_VALUE, NEGATIVE_CONSTANT_VALUE } = CONSTANT.WALLET
const { ERROR_RETURN_OBJECT } = CONSTANT.RETURN
const { OPERATION } = CONSTANT.DEFAULT_VALUES

export class InvestmentWallet {
    private wallet: IInvestmentWallet;
    private calculator: StockTradingCalculatorService;

    constructor(stockOps: IStockOperation[]) {
        this.calculator = new StockTradingCalculatorService()
        this.generateWallet(stockOps)
    }

    getWallet(): IInvestmentWallet {
        return this.wallet
    }

    getTaxByOperation(): ITaxResult[] {
        return this.wallet.taxByOperation
    }

    executeTradingHistory() {
        this.wallet.tradingHistory.map((operation: IStockOperation) => {
            if (this.isPurchase(operation)) {
                this.handlePurchaseOperation(operation)
                return;
            }

            if (!this.isSellAlowedByStockQuantity(operation)) {
                this.setErrorReturnForOperation()
                return;
            }

            if (this.isOperationNotProfitable(operation)) {
                this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
                return;
            }

            if (this.isOperationProfitable(operation) && this.canOperationBeTaxed(operation.unitcost, operation.quantity)) {
                this.handleOperationTax(operation)
                return;
            }
            this.handleProfitShortage(operation)
            return;
        })
    }

    //Factory 
    private generateWallet(stockOpsJsonList: IStockOperation[]): void {
        const tradingHistory = this.generateStockTradingHistory(stockOpsJsonList)
        this.wallet = {
            ...OPERATION, tradingHistory
        }
    }

    private generateStockTradingHistory(stockOpsJsonList: IStockOperation[]): IStockOperation[] {
        return stockOpsJsonList.map((stockOperation) => {
            const { operation, quantity, ...cost } = stockOperation
            return {
                operation,
                quantity,
                unitcost: cost['unit-cost']
            }
        })
    }

    //Validators
    private isOperationProfitable(operation: IStockOperation): boolean {
        return this.wallet.purchaseMediumPrice < operation.unitcost.toString()
    }

    private isOperationNotProfitable(operation: IStockOperation): boolean {
        return this.wallet.purchaseMediumPrice === operation.unitcost.toString()
    }

    private isSellAlowedByStockQuantity(operation: IStockOperation) {
        return operation.quantity < this.wallet.stockQuantity
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
        this.wallet.taxByOperation.push({ tax: taxValue })
    }

    private setErrorReturnForOperation(): void {
        this.wallet.taxByOperation.push(ERROR_RETURN_OBJECT)
    }

    private setWalletDebit(value: number): void {
        this.wallet.debtValue = value
    }

    private setDebtValue(value: number): void {
        this.wallet.debtValue = value
    }

    private setLastPurchase(operation: IStockOperation): void {
        this.wallet.lastPurchase = operation
    }

    private setStockQuantity(quantity: number): void {
        this.wallet.stockQuantity = quantity
    }

    //Handlers
    private calculateStockQuantity(quantity: number): number {
        return this.wallet.stockQuantity += quantity
    }
    private setMediumStockPrice(value: string): void {
        this.wallet.purchaseMediumPrice = value
    }
    private handlePurchaseOperation(operation: IStockOperation): void {
        const newMediumStockPrice = this.calculator.calculateMediumStockPrice(operation, this.wallet.lastPurchase)
        this.setMediumStockPrice(newMediumStockPrice)
        this.setLastPurchase(operation)
        const newStockQuantity = this.calculateStockQuantity(operation.quantity)
        this.setStockQuantity(newStockQuantity)
        this.setTaxReturnForOperation(ZERO_NUMERIC_VALUE)
    }

    private handleTaxReturn(profit: number): void {
        const tax = this.calculator.calculateTaxForOperation(profit)
        this.setTaxReturnForOperation(tax)
    }

    private handleProfitShortage(operation: IStockOperation) {
        const currentDebt = this.calculator.calculateOperationShortage(operation, this.wallet.lastPurchase.unitcost)
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

    private handleOperationTax(operation: IStockOperation) {
        const currentProfit = this.calculator.calculateOperationProfit(operation.unitcost, operation.quantity, this.wallet.lastPurchase)
        const newStockQuantity = this.calculateStockQuantity(operation.quantity * NEGATIVE_CONSTANT_VALUE)
        this.setStockQuantity(newStockQuantity)

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
    }


}