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
        ZERO_VALUE: 0,
        NEGATIVE_CONSTANT_VALUE: -1,
    }
}