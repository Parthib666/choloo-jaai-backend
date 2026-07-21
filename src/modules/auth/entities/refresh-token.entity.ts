import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({unique: true})
  @Column({
    type: 'varchar',
    length: 64,
  })
  tokenHash: string;

  @Column({
    type: 'timestamp',
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  revokedAt?: Date | null;

  @ManyToOne(
    () => User,
    (user) => user.refreshTokens,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}