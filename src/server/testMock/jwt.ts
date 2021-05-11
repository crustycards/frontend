import {AuthService} from '../auth/auth.service';
import {EnvironmentService} from '../environment/environment.service';

export const createMockJwt = (userName: string): string => {
    const authService = new AuthService(new EnvironmentService());
    return authService.createJwtFromUserName(userName);
};