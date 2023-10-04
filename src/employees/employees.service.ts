import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeDto } from './employee.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.employee.findMany();
  }

  async getById(id: number) {
    const employee = await this.prismaService.employee.findUnique({
      where: {
        id,
      },
    });
    if (!employee) {
      throw new NotFoundException();
    }
    return employee;
  }

  create(employee: EmployeeDto) {
    return this.prismaService.employee.create({
      data: employee,
    });
  }

  async update(id: number, employee: EmployeeDto) {
    try {
      return await this.prismaService.employee.update({
        data: {
          ...employee,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.employee.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
