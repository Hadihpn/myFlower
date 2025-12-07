import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {  SubscriptionTierEntity } from '../../subscription-tiers/entities/subscription-tier.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { EntityEnums } from 'src/common/enums/entity-name.enum';

@Entity(EntityEnums.UserSubscription)
export class UserSubscriptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'tier_id' })
  tierId: number;

  @Column({ length: 20, default: 'active' })
  status: string; // active, expired, cancelled

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'auto_renew', default: true })
  autoRenew: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => SubscriptionTierEntity, (tier) => tier.subscriptions)
  @JoinColumn({ name: 'tier_id' })
  tier: SubscriptionTierEntity;
}