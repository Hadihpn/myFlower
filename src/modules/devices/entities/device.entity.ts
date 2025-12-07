import { EntityEnums } from 'src/common/enums/entity-name.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { SensorReadingEntity } from '../../sensor-readings/entities/sensor-reading.entity';
import { UserPlantSelectionEntity } from '../../user-plant-selections/entities/user-plant-selection.entity';
import { SensorVerificationEntity } from '../../sensor-verification/entities/sensor-verification.entity';
import { UserActionEntity } from '../../user-actions/entities/user-action.entity';

@Entity(EntityEnums.Device)
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'device_id', unique: true, length: 100 })
  deviceId: string; // Physical device ID: "DEVICE_001"

  @Column({ length: 255 })
  name: string; // User-friendly name: "Backyard Sensor"

  @Column({ length: 255, nullable: true })
  location: string; // "Backyard Garden"

  @Column({ length: 20, default: 'active' })
  status: string; // active, offline, maintenance

  @Column({ name: 'token_hash', length: 255, nullable: true })
  tokenHash: string;

  @Column({ name: 'token_expires_at', type: 'timestamp', nullable: true })
  tokenExpiresAt: Date;

  @Column({ name: 'last_seen', type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ type: 'jsonb', nullable: true })
  calibration: {
    temperatureOffset?: number;
    moistureOffset?: number;
    lightOffset?: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => UserPlantSelectionEntity, (selection) => selection.device)
  plantSelections: UserPlantSelectionEntity[];

  @OneToMany(() => SensorReadingEntity, (reading) => reading.device)
  sensorReadings: SensorReadingEntity[];

  @OneToMany(() => SensorVerificationEntity, (verification) => verification.device)
  verifications: SensorVerificationEntity[];

  @OneToMany(() => UserActionEntity, (action) => action.device)
  actions: UserActionEntity[];
}