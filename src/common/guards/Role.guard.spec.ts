import { RoleGuard } from './Role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    roleGuard = new RoleGuard(reflector);
  });

  it('should allow access if roles match', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'admin', sub: '123', username: 'john_doe' },
        }),
      }),
      getHandler: () => ({}), // Mock handler method
      getClass: () => ({}), // Mock class method
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const result = await roleGuard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if roles do not match', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'user', sub: '456', username: 'jane_doe' },
        }),
      }),
      getHandler: () => ({}), // Mock handler method
      getClass: () => ({}), // Mock class method
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const result = await roleGuard.canActivate(context);

    expect(result).toBe(false);
  });
});
