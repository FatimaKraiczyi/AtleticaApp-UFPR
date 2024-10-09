export interface Default<T> {
  data: T | undefined;
  success: boolean;
  message?: string;
	error?: any;
}

export interface Delete {
  success: boolean;
  message: string;
}
