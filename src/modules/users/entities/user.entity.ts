import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { UserSubscriptionEntity } from 'src/modules/user-subscriptions/entities/user-subscription.entity';
import { DeviceEntity } from 'src/modules/devices/entities/device.entity';
import { UserPlantSelectionEntity } from 'src/modules/user-plant-selections/entities/user-plant-selection.entity';
import { UserActionEntity } from 'src/modules/user-actions/entities/user-action.entity';

@Entity(EntityEnums.User)
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // Relations
  @OneToMany(() => UserSubscriptionEntity, (subscription) => subscription.user)
  subscriptions: UserSubscriptionEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices: DeviceEntity[];

  @OneToMany(() => UserPlantSelectionEntity, (selection) => selection.user)
  plantSelections: UserPlantSelectionEntity[];

  @OneToMany(() => UserActionEntity, (action) => action.user)
  actions: UserActionEntity[];
}
