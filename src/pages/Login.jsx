import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Navbar from '../components/Navbar';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;