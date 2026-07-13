import express from 'express';
import swaggerUi from 'swagger-ui-express';
import patientRouter from './routes/patientRouter.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Patient API',
    version: '1.0.0',
    description: 'CRUD API for managing patient records',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  components: {
    schemas: {
      Patient: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          age: {
            type: 'integer',
          },
          gender: {
            type: 'string',
          },
          conditions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['id', 'name'],
      },
    },
  },
  paths: {
    '/api/v1/patients': {
      get: {
        summary: 'Get all patients',
        responses: {
          '200': {
            description: 'A list of patients',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Patient',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'integer' },
                  gender: { type: 'string' },
                  conditions: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                required: ['name'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Patient created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Patient',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/patients/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        summary: 'Get patient by ID',
        responses: {
          '200': {
            description: 'Patient data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Patient',
                },
              },
            },
          },
          '404': {
            description: 'Patient not found',
          },
        },
      },
      put: {
        summary: 'Update patient by ID',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'integer' },
                  gender: { type: 'string' },
                  conditions: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Patient updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Patient',
                },
              },
            },
          },
          '404': {
            description: 'Patient not found',
          },
        },
      },
      delete: {
        summary: 'Delete patient by ID',
        responses: {
          '204': {
            description: 'Patient deleted successfully',
          },
          '404': {
            description: 'Patient not found',
          },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API is running. Navigate to /api/v1/patients to interact with the API.');
});

app.use('/api/v1', patientRouter);

app.use((error, req, res, next) => {
    console.error(error);
    if(error.message === 'notfound'){
        res.status(404).json({error: "No patient found with the provided ID."});
    } else {
        res.status(500).json({
            error: "An internal server error occurred."
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});