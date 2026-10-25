const roles = { PATIENT: 'patient', DOCTOR: 'doctor', ADMIN: 'admin' };
export const PrismaUserMapper = {
    toDomain(user) {
        return { ...user, role: roles[user.role] };
    },
};
