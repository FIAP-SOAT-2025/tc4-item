import { Test, TestingModule } from '@nestjs/testing';
import { ItemControllerApi } from '../../../infraestructure/api/controller/item.api';
import { PrismaItemRepository } from '../../../infraestructure/persistence/prismaItem.repository';
import { ControllerItem } from '../../../controllers/item.controller';
import { CreateItemDto } from '../../../infraestructure/api/dto/createItem.dto';
import { UpdateItemDto } from '../../../infraestructure/api/dto/updateItem.dto';
import { ExceptionMapper } from '../../../../shared/exceptions/exception.mapper';
import { BaseException } from '../../../../shared/exceptions/exceptions.base';
import ItemCategoryEnum from '../../../entities/itemCategory.enum';
import { ItemProps } from '../../../entities/item.entity';

// Mock do ControllerItem
jest.mock('../../../controllers/item.controller');

// Mock do ExceptionMapper
jest.mock('../../../../shared/exceptions/exception.mapper');

describe('ItemControllerApi', () => {
  let controller: ItemControllerApi;
  let prismaItemRepository: jest.Mocked<PrismaItemRepository>;

  const mockItemResponse: ItemProps = {
    id: 'item-123',
    name: 'Big Mac',
    description: 'Hambúrguer delicioso com molho especial',
    images: ['image1.jpg', 'image2.jpg'],
    quantity: 10,
    price: 25.99,
    category: ItemCategoryEnum.SANDWICH,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    isDeleted: false,
  };

  const mockItemsResponse: ItemProps[] = [
    mockItemResponse,
    {
      ...mockItemResponse,
      id: 'item-456',
      name: 'Coca Cola',
      category: ItemCategoryEnum.BEVERAGE,
    },
  ];

  const mockDeleteResponse = {
    message: 'Item with ID item-123 deleted successfully',
  };

  beforeEach(async () => {
    // Mock do repositório
    const mockRepository = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemControllerApi],
      providers: [
        {
          provide: PrismaItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ItemControllerApi>(ItemControllerApi);
    prismaItemRepository = module.get(PrismaItemRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createItem', () => {
    it('deve criar item com sucesso', async () => {
      const createItemDto = new CreateItemDto(
        'Big Mac',
        'Hambúrguer delicioso',
        ['image1.jpg'],
        25.99,
        10,
        ItemCategoryEnum.SANDWICH,
      );

      (ControllerItem.create as jest.Mock).mockResolvedValue(mockItemResponse);

      const result = await controller.createItem(createItemDto);

      expect(ControllerItem.create).toHaveBeenCalledWith(createItemDto, prismaItemRepository);
      expect(result).toBe(mockItemResponse);
    });

    it('deve mapear exceção quando ControllerItem.create falha', async () => {
      const createItemDto = new CreateItemDto(
        'Big Mac',
        'Hambúrguer delicioso',
        ['image1.jpg'],
        25.99,
        10,
        ItemCategoryEnum.SANDWICH,
      );
      const baseException = new BaseException('Erro ao criar item', 400, 'CREATE_ERROR');
      const mappedException = new Error('Mapped exception');

      (ControllerItem.create as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

      await expect(controller.createItem(createItemDto)).rejects.toThrow(mappedException);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('deve criar item com categoria BEVERAGE', async () => {
      const createItemDto = new CreateItemDto(
        'Coca Cola',
        'Bebida refrescante',
        ['coca.jpg'],
        5.99,
        50,
        ItemCategoryEnum.BEVERAGE,
      );

      (ControllerItem.create as jest.Mock).mockResolvedValue({
        ...mockItemResponse,
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
      });

      const result = await controller.createItem(createItemDto);

      expect(ControllerItem.create).toHaveBeenCalledWith(createItemDto, prismaItemRepository);
      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve criar item com múltiplas imagens', async () => {
      const createItemDto = new CreateItemDto(
        'Pizza Margherita',
        'Pizza tradicional italiana',
        ['pizza1.jpg', 'pizza2.jpg', 'pizza3.jpg'],
        35.90,
        5,
        ItemCategoryEnum.SANDWICH,
      );

      (ControllerItem.create as jest.Mock).mockResolvedValue(mockItemResponse);

      await controller.createItem(createItemDto);

      expect(ControllerItem.create).toHaveBeenCalledWith(createItemDto, prismaItemRepository);
    });
  });

  describe('updateItem', () => {
    it('deve atualizar item com sucesso', async () => {
      const itemId = 'item-123';
      const updateItemDto = new UpdateItemDto();
      updateItemDto.name = 'Big Mac Atualizado';
      updateItemDto.price = 29.99;

      const updatedResponse = {
        ...mockItemResponse,
        name: 'Big Mac Atualizado',
        price: 29.99,
      };

      (ControllerItem.update as jest.Mock).mockResolvedValue(updatedResponse);

      const result = await controller.updateItem(updateItemDto, itemId);

      expect(ControllerItem.update).toHaveBeenCalledWith(itemId, updateItemDto, prismaItemRepository);
      expect(result).toBe(updatedResponse);
    });

    it('deve mapear exceção quando ControllerItem.update falha', async () => {
      const itemId = 'item-123';
      const updateItemDto = new UpdateItemDto();
      const baseException = new BaseException('Item não encontrado', 404, 'ITEM_NOT_FOUND');
      const mappedException = new Error('Mapped exception');

      (ControllerItem.update as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

      await expect(controller.updateItem(updateItemDto, itemId)).rejects.toThrow(mappedException);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const itemId = 'item-456';
      const updateItemDto = new UpdateItemDto();
      updateItemDto.quantity = 20;

      (ControllerItem.update as jest.Mock).mockResolvedValue({
        ...mockItemResponse,
        quantity: 20,
      });

      await controller.updateItem(updateItemDto, itemId);

      expect(ControllerItem.update).toHaveBeenCalledWith(itemId, updateItemDto, prismaItemRepository);
    });

    it('deve atualizar categoria do item', async () => {
      const itemId = 'item-789';
      const updateItemDto = new UpdateItemDto();
      updateItemDto.category = ItemCategoryEnum.DESSERT;

      (ControllerItem.update as jest.Mock).mockResolvedValue({
        ...mockItemResponse,
        category: ItemCategoryEnum.DESSERT,
      });

      await controller.updateItem(updateItemDto, itemId);

      expect(ControllerItem.update).toHaveBeenCalledWith(itemId, updateItemDto, prismaItemRepository);
    });
  });

  describe('findByCategory', () => {
    it('deve buscar itens por categoria com sucesso', async () => {
      const category = ItemCategoryEnum.SANDWICH;

      (ControllerItem.findByCategory as jest.Mock).mockResolvedValue(mockItemsResponse);

      const result = await controller.findByCategory(category);

      expect(ControllerItem.findByCategory).toHaveBeenCalledWith(category, prismaItemRepository);
      expect(result).toBe(mockItemsResponse);
    });

    it('deve mapear exceção quando ControllerItem.findByCategory falha', async () => {
      const category = ItemCategoryEnum.BEVERAGE;
      const baseException = new BaseException('Categoria inválida', 400, 'INVALID_CATEGORY');
      const mappedException = new Error('Mapped exception');

      (ControllerItem.findByCategory as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

      await expect(controller.findByCategory(category)).rejects.toThrow(mappedException);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('deve buscar itens de diferentes categorias', async () => {
      const categories = [
        ItemCategoryEnum.SANDWICH,
        ItemCategoryEnum.BEVERAGE,
        ItemCategoryEnum.SIDE,
        ItemCategoryEnum.DESSERT,
      ];

      for (const category of categories) {
        (ControllerItem.findByCategory as jest.Mock).mockResolvedValue([
          { ...mockItemResponse, category },
        ]);

        await controller.findByCategory(category);

        expect(ControllerItem.findByCategory).toHaveBeenCalledWith(category, prismaItemRepository);
      }
    });

    it('deve retornar array vazio quando nenhum item for encontrado', async () => {
      const category = ItemCategoryEnum.DESSERT;

      (ControllerItem.findByCategory as jest.Mock).mockResolvedValue([]);

      const result = await controller.findByCategory(category);

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve buscar item por ID com sucesso', async () => {
      const itemId = 'item-123';

      (ControllerItem.findById as jest.Mock).mockResolvedValue(mockItemResponse);

      const result = await controller.findById(itemId);

      expect(ControllerItem.findById).toHaveBeenCalledWith(itemId, prismaItemRepository);
      expect(result).toBe(mockItemResponse);
    });

    it('deve mapear exceção quando ControllerItem.findById falha', async () => {
      const itemId = 'item-inexistente';
      const baseException = new BaseException('Item não encontrado', 404, 'ITEM_NOT_FOUND');
      const mappedException = new Error('Mapped exception');

      (ControllerItem.findById as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

      await expect(controller.findById(itemId)).rejects.toThrow(mappedException);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('deve buscar itens com diferentes formatos de ID', async () => {
      const testIds = [
        'item-123',
        'uuid-456-789',
        '12345',
        'abc-def-ghi',
      ];

      for (const itemId of testIds) {
        (ControllerItem.findById as jest.Mock).mockResolvedValue({
          ...mockItemResponse,
          id: itemId,
        });

        const result = await controller.findById(itemId);

        expect(ControllerItem.findById).toHaveBeenCalledWith(itemId, prismaItemRepository);
        expect(result.id).toBe(itemId);
      }
    });
  });

  describe('deleteItem', () => {
    it('deve deletar item com sucesso', async () => {
      const itemId = 'item-123';

      (ControllerItem.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

      const result = await controller.deleteItem(itemId);

      expect(ControllerItem.delete).toHaveBeenCalledWith(itemId, prismaItemRepository);
      expect(result).toBe(mockDeleteResponse);
    });

    it('deve mapear exceção quando ControllerItem.delete falha', async () => {
      const itemId = 'item-inexistente';
      const baseException = new BaseException('Item não encontrado para deleção', 404, 'ITEM_NOT_FOUND');
      const mappedException = new Error('Mapped exception');

      (ControllerItem.delete as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

      await expect(controller.deleteItem(itemId)).rejects.toThrow(mappedException);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('deve deletar itens com diferentes IDs', async () => {
      const testIds = ['item-1', 'item-2', 'item-3'];

      for (const itemId of testIds) {
        const deleteResponse = {
          message: `Item with ID ${itemId} deleted successfully`,
        };

        (ControllerItem.delete as jest.Mock).mockResolvedValue(deleteResponse);

        const result = await controller.deleteItem(itemId);

        expect(ControllerItem.delete).toHaveBeenCalledWith(itemId, prismaItemRepository);
        expect(result.message).toContain(itemId);
      }
    });

    it('deve retornar objeto com propriedade message', async () => {
      const itemId = 'item-test';

      (ControllerItem.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);

      const result = await controller.deleteItem(itemId);

      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });
  });

  describe('tratamento de erros geral', () => {
    it('deve sempre mapear BaseException para HttpException', async () => {
      const methods = [
        { method: 'createItem', args: [new CreateItemDto('name', 'desc', ['img'], 10, 5, ItemCategoryEnum.SANDWICH)] },
        { method: 'updateItem', args: [new UpdateItemDto(), 'id'] },
        { method: 'findByCategory', args: [ItemCategoryEnum.SANDWICH] },
        { method: 'findById', args: ['id'] },
        { method: 'deleteItem', args: ['id'] },
      ];

      for (const { method, args } of methods) {
        const baseException = new BaseException('Erro genérico', 500, 'GENERIC_ERROR');
        const mappedException = new Error('Mapped exception');

        // Mock do método correspondente no ControllerItem
        const controllerMethod = method === 'createItem' ? 'create' :
                               method === 'updateItem' ? 'update' :
                               method === 'findByCategory' ? 'findByCategory' :
                               method === 'findById' ? 'findById' :
                               'delete';

        (ControllerItem[controllerMethod] as jest.Mock).mockRejectedValue(baseException);
        (ExceptionMapper.mapToHttpException as jest.Mock).mockReturnValue(mappedException);

        await expect((controller as any)[method](...args)).rejects.toThrow(mappedException);
        expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
      }
    });

    it('deve tratar erros não-BaseException como BaseException', async () => {
      const createItemDto = new CreateItemDto(
        'Test Item',
        'Description',
        ['img.jpg'],
        10.99,
        1,
        ItemCategoryEnum.SANDWICH,
      );
      const genericError = new Error('Erro genérico');

      (ControllerItem.create as jest.Mock).mockRejectedValue(genericError);

      await expect(controller.createItem(createItemDto)).rejects.toThrow();
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(genericError);
    });
  });

  describe('injeção de dependências', () => {
    it('deve injetar PrismaItemRepository corretamente', () => {
      expect(controller).toBeInstanceOf(ItemControllerApi);
      expect(prismaItemRepository).toBeDefined();
    });

    it('deve usar a mesma instância do repositório em todos os métodos', async () => {
      const createItemDto = new CreateItemDto('name', 'desc', ['img'], 10, 5, ItemCategoryEnum.SANDWICH);

      (ControllerItem.create as jest.Mock).mockResolvedValue(mockItemResponse);
      (ControllerItem.findById as jest.Mock).mockResolvedValue(mockItemResponse);

      await controller.createItem(createItemDto);
      await controller.findById('item-123');

      expect(ControllerItem.create).toHaveBeenCalledWith(createItemDto, prismaItemRepository);
      expect(ControllerItem.findById).toHaveBeenCalledWith('item-123', prismaItemRepository);
    });
  });
});