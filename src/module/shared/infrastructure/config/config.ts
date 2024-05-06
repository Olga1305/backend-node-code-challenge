import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.join(__dirname, '../../../../../.env'),
});

const config = {
    PORT: parseInt(process.env.PORT!),
    NODE_ENV: process.env.NODE_ENV,
    REDIS_HOST: process.env.REDIS_HOST,
};

export default config;
