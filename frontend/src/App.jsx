import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import Progress from './components/Progress/Progress';
import Medications from './components/Medications/Medications';
import Profile from './components/Profile/Profile';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Login />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navigation />
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Navigation />
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/medications" element={
            <ProtectedRoute>
              <Navigation />
              <Medications />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navigation />
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
