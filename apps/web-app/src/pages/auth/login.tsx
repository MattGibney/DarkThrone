import DarkThroneClient from '@darkthrone/client-library';
import { Logo } from '@darkthrone/react-components';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { Input } from '@darkthrone/shadcnui/input';
import { Checkbox } from '@darkthrone/shadcnui/checkbox';
import { Button } from '@darkthrone/shadcnui/button';
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from '@darkthrone/shadcnui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import { AlertCircleIcon } from 'lucide-react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/footer';
import {
  ExtractErrorCodesForStatuses,
  POST_login,
} from '@darkthrone/interfaces';
import { Label } from '@darkthrone/shadcnui/label';

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
  const [rememberMe, setRememberMe] = useState<boolean | 'indeterminate'>(
    false,
  );

  const [errorMessages, setErrorMessages] = useState<PossibleErrorCodes[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setErrorMessages([]);
      const normalisedRememberMe =
        rememberMe === 'indeterminate' ? false : rememberMe;
      await props.client.auth.login(email, password, normalisedRememberMe);

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
      </div>

      <div className="mt-10 px-4 sm:mx-auto sm:w-full sm:max-w-120">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
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
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    {/* <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a> */}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                {/* Remember Me Checkbox */}
                <Field>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                    />
                    <Label htmlFor="rememberMe">Remember Me</Label>
                  </div>
                </Field>
                <Field className="space-y-4">
                  <Button variant={'default'} type="submit">
                    Login
                  </Button>
                  <FieldDescription className="text-center">
                    Not a member?{' '}
                    <Link
                      to="/register"
                      className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500"
                    >
                      Create an account now
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
