import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

import { EventCategory } from '../enums/event-category.enum';
import { EventStatus } from '../enums/event-status.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 200,
  })
  title: string;

  @Column({
    unique: true,
    length: 250,
  })
  slug: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
  })
  category: EventCategory;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({
    length: 200,
  })
  venue: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address?: string;

  @Column({
    length: 100,
  })
  city: string;

  @Column({
    type: 'timestamp',
  })
  eventDate: Date;

  @Column({
    type: 'int',
  })
  audienceCapacity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  ticketPrice: number;

  @Column({
    nullable: true,
  })
  bannerImageUrl?: string;

  @DeleteDateColumn()
deletedAt?: Date;

constructor() {
  console.log('EVENT ENTITY LOADED WITH DELETE DATE COLUMN');
}

  @ManyToOne(
    () => User,
    { nullable: false }
  )
  @JoinColumn({
    name: 'createdBy',
  })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}