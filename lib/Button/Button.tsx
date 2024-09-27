import React from "react";

interface ButtonProps {
  children: React.ReactNode;
}

export function Button({ children }: ButtonProps) {
  return <button>{children}</button>;
}
