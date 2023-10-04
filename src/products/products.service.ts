import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProductDto } from './product.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.product.findMany();
  }

  async getById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  create(product: ProductDto) {
    return this.prismaService.product.create({
      data: product,
    });
  }

  async update(id: number, product: ProductDto) {
    try {
      return await this.prismaService.product.update({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
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
      return await this.prismaService.product.delete({
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

  async increaseStock(id: number) {
    const product = await this.getById(id);
    return this.prismaService.product.update({
      data: {
        stock: product.stock + 1,
      },
      where: {
        id,
      },
    });
  }

  async decreaseStock(id: number) {
    const product = await this.getById(id);
    if (product.stock === 0) {
      throw new ConflictException('Stock is already 0');
    }
    return this.prismaService.product.update({
      data: {
        stock: product.stock - 1,
      },
      where: {
        id,
      },
    });
  }

  getProductsWithStock(stock: number) {
    return this.prismaService.product.findMany({
      where: {
        stock: {
          equals: stock,
        },
      },
    });
  }

  async emptyStock() {
    const productsToDelete = await this.getProductsWithStock(0);
    if (!productsToDelete[0]) {
      throw new ConflictException('No products with empty stock');
    }
    const deletePromises = productsToDelete.map((product) =>
      this.delete(product.id),
    );
    return Promise.all(deletePromises);
  }
}
