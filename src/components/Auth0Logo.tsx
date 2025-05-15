import Image from 'next/image';
import type { FC } from 'react';

type Auth0LogoProps = {
  className?: string;
};

const Auth0Logo: FC<Auth0LogoProps> = ({ className = 'h-6 w-auto' }) => (
  <span className={className} style={{ display: 'inline-block' }}>
    <Image
      src="/auth0-black.svg"
      alt="Auth0 Logo"
      width={100}
      height={100}
      priority
    />
  </span>
);

export default Auth0Logo;
