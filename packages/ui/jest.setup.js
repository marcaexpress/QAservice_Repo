import '@testing-library/jest-dom';

// Mock React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
