import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
import { EntityEnums } from 'src/common/enums/entity-name.enum';

@Entity(EntityEnums.SensorReadings)
@Index(['plantId', 'timestamp']) // For efficient querying
export class SensorReadingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number; // in Celsius

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  moisture: number; // percentage (0-100)

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  light: number; // in lux

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  plantId: string;
  @ManyToOne(() => PlantEntity, (plant) => plant.sensorReadings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plantId' })
  plant: PlantEntity;
}
