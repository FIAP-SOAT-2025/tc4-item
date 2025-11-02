import { DeleteItemUseCase } from '../../useCases/deleteItem.useCase';
import Item from '../../entities/item.entity';
import ItemGatewayInterface from '../../interfaces/itemGatewayInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';

describe('DeleteItemUseCase', () => {
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

  describe('delete', () => {
    it('deve encontrar e retornar item existente ao tentar deletar', async () => {

      const itemId = 'item-123';
      const existingItem = createTestItem();
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Item);
      expect(result).toEqual(existingItem);
      expect(result.id).toBe('item-123');
      expect(result.name).toBe('Big Mac');
      expect(result.isDeleted).toBe(false);
    });

    it('deve buscar apenas itens não deletados (isDeleted = false)', async () => {

      const itemId = 'item-123';
      const existingItem = createTestItem();
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);

      await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
    });

    it('deve retornar item com categoria SANDWICH', async () => {
      const itemId = 'sandwich-123';
      const sandwichItem = createTestItem({
        id: 'sandwich-123',
        name: 'Hambúrguer Especial',
        category: ItemCategoryEnum.SANDWICH,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(sandwichItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result.name).toBe('Hambúrguer Especial');
      expect(result.id).toBe('sandwich-123');
    });

    it('deve retornar item com categoria BEVERAGE', async () => {

      const itemId = 'beverage-123';
      const beverageItem = createTestItem({
        id: 'beverage-123',
        name: 'Coca Cola',
        description: 'Refrigerante gelado',
        category: ItemCategoryEnum.BEVERAGE,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(beverageItem);


      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);


      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Coca Cola');
      expect(result.description).toBe('Refrigerante gelado');
    });

    it('deve retornar item com categoria SIDE', async () => {

      const itemId = 'side-123';
      const sideItem = createTestItem({
        id: 'side-123',
        name: 'Batata Frita',
        description: 'Batatas crocantes',
        category: ItemCategoryEnum.SIDE,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(sideItem);


      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);


      expect(result.category).toBe(ItemCategoryEnum.SIDE);
      expect(result.name).toBe('Batata Frita');
      expect(result.description).toBe('Batatas crocantes');
    });

    it('deve retornar item com categoria DESSERT', async () => {

      const itemId = 'dessert-123';
      const dessertItem = createTestItem({
        id: 'dessert-123',
        name: 'Sorvete de Chocolate',
        description: 'Sorvete cremoso',
        category: ItemCategoryEnum.DESSERT,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(dessertItem);


      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);


      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
      expect(result.name).toBe('Sorvete de Chocolate');
      expect(result.description).toBe('Sorvete cremoso');
    });

    it('deve lançar erro quando item não for encontrado', async () => {

      const itemId = 'item-inexistente';
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(null as any);


      await expect(
        DeleteItemUseCase.delete(itemId, mockItemGateway)
      ).rejects.toThrow(Error);

      await expect(
        DeleteItemUseCase.delete(itemId, mockItemGateway)
      ).rejects.toThrow(`Item with ID ${itemId} not found`);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erros do gateway quando busca falha', async () => {

      const itemId = 'item-123';
      const gatewayError = new Error('Erro de conexão com banco de dados');
      mockItemGateway.findByIdIfNotDeleted.mockRejectedValue(gatewayError);

      await expect(
        DeleteItemUseCase.delete(itemId, mockItemGateway)
      ).rejects.toThrow('Erro de conexão com banco de dados');

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledTimes(1);
    });

    it('deve retornar item com todas as propriedades corretas', async () => {

      const itemId = 'item-complete';
      const completeItem = createTestItem({
        id: 'item-complete',
        name: 'Item Completo',
        description: 'Descrição detalhada do item',
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        quantity: 50,
        price: 99.99,
        category: ItemCategoryEnum.SANDWICH,
        createdAt: new Date('2023-01-01T10:00:00.000Z'),
        updatedAt: new Date('2023-01-15T15:30:00.000Z'),
        isDeleted: false,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(completeItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.id).toBe('item-complete');
      expect(result.name).toBe('Item Completo');
      expect(result.description).toBe('Descrição detalhada do item');
      expect(result.images).toEqual(['img1.jpg', 'img2.jpg', 'img3.jpg']);
      expect(result.quantity).toBe(50);
      expect(result.price).toBe(99.99);
      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result.createdAt).toEqual(new Date('2023-01-01T10:00:00.000Z'));
      expect(result.updatedAt).toEqual(new Date('2023-01-15T15:30:00.000Z'));
      expect(result.isDeleted).toBe(false);
    });

    it('deve tratar ID vazio corretamente', async () => {

      const emptyId = '';
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(null as any);

      await expect(
        DeleteItemUseCase.delete(emptyId, mockItemGateway)
      ).rejects.toThrow(`Item with ID ${emptyId} not found`);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(emptyId, false);
    });

    it('deve tratar ID null/undefined corretamente', async () => {

      const nullId = null as any;
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(null as any);

      await expect(
        DeleteItemUseCase.delete(nullId, mockItemGateway)
      ).rejects.toThrow(`Item with ID ${nullId} not found`);

      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(nullId, false);
    });

    it('deve retornar a mesma instância do item encontrado', async () => {
      const itemId = 'item-123';
      const existingItem = createTestItem();
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(existingItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result).toBe(existingItem); // Mesma referência
      expect(result).toEqual(existingItem); // Mesmo conteúdo
    });

    it('deve funcionar com item com uma única imagem', async () => {
      const itemId = 'item-single-image';
      const singleImageItem = createTestItem({
        id: 'item-single-image',
        images: ['single-image.jpg'],
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(singleImageItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.images).toEqual(['single-image.jpg']);
      expect(result.images.length).toBe(1);
    });

    it('deve funcionar com item com preço decimal', async () => {

      const itemId = 'item-decimal';
      const decimalPriceItem = createTestItem({
        id: 'item-decimal',
        price: 15.75,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(decimalPriceItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.price).toBe(15.75);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com IDs muito longos', async () => {

      const longId = 'a'.repeat(500);
      const itemWithLongId = createTestItem({
        id: longId,
        name: 'Item com ID muito longo',
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(itemWithLongId);

      const result = await DeleteItemUseCase.delete(longId, mockItemGateway);

      expect(result.id).toBe(longId);
      expect(result.name).toBe('Item com ID muito longo');
      expect(mockItemGateway.findByIdIfNotDeleted).toHaveBeenCalledWith(longId, false);
    });

    it('deve lidar com IDs com caracteres especiais', async () => {

      const specialId = 'item-123-@#$%^&*()';
      const itemWithSpecialId = createTestItem({
        id: specialId,
        name: 'Item com ID especial',
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(itemWithSpecialId);

      const result = await DeleteItemUseCase.delete(specialId, mockItemGateway);

      expect(result.id).toBe(specialId);
      expect(result.name).toBe('Item com ID especial');
    });

    it('deve lidar com item com propriedades no limite máximo', async () => {
      const itemId = 'extreme-item';
      const extremeItem = createTestItem({
        id: 'extreme-item',
        name: 'N'.repeat(255), 
        description: 'D'.repeat(1000),
        images: Array.from({ length: 20 }, (_, i) => `extreme-image-${i + 1}.jpg`),
        quantity: 999999,
        price: 999999.99,
        category: ItemCategoryEnum.DESSERT,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(extremeItem);


      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.name).toBe('N'.repeat(255));
      expect(result.description).toBe('D'.repeat(1000));
      expect(result.images.length).toBe(20);
      expect(result.quantity).toBe(999999);
      expect(result.price).toBe(999999.99);
    });

    it('deve lidar com item com propriedades no limite mínimo', async () => {
      const itemId = 'minimal-item';
      const minimalItem = createTestItem({
        id: 'minimal-item',
        name: 'A',
        description: 'B',
        images: ['min.jpg'],
        quantity: 1,
        price: 0.01,
        category: ItemCategoryEnum.SIDE,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(minimalItem);


      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.name).toBe('A');
      expect(result.description).toBe('B');
      expect(result.images).toEqual(['min.jpg']);
      expect(result.quantity).toBe(1);
      expect(result.price).toBe(0.01);
    });

    it('deve lidar com datas extremas', async () => {
      const itemId = 'date-extreme';
      const veryOldDate = new Date('1900-01-01');
      const futureDate = new Date('2099-12-31');
      const dateExtremeItem = createTestItem({
        id: 'date-extreme',
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });
      mockItemGateway.findByIdIfNotDeleted.mockResolvedValue(dateExtremeItem);

      const result = await DeleteItemUseCase.delete(itemId, mockItemGateway);

      expect(result.createdAt).toEqual(veryOldDate);
      expect(result.updatedAt).toEqual(futureDate);
    });
  });
});