import DarkThroneClient from '@darkthrone/client-library';
import {
  Alert,
  Button,
  InputCheckbox,
  InputField,
  Logo,
} from '@darkthrone/react-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/footer';
import {
  ExtractErrorCodesForStatuses,
  POST_login,
} from '@darkthrone/interfaces';

type PossibleErrorCodes = ExtractErrorCodesForStatuses<POST_login>;

interface LoginPageProps {
  client: DarkThroneClient;
}
export default function LoginPage(props: LoginPageProps) {
  const navigate = useNavigate();

  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'auth.login.missingParams': 'Please provide both email and password.',
    'auth.login.invalidParams': 'The email or password is incorrect.',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErrorMessages([]);
      await props.client.auth.login(email, password, rememberMe);

      navigate('/overview');
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        setErrorMessages(
          (error as { errors?: PossibleErrorCodes[] })
            .errors as PossibleErrorCodes[],
        );
      } else {
        setErrorMessages(['server.error']);
      }
    }
  }

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo variant="large" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-400">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-zinc-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* TODO: These errors are translation keys */}
            {errorMessages.length > 0 ? (
              <Alert
                title="There was a problem"
                messages={errorMessages.map((code) => errorTranslations[code])}
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

            <div>
              <InputField
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                displayName="Password"
                value={password}
                setValue={(newVal) => setPassword(newVal)}
              />
            </div>

            <div className="flex items-center justify-between">
              <InputCheckbox
                id="remember-me"
                name="remember-me"
                displayName="Remember me"
                value={rememberMe}
                setValue={(newVal) => setRememberMe(newVal)}
              />

              <div className="text-sm leading-6">
                {/* <Link to="/forgot-password" className="font-semibold text-yellow-600 hover:text-yellow-500">
                  Forgot password?
                </Link> */}
              </div>
            </div>

            <div>
              <Button type="submit" text="Login" />
            </div>
          </form>
        </div>

        <p className="my-10 text-center text-sm text-zinc-500">
          Not a member?{' '}
          <Link
            to="/register"
            className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500"
          >
            Create an account now
          </Link>
        </p>

        <Footer />
      </div>
    </main>
  );
}
