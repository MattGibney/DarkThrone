import { Logo } from '@darkthrone/react-components';
import { Button } from '@darkthrone/shadcnui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/footer';

export default function RegisterPage() {
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
            <CardTitle>Registrations are closed</CardTitle>
            <CardDescription>
              DarkThrone Reborn is no longer accepting new accounts and will
              close on 1 October 2026.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </main>
  );
}
