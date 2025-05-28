'use client';

import { Eye, EyeOff, XCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import LogoVault from '@/assets/images/logo-vault.png';
import Logo from '@/assets/images/logo-vault-mono-white.png';
import { FRONTEND_URLS } from '@/common/constants';
import LoadingSpinner from '@/components/loader';
import LoadingPage from '@/components/loader-page';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEnterKeyNavigation } from '@/hooks/useEnterKeyNavigation';
import { cn } from '@/lib/utils';
import { login } from '@/modules/auth/auth.service';
import useStore from '@/store/useStore';

import ChangeAndLogin from './change-password-prompt';

const authenticate = async (
  prevState:
    | {
        success: boolean;
        errorMessage: string;
      }
    | undefined,
  formData: FormData
) => {
  try {
    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse(Object.fromEntries(formData));

    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;
      const result = await login(email, password);

      if (!result.success) {
        return {
          success: false,
          password,
          bearerToken: undefined,
          prompt_password_change: result.prompt_password_change,
          errorMessage:
            result.data?.error_code === 40102
              ? 'Invalid Credentials'
              : result.data?.error_code === 40305
                ? 'Your account is disabled'
                : 'Something Went Wrong',
        };
      }

      if (result.bearer_token) {
        localStorage.setItem('authToken', result.bearer_token);
      }

      return {
        success: true,
        password,
        bearerToken: result.bearer_token,
        prompt_password_change: result.prompt_password_change,
        errorMessage: '',
      };
    } else {
      return {
        success: false,
        password: undefined,
        bearerToken: undefined,
        prompt_password_change: false,
        errorMessage: parsedCredentials.error.errors.length
          ? parsedCredentials.error.errors[0].message
          : '',
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      password: undefined,
      bearerToken: undefined,
      prompt_password_change: false,
      errorMessage: error instanceof Error ? error.message : '',
    };
  }
};

function Component() {
  const [result, dispatch] = useFormState(authenticate, undefined);
  const form = useForm<FieldValues, unknown, FieldValues>();
  const formRef = useRef<HTMLFormElement>(null);
  useEnterKeyNavigation(formRef);

  const router = useRouter();
  const searchParams = useSearchParams();
  const setHasUnsavedChanges = useStore((state) => state.setHasUnsavedChanges);

  if (result?.success && !result.prompt_password_change) {
    router.push(
      decodeURIComponent(
        searchParams.get('redirect') || FRONTEND_URLS.DASHBOARD.HOME
      )
    );
    setHasUnsavedChanges(false);
  } else if (result?.success && result.prompt_password_change) {
    setHasUnsavedChanges(false);

    return (
      <ChangeAndLogin
        email={form.getValues('email')}
        password={result.password || ''}
        token={result.bearerToken || ''}
      />
    );
  }

  return (
    <Card className="m-auto max-w-sm">
      <CardHeader className="space-y-1">
        <div className="flex flex-row items-center justify-center space-x-2 text-2xl text-yellow-500 font-bold">
          <span>Login |</span>
          <Image src={LogoVault} alt="logo" width={40} height={10} />
          <span>Gold Kinen</span>
        </div>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} action={dispatch} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      placeholder="you@example.com"
                      {...field}
                      data-focusable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordField form={form} />

            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {result?.errorMessage && (
                <>
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{result.errorMessage}</p>
                </>
              )}
            </div>
            <LoginButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PasswordField({
  form,
}: {
  form: UseFormReturn<FieldValues, unknown, FieldValues>;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              required
              {...field}
              data-focusable
              onChange={(e) => {
                e.target.value = e.target.value.trim();
                field.onChange(e);
              }}
            >
              <Button
                variant="ghost"
                className="p-0 mr-4 hover:bg-transparent absolute right-0 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5 transform transition-transform duration-200 ease-in-out hover:scale-125" />
                ) : (
                  <Eye className="w-5 h-5 transform transition-transform duration-200 ease-in-out hover:scale-125" />
                )}
              </Button>
            </Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component />
    </Suspense>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  if (!__FEATURE_FLAGS__.LOGIN_ALLOWED) {
    return <></>;
  }

  return (
    <Button
      id="login"
      className="w-full bg-gradient-to-r from-[#e9be5a] to-[#c6952c] hover:bg-gradient-to-br"
      type="submit"
      disabled={pending}
    >
      <div className="flex justify-center items-center">
        <LoadingSpinner
          className={cn('my-auto mr-1 none', pending ? '' : 'hidden')}
        />
        <Image
          src={Logo}
          alt=""
          width={22}
          height={22}
          className={cn('m-1', pending ? 'hidden' : '')}
        />
        <span>Login</span>
      </div>
    </Button>
  );
}
