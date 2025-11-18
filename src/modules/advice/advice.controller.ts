import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdviceService } from './advice.service';
import { UserAuth } from 'src/common/decorators/auth.decorator';

@ApiTags('Advice')
@Controller('advice')
@UserAuth()
@ApiBearerAuth()
export class AdviceController {
  constructor(private adviceService: AdviceService) {}

  @Get('plant/:plantId')
  @ApiOperation({ summary: 'Get care advice for a plant' })
  async getAdvice(@Request() req, @Param('plantId') plantId: number) {
    return await this.adviceService.getAdviceForPlant(plantId, req.user.id);
  }
}
