import { AllExceptionsFilter } from './all-exceptions.filter';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('AllExceptionsFilter', () => {
  let allExceptionsFilter: AllExceptionsFilter;
  let mockLogger: Logger;
  let mockResponse: FastifyReply;
  let mockRequest: FastifyRequest;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    } as unknown as Logger;

    allExceptionsFilter = new AllExceptionsFilter(mockLogger);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    mockRequest = {
      url: '/test-url',
      method: 'GET',
    } as unknown as FastifyRequest;

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Forbidden', 403);

    allExceptionsFilter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: 403,
      timestamp: expect.any(String),
      path: '/test-url',
      method: 'GET',
      message: 'Forbidden',
    });
    expect(mockLogger.error).toHaveBeenCalledWith({
      message: 'Exception occurred',
      statusCode: 403,
      path: '/test-url',
      method: 'GET',
      errorMessage: 'Forbidden',
      stack: expect.any(String),
      exception: undefined,
    });
  });

  it('should handle generic exceptions', () => {
    const exception = new Error('Something went wrong');

    allExceptionsFilter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test-url',
      method: 'GET',
      message: 'Internal server error',
    });

    expect(mockLogger.error).toHaveBeenCalledWith({
      message: 'Exception occurred',
      statusCode: 500,
      path: '/test-url',
      method: 'GET',
      errorMessage: 'Internal server error',
      stack: expect.stringContaining('Error: Something went wrong'),
      exception: undefined,
    });
  });
});
