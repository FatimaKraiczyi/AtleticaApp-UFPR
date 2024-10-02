export interface Default<T> {
  data: T | undefined;
  success: boolean;
  message?: string;
}

export interface Delete {
  success: boolean;
  message: string;
}
