#! /usr/bin/env node
import { InvestmentWallet } from '@/investment-wallet.class';
import { InputParserService } from '@/services/input-parser.service';

function readInputFile(filePath: string) {
    const inputParser = new InputParserService()

    const fileContent: string | undefined = inputParser.readInputFile(filePath)
    const stockTradingList = inputParser.formatFileInputString(fileContent)
    return inputParser.getStockTimelineObjectsList(stockTradingList)

}

const args = process.argv;
const filePath = args.slice(2).toString()

const stockOperationJson = readInputFile(filePath)

stockOperationJson.forEach((stockOperationJson) => {
    const wallet = new InvestmentWallet(stockOperationJson)
    wallet.executeTradingHistory()
    console.log(wallet.getWallet().taxCost)
})


