import React, { createContext, useContext, useMemo, useState } from 'react';
import { ClassificationSlug } from '../constants/classifications';

export type AuthUser = {
  name: string;
  email: string;
  // Per-classification assessed levels (see getCategoryLevels in
  // ../utils/assessmentResult.ts), carried through from AssessmentResults ->
  // Curriculum -> RegistrationPrompt -> Login so the Journey tab can
  // auto-skip courses the user already tested past. Undefined when the user
  // reached Login without going through the assessment (e.g. "I already
  // have an account") — see UNASSESSED_SCORES in ../api/journey.ts.
  assessmentScores?: Record<ClassificationSlug, number>;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  // TODO: replace with real API call — api.post('/auth/login', { email, password })
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      user,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
