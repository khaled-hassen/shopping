import React from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import * as Form from "@radix-ui/react-form";

interface CommonProps {
  title: string;
  formActionText: string;
  onSubmit(e: React.FormEvent<HTMLFormElement>): void;
  children: React.ReactNode;
  loading?: boolean;
  errors?: string[];
  extraInfo?: React.ReactNode;
}

interface PropsWithSubtitle {
  subtitle: string;
  subtitleActionText?: string;
  subtitleActionHref?: string;
}

interface PropsWithoutSubtitle {
  subtitle?: never;
  subtitleActionText?: never;
  subtitleActionHref?: never;
}

type Props = CommonProps & (PropsWithSubtitle | PropsWithoutSubtitle);

const FormContainer: React.FC<Props> = ({
  title,
  subtitle,
  subtitleActionHref,
  subtitleActionText,
  formActionText,
  loading,
  errors,
  children,
  extraInfo,
  onSubmit,
}) => {
  return (
    <Form.Root
      className="mx-auto flex w-full max-w-2xl flex-col gap-10"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {!!subtitle && (
          <div className="flex items-center gap-2 text-2xl">
            <p>{subtitle}</p>
            {!!subtitleActionText && !!subtitleActionHref && (
              <Link href={subtitleActionHref} className="font-bold">
                {subtitleActionText}
              </Link>
            )}
          </div>
        )}
        {!!errors &&
          errors?.length > 0 &&
          errors.map((error, i) => (
            <p key={i} className="text-danger font-bold">
              {error}
            </p>
          ))}
        {extraInfo}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
      <Form.Submit asChild className="self-end">
        <Button title={formActionText} type="submit" loading={loading} />
      </Form.Submit>
    </Form.Root>
  );
};

export default FormContainer;
