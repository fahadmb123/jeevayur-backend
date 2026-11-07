import { ScryptPasswordService } from '../services/scryptPassword.service.js';
import { JwtTokenService } from '../services/jwtToken.service.js';
import { ExpressCookieService } from '../services/expressCookie.service.js';
import type { IPasswordHasher } from '../../../../shared/interfaces/services/IPasswordHasher.service.js';
import type { IJwtService } from '../../../../shared/interfaces/services/IJwtService.js';
import type { ICookieService } from '../../../../shared/interfaces/services/ICookieService.js';
import type { EnvironmentConfig } from '../../../../config/environment.config.js';

export interface AuthServicesComposition {
  passwordHasher: IPasswordHasher;
  jwtService: IJwtService;
  cookieService: ICookieService;
}

export function buildAuthServices(config: EnvironmentConfig): AuthServicesComposition {
  return {
    passwordHasher: new ScryptPasswordService(),
    jwtService: new JwtTokenService({
      accessTokenSecret: config.accessTokenSecret,
      refreshTokenSecret: config.refreshTokenSecret,
      accessTokenExpiresIn: config.accessTokenExpiresIn,
      refreshTokenExpiresIn: config.refreshTokenExpiresIn,
    }),
    cookieService: new ExpressCookieService(config),
  };
}
