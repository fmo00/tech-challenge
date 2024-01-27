import { IInvestmentPortfolio } from "@/interfaces/investment-portifolio.interface";

export class WalletMock {
    public static stockList() {
        return [
            { "operation": 'buy', "unit-cost": 10, quantity: 10000 },
            { "operation": 'sell', "unit-cost": 2, quantity: 5000 },
            { "operation": 'sell', "unit-cost": 20, quantity: 2000 },
            { "operation": 'sell', "unit-cost": 20, quantity: 2000 },
            { "operation": 'sell', "unit-cost": 25, quantity: 1000 },
            { "operation": 'buy', "unit-cost": 20, quantity: 10000 },
            { "operation": 'sell', "unit-cost": 15, quantity: 5000 },
            { "operation": 'sell', "unit-cost": 30, quantity: 4350 },
            { "operation": 'sell', "unit-cost": 30, quantity: 650 }
        ]
    }

    public static generatedWallet(): IInvestmentPortfolio {
        return {
            mediumStockPrice: '0',
            lastPurchasePrice: 0,
            lastPurchaseQuantity: 0,
            debtValue: 0,
            history: [
                { operation: 'buy', quantity: 10000, unitcost: 10 },
                { operation: 'sell', quantity: 5000, unitcost: 2 },
                { operation: 'sell', quantity: 2000, unitcost: 20 },
                { operation: 'sell', quantity: 2000, unitcost: 20 },
                { operation: 'sell', quantity: 1000, unitcost: 25 },
                { operation: 'buy', quantity: 10000, unitcost: 20 },
                { operation: 'sell', quantity: 5000, unitcost: 15 },
                { operation: 'sell', quantity: 4350, unitcost: 30 },
                { operation: 'sell', quantity: 650, unitcost: 30 }
            ],
            taxCost: []
        }
    }

    public static zeroTaxReturnObject() {
        return { tax: 0 }
    }
}