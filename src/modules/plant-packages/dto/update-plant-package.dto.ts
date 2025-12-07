import { PartialType } from '@nestjs/swagger';
import { CreatePlantPackageDto } from './create-plant-package.dto';

export class UpdatePlantPackageDto extends PartialType(CreatePlantPackageDto) {}