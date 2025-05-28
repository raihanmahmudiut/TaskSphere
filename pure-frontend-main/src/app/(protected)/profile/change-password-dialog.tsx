'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { z } from 'zod';

import DialogComponent from '@/components/dialog-component';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { changeAdminPassword } from '@/modules/auth/auth.service';

import ConfirmNewPasswordFromField from './components/confirm-password-form-field';
import CurrentPasswordFromField from './components/current-password-form-field';
import NewPasswordFromField from './components/new-password-form-field';

const formSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'User must provide current password',
    }),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_^=+-])[A-Za-z\d@$!%*?&#_^=+-]{8,}$/gm,
        'Must contain at least one number and one uppercase and one lowercase letter and one special character, and at least 8 or more characters.'
      ),
    confirmNewPassword: z.string().min(1, {
      message: 'Must be provided',
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type ChangePasswordFormSchema = z.infer<typeof formSchema>;

export const ChangePasswordDialog = ({ open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },

    mode: 'onChange',
  });

  async function onSubmit(data: ChangePasswordFormSchema) {
    setLoading(true);
    const { currentPassword, newPassword } = data;

    const filteredData = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    const result = await changeAdminPassword(filteredData);

    if (result.success) {
      setLoading(false);
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      await mutate('getAdminUserList');
      setOpen(false);
    } else {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Failed to change password',
      });
      form.setError('currentPassword', {
        message: 'Invalid Password',
      });
    }
  }

  return (
    <div>
      <DialogComponent
        open={open}
        onOpenChange={setOpen}
        title="Change password"
        description="Update your password below"
        onConfirm={form.handleSubmit(onSubmit)}
        confirmText="Change Password"
        loading={loading}
        disabled={
          loading ||
          form.watch('newPassword') !== form.watch('confirmNewPassword')
        }
      >
        <Form {...form}>
          <form className="space-y-8">
            <CurrentPasswordFromField form={form} />
            <NewPasswordFromField form={form} />
            <ConfirmNewPasswordFromField form={form} />
          </form>
        </Form>
      </DialogComponent>
    </div>
  );
};
