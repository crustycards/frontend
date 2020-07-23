import {Injectable} from '@nestjs/common';
import {use} from 'passport';
import {Strategy as PassportGoogleStrategy} from 'passport-google-oauth20';
import {User} from '../../../proto-gen-out/api/model_pb';
import {OAuthCredentials} from '../../../proto-gen-out/api/user_service_pb';
import {EnvironmentService} from '../environment/environment.service';
import {UserService} from '../user/user.service';

@Injectable()
export class GoogleStrategy {
  constructor(envService: EnvironmentService, userService: UserService) {
    use('google', new PassportGoogleStrategy({
      clientID: envService.getArgs().googleClientId,
      clientSecret: envService.getArgs().googleClientSecret,
      callbackURL: `${envService.getArgs().googleRedirectDomain}/auth/google`,
      scope: ['profile']
    }, async (accessToken, refreshToken, profile, cb) => {
      try {
        const oauthCredentials = new OAuthCredentials();
        oauthCredentials.setOauthId(profile.id);
        oauthCredentials.setOauthProvider('google');
        let user = new User();
        user.setDisplayName(profile.name?.givenName || profile.username || 'Unknown User');
        user = await userService.getOrCreateUser(oauthCredentials, user);
        cb(undefined, user);
      } catch (err) {
        cb(err);
      }
    }
    ));
  }
}
