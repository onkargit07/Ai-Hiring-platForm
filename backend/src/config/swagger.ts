import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Hiring Platform API',
      version: '1.0.0',
      description: 'API documentation for AI-based hiring platform',
      contact: {
        name: 'API Support',
        email: 'support@aihiring.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.aihiring.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['RECRUITER', 'CANDIDATE'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        JobPost: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            department: { type: 'string' },
            location: { type: 'string' },
            employmentType: { type: 'string', enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'] },
            experienceLevel: { type: 'string', enum: ['ENTRY', 'MID', 'SENIOR', 'LEAD'] },
            requiredSkills: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['ACTIVE', 'CLOSED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            jobPostId: { type: 'string', format: 'uuid' },
            candidateId: { type: 'string', format: 'uuid' },
            skills: { type: 'array', items: { type: 'string' } },
            experience: { type: 'number' },
            education: { type: 'string' },
            resumePath: { type: 'string' },
            aiScore: { type: 'number' },
            status: { type: 'string', enum: ['APPLIED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'SELECTED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AI Hiring Platform API Docs',
  }));
  
  // Serve raw OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
