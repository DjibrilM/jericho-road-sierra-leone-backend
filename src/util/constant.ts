import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export const environment = process.env.ENVIRONMENT as 'development' | 'production';

const allowedOrigins = [
  'https://jericho-road-road-web.vercel.app',
  'https://presence-tracking-app.vercel.app',
  environment === 'development' && 'http://localhost:5173',
  environment === 'development' && 'http://localhost:8100',
];

console.log('Allowed Origins:', allowedOrigins);
console.log('Environment:', environment);
console.log('CORS Config:', {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders:
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers , Authorization',
});


export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (process.env.ENVIRONMENT === 'development') {
      callback(null, true);
      return;
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders:
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers , Authorization',
};

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};


