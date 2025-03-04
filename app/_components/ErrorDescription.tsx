import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ErrorDescription({ children }: Props) {
  return (
    <div className="text-body-extrasmall text-prospectory-error" role="alert">
      {children}
    </div>
  );
}
