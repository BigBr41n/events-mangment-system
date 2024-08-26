import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogstashTransport } from 'winston-logstash-transport';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, context, ms }) =>
                `${timestamp} [${context}] ${level}: ${message} ${ms}`,
            ),
          ),
        }),
        new LogstashTransport({
          host: 'localhost',
          port: 5000,
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
