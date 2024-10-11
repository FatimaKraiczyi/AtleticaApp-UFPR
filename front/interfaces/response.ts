export interface Default<T> {
  data: T ;
  success: boolean;
  message?: string;
	error?: any;
}

export interface Delete {
  success: boolean;
  message: string;
}
