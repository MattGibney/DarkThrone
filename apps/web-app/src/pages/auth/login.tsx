import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputCheckbox, InputField } from '@darkthrone/react-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginPageProps {
  client: DarkThroneClient;
}
export default function LoginPage(props: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await props.client.auth.login(email, password, rememberMe);

    if (result.status === 'fail') {
      setErrorMessages(result.data.map((err) => err.title));
      return;
    }

    navigate('/overview');
  }

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-200">
          Login to your account
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
                <Link to="/forgot-password" className="font-semibold text-yellow-600 hover:text-yellow-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button type='submit' text='Login' />
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Not a member?{' '}
          <Link to="/register" className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500">
            Create an account now
          </Link>
        </p>
      </div>
    </main>
  );
}
