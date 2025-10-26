import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowerService } from './flower.service';

@Controller('flower')
export class FlowerController {
  constructor(private readonly flowerService: FlowerService) {}

  @Post()
  create(@Body() getData:any) {
    return this.flowerService.create(getData);
  }

  
}
