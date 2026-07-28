import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const PORT = process.env.PORT || 5000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'COSMALAC Premium Skincare REST API',
      version: '1.0.0',
      description: 'Enterprise REST API backend for Cosmalac B2B + B2C Skincare platform. Handles authorization, catalog items, lead inquiries, CMS content, and analytics.',
      contact: {
        name: 'COSMALAC Trade Support',
        email: 'info@cosmalac.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js')
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
