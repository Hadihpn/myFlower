import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserPlantSelectionEntity } from '../../user-plant-selections/entities/user-plant-selection.entity';
import { PlantGroupEntity } from 'src/modules/plant-groups/entities/plant-group.entity';
import { PlantPackageItemEntity } from 'src/modules/plant-packages/entities/plant-package-item.entity';

@Entity('plant_species')
export class PlantSpeciesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', nullable: true })
  groupId: number;

  @Column({ length: 255 })
  name: string; // "Basil"

  @Column({ name: 'scientific_name', length: 255, nullable: true })
  scientificName: string; // "Ocimum basilicum"

  @Column({ name: 'common_names', type: 'text', array: true, nullable: true })
  commonNames: string[];

  @Column({ length: 50, nullable: true })
  category: string; // "Herb", "Vegetable"

  @Column({ length: 20, nullable: true })
  difficulty: string;

  @Column({ type: 'jsonb' })
  thresholds: {
    temperature: { min: number; max: number; ideal: { min: number; max: number } };
    moisture: { min: number; max: number; ideal: { min: number; max: number } };
    light: { min: number; max: number; ideal: { min: number; max: number } };
  };

  @Column({ type: 'jsonb', nullable: true })
  watering: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  fertilization: Record<string, any>;

  @Column({ name: 'growth_info', type: 'jsonb', nullable: true })
  growthInfo: Record<string, any>;

  @Column({ name: 'harvest_info', type: 'jsonb', nullable: true })
  harvestInfo: Record<string, any>;

  @Column({ name: 'common_problems', type: 'jsonb', nullable: true })
  commonProblems: Record<string, any>[];

  @Column({ name: 'companion_plants', type: 'text', array: true, nullable: true })
  companionPlants: string[];

  @Column({ name: 'avoid_plants', type: 'text', array: true, nullable: true })
  avoidPlants: string[];

  @Column({ type: 'jsonb', nullable: true })
  toxicity: Record<string, any>;

  @Column({ type: 'text', array: true, nullable: true })
  tips: string[];

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => PlantGroupEntity, (group) => group.species, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'group_id' })
  group: PlantGroupEntity;

  @OneToMany(() => PlantPackageItemEntity, (item) => item.plantSpecies)
  packageItems: PlantPackageItemEntity[];

  @OneToMany(() => UserPlantSelectionEntity, (selection) => selection.plantSpecies)
  selections: UserPlantSelectionEntity[];
}