#! /usr/bin/env node
import { InvestmentWallet } from '../capital-gain-calculator.class'
import { InputParser } from '../input-parser.class'

const inputParser = new InputParser()

const fileContent: string | undefined = inputParser.readInputFile('case7.txt')
const stockTradingList: string[] = inputParser.formatFileInputString(fileContent)
const stockOperationJson = inputParser.getStockTimelineObjectsList(stockTradingList)


stockOperationJson.forEach((op) => {
    const wallet = new InvestmentWallet(op)
    wallet.executeTrading()
    console.log(wallet.getWallet().taxByOperation)
})


