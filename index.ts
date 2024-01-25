import { InputParser } from './input-parser.class'

const inputParser = new InputParser()

const fileContent: string | undefined = inputParser.readInputFile('input.txt')
const stockTradingList: string[] = inputParser.formatFileInputString(fileContent)
const stockOperationJson = inputParser.getStockTimelineObjectsList(stockTradingList)
console.log(stockOperationJson)
