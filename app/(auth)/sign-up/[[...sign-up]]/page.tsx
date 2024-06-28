import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="p-24 w-full flex justify-center items-center">
      <SignUp fallbackRedirectUrl="/onboarding" />
    </div>
  );
}
