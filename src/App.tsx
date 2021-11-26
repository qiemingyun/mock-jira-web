import { AuthenticatedApp } from './AuthenticatedApp';
import { useAuth } from './context/AuthContext';
import { UnauthenticatedApp } from './unauthenticatedApp';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ReactQueryDevtools initialIsOpen={false} />
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
}

export default App;
