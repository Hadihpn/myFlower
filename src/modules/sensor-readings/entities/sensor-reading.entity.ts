import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { DeviceEntity } from 'src/modules/devices/entities/device.entity';
import { SensorVerificationEntity } from 'src/modules/sensor-verification/entities/sensor-verification.entity';

@Entity(EntityEnums.SensorReadings)
@Index(['deviceId', 'timestamp'])
export class SensorReadingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_id' })
  deviceId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  moisture: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  light: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ default: false })
  verified: boolean; // True if passed verification

  @Column({ default: false })
  anomaly: boolean; // True if suspected sensor glitch

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => DeviceEntity, (device) => device.sensorReadings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @OneToMany(() => SensorVerificationEntity, (verification) => verification.triggerReading)
  verifications: SensorVerificationEntity[];
}