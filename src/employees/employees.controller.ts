import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto } from './employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getAll() {
    return this.employeesService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getById(id);
  }

  @Post()
  create(@Body() employee: EmployeeDto) {
    return this.employeesService.create(employee);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() employee: EmployeeDto) {
    return this.employeesService.update(id, employee);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.employeesService.delete(id);
  }
}
