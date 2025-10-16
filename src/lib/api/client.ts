// Mock Data Configuration
const USE_MOCK_DATA = true;

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export { USE_MOCK_DATA };

