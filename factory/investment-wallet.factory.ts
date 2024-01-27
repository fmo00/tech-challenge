/* import { IInvestmentPortfolio } from "../interfaces/investment-portifolio.interface"

export const investmentWalletFactory = (item): IInvestmentPortfolio => {
    const { operation, quantity, ...cost } = item
    // console.log({ ...cost })
    return {
        lastPurchasePrice: 0,
        lastPurchaseQuantity: 0,
        debitValue: 0,
        history: [{
            operation,
            quantity,
            unitcost: cost['unit-cost']
        }]
    }
}
 */