import {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    RawAxiosRequestHeaders,
} from 'axios';

import { Exception } from '@/common/constants';
import { BaseException } from '@/common/exceptions';
import { replaceUrlVars } from '@/common/utils/url.utils';
import { appConfig } from '@/config';
import {
    axiosGuardedInstance,
    axiosPublicInstance,
} from '@/providers/axios.provider';

import { APIExceptionResponse } from '../types/common.type';
import { getMessageFromErrorCode, transformApiError } from './error.service';

const apiClient =
    (defaultConfigs: AxiosRequestConfig, instance: AxiosInstance) =>
    async <Data>(
        requestConfig: AxiosRequestConfig & {
            endpoint: string;
            urlVars?: Record<string, string | number | boolean>;
            bearerToken?: string;
            signal: AbortSignal | undefined;
        }
    ): Promise<
        | {
              code?: number;
              success: true;
              data: Data;
          }
        | {
              code?: number;
              success: false;
              data: APIExceptionResponse;
              message?: string;
              errorInstance?: BaseException;
          }
    > => {
        try {
            const headers = new AxiosHeaders();

            headers.set('x-b-key', process.env.NEXT_PUBLIC_X_B_KEY);

            if (defaultConfigs.headers) {
                Object.entries(
                    defaultConfigs.headers as RawAxiosRequestHeaders
                ).forEach(([key, value]) => {
                    if (value !== undefined) {
                        headers.set(key, value);
                    }
                });
            }

            if (requestConfig.headers) {
                Object.entries(
                    requestConfig.headers as RawAxiosRequestHeaders
                ).forEach(([key, value]) => {
                    if (value !== undefined) {
                        headers.set(key, value);
                    }
                });
            }

            if (requestConfig.bearerToken) {
                headers['Authorization'] =
                    `Bearer ${requestConfig.bearerToken}`;
            }

            const response = await instance.request<Data>({
                ...defaultConfigs,
                url: `${replaceUrlVars(requestConfig.endpoint, requestConfig.urlVars)}`,
                method: requestConfig.method,
                data: requestConfig.data,
                params: requestConfig.params,
                headers: headers,
            });

            return {
                code: response.status,
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            return transformApiError(error as AxiosError);
        }
    };

export const publicApiClient = apiClient(
    { baseURL: appConfig.api_base_url },
    axiosPublicInstance
);

export const protectedApiClient = apiClient(
    { baseURL: appConfig.api_base_url },
    axiosGuardedInstance
);

export const standardizeApiResult = <Data>(
    data:
        | {
              code?: number | undefined;
              success: true;
              data: Data;
              message?: string | undefined;
              errorInstance?: BaseException | undefined;
          }
        | {
              code?: number | undefined;
              success: false;
              data: APIExceptionResponse;
              message?: string | undefined;
              errorInstance?: BaseException | undefined;
          }
):
    | {
          success: true;
          data: Data;
          errorMessage: undefined;
      }
    | {
          success: false;
          data: undefined;
          errorMessage: string;
      } => {
    if (data.success) {
        return {
            success: true,
            data: data.data,
            errorMessage: undefined,
        };
    }

    return {
        success: false,
        data: undefined,
        errorMessage: getMessageFromErrorCode(
            data.errorInstance?.errorCode ||
                Exception.InternalServerErrorException.UNKNOWN.ERROR_CODE
        ),
    };
};
