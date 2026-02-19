import { ApiError, ValidationError, NotFoundError } from '../../utils/ApiError';

describe('ApiError', () => {
  it('should create an ApiError with correct properties', () => {
    const error = new ApiError(404, 'Not found');
    
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.isOperational).toBe(true);
  });

  it('should create a ValidationError', () => {
    const error = new ValidationError('Invalid input');
    
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid input');
  });

  it('should create a NotFoundError', () => {
    const error = new NotFoundError('User not found');
    
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('User not found');
  });
});
