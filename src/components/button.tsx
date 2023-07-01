import React, { ButtonHTMLAttributes, ReactNode } from 'react';

const Button = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => {
  return (
    <button {...props} className="bg-sky-400 text-white p-3  rounded-full">
      {children}
    </button>
  );
};

export default Button;
