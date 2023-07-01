import Button from '../components/button';

import { useAuth } from '../features/hooks/useAuth';
const LogoutPage = () => {
  const { logout } = useAuth();

  return <Button onClick={logout}>ログアウト</Button>;
};

export default LogoutPage;
