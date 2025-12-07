import { ApiProperty } from '@nestjs/swagger';

class AdviceItemDto {
  @ApiProperty({ example: 'critical' })
  type: string;

  @ApiProperty({ example: 'moisture' })
  category: string;

  @ApiProperty({ example: 'Soil is too dry. Water immediately!' })
  message: string;

  @ApiProperty({ example: 0 })
  priority: number;

  @ApiProperty({ example: true, required: false })
  actionRequired?: boolean;
}

class SelectionAdviceDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'package' })
  type: string; // 'package' or 'individual'

  @ApiProperty({ example: 'Mediterranean Herb Garden' })
  name: string;

  @ApiProperty({ example: ['Basil', 'Rosemary', 'Thyme'], required: false })
  plants?: string[];

  @ApiProperty({ example: 92 })
  healthScore: number;

  @ApiProperty({ example: 'Excellent' })
  status: string;

  @ApiProperty({ type: [AdviceItemDto] })
  advice: AdviceItemDto[];
}

export class AdviceResponseDto {
  @ApiProperty()
  device: {
    id: number;
    name: string;
    location: string;
  };

  @ApiProperty({ type: [SelectionAdviceDto] })
  selections: SelectionAdviceDto[];

  @ApiProperty({ example: 'Good' })
  overallHealth: string;

  @ApiProperty()
  sensorData: {
    temperature: number;
    moisture: number;
    light: number;
    humidity?: number;
    timestamp: Date;
  };

  @ApiProperty()
  thresholds: Record<string, any>;
}