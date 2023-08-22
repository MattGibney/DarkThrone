import DarkThroneClient from '@darkthrone/client-library';
import { Alert, Button, InputCheckbox, InputField } from '@darkthrone/react-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  client: DarkThroneClient;
}
export default function RegisterPage(props: RegisterPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [shouldCheckPasswords, setShouldCheckPasswords] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password || !doPasswordsMatch) return;

    console.log('Register');

    const result = await props.client.register(email, password);

    if (result.status === 'fail') {
      setErrorMessages(result.data.map((err) => err.title));
      return;
    }

    navigate('/overview');
  }

  useEffect(() => {
    if (!shouldCheckPasswords) return;
    setDoPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword, shouldCheckPasswords]);

  return (
    <main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
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
              invalidMessage={shouldCheckPasswords && !doPasswordsMatch ? 'Passwords do not match' : ''}
              value={password}
              setValue={(newVal) => setPassword(newVal)}
            />

            <InputField
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              onBlur={() => setShouldCheckPasswords(true)}
              required
              displayName="Confirm Password"
              invalidMessage={shouldCheckPasswords && !doPasswordsMatch ? 'Passwords do not match' : ''}
              value={confirmPassword}
              setValue={(newVal) => setConfirmPassword(newVal)}
            />

            <div>
              <Button type='submit' text='Create Account' />
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{' '}
          <Link to="/login" className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500">
            Login now
          </Link>
        </p>
      </div>
    </main>
  );
}
