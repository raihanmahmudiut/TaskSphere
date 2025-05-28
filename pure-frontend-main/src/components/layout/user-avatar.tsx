import { type AvatarProps } from '@radix-ui/react-avatar';

import { getInitialsFromName } from '@/common/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps extends AvatarProps {
  user: {
    name: string;
    image?: string;
  };
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage alt="Picture" src={user.image} />
      <AvatarFallback className="bg-orange-600 font-bold">
        {getInitialsFromName(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
