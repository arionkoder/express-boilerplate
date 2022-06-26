import 'reflect-metadata';
import { DataSource } from 'typeorm';
//import { User } from "./entity/User"

export const AppDataSource = new DataSource({
  type: 'mysql',
  name: 'default',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: 'all',
  entities: ['src/entity/*.ts'],
  migrations: [],
  subscribers: [],
});
