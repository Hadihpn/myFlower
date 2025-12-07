import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PlantPackageItemEntity } from './plant-package-item.entity';
import { UserPlantSelectionEntity } from 'src/modules/user-plant-selections/entities/user-plant-selection.entity';

@Entity('plant_packages')
export class PlantPackageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string; // "Mediterranean Herb Garden"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ length: 20, nullable: true })
  difficulty: string;

  @Column({ name: 'plant_count' })
  plantCount: number; // How many plants in this package

  @Column({ type: 'jsonb' })
  thresholds: {
    temperature: { min: number; max: number; ideal: { min: number; max: number } };
    moisture: { min: number; max: number; ideal: { min: number; max: number } };
    light: { min: number; max: number; ideal: { min: number; max: number } };
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ default: false })
  popular: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  // Relations
  @OneToMany(() => PlantPackageItemEntity, item => item.package)
  items: PlantPackageItemEntity[];

  @OneToMany(() => UserPlantSelectionEntity, (selection) => selection.package)
  selections: UserPlantSelectionEntity[];
}