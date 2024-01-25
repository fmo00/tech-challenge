import * as fs from 'fs';

const END_OF_OBJECT_REGEX = /},/g;
const OBJECT_FORMAT_REGEX = /(\{[^{}]*\})/;

const LIST_FINAL_TOKEN = ']'
const LIST_INITIAL_TOKEN = '['

export class InputParser {
    constructor() { }

    readInputFile(filename: string): string | undefined {
        try {
            return fs.readFileSync(filename, 'utf-8');
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    formatFileInputString(fileContent: string): string[] {
        return this.divideOperationsByList(fileContent)
    }

    getStockTimelineObjectsList(stockOpsList: string[]) {
        return stockOpsList.map((stockOperations) => {
            return this.parseStockOperations(stockOperations)
        })
    }
    private parseStockOperations(fileContent: string) {
        const operationsSteps: string[] = this.getOperationSteps(fileContent)
        const validOperationsSteps: string[] = this.validateOperationSteps(operationsSteps)
        return this.generateStockTimelineJson(validOperationsSteps)
    };

    private divideOperationsByList(fileContent: string): string[] {
        const stockOpsList = fileContent.split(LIST_FINAL_TOKEN).slice(0, -1)
        return stockOpsList.map((item: string) => {
            return item.replace(LIST_INITIAL_TOKEN, '')
        })
    }

    private validateOperationSteps(stockOperation: string[]): string[] {
        return stockOperation.filter(str => str.trim() !== '')
    }

    private getOperationSteps(fileContent: string): string[] {
        fileContent = fileContent.replace(END_OF_OBJECT_REGEX, '}')
        return fileContent.split(OBJECT_FORMAT_REGEX)
    }

    private generateStockTimelineJson(stockSteps: string[]) {
        return stockSteps.map((step) => {
            return JSON.parse(step)
        })
    }
}