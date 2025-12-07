import { PlantSpeciesEntity } from 'src/modules/plant-species/entities/plant-species.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('plant_groups')
export class PlantGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string; // "Mediterranean Herbs"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  category: string; // "Herbs", "Vegetables"

  @Column({ length: 20, nullable: true })
  difficulty: string; // "Easy", "Medium", "Hard"

  @Column({ type: 'jsonb' })
  thresholds: {
    temperature: { min: number; max: number; ideal: { min: number; max: number } };
    moisture: { min: number; max: number; ideal: { min: number; max: number } };
    light: { min: number; max: number; ideal: { min: number; max: number } };
  };

  @Column({ name: 'care_instructions', type: 'jsonb', nullable: true })
  careInstructions: Record<string, any>;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  // Relations
  @OneToMany(() => PlantSpeciesEntity, (species) => species.group)
  species: PlantSpeciesEntity[];
}