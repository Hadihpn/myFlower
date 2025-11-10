import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { SensorReadingEntity } from 'src/modules/sensor-readings/entities/sensor-reading.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity(EntityEnums.Plant)
export class PlantEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  species: string; // e.g., "Tomato", "Rose", "Basil"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string; // e.g., "Garden", "Balcony", "Indoor"

  @Column({ type: 'date' })
  plantedDate: Date;

  @Column({ default: 'active' })
  status: string; // active, dormant, removed

  // Sensor device information
  @Column({ unique: true })
  deviceId: string; // Unique identifier for the IoT device

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.plants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;
  @OneToMany(() => SensorReadingEntity, (reading) => reading.plant)
  sensorReadings: SensorReadingEntity[];
}
