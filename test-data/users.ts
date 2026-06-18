export interface User {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationDetails extends User {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export const existingUser: User = {
  name: process.env.TEST_USER_NAME!,
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

export function generateRegistrationData(): RegistrationDetails {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `testuser_${timestamp}@mailinator.com`,
    password: 'Test1234!',
    firstName: 'Test',
    lastName: 'User',
    address: '123 QA Street',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    zipcode: '94105',
    mobile: '4155551234',
  };
}
