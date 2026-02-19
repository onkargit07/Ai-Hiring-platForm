import { registerSchema, createJobSchema } from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const data = {
        email: 'test@example.com',
        password: 'Test@123',
        name: 'Test User',
        role: 'CANDIDATE',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'Test@123',
        name: 'Test User',
        role: 'CANDIDATE',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail with weak password', () => {
      const data = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
        role: 'CANDIDATE',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createJobSchema', () => {
    it('should validate correct job data', () => {
      const data = {
        title: 'Software Engineer',
        description: 'We are looking for a talented software engineer',
        department: 'Engineering',
        location: 'New York',
        employmentType: 'FULL_TIME',
        experienceLevel: 'MID',
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
      };

      const result = createJobSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail without required skills', () => {
      const data = {
        title: 'Software Engineer',
        description: 'We are looking for a talented software engineer',
        department: 'Engineering',
        location: 'New York',
        employmentType: 'FULL_TIME',
        experienceLevel: 'MID',
        requiredSkills: [],
      };

      const result = createJobSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
