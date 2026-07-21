import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access';
}