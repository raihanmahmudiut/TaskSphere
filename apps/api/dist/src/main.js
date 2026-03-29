"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TaskSphere API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .addTag('tasks')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    common_1.Logger.log(`[Bootstrap] Attempting to listen on port: ${port} (raw process.env.PORT: ${process.env.PORT})`, 'Bootstrap');
    try {
        await app.listen(port);
        common_1.Logger.log(`[Bootstrap] Successfully called app.listen. Application SHOULD BE running on: http://localhost:${port}`, 'Bootstrap');
    }
    catch (error) {
        common_1.Logger.error(`[Bootstrap] Error during app.listen: ${error}`, error.stack, 'Bootstrap');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map