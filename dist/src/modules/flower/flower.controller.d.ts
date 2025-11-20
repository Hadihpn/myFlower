import { FlowerService } from './flower.service';
export declare class FlowerController {
    private readonly flowerService;
    constructor(flowerService: FlowerService);
    create(getData: any): Promise<any>;
}
