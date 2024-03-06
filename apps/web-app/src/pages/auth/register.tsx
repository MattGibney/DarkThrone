import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputField, Logo } from '@darkthrone/react-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/footer';

interface RegisterPageProps {
  client: DarkThroneClient;
}
export default function RegisterPage(props: RegisterPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [passwordsError, setPasswordsError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    setPasswordsError('');
    const matchingPasswords = password === confirmPassword;
    if (!matchingPasswords) {
      setPasswordsError('Passwords do not match');
      return;
    }

    const result = await props.client.auth.register(email, password);
    if (result.status === 'fail') {
      setErrorMessages(result.data.map((err) => err.title));
      return;
    }

    navigate('/player-select');
  }

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo variant="large" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-400">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-zinc-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessages.length > 0 ? (
              <Alert
                title="There was a problem"
                messages={errorMessages}
                type="error"
              />
            ) : null}
            <InputField
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              displayName="Email address"
              value={email}
              setValue={(newVal) => setEmail(newVal)}
            />

            <InputField
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              displayName="Password"
              validationMessage={passwordsError}
              validationState={passwordsError ? 'invalid' : 'neutral'}
              value={password}
              setValue={(newVal) => setPassword(newVal)}
            />

            <InputField
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              displayName="Confirm Password"
              validationMessage={passwordsError}
              validationState={passwordsError ? 'invalid' : 'neutral'}
              value={confirmPassword}
              setValue={(newVal) => setConfirmPassword(newVal)}
            />

            <div>
              <Button
                onClick={() => handleSubmit}
                type="submit"
                text="Create Account"
              />
            </div>
          </form>
        </div>

        <p className="my-10 text-center text-sm text-zinc-500">
          Already a member?{' '}
          <Link
            to="/login"
            className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500"
          >
            Login now
          </Link>
        </p>

        <Footer />
      </div>
    </main>
  );
}
