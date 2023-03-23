import { Type, string, optional, min } from 'js-validate-type'


export class ValidationService {
    private static VALIDATION_SCHEMA_PRODUCT = new Type({
        title: string,
        description: string | optional,
        price: [[min, 0]],
        count: [[min, 0]],
    })

    static validate(data) {
        return this.VALIDATION_SCHEMA_PRODUCT.validate(data)
    }
}
