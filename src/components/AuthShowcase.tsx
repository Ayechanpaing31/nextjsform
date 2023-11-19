import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export function AuthShowcase() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if the user is already signed in
    if (sessionData) {
      router.push('/home'); // Redirect to the home page if already signed in
    } else {
      // If not signed in, initiate the sign-in process
      await signIn('your-provider', { callbackUrl: '/home' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <form onSubmit={handleFormSubmit}>
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          {sessionData ? 'Go to Home' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
