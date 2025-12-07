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
  Check,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { DeviceEntity } from '../../devices/entities/device.entity';
import { PlantSpeciesEntity } from '../../plant-species/entities/plant-species.entity';
import { UserActionEntity } from '../../user-actions/entities/user-action.entity';
import { PlantPackageEntity } from 'src/modules/plant-packages/entities/plant-package.entity';

@Entity(EntityEnums.UserPlantSelection)
@Check(
  `(package_id IS NOT NULL AND plant_species_id IS NULL) OR (package_id IS NULL AND plant_species_id IS NOT NULL)`,
)
export class UserPlantSelectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'package_id', nullable: true })
  packageId: number;

  @Column({ name: 'plant_species_id', nullable: true })
  plantSpeciesId: number;

  @Column({ length: 255, nullable: true })
  nickname: string;

  @Column({ name: 'planted_date', type: 'date', nullable: true })
  plantedDate: Date;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.plantSelections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => DeviceEntity, (device) => device.plantSelections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @ManyToOne(() => PlantPackageEntity, (pkg) => pkg.selections, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'package_id' })
  package: PlantPackageEntity;

  @ManyToOne(() => PlantSpeciesEntity, (species) => species.selections, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'plant_species_id' })
  plantSpecies: PlantSpeciesEntity;

  @OneToMany(() => UserActionEntity, (action) => action.selection)
  actions: UserActionEntity[];
}