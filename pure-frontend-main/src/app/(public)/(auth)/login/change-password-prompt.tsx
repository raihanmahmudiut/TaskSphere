'use client';

import { XCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  CardTitle,
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
import { cn } from '@/lib/utils';
import { changeAdminPasswordAndPersistSessionViaForcePasswordChangePrompt } from '@/modules/auth/auth.service';

const passwordSchema = z
  .string()
  .min(8, 'Must be 8 or more characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/gm,
    'Must contain number, uppercase, lowercase, and special character.'
  );

function PasswordValidationMessage({ password }: { password: string }) {
  if (!password) return null;

  const validations = [
    {
      test: password.length >= 8,
      message: '8+ characters',
    },
    {
      test: /[a-z]/.test(password),
      message: 'lowercase',
    },
    {
      test: /[A-Z]/.test(password),
      message: 'uppercase',
    },
    {
      test: /\d/.test(password),
      message: 'number',
    },
    {
      test: /[@$!%*?&#_^=+-]/.test(password),
      message: 'special character',
    },
  ];

  const failingValidations = validations.filter((v) => !v.test);

  if (failingValidations.length === 0) return null;

  return (
    <div className="flex flex-col items-start space-x-1 mt-1">
      <div className="flex flex-row space-x-1 mb-1">
        <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5" />
        <p className="text-xs text-wrap text-red-500">
          Must include {failingValidations.map((v) => v.message).join(', ')}
        </p>
      </div>
      {/* <p className="text-xs text-red-500"></p> */}
    </div>
  );
}

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
      .object({
        password: z.string(),
        new_password: passwordSchema,
        retype_password: z.string(),
        token: z.string(),
      })
      .refine((data) => data.new_password === data.retype_password, {
        message: "Passwords don't match",
        path: ['retype_password'],
      })
      .safeParse(Object.fromEntries(formData));

    if (parsedCredentials.success) {
      const {
        password,
        token,
        new_password: newPassword,
      } = parsedCredentials.data;

      const result =
        await changeAdminPasswordAndPersistSessionViaForcePasswordChangePrompt(
          {
            current_password: password,
            new_password: newPassword,
          },
          token
        );

      return {
        success: result.success,
        errorMessage: result.errorMessage || '',
      };
    } else {
      return {
        success: false,
        errorMessage: parsedCredentials.error.errors[0].message,
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '',
    };
  }
};

type Props = {
  email: string;
  password: string;
  token: string;
};

function Component({ email, password, token }: Props) {
  const [result, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      password,
      email,
      new_password: '',
      retype_password: '',
      token: token,
    },
    mode: 'onChange',
  });

  const { watch } = form;
  const NEW_PASSWORD = watch('new_password');
  const CONFIRM_NEW_PASSWORD = watch('retype_password');

  // // Validate password as user types
  // const isPasswordValid = NEW_PASSWORD
  //   ? passwordSchema.safeParse(NEW_PASSWORD).success
  //   : false;

  // Show password mismatch error only if confirm password field has been touched
  const showPasswordMismatchError =
    CONFIRM_NEW_PASSWORD !== '' && NEW_PASSWORD !== CONFIRM_NEW_PASSWORD;

  // Disable button if passwords don't meet all criteria
  const isSubmitDisabled =
    !NEW_PASSWORD ||
    !CONFIRM_NEW_PASSWORD ||
    NEW_PASSWORD !== CONFIRM_NEW_PASSWORD;

  if (result?.success) {
    router.push(
      decodeURIComponent(
        searchParams.get('redirect') || FRONTEND_URLS.DASHBOARD.HOME
      )
    );
  }

  return (
    <Card className="m-auto w-96 max-w-sm bg-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">
          Change Password | Gold Kinen
        </CardTitle>
        <CardDescription>
          You must change your password before proceeding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={dispatch} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      placeholder="you@goldkinen.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input type="password" required {...field} className="hidden" />
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <Input type="password" required {...field} className="hidden" />
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="space-y-2">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" required {...field} />
                  </FormControl>
                  <PasswordValidationMessage password={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {result?.errorMessage && (
              <div
                className="flex items-start space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                <XCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{result.errorMessage}</p>
              </div>
            )} */}

            <FormField
              control={form.control}
              name="retype_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="space-y-4">Retype Password</FormLabel>
                  <FormControl>
                    <Input type="password" required {...field} />
                  </FormControl>

                  {showPasswordMismatchError && (
                    <div className="flex items-start space-x-1 mt-1">
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-500">
                        Passwords don&apos;t match
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <ChangeAndLoginButton disabled={isSubmitDisabled} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ChangeAndLogin(props: Props) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  );
}

function ChangeAndLoginButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={disabled || pending}>
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
        <span>Change & Login</span>
      </div>
    </Button>
  );
}
