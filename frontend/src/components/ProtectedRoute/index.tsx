import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../auth';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}
