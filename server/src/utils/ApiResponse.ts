export class ApiResponse<T = any> {
  public statusCode: number;
  public message: string;
  public success: boolean;
  public data: T;

  constructor(statusCode: number, message: string = "Success", data: T) {
    this.success = statusCode < 400; // Automatically set success to false if it's error status code
    ((this.statusCode = statusCode), (this.message = message));
    this.data = data;
  }
}
