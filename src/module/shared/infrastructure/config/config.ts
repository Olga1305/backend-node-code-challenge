import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../../../../.env')
});

const config = {
  PORT: parseInt(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV,
};

export default config;
