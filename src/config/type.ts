export interface User {
  user_id: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface Throw {
  errors?: { field: string; message: string };
  meta?: string;
  message?: string;
  code: number;
}
