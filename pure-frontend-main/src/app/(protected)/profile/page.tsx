'use client';

import dayjs from '@dayjs';
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  Calendar,
  Mail,
  Phone,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

import { getStaff, getUserGroups } from '@/common/services';
import { getInitialsFromName } from '@/common/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { ChangePasswordDialog } from './change-password-dialog';

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-center space-x-3 py-1.5">
    <Icon className="h-4 w-4 text-gray-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
  </div>
);

export default function Profile() {
  const { data: staff } = useSWR('fetchStaff', () => getStaff());
  const { data: userGroups } = useSWR('fetchUserGroups', () => getUserGroups());
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);

  return (
    <div className="h-full w-full p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white/50 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left column - Avatar and name */}
            <div className="md:col-span-2 flex flex-col items-center justify-start space-y-4">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white">
                  {getInitialsFromName(staff?.name || '')}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {staff?.name}
                </h1>
                <p className="text-sm text-gray-500">{staff?.designation}</p>
              </div>

              <Button
                className="w-full mt-2"
                variant="blue"
                size="sm"
                onClick={() => setOpenChangePasswordDialog(true)}
              >
                Change Password
              </Button>
            </div>

            {/* Right column - Info and groups */}
            <div className="md:col-span-3 space-y-4">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-600 mb-3">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  <InfoRow icon={Mail} label="Email" value={staff?.email} />
                  <InfoRow icon={Phone} label="Phone" value={staff?.phone} />
                  <InfoRow
                    icon={Calendar}
                    label="Date of Birth"
                    value={
                      staff?.dob
                        ? dayjs(staff.dob).format('MMMM D, YYYY')
                        : 'N/A'
                    }
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Designation"
                    value={staff?.designation}
                  />
                  <InfoRow
                    icon={Building2}
                    label="Department"
                    value={staff?.department}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex items-center mb-3">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <h2 className="text-sm font-semibold text-gray-600">
                    User Groups
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {userGroups?.length ? (
                    userGroups.map((userGroup) => (
                      <Badge
                        key={userGroup}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {userGroup}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-red-500 font-medium">
                      No groups assigned yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        open={openChangePasswordDialog}
        setOpen={setOpenChangePasswordDialog}
      />
    </div>
  );
}
