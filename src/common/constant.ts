export const CONSTANT = {
    FILE_PARSER: {
        REGEX: {
            END_OF_OBJECT_REGEX: /},/g,
            OBJECT_FORMAT_REGEX: /(\{[^{}]*\})/,
        },
        TOKEN: {
            LIST_FINAL_TOKEN: ']',
            LIST_INITIAL_TOKEN: '['
        }
    },
    WALLET: {
        LIMIT_VALUE_FOR_EVADING_TAXES: 20000,
        TAX_RATE: 0.2,
        ZERO_NUMERIC_VALUE: 0,
        NEGATIVE_CONSTANT_VALUE: -1,
    },
    RETURN: {
        ERROR_RETURN_OBJECT: { error: "Can't sell more stocks than you have" }
    },
    DEFAULT_VALUES: {
        OPERATION: {
            stockQuantity: 0,
            purchaseMediumPrice: '0',
            lastPurchase: { 'operation': 'buy', 'unitcost': 0, 'quantity': 0 },
            debtValue: 0,
            taxByOperation: []
        }
    }
}