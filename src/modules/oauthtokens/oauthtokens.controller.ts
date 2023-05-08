import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OauthtokensService } from './oauthtokens.service';
import { CreateOauthtokenDto } from './dto/create-oauthtoken.dto';

@Controller('oauthtokens')
export class OauthtokensController {
  constructor(private readonly oauthtokensService: OauthtokensService) {}

  @Post()
  create(@Body() createOauthtokenDto: CreateOauthtokenDto) {
    return this.oauthtokensService.create(createOauthtokenDto);
  }

  @Get()
  findAll() {
    return this.oauthtokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauthtokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.oauthtokensService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauthtokensService.remove(+id);
  }
}
