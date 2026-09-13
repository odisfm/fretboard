import { use } from 'react';
import { UserDataContext } from './UserDataContext.ts';

export function useUserData() {
    const ctx = use(UserDataContext);
    if (!ctx) throw new Error('useTuning must be used within a UserDataProvider');
    return ctx;
}
