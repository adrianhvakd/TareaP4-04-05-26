import { Test, TestingModule } from '@nestjs/testing';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';

describe('TramiteController', () => {
  let controller: TramiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TramiteController],
      providers: [TramiteService],
    }).compile();

    controller = module.get<TramiteController>(TramiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
