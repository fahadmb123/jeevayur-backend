import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { env, type EnvironmentConfig } from '../../config/environment.config.js';
import { TOKENS } from './tokens.js';

import { PrismaUserRepository } from '../repositories/auth/prismaUser.repository.js';
import { PrismaSessionRepository } from '../repositories/auth/prismaSession.repository.js';
import { PrismaPatientRepository } from '../repositories/patient/prismaPatient.repository.js';
import { PrismaAppointmentRepository } from '../repositories/appointment/prismaAppointment.repository.js';
import { PrismaSocialLinkRepository } from '../repositories/social/prismaSocialLink.repository.js';
import { PrismaGalleryRepository } from '../repositories/gallery/prismaGallery.repository.js';
import { PrismaYogaRepository } from '../repositories/yoga/prismaYoga.repository.js';
import { B2StorageService } from '../services/storage/b2Storage.service.js';
import { PrismaHealthService } from '../services/health/prismaHealth.service.js';

import { ScryptPasswordService } from '../services/auth/scryptPassword.service.js';
import { JwtTokenService } from '../services/auth/jwtToken.service.js';
import { ExpressCookieService } from '../services/auth/expressCookie.service.js';
import { EmailService } from '../services/email/email.service.js';

import { GetPatientsUseCase } from '../../application/use-cases/patient/getPatients.useCase.js';
import { CreatePatientUseCase } from '../../application/use-cases/patient/createPatient.useCase.js';
import { UpdatePatientStatusUseCase } from '../../application/use-cases/patient/updatePatientStatus.useCase.js';
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
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/me/getCurrentUser.useCase.js';
import { LogoutUseCase } from '../../application/use-cases/auth/logout/logout.useCase.js';
import { GetUserSessionsUseCase } from '../../application/use-cases/auth/session/getUserSessions.useCase.js';
import { RevokeSessionUseCase } from '../../application/use-cases/auth/session/revokeSession.useCase.js';
import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';

import { CreateGalleryItemUseCase } from '../../application/use-cases/gallery/createGalleryItem.useCase.js';
import { UpdateGalleryItemUseCase } from '../../application/use-cases/gallery/updateGalleryItem.useCase.js';
import { GetGalleryItemsUseCase } from '../../application/use-cases/gallery/getGalleryItems.useCase.js';
import { DeleteGalleryItemUseCase } from '../../application/use-cases/gallery/deleteGalleryItem.useCase.js';
import { ResetGalleryDefaultsUseCase } from '../../application/use-cases/gallery/resetGalleryDefaults.useCase.js';
import { GalleryController } from '../../presentation/controllers/gallery/gallery.controller.js';

import { GetYogaSessionsUseCase } from '../../application/use-cases/yoga/getYogaSessions.useCase.js';
import { GetYogaSessionByIdUseCase } from '../../application/use-cases/yoga/getYogaSessionById.useCase.js';
import { CreateYogaSessionUseCase } from '../../application/use-cases/yoga/createYogaSession.useCase.js';
import { UpdateYogaSessionUseCase } from '../../application/use-cases/yoga/updateYogaSession.useCase.js';
import { DeleteYogaSessionUseCase } from '../../application/use-cases/yoga/deleteYogaSession.useCase.js';
import { YogaController } from '../../presentation/controllers/yoga/yoga.controller.js';

import { GetTreatmentsUseCase } from '../../application/use-cases/treatment/getTreatments.useCase.js';
import { GetFaqsUseCase } from '../../application/use-cases/treatment/getFaqs.useCase.js';
import { TreatmentController } from '../../presentation/controllers/treatment/treatment.controller.js';

