export const TOKENS = {
  EnvironmentConfig: Symbol('EnvironmentConfig'),
  UserRepository: Symbol('IUserRepository'),
  SessionRepository: Symbol('ISessionRepository'),
  PatientRepository: Symbol('IPatientRepository'),
  AppointmentRepository: Symbol('IAppointmentRepository'),
  SocialLinkRepository: Symbol('ISocialLinkRepository'),
  PasswordService: Symbol('IPasswordService'),
  JwtService: Symbol('IJwtService'),
  CookieService: Symbol('ICookieService'),
  EmailService: Symbol('IEmailService'),
  AuthMiddleware: Symbol('AuthMiddleware'),
  GalleryRepository: Symbol('IGalleryRepository'),
  B2StorageService: Symbol('B2StorageService'),
} as const;

