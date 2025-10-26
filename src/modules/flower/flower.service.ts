import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FlowerService {
  constructor(
   
  ) {}
  //createUserDto is same as sendOtpDto . so use sameSendOtpDto
  async create(getData: any) {
    console.log(getData)
    return getData;
  }
}
