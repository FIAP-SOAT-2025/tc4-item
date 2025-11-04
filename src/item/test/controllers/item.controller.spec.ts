import { ControllerItem } from '../../controllers/item.controller';
import { ItemGateway } from '../../gateways/item.gateway';
import { CreateItemInterface } from '../../interfaces/createItemInterface';
import { UpdateItemInterface } from '../../interfaces/updateItemInterface';
import ItemRepositoryInterface from '../../interfaces/ItemRepositoryInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import Item, { ItemProps } from '../../entities/item.entity';
import CreateItemUseCase from '../../useCases/createItem.useCase';
import UpdateItemUseCase from '../../useCases/updateItem.useCase';
import FindItemUseCase from '../../useCases/findItem.useCase';
import FindItemCategory from '../../useCases/findItemCategory.useCase';
import { DeleteItemUseCase } from '../../useCases/deleteItem.useCase';
import { ItemPresenter } from '../../presenter/item.presenter';
import { CategoryPresenter } from '../../presenter/category.presenter';
import { DeletePresenter } from '../../presenter/Delete.presenter';

// Mock dos use cases
jest.mock('../../useCases/createItem.useCase');
jest.mock('../../useCases/updateItem.useCase');
jest.mock('../../useCases/findItem.useCase');
jest.mock('../../useCases/findItemCategory.useCase');
jest.mock('../../useCases/deleteItem.useCase');

// Mock dos presenters
jest.mock('../../presenter/item.presenter');
jest.mock('../../presenter/category.presenter');
jest.mock('../../presenter/Delete.presenter');

// Mock do gateway
jest.mock('../../gateways/item.gateway');

