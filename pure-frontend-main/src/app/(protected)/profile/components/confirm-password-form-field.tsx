import { Eye, EyeOff } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ChangePasswordFormSchema } from '../change-password-dialog';

type Props = {
  form: UseFormReturn<ChangePasswordFormSchema>;
};

export default function ConfirmNewPasswordFromField({ form }: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPasswordVisible(!passwordVisible);
  };

  return (
    <FormField
      control={form.control}
      name="confirmNewPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">Confirm New Password</FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <Input
                type={passwordVisible ? 'text' : 'password'}
                required
                placeholder="Retype new password"
                {...field}
                onChange={(e) => {
                  e.target.value = e.target.value.trim();
                  field.onChange(e);
                }}
              />
              <Button
                variant="ghost"
                className="p-0 mr-4 hover:bg-transparent absolute right-0"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5 transform transition-transform duration-200 ease-in-out hover:scale-125" />
                ) : (
                  <Eye className="w-5 h-5 transform transition-transform duration-200 ease-in-out hover:scale-125" />
                )}
              </Button>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
