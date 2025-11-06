import UpdateQuantityItemUseCase from '../../useCases/updateQuantityItem.usecase';
import Item from '../../entities/item.entity';
import ItemGatewayInterface from '../../interfaces/itemGatewayInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import FindItemUseCase from '../../useCases/findItem.useCase';
import UpdateItemUseCase from '../../useCases/updateItem.useCase';


jest.mock('../../useCases/findItem.useCase');
jest.mock('../../useCases/updateItem.useCase');

const mockFindItemUseCase = FindItemUseCase as jest.Mocked<typeof FindItemUseCase>;
const mockUpdateItemUseCase = UpdateItemUseCase as jest.Mocked<typeof UpdateItemUseCase>;

describe('UpdateQuantityItemUseCase', () => {
  let mockItemGateway: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    mockItemGateway = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };

    
    jest.clearAllMocks();
  });

  const createTestItem = (overrides = {}) => {
    return new Item({
      id: 'item-123',
      name: 'Big Mac',
      description: 'Hambúrguer delicioso com molho especial',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 50,
      price: 25.99,
      category: ItemCategoryEnum.SANDWICH,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      isDeleted: false,
      ...overrides,
    });
  };

  describe('updateQuantity', () => {
    it('deve atualizar quantidade do item corretamente', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 5;
      const existingItem = createTestItem({ quantity: 50 });
      const updatedItem = createTestItem({ quantity: 45 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      
      const updateQuantitySpy = jest.spyOn(existingItem, 'updateItemQuantity');

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(updateQuantitySpy).toHaveBeenCalledWith(quantityToRemove);
      expect(mockUpdateItemUseCase.update).toHaveBeenCalledWith(itemId, existingItem, mockItemGateway);
      expect(result).toEqual(updatedItem);
      expect(result.quantity).toBe(45);
    });

    it('deve remover quantidade pequena do estoque', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 1;
      const existingItem = createTestItem({ quantity: 10 });
      const updatedItem = createTestItem({ quantity: 9 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      const updateQuantitySpy = jest.spyOn(existingItem, 'updateItemQuantity');

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(updateQuantitySpy).toHaveBeenCalledWith(1);
      expect(result.quantity).toBe(9);
    });

    it('deve remover quantidade grande do estoque', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 25;
      const existingItem = createTestItem({ quantity: 100 });
      const updatedItem = createTestItem({ quantity: 75 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      const updateQuantitySpy = jest.spyOn(existingItem, 'updateItemQuantity');

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(updateQuantitySpy).toHaveBeenCalledWith(25);
      expect(result.quantity).toBe(75);
    });

    it('deve funcionar com diferentes categorias de itens', async () => {
      
      const itemId = 'beverage-123';
      const quantityToRemove = 3;
      const beverageItem = createTestItem({
        id: 'beverage-123',
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
        quantity: 20,
      });
      const updatedBeverage = createTestItem({
        id: 'beverage-123',
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
        quantity: 17,
      });

      mockFindItemUseCase.findById.mockResolvedValue(beverageItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedBeverage);

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Coca Cola');
      expect(result.quantity).toBe(17);
    });

    it('deve lançar erro quando item não for encontrado', async () => {
      
      const itemId = 'item-inexistente';
      const quantityToRemove = 5;

      mockFindItemUseCase.findById.mockResolvedValue(null);

      
      await expect(
        UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway)
      ).rejects.toThrow(`Item with ID ${itemId} not found`);

      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(mockUpdateItemUseCase.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro do FindItemUseCase quando busca falha', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 5;
      const findError = new Error('Erro ao buscar item');

      mockFindItemUseCase.findById.mockRejectedValue(findError);

      
      await expect(
        UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway)
      ).rejects.toThrow('Erro ao buscar item');

      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(mockUpdateItemUseCase.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do updateItemQuantity quando quantidade for inválida', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 100; 
      const existingItem = createTestItem({ quantity: 50 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);

      
      const updateQuantityError = new Error('Quantidade insuficiente no estoque');
      jest.spyOn(existingItem, 'updateItemQuantity').mockImplementation(() => {
        throw updateQuantityError;
      });

      
      await expect(
        UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway)
      ).rejects.toThrow('Quantidade insuficiente no estoque');

      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(mockUpdateItemUseCase.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do UpdateItemUseCase quando atualização falha', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 5;
      const existingItem = createTestItem({ quantity: 50 });
      const updateError = new Error('Erro ao atualizar item');

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      jest.spyOn(existingItem, 'updateItemQuantity').mockImplementation(() => {
        
        (existingItem as any).quantity = 45;
      });
      mockUpdateItemUseCase.update.mockRejectedValue(updateError);

      
      await expect(
        UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway)
      ).rejects.toThrow('Erro ao atualizar item');

      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(mockUpdateItemUseCase.update).toHaveBeenCalledWith(itemId, existingItem, mockItemGateway);
    });

    it('deve atualizar item com quantidade zero', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 0; 
      const existingItem = createTestItem({ quantity: 10 });
      const updatedItem = createTestItem({ quantity: 10 }); 

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      const updateQuantitySpy = jest.spyOn(existingItem, 'updateItemQuantity');

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(updateQuantitySpy).toHaveBeenCalledWith(0);
      expect(result.quantity).toBe(10);
    });

    it('deve preservar todas as propriedades do item exceto quantidade', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 2;
      const completeItem = createTestItem({
        id: 'item-123',
        name: 'Big Mac',
        description: 'Hambúrguer delicioso com molho especial',
        images: ['img1.jpg', 'img2.jpg'],
        quantity: 15,
        price: 35.99,
        category: ItemCategoryEnum.DESSERT,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-15T15:30:00.000Z'),
        isDeleted: false,
      });

      const updatedItem = createTestItem({
        ...completeItem,
        quantity: 13,
        updatedAt: new Date(), 
      });

      mockFindItemUseCase.findById.mockResolvedValue(completeItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(result.id).toBe('item-123');
      expect(result.name).toBe('Big Mac');
      expect(result.description).toBe('Hambúrguer delicioso com molho especial');
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(result.price).toBe(25.99);
      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result.createdAt).toEqual(new Date('2023-01-01T00:00:00.000Z'));
      expect(result.isDeleted).toBe(false);
      expect(result.quantity).toBe(13); 
    });

    it('deve funcionar com IDs de diferentes formatos', async () => {
      
      const specialId = 'item-abc-123-xyz';
      const quantityToRemove = 3;
      const existingItem = createTestItem({ id: specialId, quantity: 20 });
      const updatedItem = createTestItem({ id: specialId, quantity: 17 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        specialId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(mockFindItemUseCase.findById).toHaveBeenCalledWith(specialId, mockItemGateway);
      expect(result.id).toBe(specialId);
      expect(result.quantity).toBe(17);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com IDs muito longos', async () => {
      
      const longId = 'a'.repeat(500);
      const quantityToRemove = 1;
      const existingItem = createTestItem({ id: longId, quantity: 10 });
      const updatedItem = createTestItem({ id: longId, quantity: 9 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        longId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(result.id).toBe(longId);
      expect(result.quantity).toBe(9);
    });

    it('deve lidar com quantidades muito altas', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 50000;
      const existingItem = createTestItem({ quantity: 100000 });
      const updatedItem = createTestItem({ quantity: 50000 });

      mockFindItemUseCase.findById.mockResolvedValue(existingItem);
      mockUpdateItemUseCase.update.mockResolvedValue(updatedItem);

      
      const result = await UpdateQuantityItemUseCase.updateQuantity(
        itemId,
        quantityToRemove,
        mockItemGateway
      );

      
      expect(result.quantity).toBe(50000);
    });

    it('deve chamar métodos na sequência correta', async () => {
      
      const itemId = 'item-123';
      const quantityToRemove = 5;
      const existingItem = createTestItem({ quantity: 20 });
      const updatedItem = createTestItem({ quantity: 15 });

      const callOrder: string[] = [];

      mockFindItemUseCase.findById.mockImplementation(() => {
        callOrder.push('findById');
        return Promise.resolve(existingItem);
      });

      jest.spyOn(existingItem, 'updateItemQuantity').mockImplementation(() => {
        callOrder.push('updateItemQuantity');
      });

      mockUpdateItemUseCase.update.mockImplementation(() => {
        callOrder.push('update');
        return Promise.resolve(updatedItem);
      });

      
      await UpdateQuantityItemUseCase.updateQuantity(itemId, quantityToRemove, mockItemGateway);

      
      expect(callOrder).toEqual(['findById', 'updateItemQuantity', 'update']);
    });
  });
});