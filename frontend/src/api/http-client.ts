import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/models/types';

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:5000/api/v1') {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async get<T>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(
      url,
      { params },
    );
    return response.data.data;
  }

  public async post<T, B>(url: string, data: B): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
      url,
      data,
    );
    return response.data.data;
  }

  public async put<T, B>(url: string, data: B): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(
      url,
      data,
    );
    return response.data.data;
  }

  public async patch<T, B>(url: string, data: B): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.patch(
      url,
      data,
    );
    return response.data.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> =
      await this.instance.delete(url);
    return response.data.data;
  }
}

export const httpClient = new HttpClient();
