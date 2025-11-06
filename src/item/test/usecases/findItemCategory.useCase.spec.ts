import FindItemCategoryUseCase from '../../useCases/findItemCategory.useCase';
import Item from '../../entities/item.entity';
import ItemGatewayInterface from '../../interfaces/itemGatewayInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('FindItemCategoryUseCase', () => {
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

  describe('findByCategory', () => {
    it('deve encontrar itens da categoria SANDWICH', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const sandwichItems = [
        createTestItem({
          id: 'sandwich-1',
          name: 'Big Mac',
          category: ItemCategoryEnum.SANDWICH,
        }),
        createTestItem({
          id: 'sandwich-2',
          name: 'Quarteirão',
          category: ItemCategoryEnum.SANDWICH,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(sandwichItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(mockItemGateway.findByCategory).toHaveBeenCalledWith(category);
      expect(mockItemGateway.findByCategory).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result![0]).toBeInstanceOf(Item);
      expect(result![1]).toBeInstanceOf(Item);
      expect(result![0].category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result![1].category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result![0].name).toBe('Big Mac');
      expect(result![1].name).toBe('Quarteirão');
    });

    it('deve encontrar itens da categoria BEVERAGE', async () => {
      
      const category = ItemCategoryEnum.BEVERAGE;
      const beverageItems = [
        createTestItem({
          id: 'beverage-1',
          name: 'Coca Cola',
          description: 'Refrigerante gelado',
          category: ItemCategoryEnum.BEVERAGE,
        }),
        createTestItem({
          id: 'beverage-2',
          name: 'Suco de Laranja',
          description: 'Suco natural',
          category: ItemCategoryEnum.BEVERAGE,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(beverageItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(2);
      expect(result![0].category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result![1].category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result![0].name).toBe('Coca Cola');
      expect(result![1].name).toBe('Suco de Laranja');
    });

    it('deve encontrar itens da categoria SIDE', async () => {
      
      const category = ItemCategoryEnum.SIDE;
      const sideItems = [
        createTestItem({
          id: 'side-1',
          name: 'Batata Frita',
          description: 'Batatas crocantes',
          category: ItemCategoryEnum.SIDE,
        }),
        createTestItem({
          id: 'side-2',
          name: 'Onion Rings',
          description: 'Anéis de cebola empanados',
          category: ItemCategoryEnum.SIDE,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(sideItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(2);
      expect(result![0].category).toBe(ItemCategoryEnum.SIDE);
      expect(result![1].category).toBe(ItemCategoryEnum.SIDE);
      expect(result![0].name).toBe('Batata Frita');
      expect(result![1].name).toBe('Onion Rings');
    });

    it('deve encontrar itens da categoria DESSERT', async () => {
      
      const category = ItemCategoryEnum.DESSERT;
      const dessertItems = [
        createTestItem({
          id: 'dessert-1',
          name: 'Sorvete de Chocolate',
          description: 'Sorvete cremoso',
          category: ItemCategoryEnum.DESSERT,
        }),
        createTestItem({
          id: 'dessert-2',
          name: 'Torta de Maçã',
          description: 'Torta quente',
          category: ItemCategoryEnum.DESSERT,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(dessertItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(2);
      expect(result![0].category).toBe(ItemCategoryEnum.DESSERT);
      expect(result![1].category).toBe(ItemCategoryEnum.DESSERT);
      expect(result![0].name).toBe('Sorvete de Chocolate');
      expect(result![1].name).toBe('Torta de Maçã');
    });

    it('deve retornar array vazio quando não houver itens da categoria', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      mockItemGateway.findByCategory.mockResolvedValue([]);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(mockItemGateway.findByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve criar novas instâncias de Item para cada item retornado', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const originalItems = [
        createTestItem({ id: 'item-1', name: 'Item 1' }),
        createTestItem({ id: 'item-2', name: 'Item 2' }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(originalItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(2);
      
      expect(result![0]).not.toBe(originalItems[0]);
      expect(result![1]).not.toBe(originalItems[1]);
      
      expect(result![0].id).toBe(originalItems[0].id);
      expect(result![1].id).toBe(originalItems[1].id);
      expect(result![0].name).toBe(originalItems[0].name);
      expect(result![1].name).toBe(originalItems[1].name);
    });

    it('deve encontrar um único item da categoria', async () => {
      
      const category = ItemCategoryEnum.BEVERAGE;
      const singleItem = [
        createTestItem({
          id: 'single-beverage',
          name: 'Água Mineral',
          category: ItemCategoryEnum.BEVERAGE,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(singleItem);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(1);
      expect(result![0].name).toBe('Água Mineral');
      expect(result![0].category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve encontrar múltiplos itens com propriedades variadas', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const multipleItems = [
        createTestItem({
          id: 'sandwich-1',
          name: 'Big Mac',
          price: 25.99,
          quantity: 10,
          images: ['big-mac1.jpg', 'big-mac2.jpg'],
        }),
        createTestItem({
          id: 'sandwich-2',
          name: 'Cheeseburger',
          price: 15.50,
          quantity: 20,
          images: ['cheese1.jpg'],
        }),
        createTestItem({
          id: 'sandwich-3',
          name: 'Chicken Burger',
          price: 22.75,
          quantity: 5,
          images: ['chicken1.jpg', 'chicken2.jpg', 'chicken3.jpg'],
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(multipleItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(3);
      expect(result![0].price).toBe(25.99);
      expect(result![0].images).toHaveLength(2);
      expect(result![1].price).toBe(15.50);
      expect(result![1].images).toHaveLength(1);
      expect(result![2].price).toBe(22.75);
      expect(result![2].images).toHaveLength(3);
    });

    it('deve lançar erro para categoria inválida', async () => {
      
      const invalidCategory = 'CATEGORIA_INVALIDA' as any;

      
      await expect(
        FindItemCategoryUseCase.findByCategory(invalidCategory, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        FindItemCategoryUseCase.findByCategory(invalidCategory, mockItemGateway)
      ).rejects.toThrow('Invalid category. Expected values: SANDWICH, BEVERAGE, SIDE, DESSERT');

      expect(mockItemGateway.findByCategory).not.toHaveBeenCalled();
    });

    it('deve validar todas as categorias válidas', async () => {
      
      const validCategories = [
        ItemCategoryEnum.SANDWICH,
        ItemCategoryEnum.BEVERAGE,
        ItemCategoryEnum.SIDE,
        ItemCategoryEnum.DESSERT,
      ];

      for (const category of validCategories) {
        mockItemGateway.findByCategory.mockResolvedValue([]);

        await expect(
          FindItemCategoryUseCase.findByCategory(category, mockItemGateway)
        ).resolves.not.toThrow();
      }

      expect(mockItemGateway.findByCategory).toHaveBeenCalledTimes(4);
    });

    it('deve propagar erros do gateway quando busca falha', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const gatewayError = new Error('Erro de conexão com banco de dados');
      mockItemGateway.findByCategory.mockRejectedValue(gatewayError);

      
      await expect(
        FindItemCategoryUseCase.findByCategory(category, mockItemGateway)
      ).rejects.toThrow('Erro de conexão com banco de dados');

      expect(mockItemGateway.findByCategory).toHaveBeenCalledWith(category);
      expect(mockItemGateway.findByCategory).toHaveBeenCalledTimes(1);
    });

    it('deve propagar BaseException do gateway', async () => {
      
      const category = ItemCategoryEnum.BEVERAGE;
      const gatewayError = new BaseException('Erro interno do servidor', 500, 'SERVER_ERROR');
      mockItemGateway.findByCategory.mockRejectedValue(gatewayError);

      
      await expect(
        FindItemCategoryUseCase.findByCategory(category, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        FindItemCategoryUseCase.findByCategory(category, mockItemGateway)
      ).rejects.toThrow('Erro interno do servidor');

      expect(mockItemGateway.findByCategory).toHaveBeenCalledWith(category);
    });

    it('deve preservar todas as propriedades dos itens encontrados', async () => {
      
      const category = ItemCategoryEnum.DESSERT;
      const itemWithAllProperties = createTestItem({
        id: 'complete-item',
        name: 'Item Completo',
        description: 'Descrição detalhada',
        images: ['img1.jpg', 'img2.jpg'],
        quantity: 25,
        price: 45.75,
        category: ItemCategoryEnum.DESSERT,
        createdAt: new Date('2023-01-01T10:00:00.000Z'),
        updatedAt: new Date('2023-01-15T15:30:00.000Z'),
        isDeleted: false,
      });

      mockItemGateway.findByCategory.mockResolvedValue([itemWithAllProperties]);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(1);
      const returnedItem = result![0];
      expect(returnedItem.id).toBe('complete-item');
      expect(returnedItem.name).toBe('Item Completo');
      expect(returnedItem.description).toBe('Descrição detalhada');
      expect(returnedItem.images).toEqual(['img1.jpg', 'img2.jpg']);
      expect(returnedItem.quantity).toBe(25);
      expect(returnedItem.price).toBe(45.75);
      expect(returnedItem.category).toBe(ItemCategoryEnum.DESSERT);
      expect(returnedItem.createdAt).toEqual(new Date('2023-01-01T10:00:00.000Z'));
      expect(returnedItem.updatedAt).toEqual(new Date('2023-01-15T15:30:00.000Z'));
      expect(returnedItem.isDeleted).toBe(false);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com muitos itens retornados', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const manyItems = Array.from({ length: 100 }, (_, i) =>
        createTestItem({
          id: `item-${i + 1}`,
          name: `Sandwich ${i + 1}`,
          category: ItemCategoryEnum.SANDWICH,
        })
      );

      mockItemGateway.findByCategory.mockResolvedValue(manyItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(100);
      expect(result![0].name).toBe('Sandwich 1');
      expect(result![99].name).toBe('Sandwich 100');
      result!.forEach(item => {
        expect(item).toBeInstanceOf(Item);
        expect(item.category).toBe(ItemCategoryEnum.SANDWICH);
      });
    });

    it('deve lidar com itens com propriedades extremas', async () => {
      
      const category = ItemCategoryEnum.SIDE;
      const extremeItems = [
        createTestItem({
          id: 'extreme-item',
          name: 'N'.repeat(500), 
          description: 'D'.repeat(1000), 
          images: Array.from({ length: 50 }, (_, i) => `image${i + 1}.jpg`), 
          quantity: 999999, 
          price: 999999.99, 
          category: ItemCategoryEnum.SIDE,
        }),
        createTestItem({
          id: 'minimal-item',
          name: 'A', 
          description: 'B', 
          images: ['min.jpg'], 
          quantity: 1, 
          price: 0.01, 
          category: ItemCategoryEnum.SIDE,
        }),
      ];

      mockItemGateway.findByCategory.mockResolvedValue(extremeItems);

      
      const result = await FindItemCategoryUseCase.findByCategory(category, mockItemGateway);

      
      expect(result).toHaveLength(2);
      
      expect(result![0].name).toBe('N'.repeat(500));
      expect(result![0].images.length).toBe(50);
      expect(result![0].quantity).toBe(999999);
      expect(result![0].price).toBe(999999.99);
      
      expect(result![1].name).toBe('A');
      expect(result![1].images.length).toBe(1);
      expect(result![1].quantity).toBe(1);
      expect(result![1].price).toBe(0.01);
    });

    it('deve lidar com categoria null/undefined', async () => {
      
      const nullCategory = null as any;
      const undefinedCategory = undefined as any;

      
      await expect(
        FindItemCategoryUseCase.findByCategory(nullCategory, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        FindItemCategoryUseCase.findByCategory(undefinedCategory, mockItemGateway)
      ).rejects.toThrow(BaseException);
    });

    it('deve validar categoria usando valores do enum estritamente', async () => {
      
      const fakeCategory = 'SANDWICH' as any; 

      
      
      
      if (Object.values(ItemCategoryEnum).includes(fakeCategory)) {
        mockItemGateway.findByCategory.mockResolvedValue([]);
        await expect(
          FindItemCategoryUseCase.findByCategory(fakeCategory, mockItemGateway)
        ).resolves.not.toThrow();
      } else {
        await expect(
          FindItemCategoryUseCase.findByCategory(fakeCategory, mockItemGateway)
        ).rejects.toThrow(BaseException);
      }
    });
  });
});