export function setupContainer(config: EnvironmentConfig = env) {
  container.registerInstance(TOKENS.EnvironmentConfig, config);

  container.register(TOKENS.UserRepository, { useClass: PrismaUserRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.SessionRepository, { useClass: PrismaSessionRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.PatientRepository, { useClass: PrismaPatientRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.AppointmentRepository, { useClass: PrismaAppointmentRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.SocialLinkRepository, { useClass: PrismaSocialLinkRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.GalleryRepository, { useClass: PrismaGalleryRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.YogaRepository, { useClass: PrismaYogaRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.B2StorageService, { useClass: B2StorageService }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.StorageService, { useClass: B2StorageService }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.DatabaseHealthService, { useClass: PrismaHealthService }, { lifecycle: Lifecycle.Singleton });

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

  container.register(UpdatePatientStatusUseCase, {
    useFactory: (c) => new UpdatePatientStatusUseCase(c.resolve(TOKENS.PatientRepository)),
  });

  container.register(PatientController, {
    useFactory: (c) =>
      new PatientController(
        c.resolve(GetPatientsUseCase),
        c.resolve(CreatePatientUseCase),
        c.resolve(UpdatePatientStatusUseCase)
      ),
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
    useFactory: (c) => new CheckHealthUseCase(c.resolve(TOKENS.DatabaseHealthService)),
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

  container.register(GetCurrentUserUseCase, {
    useFactory: (c) => new GetCurrentUserUseCase(c.resolve(TOKENS.UserRepository)),
  });

  container.register(LogoutUseCase, {
    useFactory: (c) => new LogoutUseCase(c.resolve(TOKENS.SessionRepository)),
  });

  container.register(GetUserSessionsUseCase, {
    useFactory: (c) => new GetUserSessionsUseCase(c.resolve(TOKENS.SessionRepository)),
  });

  container.register(RevokeSessionUseCase, {
    useFactory: (c) => new RevokeSessionUseCase(c.resolve(TOKENS.SessionRepository)),
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
        c.resolve(UpdateProfileUseCase),
        c.resolve(GetCurrentUserUseCase),
        c.resolve(LogoutUseCase),
        c.resolve(GetUserSessionsUseCase),
        c.resolve(RevokeSessionUseCase)
      );
    },
  });

  container.register(GetGalleryItemsUseCase, {
    useFactory: (c) => new GetGalleryItemsUseCase(c.resolve(TOKENS.GalleryRepository)),
  });

  container.register(CreateGalleryItemUseCase, {
    useFactory: (c) =>
      new CreateGalleryItemUseCase(
        c.resolve(TOKENS.GalleryRepository),
        c.resolve(TOKENS.StorageService)
      ),
  });

  container.register(UpdateGalleryItemUseCase, {
    useFactory: (c) =>
      new UpdateGalleryItemUseCase(
        c.resolve(TOKENS.GalleryRepository),
        c.resolve(TOKENS.StorageService)
      ),
  });

  container.register(DeleteGalleryItemUseCase, {
    useFactory: (c) =>
      new DeleteGalleryItemUseCase(
        c.resolve(TOKENS.GalleryRepository),
        c.resolve(TOKENS.StorageService)
      ),
  });

  container.register(ResetGalleryDefaultsUseCase, {
    useFactory: (c) =>
      new ResetGalleryDefaultsUseCase(
        c.resolve(TOKENS.GalleryRepository),
        c.resolve(TOKENS.StorageService)
      ),
  });

  container.register(GalleryController, {
    useFactory: (c) =>
      new GalleryController(
        c.resolve(GetGalleryItemsUseCase),
        c.resolve(CreateGalleryItemUseCase),
        c.resolve(UpdateGalleryItemUseCase),
        c.resolve(DeleteGalleryItemUseCase),
        c.resolve(ResetGalleryDefaultsUseCase),
        c.resolve(TOKENS.B2StorageService)
      ),
  });

  container.register(GetYogaSessionsUseCase, {
    useFactory: (c) => new GetYogaSessionsUseCase(c.resolve(TOKENS.YogaRepository)),
  });

  container.register(GetYogaSessionByIdUseCase, {
    useFactory: (c) => new GetYogaSessionByIdUseCase(c.resolve(TOKENS.YogaRepository)),
  });

  container.register(CreateYogaSessionUseCase, {
    useFactory: (c) => new CreateYogaSessionUseCase(c.resolve(TOKENS.YogaRepository)),
  });

  container.register(UpdateYogaSessionUseCase, {
    useFactory: (c) => new UpdateYogaSessionUseCase(c.resolve(TOKENS.YogaRepository)),
  });

  container.register(DeleteYogaSessionUseCase, {
    useFactory: (c) => new DeleteYogaSessionUseCase(c.resolve(TOKENS.YogaRepository)),
  });

  container.register(YogaController, {
    useFactory: (c) =>
      new YogaController(
        c.resolve(GetYogaSessionsUseCase),
        c.resolve(GetYogaSessionByIdUseCase),
        c.resolve(CreateYogaSessionUseCase),
        c.resolve(UpdateYogaSessionUseCase),
        c.resolve(DeleteYogaSessionUseCase)
      ),
  });

  container.register(GetTreatmentsUseCase, {
    useFactory: (c) => new GetTreatmentsUseCase(c.resolve(TOKENS.GalleryRepository)),
  });

  container.register(GetFaqsUseCase, {
    useFactory: () => new GetFaqsUseCase(),
  });

  container.register(TreatmentController, {
    useFactory: (c) =>
      new TreatmentController(
        c.resolve(GetTreatmentsUseCase),
        c.resolve(GetFaqsUseCase)
      ),
  });

  return container;
}

export { container };
