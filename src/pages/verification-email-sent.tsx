import React, { useRef } from "react";
import Button from "@/components/shared/Button";
import { useSendEmailVerificationEmailLazyQuery } from "@/__generated__/client";
import { useSearchParams } from "next/navigation";
import { useSignal } from "@preact/signals-react";

interface IProps {}

const VerificationEmailSent: React.FC<IProps> = ({}) => {
  const params = useSearchParams();
  const [sendEmail] = useSendEmailVerificationEmailLazyQuery();
  const emailSent = useSignal(false);
  const emailTimer = useRef<NodeJS.Timeout>();

  async function sendVerificationEmail() {
    if (emailSent.value) return;
    clearTimeout(emailTimer.current);
    const { data } = await sendEmail({
      variables: { email: params.get("email") ?? "" },
    });
    if (data?.sendEmailVerificationEmail) emailSent.value = true;
    emailTimer.current = setTimeout(() => {
      emailSent.value = false;
    }, 30_000);
  }

  return (
    <div className="pt-40">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Verification email sent</h1>
          <p className="text-2xl">
            If your account exists you will receive a verification email. Please
            check your inbox and click the link in the email to verify your
            account.
          </p>
          {emailSent.value && (
            <p className="text-lg">
              Email sent. You can try again after 30 seconds
            </p>
          )}
        </div>
        <Button
          title="Resent email"
          className="self-end"
          disabled={emailSent.value}
          onClick={sendVerificationEmail}
        />
      </div>
    </div>
  );
};

export default VerificationEmailSent;
