import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { PlantPackageEntity } from './plant-package.entity';
import { EntityEnums } from 'src/common/enums/entity-name.enum';
import { PlantSpeciesEntity } from 'src/modules/plant-species/entities/plant-species.entity';

@Entity(EntityEnums.PlantPackageItem)
@Unique(['packageId', 'plantSpeciesId'])
export class PlantPackageItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'package_id' })
  packageId: number;

  @Column({ name: 'plant_species_id' })
  plantSpeciesId: number;

  @Column({ nullable: true })
  position: number; // Order in package (1, 2, 3...)

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => PlantPackageEntity, (pkg) => pkg.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: PlantPackageEntity;

  @ManyToOne(() => PlantSpeciesEntity, (species) => species.packageItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plant_species_id' })
  plantSpecies: PlantSpeciesEntity;
}