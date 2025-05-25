import swaggerJsDoc from 'swagger-jsdoc';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'tpl-express',
            version: '1.0.0'
        }
    },
    apis: ['./lib/src/routes/*.js'] // 替换为你的路由文件路径
};

export default swaggerJsDoc(options);
