import type { EnvironmentConfig } from '../../config/environment.config.js';
import { ScryptPasswordService } from '../services/scryptPassword.service.js';
import { JwtTokenService } from '../services/jwtToken.service.js';
import { ExpressCookieService } from '../services/expressCookie.service.js';

export interface ServicesComposition {
  passwordService: ScryptPasswordService;
  tokenService: JwtTokenService;
  cookieService: ExpressCookieService;
}

export function buildServices(config: EnvironmentConfig): ServicesComposition {
  const passwordService = new ScryptPasswordService();
  const tokenService = new JwtTokenService(config.tokenSecret);
  const cookieService = new ExpressCookieService(config);

  return {
    passwordService,
    tokenService,
    cookieService,
  };
}
