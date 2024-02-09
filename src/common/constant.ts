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
        ZERO_VALUE_STR: '0',
        NEGATIVE_CONSTANT_VALUE: -1,
    },
    CALCULATOR: {
        DEFAULT_DECIMAL_PLACES_VALUE: 2
    },
    RETURN: {
        ERROR_RETURN_OBJECT: { error: "Can't sell more stocks than you have" }
    },
    DEFAULT_VALUES: {
        OPERATION: {
            stockQuantity: 0,
            purchaseMediumPrice: '0',
            lastPurchasePrice: 0,
            lastPurchaseQuantity: 0,
            debtValue: 0,
            taxCost: []
        }
    }
}