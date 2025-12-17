import DarkThroneClient from '@darkthrone/client-library';
import { Logo } from '@darkthrone/react-components';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Button } from '@darkthrone/shadcnui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@darkthrone/shadcnui/field';
import { Input } from '@darkthrone/shadcnui/input';
import { AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/footer';
import {
  ExtractErrorCodesForStatuses,
  POST_register,
} from '@darkthrone/interfaces';

type PossibleErrorCodes = ExtractErrorCodesForStatuses<POST_register>;

interface RegisterPageProps {
  client: DarkThroneClient;
}
export default function RegisterPage(props: RegisterPageProps) {
  const navigate = useNavigate();

  const errorTranslations: Record<PossibleErrorCodes, string> = {
    'auth.register.missingParams': 'Please provide both email and password.',
    'auth.register.invalidParams': 'Please provide both email and password.',
    'auth.register.invalidPassword':
      'Password must be at least 7 characters long and include both upper and lower case letters.',
    'auth.register.passwordsDoNotMatch': 'Passwords do not match.',
    'auth.register.emailInUse': 'This email is already registered.',
    'server.error': 'An unexpected server error occurred. Please try again.',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    const matchingPasswords = password === confirmPassword;
    if (!matchingPasswords) {
      setErrorMessages(['auth.register.passwordsDoNotMatch']);
      return;
    }

    try {
      setErrorMessages([]);
      await props.client.auth.register(email, password);

      navigate('/player-select');
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
      </div>

      <div className="mt-10 px-4 sm:mx-auto sm:w-full sm:max-w-120">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessages.length > 0 ? (
                <Alert variant="destructive" className="text-sm [&>svg]:size-4">
                  <AlertCircleIcon />
                  <AlertTitle>There was a problem</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      {errorMessages.map((code) => (
                        <li key={code}>{errorTranslations[code]}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : null}

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </Field>

                <Field className="space-y-4">
                  <Button variant="default" type="submit">
                    Create Account
                  </Button>
                  <FieldDescription className="text-center">
                    Already a member?{' '}
                    <Link
                      to="/login"
                      className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500"
                    >
                      Login now
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </main>
  );
}
