import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserRole } from '../services/restdbService';

// Define access levels
export const ACCESS_LEVELS = {
    PUBLIC: 'public',
    PENDING: 'pending',
    MEMBER: 'member',
    OFFICER: 'officer',
    ADMIN: 'admin'
};

// Role hierarchy (higher numbers have more access)
const ROLE_HIERARCHY = {
    [ACCESS_LEVELS.PUBLIC]: 0,
    [ACCESS_LEVELS.PENDING]: 0.5,
    [ACCESS_LEVELS.MEMBER]: 1,
    [ACCESS_LEVELS.OFFICER]: 2,
    [ACCESS_LEVELS.ADMIN]: 3
};

export const useUserRole = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [userRole, setUserRole] = useState(ACCESS_LEVELS.PUBLIC);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const determineUserRole = async () => {
            setRoleLoading(true);

            if (!isAuthenticated || !user) {
                setUserRole(ACCESS_LEVELS.PUBLIC);
                setRoleLoading(false);
                return;
            }

            try {
                const data = await getUserRole(user.email, user.sub);

                // Check if the response contains an error
                if (data.error) {
                    setUserRole(ACCESS_LEVELS.PUBLIC);
                } else {
                    setUserRole(data.role || ACCESS_LEVELS.PUBLIC);
                }
            } catch (error) {
                console.error('useUserRole - API call failed:', error);
                // For authenticated users without member records, default to PUBLIC
                // This prevents bypass of member record requirement
                setUserRole(ACCESS_LEVELS.PUBLIC);
            }

            setRoleLoading(false);
        };

        if (!isLoading) {
            determineUserRole();
        }
    }, [user, isAuthenticated, isLoading]);

    const hasAccess = (requiredLevel) => {
        return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredLevel];
    };

    const isRole = (role) => {
        return userRole === role;
    };

    return {
        userRole,
        roleLoading,
        hasAccess,
        isRole,
        isPublic: userRole === ACCESS_LEVELS.PUBLIC,
        isPending: userRole === ACCESS_LEVELS.PENDING,
        isMember: hasAccess(ACCESS_LEVELS.MEMBER),
        isOfficer: hasAccess(ACCESS_LEVELS.OFFICER),
        isAdmin: hasAccess(ACCESS_LEVELS.ADMIN)
    };
};
