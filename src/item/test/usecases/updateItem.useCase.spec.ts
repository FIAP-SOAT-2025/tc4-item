import UpdateItemUseCase from '../../useCases/updateItem.useCase';
import Item from '../../entities/item.entity';
import ItemGatewayInterface from '../../interfaces/itemGatewayInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { UpdateItemInterface } from '../../interfaces/updateItemInterface';

describe('UpdateItemUseCase', () => {
  let mockItemGateway: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    mockItemGateway = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createTestItem = (overrides = {}) => {
    return new Item({
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
      ...overrides,
    });
  };

  const createUpdateData = (overrides: Partial<UpdateItemInterface> = {}): Partial<UpdateItemInterface> => {
    return {
      name: 'Big Mac Atualizado',
      description: 'Hambúrguer ainda mais delicioso',
      images: ['new-image1.jpg', 'new-image2.jpg'],
      quantity: 15,
      price: 29.99,
      category: ItemCategoryEnum.SANDWICH,
      ...overrides,
    };
  };

  describe('update', () => {
    it('deve atualizar um item existente com todos os campos', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = createUpdateData();
      const updatedItem = createTestItem({
        ...updateData,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Item);
      expect(result.name).toBe('Big Mac Atualizado');
      expect(result.description).toBe('Hambúrguer ainda mais delicioso');
      expect(result.price).toBe(29.99);
      expect(result.quantity).toBe(15);
      expect(result.images).toEqual(['new-image1.jpg', 'new-image2.jpg']);
      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
    });

    it('deve atualizar apenas o nome do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { name: 'Nome Atualizado' };
      const updatedItem = createTestItem({
        name: 'Nome Atualizado',
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.name).toBe('Nome Atualizado');
      expect(result.description).toBe(existingItem.description); 
      expect(result.price).toBe(existingItem.price);
      expect(result.quantity).toBe(existingItem.quantity);
    });

    it('deve atualizar apenas a descrição do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { description: 'Nova descrição incrível' };
      const updatedItem = createTestItem({
        description: 'Nova descrição incrível',
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.description).toBe('Nova descrição incrível');
      expect(result.name).toBe(existingItem.name); 
    });

    it('deve atualizar apenas o preço do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { price: 35.50 };
      const updatedItem = createTestItem({
        price: 35.50,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.price).toBe(35.50);
      expect(result.name).toBe(existingItem.name);
      expect(result.description).toBe(existingItem.description);
    });

    it('deve atualizar apenas a quantidade do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { quantity: 25 };
      const updatedItem = createTestItem({
        quantity: 25,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.quantity).toBe(25);
      expect(result.name).toBe(existingItem.name);
      expect(result.price).toBe(existingItem.price);
    });

    it('deve atualizar apenas a categoria do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { category: ItemCategoryEnum.DESSERT };
      const updatedItem = createTestItem({
        category: ItemCategoryEnum.DESSERT,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
      expect(result.name).toBe(existingItem.name);
      expect(result.description).toBe(existingItem.description);
    });

    it('deve atualizar apenas as imagens do item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const newImages = ['nova-imagem1.jpg', 'nova-imagem2.jpg', 'nova-imagem3.jpg'];
      const updateData = { images: newImages };
      const updatedItem = createTestItem({
        images: newImages,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.images).toEqual(newImages);
      expect(result.name).toBe(existingItem.name);
      expect(result.description).toBe(existingItem.description);
    });

    it('deve preservar createdAt e atualizar updatedAt', async () => {
      
      const itemId = 'item-123';
      const originalCreatedAt = new Date('2023-01-01');
      const existingItem = createTestItem({ createdAt: originalCreatedAt });
      const updateData = { name: 'Nome Atualizado' };
      const updatedItem = createTestItem({
        name: 'Nome Atualizado',
        createdAt: originalCreatedAt,
        updatedAt: new Date('2023-01-15'),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.createdAt).toEqual(originalCreatedAt);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.getTime()).toBeGreaterThan(originalCreatedAt.getTime());
    });

    it('deve lançar erro quando ID não for fornecido', async () => {
      
      const emptyId = '';
      const updateData = { name: 'Nome Atualizado' };

      
      await expect(
        UpdateItemUseCase.update(emptyId, updateData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        UpdateItemUseCase.update(emptyId, updateData, mockItemGateway)
      ).rejects.toThrow('Id not provided');

      expect(mockItemGateway.findByIdIfNotDeleted).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando dados de atualização estiverem vazios', async () => {
      
      const itemId = 'item-123';
      const emptyUpdateData = {};

      
      await expect(
        UpdateItemUseCase.update(itemId, emptyUpdateData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        UpdateItemUseCase.update(itemId, emptyUpdateData, mockItemGateway)
      ).rejects.toThrow('Id not provided');

      expect(mockItemGateway.findByIdIfNotDeleted).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando item não for encontrado', async () => {
      
      const itemId = 'item-inexistente';
      const updateData = { name: 'Nome Atualizado' };

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(null as any);

      
      await expect(
        UpdateItemUseCase.update(itemId, updateData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        UpdateItemUseCase.update(itemId, updateData, mockItemGateway)
      ).rejects.toThrow(`Item with ID ${itemId} not found`);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.update).not.toHaveBeenCalled();
    });

    it('deve propagar erros do gateway ao buscar item', async () => {
      
      const itemId = 'item-123';
      const updateData = { name: 'Nome Atualizado' };
      const gatewayError = new Error('Erro de conexão com banco');

      mockItemGateway.findByIdIfNotDeleted.mockRejectedValue(gatewayError);

      
      await expect(
        UpdateItemUseCase.update(itemId, updateData, mockItemGateway)
      ).rejects.toThrow('Erro de conexão com banco');

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.update).not.toHaveBeenCalled();
    });

    it('deve propagar erros do gateway ao atualizar item', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { name: 'Nome Atualizado' };
      const updateError = new Error('Erro ao atualizar item');

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockRejectedValue(updateError);

      
      await expect(
        UpdateItemUseCase.update(itemId, updateData, mockItemGateway)
      ).rejects.toThrow('Erro ao atualizar item');

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.update).toHaveBeenCalledTimes(1);
    });

    it('deve atualizar item para categoria BEVERAGE', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = {
        name: 'Coca Cola',
        description: 'Refrigerante gelado',
        category: ItemCategoryEnum.BEVERAGE,
        price: 5.99,
      };
      const updatedItem = createTestItem({
        ...updateData,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Coca Cola');
      expect(result.description).toBe('Refrigerante gelado');
      expect(result.price).toBe(5.99);
    });

    it('deve atualizar item para categoria SIDE', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = {
        name: 'Batata Frita',
        category: ItemCategoryEnum.SIDE,
        price: 8.99,
      };
      const updatedItem = createTestItem({
        ...updateData,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.category).toBe(ItemCategoryEnum.SIDE);
      expect(result.name).toBe('Batata Frita');
      expect(result.price).toBe(8.99);
    });

    it('deve atualizar preço para valor decimal', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const updateData = { price: 12.75 };
      const updatedItem = createTestItem({
        price: 12.75,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.price).toBe(12.75);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com IDs muito longos', async () => {
      
      const longId = 'a'.repeat(500);
      const existingItem = createTestItem({ id: longId });
      const updateData = { name: 'Nome Atualizado' };
      const updatedItem = createTestItem({
        id: longId,
        name: 'Nome Atualizado',
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(longId, updateData, mockItemGateway);

      
      expect(result.id).toBe(longId);
      expect(result.name).toBe('Nome Atualizado');
    });

    it('deve lidar com nomes muito longos', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const longName = 'N'.repeat(500);
      const updateData = { name: longName };
      const updatedItem = createTestItem({
        name: longName,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.name).toBe(longName);
    });

    it('deve lidar com muitas imagens', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const manyImages = Array.from({ length: 50 }, (_, i) => `image-${i + 1}.jpg`);
      const updateData = { images: manyImages };
      const updatedItem = createTestItem({
        images: manyImages,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.images).toEqual(manyImages);
      expect(result.images.length).toBe(50);
    });

    it('deve lidar com preços muito altos', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const highPrice = 999999.99;
      const updateData = { price: highPrice };
      const updatedItem = createTestItem({
        price: highPrice,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.price).toBe(highPrice);
    });

    it('deve lidar com quantidades muito altas', async () => {
      
      const itemId = 'item-123';
      const existingItem = createTestItem();
      const highQuantity = 999999;
      const updateData = { quantity: highQuantity };
      const updatedItem = createTestItem({
        quantity: highQuantity,
        updatedAt: new Date(),
      });

      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);
      mockItemGateway.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateItemUseCase.update(itemId, updateData, mockItemGateway);

      
      expect(result.quantity).toBe(highQuantity);
    });
  });
});