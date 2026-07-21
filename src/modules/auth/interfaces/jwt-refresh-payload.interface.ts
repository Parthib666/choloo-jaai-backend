import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtRefreshPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
}