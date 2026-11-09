import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { env, type EnvironmentConfig } from '../../config/environment.config.js';
import { TOKENS } from './tokens.js';

import { PrismaUserRepository } from '../repositories/auth/prismaUser.repository.js';
import { PrismaSessionRepository } from '../repositories/auth/prismaSession.repository.js';
import { PrismaPatientRepository } from '../repositories/patient/prismaPatient.repository.js';
import { PrismaAppointmentRepository } from '../repositories/appointment/prismaAppointment.repository.js';
import { PrismaSocialLinkRepository } from '../repositories/social/prismaSocialLink.repository.js';

import { ScryptPasswordService } from '../services/auth/scryptPassword.service.js';
import { JwtTokenService } from '../services/auth/jwtToken.service.js';
import { ExpressCookieService } from '../services/auth/expressCookie.service.js';
import { EmailService } from '../services/email/email.service.js';

import { GetPatientsUseCase } from '../../application/use-cases/patient/getPatients.useCase.js';
import { CreatePatientUseCase } from '../../application/use-cases/patient/createPatient.useCase.js';
import { PatientController } from '../../presentation/controllers/patient/patient.controller.js';

import { CreateAppointmentUseCase } from '../../application/use-cases/appointment/createAppointment.useCase.js';
import { GetAppointmentsUseCase } from '../../application/use-cases/appointment/getAppointments.useCase.js';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/appointment/updateAppointmentStatus.useCase.js';
import { AppointmentController } from '../../presentation/controllers/appointment/appointment.controller.js';

import { GetDoctorDashboardUseCase } from '../../application/use-cases/doctor/dashboard/getDoctorDashboard.useCase.js';
import { DoctorController } from '../../presentation/controllers/doctor/doctor.controller.js';

import { CheckHealthUseCase } from '../../application/use-cases/health/system/checkHealth.useCase.js';
import { HealthController } from '../../presentation/controllers/health/health.controller.js';

import {
  GetSocialLinksUseCase,
  BulkSaveSocialLinksUseCase,
  CreateSocialLinkUseCase,
  UpdateSocialLinkUseCase,
  DeleteSocialLinkUseCase,
} from '../../application/use-cases/social/socialLink.useCases.js';
import { SocialLinkController } from '../../presentation/controllers/social/socialLink.controller.js';

import { LoginUseCase } from '../../application/use-cases/auth/login/login.useCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token/refreshToken.useCase.js';
import { RequestPasswordResetUseCase } from '../../application/use-cases/auth/forgot-password/requestPasswordReset.useCase.js';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password/resetPassword.useCase.js';
import { VerifyResetTokenUseCase } from '../../application/use-cases/auth/verify-reset-token/verifyResetToken.useCase.js';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/profile/updateProfile.useCase.js';
import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';

