import { Test, TestingModule } from '@nestjs/testing';
import { PrismaItemRepository } from '../../../infraestructure/persistence/prismaItem.repository';
import { PrismaService } from '../../../../shared/infra/prisma.service';
import Item, { ItemProps } from '../../../entities/item.entity';
import ItemCategoryEnum from '../../../entities/itemCategory.enum';
import { BaseException } from '../../../../shared/exceptions/exceptions.base';
import { Decimal } from '@prisma/client/runtime/library';

// Interface para tipar o mock do PrismaService
interface MockPrismaService {
  item: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
  };
}

describe('PrismaItemRepository', () => {
  let repository: PrismaItemRepository;
  let prismaService: MockPrismaService;

  const mockDate = new Date('2023-01-01T10:00:00.000Z');

  const createMockPrismaItem = (overrides = {}) => ({
    id: 'item-123',
    name: 'Big Mac',
    description: 'Hambúrguer delicioso com molho especial',
    images: ['image1.jpg', 'image2.jpg'],
    price: new Decimal(25.99),
    quantity: 10,
    category: ItemCategoryEnum.SANDWICH,
    createdAt: mockDate,
    updatedAt: mockDate,
    isDeleted: false,
    ...overrides,
  });

  const createMockItem = (overrides: Partial<ItemProps> = {}): Item => {
    const defaultProps: ItemProps = {
      id: 'item-123',
      name: 'Big Mac',
      description: 'Hambúrguer delicioso com molho especial',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 10,
      price: 25.99,
      category: ItemCategoryEnum.SANDWICH,
      createdAt: mockDate,
      updatedAt: mockDate,
      isDeleted: false,
      ...overrides,
    };
    return new Item(defaultProps);
  };

  beforeEach(async () => {
    const mockPrismaService: MockPrismaService = {
      item: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaItemRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaItemRepository>(PrismaItemRepository);
    prismaService = module.get<MockPrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar item com sucesso', async () => {
      const newItem = createMockItem();
      const mockPrismaResponse = createMockPrismaItem();

      (prismaService.item.create as jest.Mock).mockResolvedValue(mockPrismaResponse);

      const result = await repository.create(newItem);

      expect(prismaService.item.create).toHaveBeenCalledWith({
        data: {
          name: newItem.name,
          price: newItem.price,
          images: newItem.images,
          description: newItem.description,
          quantity: newItem.quantity,
          category: newItem.category,
        },
      });

      expect(result).toEqual({
        id: 'item-123',
        name: 'Big Mac',
        description: 'Hambúrguer delicioso com molho especial',
        images: ['image1.jpg', 'image2.jpg'],
        price: 25.99,
        quantity: 10,
        category: ItemCategoryEnum.SANDWICH,
        createdAt: mockDate,
        updatedAt: mockDate,
        isDeleted: false,
      });
    });

    it('deve converter Decimal para number no preço', async () => {
      const newItem = createMockItem({ price: 15.50 });
      const mockPrismaResponse = createMockPrismaItem({
        price: new Decimal('15.50'),
      });

      (prismaService.item.create as jest.Mock).mockResolvedValue(mockPrismaResponse);

      const result = await repository.create(newItem);

      expect(result.price).toBe(15.50);
      expect(typeof result.price).toBe('number');
    });

    it('deve criar item com categoria BEVERAGE', async () => {
      const newItem = createMockItem({
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
        price: 5.99,
      });
      const mockPrismaResponse = createMockPrismaItem({
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
        price: new Decimal(5.99),
      });

      (prismaService.item.create as jest.Mock).mockResolvedValue(mockPrismaResponse);

      const result = await repository.create(newItem);

      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Coca Cola');
    });

    it('deve lançar BaseException quando criação falha', async () => {
      const newItem = createMockItem();
      const prismaError = new Error('Prisma error: duplicate key');

      (prismaService.item.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(repository.create(newItem)).rejects.toThrow(BaseException);
      await expect(repository.create(newItem)).rejects.toThrow('Failed to create item');
    });

    it('deve criar item com imagem única', async () => {
      const newItem = createMockItem({ images: ['single-image.jpg'] });
      const mockPrismaResponse = createMockPrismaItem({
        images: ['single-image.jpg'],
      });

      prismaService.item.create.mockResolvedValue(mockPrismaResponse);

      const result = await repository.create(newItem);

      expect(result.images).toEqual(['single-image.jpg']);
    });

    it('deve criar item com múltiplas imagens', async () => {
      const images = ['img1.jpg', 'img2.png', 'img3.gif'];
      const newItem = createMockItem({ images });
      const mockPrismaResponse = createMockPrismaItem({ images });

      prismaService.item.create.mockResolvedValue(mockPrismaResponse);

      const result = await repository.create(newItem);

      expect(result.images).toEqual(images);
    });

    it('deve incluir código de erro correto na exceção', async () => {
      const newItem = createMockItem();
      const prismaError = new Error('Database connection failed');

      prismaService.item.create.mockRejectedValue(prismaError);

      try {
        await repository.create(newItem);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_CREATION_ERROR');
        expect((error as BaseException).statusCode).toBe(500);
      }
    });
  });

  describe('findByCategory', () => {
    it('deve encontrar itens por categoria com sucesso', async () => {
      const mockPrismaItems = [
        createMockPrismaItem(),
        createMockPrismaItem({ id: 'item-456', name: 'McChicken' }),
      ];

      prismaService.item.findMany.mockResolvedValue(mockPrismaItems);

      const result = await repository.findByCategory(ItemCategoryEnum.SANDWICH);

      expect(prismaService.item.findMany).toHaveBeenCalledWith({
        where: {
          category: ItemCategoryEnum.SANDWICH,
          isDeleted: false,
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Big Mac');
      expect(result[1].name).toBe('McChicken');
    });

    it('deve retornar array vazio quando nenhum item for encontrado', async () => {
      prismaService.item.findMany.mockResolvedValue([]);

      const result = await repository.findByCategory(ItemCategoryEnum.DESSERT);

      expect(result).toEqual([]);
    });

    it('deve buscar apenas itens não deletados', async () => {
      prismaService.item.findMany.mockResolvedValue([]);

      await repository.findByCategory(ItemCategoryEnum.BEVERAGE);

      expect(prismaService.item.findMany).toHaveBeenCalledWith({
        where: {
          category: ItemCategoryEnum.BEVERAGE,
          isDeleted: false,
        },
      });
    });

    it('deve converter preços Decimal para number', async () => {
      const mockPrismaItems = [
        createMockPrismaItem({ price: new Decimal('25.99') }),
        createMockPrismaItem({ price: new Decimal('15.50') }),
      ];

      prismaService.item.findMany.mockResolvedValue(mockPrismaItems);

      const result = await repository.findByCategory(ItemCategoryEnum.SANDWICH);

      expect(result[0].price).toBe(25.99);
      expect(result[1].price).toBe(15.50);
      expect(typeof result[0].price).toBe('number');
      expect(typeof result[1].price).toBe('number');
    });

    it('deve buscar itens de diferentes categorias', async () => {
      const categories = Object.values(ItemCategoryEnum);

      for (const category of categories) {
        prismaService.item.findMany.mockResolvedValue([
          createMockPrismaItem({ category }),
        ]);

        const result = await repository.findByCategory(category);

        expect(prismaService.item.findMany).toHaveBeenCalledWith({
          where: {
            category,
            isDeleted: false,
          },
        });
        expect(result[0].category).toBe(category);
      }
    });

    it('deve lançar BaseException quando busca falha', async () => {
      const prismaError = new Error('Database connection error');
      prismaService.item.findMany.mockRejectedValue(prismaError);

      await expect(
        repository.findByCategory(ItemCategoryEnum.SANDWICH)
      ).rejects.toThrow(BaseException);

      try {
        await repository.findByCategory(ItemCategoryEnum.SANDWICH);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_CATEGORY_ERROR');
        expect((error as BaseException).statusCode).toBe(500);
      }
    });

    it('deve mapear todos os campos corretamente', async () => {
      const mockPrismaItem = createMockPrismaItem({
        id: 'test-id',
        name: 'Test Item',
        description: 'Test Description',
        images: ['test1.jpg', 'test2.jpg'],
        price: new Decimal('99.99'),
        quantity: 5,
        category: ItemCategoryEnum.SIDE,
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2023-06-16'),
        isDeleted: false,
      });

      prismaService.item.findMany.mockResolvedValue([mockPrismaItem]);

      const result = await repository.findByCategory(ItemCategoryEnum.SIDE);

      expect(result[0]).toEqual({
        id: 'test-id',
        name: 'Test Item',
        description: 'Test Description',
        images: ['test1.jpg', 'test2.jpg'],
        price: 99.99,
        quantity: 5,
        category: ItemCategoryEnum.SIDE,
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2023-06-16'),
        isDeleted: false,
      });
    });
  });

  describe('findByNameAndDescription', () => {
    it('deve retornar true quando item existe', async () => {
      const mockPrismaItem = createMockPrismaItem();
      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByNameAndDescription(
        'Big Mac',
        'Hambúrguer delicioso'
      );

      expect(prismaService.item.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'Big Mac',
          description: 'Hambúrguer delicioso',
          isDeleted: false,
        },
      });
      expect(result).toBe(true);
    });

    it('deve retornar false quando item não existe', async () => {
      prismaService.item.findFirst.mockResolvedValue(null);

      const result = await repository.findByNameAndDescription(
        'Item Inexistente',
        'Descrição inexistente'
      );

      expect(result).toBe(false);
    });

    it('deve buscar apenas itens não deletados', async () => {
      prismaService.item.findFirst.mockResolvedValue(null);

      await repository.findByNameAndDescription('Test', 'Test Description');

      expect(prismaService.item.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'Test',
          description: 'Test Description',
          isDeleted: false,
        },
      });
    });

    it('deve retornar false para item deletado', async () => {
      prismaService.item.findFirst.mockResolvedValue(null); // Simula que não encontrou porque está deletado

      const result = await repository.findByNameAndDescription(
        'Item Deletado',
        'Descrição do item deletado'
      );

      expect(result).toBe(false);
    });

    it('deve funcionar com nomes e descrições com caracteres especiais', async () => {
      const mockPrismaItem = createMockPrismaItem({
        name: 'Café & Açúcar',
        description: 'Descrição com "aspas" e símbolos!',
      });
      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByNameAndDescription(
        'Café & Açúcar',
        'Descrição com "aspas" e símbolos!'
      );

      expect(result).toBe(true);
    });
  });

  describe('findByIdIfNotDeleted', () => {
    it('deve encontrar item por ID quando não está deletado', async () => {
      const mockPrismaItem = createMockPrismaItem();
      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByIdIfNotDeleted('item-123', false);

      expect(prismaService.item.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'item-123',
          isDeleted: false,
        },
      });

      expect(result).toEqual({
        id: 'item-123',
        name: 'Big Mac',
        description: 'Hambúrguer delicioso com molho especial',
        images: ['image1.jpg', 'image2.jpg'],
        price: 25.99,
        quantity: 10,
        category: ItemCategoryEnum.SANDWICH,
        createdAt: mockDate,
        updatedAt: mockDate,
        isDeleted: false,
      });
    });

    it('deve encontrar item deletado quando isDeleted é true', async () => {
      const mockPrismaItem = createMockPrismaItem({ isDeleted: true });
      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByIdIfNotDeleted('item-123', true);

      expect(prismaService.item.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'item-123',
          isDeleted: true,
        },
      });

      expect(result.isDeleted).toBe(true);
    });

    it('deve lançar BaseException quando item não é encontrado', async () => {
      prismaService.item.findFirst.mockResolvedValue(null);

      await expect(
        repository.findByIdIfNotDeleted('item-inexistente', false)
      ).rejects.toThrow(BaseException);

      try {
        await repository.findByIdIfNotDeleted('item-inexistente', false);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).message).toContain('Failed to find item by ID: item-inexistente');
        expect((error as BaseException).errorCode).toBe('ITEM_NOT_FOUND');
        expect((error as BaseException).statusCode).toBe(404);
      }
    });

    it('deve converter Decimal para number no preço', async () => {
      const mockPrismaItem = createMockPrismaItem({
        price: new Decimal('35.75'),
      });
      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByIdIfNotDeleted('item-123', false);

      expect(result.price).toBe(35.75);
      expect(typeof result.price).toBe('number');
    });

    it('deve funcionar com diferentes IDs', async () => {
      const testIds = ['item-1', 'uuid-456-789', '12345'];

      for (const itemId of testIds) {
        const mockPrismaItem = createMockPrismaItem({ id: itemId });
        prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

        const result = await repository.findByIdIfNotDeleted(itemId, false);

        expect(result.id).toBe(itemId);
      }
    });
  });

  describe('update', () => {
    it('deve atualizar item com sucesso', async () => {
      const updateData = {
        name: 'Big Mac Atualizado',
        price: 29.99,
        description: 'Nova descrição',
        quantity: 15,
      };
      const mockUpdatedItem = createMockPrismaItem({
        ...updateData,
        price: new Decimal(29.99),
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      const result = await repository.update('item-123', updateData);

      expect(prismaService.item.update).toHaveBeenCalledWith({
        where: { id: 'item-123' },
        data: {
          name: updateData.name,
          price: updateData.price,
          description: updateData.description,
          images: undefined,
          quantity: updateData.quantity,
          category: undefined,
          updatedAt: expect.any(Date),
        },
      });

      expect(result.name).toBe('Big Mac Atualizado');
      expect(result.price).toBe(29.99);
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const partialUpdate = { name: 'Apenas Nome' };
      const mockUpdatedItem = createMockPrismaItem({
        name: 'Apenas Nome',
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      await repository.update('item-123', partialUpdate);

      expect(prismaService.item.update).toHaveBeenCalledWith({
        where: { id: 'item-123' },
        data: {
          name: 'Apenas Nome',
          price: undefined,
          description: undefined,
          images: undefined,
          quantity: undefined,
          category: undefined,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('deve sempre atualizar o campo updatedAt', async () => {
      const updateData = { name: 'Novo Nome' };
      const mockUpdatedItem = createMockPrismaItem({
        name: 'Novo Nome',
        updatedAt: new Date(),
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      await repository.update('item-123', updateData);

      const updateCall = prismaService.item.update.mock.calls[0][0];
      expect(updateCall.data.updatedAt).toBeInstanceOf(Date);
    });

    it('deve converter Decimal para number no retorno', async () => {
      const updateData = { price: 45.99 };
      const mockUpdatedItem = createMockPrismaItem({
        price: new Decimal('45.99'),
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      const result = await repository.update('item-123', updateData);

      expect(result.price).toBe(45.99);
      expect(typeof result.price).toBe('number');
    });

    it('deve atualizar categoria corretamente', async () => {
      const updateData = { category: ItemCategoryEnum.DESSERT };
      const mockUpdatedItem = createMockPrismaItem({
        category: ItemCategoryEnum.DESSERT,
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      const result = await repository.update('item-123', updateData);

      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('deve atualizar imagens corretamente', async () => {
      const newImages = ['nova1.jpg', 'nova2.jpg', 'nova3.jpg'];
      const updateData = { images: newImages };
      const mockUpdatedItem = createMockPrismaItem({
        images: newImages,
      });

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      const result = await repository.update('item-123', updateData);

      expect(result.images).toEqual(newImages);
    });

    it('deve lançar BaseException quando atualização falha', async () => {
      const updateData = { name: 'Novo Nome' };
      const prismaError = new Error('Item not found for update');

      prismaService.item.update.mockRejectedValue(prismaError);

      await expect(
        repository.update('item-inexistente', updateData)
      ).rejects.toThrow(BaseException);

      try {
        await repository.update('item-inexistente', updateData);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).message).toContain('Failed to update item');
        expect((error as BaseException).errorCode).toBe('ITEM_UPDATE_ERROR');
        expect((error as BaseException).statusCode).toBe(500);
      }
    });

    it('deve mapear todos os campos de retorno corretamente', async () => {
      const updateData = {
        name: 'Item Completo',
        description: 'Descrição completa',
        images: ['comp1.jpg', 'comp2.jpg'],
        price: 99.99,
        quantity: 25,
        category: ItemCategoryEnum.SIDE,
      };

      const mockUpdatedItem = {
        id: 'item-123',
        name: 'Item Completo',
        description: 'Descrição completa',
        images: ['comp1.jpg', 'comp2.jpg'],
        price: new Decimal('99.99'),
        quantity: 25,
        category: ItemCategoryEnum.SIDE,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        isDeleted: false,
      };

      prismaService.item.update.mockResolvedValue(mockUpdatedItem);

      const result = await repository.update('item-123', updateData);

      expect(result).toEqual({
        id: 'item-123',
        name: 'Item Completo',
        description: 'Descrição completa',
        images: ['comp1.jpg', 'comp2.jpg'],
        price: 99.99,
        quantity: 25,
        category: ItemCategoryEnum.SIDE,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        isDeleted: false,
      });
    });
  });

  describe('tratamento de erros geral', () => {
    it('deve incluir mensagem original do erro nas exceções', async () => {
      const originalError = new Error('Specific database error');
      prismaService.item.create.mockRejectedValue(originalError);

      try {
        await repository.create(createMockItem());
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).message).toContain('Specific database error');
      }
    });

    it('deve manter consistência no formato de exceções', async () => {
      const methods = [
        { method: 'create', args: [createMockItem()] },
        { method: 'findByCategory', args: [ItemCategoryEnum.SANDWICH] },
        { method: 'update', args: ['item-123', { name: 'Test' }] },
      ];

      const prismaError = new Error('Database error');

      for (const { method, args } of methods) {
        const prismaMethod = method === 'create' ? 'create' :
                           method === 'findByCategory' ? 'findMany' :
                           'update';
        
        prismaService.item[prismaMethod].mockRejectedValue(prismaError);

        try {
          await (repository as any)[method](...args);
        } catch (error) {
          expect(error).toBeInstanceOf(BaseException);
          expect((error as BaseException).statusCode).toBe(500);
          expect((error as BaseException).message).toContain('Failed to');
        }
      }
    });
  });

  describe('integração com tipos Prisma', () => {
    it('deve lidar com diferentes tipos de Decimal', async () => {
      const prices = [
        new Decimal('0.01'),
        new Decimal('999.99'),
        new Decimal('25.5'),
        new Decimal('100'),
      ];

      for (const price of prices) {
        const mockPrismaItem = createMockPrismaItem({ price });
        prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

        const result = await repository.findByIdIfNotDeleted('item-test', false);

        expect(typeof result.price).toBe('number');
        expect(result.price).toBe(price.toNumber());
      }
    });

    it('deve preservar tipos de dados nativos', async () => {
      const mockPrismaItem = createMockPrismaItem({
        quantity: 42,
        isDeleted: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        images: ['test1.jpg', 'test2.jpg'],
      });

      prismaService.item.findFirst.mockResolvedValue(mockPrismaItem);

      const result = await repository.findByIdIfNotDeleted('item-test', true);

      expect(typeof result.quantity).toBe('number');
      expect(typeof result.isDeleted).toBe('boolean');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(Array.isArray(result.images)).toBe(true);
    });
  });
});