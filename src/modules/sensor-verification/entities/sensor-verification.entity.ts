import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { DeviceEntity } from '../../devices/entities/device.entity';
import { SensorReadingEntity } from '../../sensor-readings/entities/sensor-reading.entity';

@Entity(EntityEnums.SensorVerification)
export class SensorVerificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'trigger_reading_id' })
  triggerReadingId: number;

  @Column({ length: 20, default: 'pending' })
  status: string; // pending, completed, expired

  @Column({ name: 'change_type', length: 50, nullable: true })
  changeType: string; // "temperature_drop", "moisture_drop", "heat_spike"

  @Column({ name: 'verification_readings', type: 'jsonb', nullable: true })
  verificationReadings: any[];

  @Column({ nullable: true })
  confirmed: boolean; // True if verified as real change

  @Column({ length: 20, nullable: true })
  confidence: string; // "high", "medium", "low"

  @Column({ name: 'requested_at', type: 'timestamp' })
  requestedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => DeviceEntity, (device) => device.verifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @ManyToOne(() => SensorReadingEntity, (reading) => reading.verifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trigger_reading_id' })
  triggerReading: SensorReadingEntity;
}