export function setupContainer(config: EnvironmentConfig = env) {
  container.registerInstance(TOKENS.EnvironmentConfig, config);

  container.register(TOKENS.UserRepository, { useClass: PrismaUserRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.SessionRepository, { useClass: PrismaSessionRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.PatientRepository, { useClass: PrismaPatientRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.AppointmentRepository, { useClass: PrismaAppointmentRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.SocialLinkRepository, { useClass: PrismaSocialLinkRepository }, { lifecycle: Lifecycle.Singleton });

  container.register(TOKENS.PasswordService, { useClass: ScryptPasswordService }, { lifecycle: Lifecycle.Singleton });

  container.register(TOKENS.JwtService, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new JwtTokenService({
        accessTokenSecret: cfg.accessTokenSecret,
        refreshTokenSecret: cfg.refreshTokenSecret,
        accessTokenExpiresIn: cfg.accessTokenExpiresIn,
        refreshTokenExpiresIn: cfg.refreshTokenExpiresIn,
      });
    },
  });

  container.register(TOKENS.CookieService, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new ExpressCookieService(cfg);
    },
  });

  container.register(TOKENS.EmailService, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new EmailService(cfg);
    },
  });

  container.register(GetPatientsUseCase, {
    useFactory: (c) => new GetPatientsUseCase(c.resolve(TOKENS.PatientRepository)),
  });

  container.register(CreatePatientUseCase, {
    useFactory: (c) => new CreatePatientUseCase(c.resolve(TOKENS.PatientRepository)),
  });

  container.register(PatientController, {
    useFactory: (c) => new PatientController(c.resolve(GetPatientsUseCase), c.resolve(CreatePatientUseCase)),
  });

  container.register(CreateAppointmentUseCase, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new CreateAppointmentUseCase(
        c.resolve(TOKENS.AppointmentRepository),
        c.resolve(TOKENS.EmailService),
        cfg.clinicEmail
      );
    },
  });

  container.register(GetAppointmentsUseCase, {
    useFactory: (c) => new GetAppointmentsUseCase(c.resolve(TOKENS.AppointmentRepository)),
  });

  container.register(UpdateAppointmentStatusUseCase, {
    useFactory: (c) =>
      new UpdateAppointmentStatusUseCase(
        c.resolve(TOKENS.AppointmentRepository),
        c.resolve(TOKENS.PatientRepository),
        c.resolve(TOKENS.EmailService)
      ),
  });

  container.register(AppointmentController, {
    useFactory: (c) =>
      new AppointmentController(
        c.resolve(CreateAppointmentUseCase),
        c.resolve(GetAppointmentsUseCase),
        c.resolve(UpdateAppointmentStatusUseCase)
      ),
  });

  container.register(GetDoctorDashboardUseCase, {
    useFactory: () => new GetDoctorDashboardUseCase(),
  });

  container.register(DoctorController, {
    useFactory: (c) => new DoctorController(c.resolve(GetDoctorDashboardUseCase)),
  });

  container.register(CheckHealthUseCase, {
    useFactory: () => new CheckHealthUseCase(),
  });

  container.register(HealthController, {
    useFactory: (c) => new HealthController(c.resolve(CheckHealthUseCase)),
  });

  container.register(GetSocialLinksUseCase, {
    useFactory: (c) => new GetSocialLinksUseCase(c.resolve(TOKENS.SocialLinkRepository)),
  });

  container.register(BulkSaveSocialLinksUseCase, {
    useFactory: (c) => new BulkSaveSocialLinksUseCase(c.resolve(TOKENS.SocialLinkRepository)),
  });

  container.register(CreateSocialLinkUseCase, {
    useFactory: (c) => new CreateSocialLinkUseCase(c.resolve(TOKENS.SocialLinkRepository)),
  });

  container.register(UpdateSocialLinkUseCase, {
    useFactory: (c) => new UpdateSocialLinkUseCase(c.resolve(TOKENS.SocialLinkRepository)),
  });

  container.register(DeleteSocialLinkUseCase, {
    useFactory: (c) => new DeleteSocialLinkUseCase(c.resolve(TOKENS.SocialLinkRepository)),
  });

  container.register(SocialLinkController, {
    useFactory: (c) =>
      new SocialLinkController(
        c.resolve(GetSocialLinksUseCase),
        c.resolve(BulkSaveSocialLinksUseCase),
        c.resolve(CreateSocialLinkUseCase),
        c.resolve(UpdateSocialLinkUseCase),
        c.resolve(DeleteSocialLinkUseCase)
      ),
  });

  container.register(LoginUseCase, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new LoginUseCase(
        c.resolve(TOKENS.UserRepository),
        c.resolve(TOKENS.PasswordService),
        c.resolve(TOKENS.JwtService),
        c.resolve(TOKENS.SessionRepository),
        c.resolve(TOKENS.EmailService),
        cfg.frontendUrl
      );
    },
  });

  container.register(RefreshTokenUseCase, {
    useFactory: (c) =>
      new RefreshTokenUseCase(
        c.resolve(TOKENS.JwtService),
        c.resolve(TOKENS.UserRepository),
        c.resolve(TOKENS.SessionRepository)
      ),
  });

  container.register(RequestPasswordResetUseCase, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new RequestPasswordResetUseCase(
        c.resolve(TOKENS.UserRepository),
        c.resolve(TOKENS.EmailService),
        cfg.frontendUrl
      );
    },
  });

  container.register(ResetPasswordUseCase, {
    useFactory: (c) =>
      new ResetPasswordUseCase(c.resolve(TOKENS.UserRepository), c.resolve(TOKENS.PasswordService)),
  });

  container.register(VerifyResetTokenUseCase, {
    useFactory: (c) => new VerifyResetTokenUseCase(c.resolve(TOKENS.UserRepository)),
  });

  container.register(UpdateProfileUseCase, {
    useFactory: (c) => new UpdateProfileUseCase(c.resolve(TOKENS.UserRepository)),
  });

  container.register(AuthController, {
    useFactory: (c) => {
      const cfg = c.resolve<EnvironmentConfig>(TOKENS.EnvironmentConfig);
      return new AuthController(
        c.resolve(LoginUseCase),
        c.resolve(RefreshTokenUseCase),
        c.resolve(RequestPasswordResetUseCase),
        c.resolve(ResetPasswordUseCase),
        c.resolve(VerifyResetTokenUseCase),
        c.resolve(TOKENS.CookieService),
        cfg,
        c.resolve(TOKENS.UserRepository),
        c.resolve(TOKENS.SessionRepository),
        c.resolve(UpdateProfileUseCase)
      );
    },
  });

  return container;
}

export { container };
