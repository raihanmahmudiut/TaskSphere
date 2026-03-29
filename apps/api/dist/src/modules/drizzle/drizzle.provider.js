"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionFactory = void 0;
exports.createNestDrizzleProviders = createNestDrizzleProviders;
const db_constants_1 = require("../../core/constants/db.constants");
const drizzle_service_1 = require("./drizzle.service");
exports.connectionFactory = {
    provide: db_constants_1.DRIZZLE_PROVIDER,
    useFactory: async (drizzleServiceInstance) => {
        return drizzleServiceInstance.getDrizzle();
    },
    inject: [drizzle_service_1.DrizzleService],
};
function createNestDrizzleProviders(options) {
    return [
        {
            provide: db_constants_1.NEST_DRIZZLE_OPTIONS,
            useValue: options,
        },
    ];
}
//# sourceMappingURL=drizzle.provider.js.map