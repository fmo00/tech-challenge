import { OPERATION_TYPE } from "./enums/operation-type.enum";
import { IInvestmentPortfolio } from "./interfaces/investment-portifolio.interface";
import { IStockOperation } from "./interfaces/stock-operation.interface";

const LIMIT_VALUE_FOR_EVADING_TAXES = 20000;
const TAX_RATE = 0.2
const ZERO_VALUE = 0
const NEGATIVE_CONSTANT_VALUE = -1

export class InvestmentWallet {
    private wallet: IInvestmentPortfolio;

    constructor(stockOps: IStockOperation[]) {
        this.formatStockOperations(stockOps)
    }

    getWallet() {
        return this.wallet
    }

    executeTrading() {
        this.wallet.history.map((operation) => {
            if (this.isPurchase(operation)) {
                this.handlePurchaseOperation(operation)
                this.setTaxReturnForOperation(ZERO_VALUE)
                return;
            }

            if (this.isOperationNotProfitable(operation)) {
                this.setTaxReturnForOperation(ZERO_VALUE)
                return;
            }

            if (this.isOperationProfitable(operation) && this.canOperationBeTaxed(operation.unitcost, operation.quantity)) {
                const currentProfit = this.calculateOperationProfit(operation.unitcost, operation.quantity)

                if (!this.hasDebtToBeCharged()) {
                    this.handleTaxReturn(currentProfit)
                    return;
                }

                const remainingProfit = this.chargeDebt(currentProfit)
                if (this.hasNoRemainingProfit(remainingProfit)) {
                    this.setTaxReturnForOperation(ZERO_VALUE)
                    return;
                }

                this.handleTaxReturn(remainingProfit)
                return;
            }
            this.handleProfitShortage(operation)
        })
    }

    private calculateMediumStockPrice(operation: IStockOperation): void {
        this.wallet.mediumStockPrice = this.calculateNewAverage(operation.unitcost, operation.quantity)
    }

    private isOperationProfitable(operation: IStockOperation): boolean {
        return this.wallet.mediumStockPrice < operation.unitcost.toString()
    }

    private isOperationNotProfitable(operation: IStockOperation): boolean {
        return this.wallet.mediumStockPrice === operation.unitcost.toString()
    }

    private setTaxReturnForOperation(taxValue: number): void {
        this.wallet.taxByOperation.push({ tax: taxValue })
    }

    private calculateOperationCost(operation: IStockOperation): number {
        return operation.unitcost * operation.quantity;
    }

    private handlePurchaseOperation(operation: IStockOperation): void {
        this.calculateMediumStockPrice(operation)
        this.setLastPurchaseValues(operation)
    }

    private handleTaxReturn(profit: number): void {
        const tax = this.calculateTaxForOperation(profit)
        this.setTaxReturnForOperation(tax)
    }

    private handleProfitShortage(operation: IStockOperation) {
        const currentDebt = this.calculateOperationShortage(operation)
        this.setWalletDebit(currentDebt)
        this.setTaxReturnForOperation(ZERO_VALUE)
        return;
    }

    private hasNoRemainingProfit(value: number): boolean {
        return value === 0 || value < 0
    }
    private calculateOperationShortage(operation: IStockOperation): number {
        return (this.wallet.lastPurchasePrice * operation.quantity - this.calculateOperationCost(operation)) * NEGATIVE_CONSTANT_VALUE
    }

    private setWalletDebit(value: number): void {
        this.wallet.debtValue = value
    }

    private calculateNewAverage(currentCost: number, currentQuantity: number) {
        const buyCost = parseFloat(this.wallet.lastPurchasePrice.toString())
        const quantity = parseFloat(this.wallet.lastPurchaseQuantity.toString())
        const denominador = (parseFloat(currentQuantity.toString()) + quantity)

        const vendaAtual = (parseFloat(currentQuantity.toString()) * parseFloat(currentCost.toString()))

        const ultimaCompra = (quantity * buyCost)
        const saldo = vendaAtual + ultimaCompra;

        const tudo = saldo / denominador

        return parseFloat(tudo.toString()).toFixed(2)
    }

    private isPurchase(stockOperation: IStockOperation): boolean {
        return stockOperation.operation === OPERATION_TYPE.BUY
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

    private canOperationBeTaxed(stockCost: number, stockQuantity: number): boolean {
        return stockCost * (stockQuantity) > (LIMIT_VALUE_FOR_EVADING_TAXES)
    }

    private setDebtValue(value: number): void {
        this.wallet.debtValue = value
    }

    private chargeDebt(currentProfit: number): number {
        const existingDebt: number = this.wallet.debtValue
        const remaining = currentProfit + existingDebt

        if (remaining >= ZERO_VALUE) {
            this.setDebtValue(ZERO_VALUE)
            return remaining
        }

        this.setDebtValue(remaining)
        return this.wallet.debtValue;
    }

    private setLastPurchaseValues(operation: IStockOperation): void {
        this.wallet.lastPurchasePrice = operation.unitcost
        this.wallet.lastPurchaseQuantity = operation.quantity
    }

    private hasDebtToBeCharged(): boolean {
        return this.wallet.debtValue < ZERO_VALUE
    }

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
            mediumStockPrice: '0',
            lastPurchasePrice: ZERO_VALUE,
            lastPurchaseQuantity: ZERO_VALUE,
            debtValue: ZERO_VALUE,
            history,
            taxByOperation: []
        }
    }
}