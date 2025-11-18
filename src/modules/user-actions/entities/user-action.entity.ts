import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlantEntity } from '../../plants/entities/plant.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ActionType } from '../enum/user-actions.enum';
import { EntityEnums } from '../../../common/enums/entity-name.enum';

@Entity(EntityEnums.UserActions)
export class UserActionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
  plantId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;
}
