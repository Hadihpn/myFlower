import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import {  DeviceEntity } from '../../devices/entities/device.entity';
import { UserPlantSelectionEntity } from '../../user-plant-selections/entities/user-plant-selection.entity';
import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { ActionType } from '../type/actionType.enum';

// export enum ActionType {
//   WATERED = 'watered',
//   FERTILIZED = 'fertilized',
//   PRUNED = 'pruned',
//   SOIL_CHANGED = 'soil_changed',
//   RELOCATED = 'relocated',
//   PESTICIDE_APPLIED = 'pesticide_applied',
//   HARVESTED = 'harvested',
//   OTHER = 'other',
// }

@Entity(EntityEnums.UserActions)
export class UserActionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'selection_id' })
  selectionId: number;

  @Column({
    name: 'action_type',
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'action_date', type: 'timestamp' })
  actionDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.actions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => DeviceEntity, (device) => device.actions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @ManyToOne(() => UserPlantSelectionEntity, (selection) => selection.actions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'selection_id' })
  selection: UserPlantSelectionEntity;
}