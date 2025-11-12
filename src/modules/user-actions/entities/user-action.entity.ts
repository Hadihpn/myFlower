import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlantEntity } from 'src/modules/plants/entities/plant.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ActionType } from '../enum/user-actions.enum';
import { EntityEnums } from 'src/common/enums/entity-name.enum';



@Entity(EntityEnums.UserActions)
export class UserActionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp' })
  actionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => PlantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plantId' })
  plant: PlantEntity;

  @Column()
  plantId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;
}