// components/Auth0Logo.tsx

import Image from 'next/image';
import type { FC } from 'react';

type Auth0LogoProps = {
  className?: string;
};

const Auth0Logo: FC<Auth0LogoProps> = ({ className }) => (
  <div className={className}>
    <Image
      src="/auth0-black.svg"
      alt="Auth0 Logo"
      width={120}
      height={40}
      priority
    />
  </div>
);

export default Auth0Logo;
