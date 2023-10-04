import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductsQuery } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() product: ProductDto) {
    return this.productsService.create(product);
  }

  @Get()
  getAll(@Query() query: ProductsQuery) {
    if (query.stock) {
      return this.productsService.getProductsWithStock(+query.stock);
    }
    return this.productsService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() product: ProductDto) {
    return this.productsService.update(id, product);
  }

  @Delete('/empty-stock')
  emptyStock() {
    return this.productsService.emptyStock();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @Patch(':id/increase-stock')
  increaseStock(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.increaseStock(id);
  }

  @Patch(':id/decrease-stock')
  decreaseStock(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.decreaseStock(id);
  }
}
