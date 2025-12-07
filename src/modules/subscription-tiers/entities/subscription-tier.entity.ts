import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserSubscriptionEntity } from '../../user-subscriptions/entities/user-subscription.entity';
import { EntityEnums } from 'src/common/enums/entity-name.enum';

@Entity(EntityEnums.SubscriptionTier)
export class SubscriptionTierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string; // "Bronze", "Silver", "Gold"

  @Column({ name: 'plant_slot_limit' })
  plantSlotLimit: number; // 3, 6, 10

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'billing_cycle', length: 20, default: 'monthly' })
  billingCycle: string;

  @Column({ type: 'jsonb', nullable: true })
  features: Record<string, any>;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @OneToMany(
    () => UserSubscriptionEntity,
    (subscription) => subscription.tier,
  )
  subscriptions: UserSubscriptionEntity[];
}