describe('ControllerItem', () => {
  let mockPrismaItemRepository: jest.Mocked<ItemRepositoryInterface>;
  let mockItemGateway: jest.Mocked<ItemGateway>;

  const mockDate = new Date('2023-01-01T10:00:00.000Z');

  beforeEach(() => {
    // Mock do repositório
    mockPrismaItemRepository = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };

    // Mock do gateway
    mockItemGateway = new ItemGateway(mockPrismaItemRepository) as jest.Mocked<ItemGateway>;
    
    // Mock da criação do gateway
    jest.spyOn(ControllerItem as any, 'createItemGateway').mockReturnValue(mockItemGateway);

    // Reset dos mocks
    jest.clearAllMocks();
  });

  const createMockItemData = (overrides: Partial<ItemProps> = {}): ItemProps => {
    return {
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
  };

  const createMockItem = (overrides: Partial<ItemProps> = {}): Item => {
    return new Item(createMockItemData(overrides));
  };

  const createMockCreateItemInterface = (overrides: Partial<CreateItemInterface> = {}): CreateItemInterface => {
    return {
      name: 'Big Mac',
      description: 'Hambúrguer delicioso com molho especial',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 10,
      price: 25.99,
      category: ItemCategoryEnum.SANDWICH,
      ...overrides,
    };
  };

  const createMockUpdateItemInterface = (overrides: Partial<UpdateItemInterface> = {}): UpdateItemInterface => {
    return {
      name: 'Big Mac Atualizado',
      description: 'Hambúrguer atualizado com molho especial',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 15,
      price: 29.99,
      category: ItemCategoryEnum.SANDWICH,
      ...overrides,
    };
  };

  describe('create', () => {
    it('deve criar item com sucesso e retornar resposta formatada', async () => {
      const createItemData = createMockCreateItemInterface();
      const createdItem = createMockItem();
      const formattedResponse = createMockItemData();

      (CreateItemUseCase.create as jest.Mock).mockResolvedValue(createdItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(formattedResponse);

      const result = await ControllerItem.create(createItemData, mockPrismaItemRepository);

      expect(CreateItemUseCase.create).toHaveBeenCalledWith(createItemData, mockItemGateway);
      expect(ItemPresenter.toResponse).toHaveBeenCalledWith(createdItem);
      expect(result).toBe(formattedResponse);
    });

    it('deve criar gateway com repositório correto', async () => {
      const createItemData = createMockCreateItemInterface();
      const createdItem = createMockItem();

      (CreateItemUseCase.create as jest.Mock).mockResolvedValue(createdItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.create(createItemData, mockPrismaItemRepository);

      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
    });

    it('deve propagar erro do use case', async () => {
      const createItemData = createMockCreateItemInterface();
      const error = new Error('Erro ao criar item');

      (CreateItemUseCase.create as jest.Mock).mockRejectedValue(error);

      await expect(
        ControllerItem.create(createItemData, mockPrismaItemRepository)
      ).rejects.toThrow('Erro ao criar item');
    });

    it('deve criar item com categoria BEVERAGE', async () => {
      const createItemData = createMockCreateItemInterface({
        name: 'Coca Cola',
        category: ItemCategoryEnum.BEVERAGE,
        price: 5.99
      });
      const createdItem = createMockItem({ category: ItemCategoryEnum.BEVERAGE });

      (CreateItemUseCase.create as jest.Mock).mockResolvedValue(createdItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.create(createItemData, mockPrismaItemRepository);

      expect(CreateItemUseCase.create).toHaveBeenCalledWith(createItemData, mockItemGateway);
    });
  });

  describe('update', () => {
    it('deve atualizar item com sucesso e retornar resposta formatada', async () => {
      const itemId = 'item-123';
      const updateItemData = createMockUpdateItemInterface();
      const updatedItem = createMockItem();
      const formattedResponse = createMockItemData();

      (UpdateItemUseCase.update as jest.Mock).mockResolvedValue(updatedItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(formattedResponse);

      const result = await ControllerItem.update(itemId, updateItemData, mockPrismaItemRepository);

      expect(UpdateItemUseCase.update).toHaveBeenCalledWith(itemId, updateItemData, mockItemGateway);
      expect(ItemPresenter.toResponse).toHaveBeenCalledWith(updatedItem);
      expect(result).toBe(formattedResponse);
    });

    it('deve criar gateway com repositório correto para update', async () => {
      const itemId = 'item-123';
      const updateItemData = createMockUpdateItemInterface();
      const updatedItem = createMockItem();

      (UpdateItemUseCase.update as jest.Mock).mockResolvedValue(updatedItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.update(itemId, updateItemData, mockPrismaItemRepository);

      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
    });

    it('deve propagar erro do use case de update', async () => {
      const itemId = 'item-123';
      const updateItemData = createMockUpdateItemInterface();
      const error = new Error('Erro ao atualizar item');

      (UpdateItemUseCase.update as jest.Mock).mockRejectedValue(error);

      await expect(
        ControllerItem.update(itemId, updateItemData, mockPrismaItemRepository)
      ).rejects.toThrow('Erro ao atualizar item');
    });

    it('deve atualizar item com diferentes propriedades', async () => {
      const itemId = 'item-456';
      const updateItemData = createMockUpdateItemInterface({
        name: 'McFish',
        category: ItemCategoryEnum.SANDWICH,
        price: 19.99,
        quantity: 5
      });
      const updatedItem = createMockItem({ name: 'McFish' });

      (UpdateItemUseCase.update as jest.Mock).mockResolvedValue(updatedItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.update(itemId, updateItemData, mockPrismaItemRepository);

      expect(UpdateItemUseCase.update).toHaveBeenCalledWith(itemId, updateItemData, mockItemGateway);
    });
  });

  describe('findByCategory', () => {
    it('deve encontrar itens por categoria com sucesso e retornar resposta formatada', async () => {
      const category = ItemCategoryEnum.SANDWICH;
      const foundItems = [createMockItem(), createMockItem({ name: 'McChicken' })];
      const formattedResponse = [createMockItemData(), createMockItemData({ name: 'McChicken' })];

      (FindItemCategory.findByCategory as jest.Mock).mockResolvedValue(foundItems);
      (CategoryPresenter.toResponse as jest.Mock).mockReturnValue(formattedResponse);

      const result = await ControllerItem.findByCategory(category, mockPrismaItemRepository);

      expect(FindItemCategory.findByCategory).toHaveBeenCalledWith(category, mockItemGateway);
      expect(CategoryPresenter.toResponse).toHaveBeenCalledWith(foundItems);
      expect(result).toBe(formattedResponse);
    });

    it('deve tratar caso quando nenhum item é encontrado por categoria', async () => {
      const category = ItemCategoryEnum.DESSERT;
      const formattedResponse: ItemProps[] = [];

      (FindItemCategory.findByCategory as jest.Mock).mockResolvedValue(null);
      (CategoryPresenter.toResponse as jest.Mock).mockReturnValue(formattedResponse);

      const result = await ControllerItem.findByCategory(category, mockPrismaItemRepository);

      expect(FindItemCategory.findByCategory).toHaveBeenCalledWith(category, mockItemGateway);
      expect(CategoryPresenter.toResponse).toHaveBeenCalledWith([]);
      expect(result).toBe(formattedResponse);
    });

    it('deve tratar categoria como string e converter para enum', async () => {
      const categoryString = 'BEVERAGE';
      const foundItems = [createMockItem({ category: ItemCategoryEnum.BEVERAGE })];

      (FindItemCategory.findByCategory as jest.Mock).mockResolvedValue(foundItems);
      (CategoryPresenter.toResponse as jest.Mock).mockReturnValue([createMockItemData()]);

      await ControllerItem.findByCategory(categoryString, mockPrismaItemRepository);

      expect(FindItemCategory.findByCategory).toHaveBeenCalledWith(ItemCategoryEnum.BEVERAGE, mockItemGateway);
    });

    it('deve propagar erro do use case de busca por categoria', async () => {
      const category = ItemCategoryEnum.SIDE;
      const error = new Error('Erro ao buscar por categoria');

      (FindItemCategory.findByCategory as jest.Mock).mockRejectedValue(error);

      await expect(
        ControllerItem.findByCategory(category, mockPrismaItemRepository)
      ).rejects.toThrow('Erro ao buscar por categoria');
    });

    it('deve buscar itens de todas as categorias', async () => {
      const categories = Object.values(ItemCategoryEnum);
      
      for (const category of categories) {
        const foundItems = [createMockItem({ category })];
        
        (FindItemCategory.findByCategory as jest.Mock).mockResolvedValue(foundItems);
        (CategoryPresenter.toResponse as jest.Mock).mockReturnValue([createMockItemData()]);

        await ControllerItem.findByCategory(category, mockPrismaItemRepository);

        expect(FindItemCategory.findByCategory).toHaveBeenCalledWith(category, mockItemGateway);
      }
    });
  });

  describe('findById', () => {
    it('deve encontrar item por ID com sucesso e retornar resposta formatada', async () => {
      const itemId = 'item-123';
      const foundItem = createMockItem();
      const formattedResponse = createMockItemData();

      (FindItemUseCase.findById as jest.Mock).mockResolvedValue(foundItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(formattedResponse);

      const result = await ControllerItem.findById(itemId, mockPrismaItemRepository);

      expect(FindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(ItemPresenter.toResponse).toHaveBeenCalledWith(foundItem);
      expect(result).toBe(formattedResponse);
    });

    it('deve criar gateway com repositório correto para findById', async () => {
      const itemId = 'item-123';
      const foundItem = createMockItem();

      (FindItemUseCase.findById as jest.Mock).mockResolvedValue(foundItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.findById(itemId, mockPrismaItemRepository);

      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
    });

    it('deve propagar erro do use case de busca por ID', async () => {
      const itemId = 'item-123';
      const error = new Error('Item não encontrado');

      (FindItemUseCase.findById as jest.Mock).mockRejectedValue(error);

      await expect(
        ControllerItem.findById(itemId, mockPrismaItemRepository)
      ).rejects.toThrow('Item não encontrado');
    });

    it('deve buscar item com diferentes IDs', async () => {
      const testIds = ['item-1', 'item-2', 'uuid-123-456', '12345'];
      
      for (const itemId of testIds) {
        const foundItem = createMockItem({ id: itemId });
        
        (FindItemUseCase.findById as jest.Mock).mockResolvedValue(foundItem);
        (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

        await ControllerItem.findById(itemId, mockPrismaItemRepository);

        expect(FindItemUseCase.findById).toHaveBeenCalledWith(itemId, mockItemGateway);
      }
    });

    it('deve tratar item retornado como null com operador de não-nulidade', async () => {
      const itemId = 'item-123';
      const foundItem = createMockItem();

      (FindItemUseCase.findById as jest.Mock).mockResolvedValue(foundItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.findById(itemId, mockPrismaItemRepository);

      expect(ItemPresenter.toResponse).toHaveBeenCalledWith(foundItem);
    });
  });

  describe('delete', () => {
    it('deve deletar item com sucesso e retornar resposta formatada', async () => {
      const itemId = 'item-123';
      const deletedItem = createMockItem();
      const deleteResponse = { message: 'Item with ID item-123 deleted successfully' };

      (DeleteItemUseCase.delete as jest.Mock).mockResolvedValue(deletedItem);
      (DeletePresenter.toResponse as jest.Mock).mockReturnValue(deleteResponse);

      const result = await ControllerItem.delete(itemId, mockPrismaItemRepository);

      expect(DeleteItemUseCase.delete).toHaveBeenCalledWith(itemId, mockItemGateway);
      expect(DeletePresenter.toResponse).toHaveBeenCalledWith(deletedItem.id);
      expect(result).toBe(deleteResponse);
    });

    it('deve criar gateway com repositório correto para delete', async () => {
      const itemId = 'item-123';
      const deletedItem = createMockItem();

      (DeleteItemUseCase.delete as jest.Mock).mockResolvedValue(deletedItem);
      (DeletePresenter.toResponse as jest.Mock).mockReturnValue({ message: 'success' });

      await ControllerItem.delete(itemId, mockPrismaItemRepository);

      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
    });

    it('deve propagar erro do use case de delete', async () => {
      const itemId = 'item-123';
      const error = new Error('Erro ao deletar item');

      (DeleteItemUseCase.delete as jest.Mock).mockRejectedValue(error);

      await expect(
        ControllerItem.delete(itemId, mockPrismaItemRepository)
      ).rejects.toThrow('Erro ao deletar item');
    });

    it('deve deletar item com diferentes IDs', async () => {
      const testIds = ['item-1', 'item-2', 'uuid-123-456'];
      
      for (const itemId of testIds) {
        const deletedItem = createMockItem({ id: itemId });
        const deleteResponse = { message: `Item with ID ${itemId} deleted successfully` };
        
        (DeleteItemUseCase.delete as jest.Mock).mockResolvedValue(deletedItem);
        (DeletePresenter.toResponse as jest.Mock).mockReturnValue(deleteResponse);

        const result = await ControllerItem.delete(itemId, mockPrismaItemRepository);

        expect(DeleteItemUseCase.delete).toHaveBeenCalledWith(itemId, mockItemGateway);
        expect(DeletePresenter.toResponse).toHaveBeenCalledWith(itemId);
        expect(result).toBe(deleteResponse);
      }
    });

    it('deve retornar objeto com propriedade message', async () => {
      const itemId = 'item-123';
      const deletedItem = createMockItem();
      const deleteResponse = { message: 'Item deleted successfully' };

      (DeleteItemUseCase.delete as jest.Mock).mockResolvedValue(deletedItem);
      (DeletePresenter.toResponse as jest.Mock).mockReturnValue(deleteResponse);

      const result = await ControllerItem.delete(itemId, mockPrismaItemRepository);

      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });

    it('deve passar ID do item deletado para o presenter', async () => {
      const itemId = 'item-456';
      const deletedItem = createMockItem({ id: itemId });

      (DeleteItemUseCase.delete as jest.Mock).mockResolvedValue(deletedItem);
      (DeletePresenter.toResponse as jest.Mock).mockReturnValue({ message: 'success' });

      await ControllerItem.delete(itemId, mockPrismaItemRepository);

      expect(DeletePresenter.toResponse).toHaveBeenCalledWith(itemId);
    });
  });

  describe('createItemGateway (método privado)', () => {
    it('deve criar instância do ItemGateway com repositório fornecido', () => {
      // Limpar mock para testar o método real
      jest.restoreAllMocks();
      
      const gateway = ControllerItem['createItemGateway'](mockPrismaItemRepository);
      
      expect(gateway).toBeInstanceOf(ItemGateway);
    });
  });

  describe('integração entre métodos', () => {
    it('deve usar a mesma instância de gateway em operações sequenciais', async () => {
      const createItemData = createMockCreateItemInterface();
      const createdItem = createMockItem();
      
      (CreateItemUseCase.create as jest.Mock).mockResolvedValue(createdItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.create(createItemData, mockPrismaItemRepository);
      
      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
      
      // Reset para verificar próxima chamada
      jest.clearAllMocks();
      
      (FindItemUseCase.findById as jest.Mock).mockResolvedValue(createdItem);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(createMockItemData());

      await ControllerItem.findById('item-123', mockPrismaItemRepository);
      
      expect(ControllerItem['createItemGateway']).toHaveBeenCalledWith(mockPrismaItemRepository);
    });

    it('deve manter consistência de tipos entre operações', async () => {
      const itemData = createMockItemData();
      const item = createMockItem(itemData);

      // Create
      (CreateItemUseCase.create as jest.Mock).mockResolvedValue(item);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(itemData);

      const createResult = await ControllerItem.create(
        createMockCreateItemInterface(), 
        mockPrismaItemRepository
      );

      expect(createResult).toEqual(itemData);

      // FindById
      (FindItemUseCase.findById as jest.Mock).mockResolvedValue(item);
      (ItemPresenter.toResponse as jest.Mock).mockReturnValue(itemData);

      const findResult = await ControllerItem.findById(itemData.id!, mockPrismaItemRepository);

      expect(findResult).toEqual(itemData);
    });
  });
});