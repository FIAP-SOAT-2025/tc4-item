import { ItemGateway } from '../../gateways/item.gateway';
import Item from '../../entities/item.entity';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import ItemRepositoryInterface from '../../interfaces/ItemRepositoryInterface';

describe('ItemGateway', () => {
  let itemGateway: ItemGateway;
  let mockItemRepository: jest.Mocked<ItemRepositoryInterface>;

  beforeEach(() => {
    mockItemRepository = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };

    itemGateway = new ItemGateway(mockItemRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createTestItemData = (overrides = {}) => {
    return {
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
    };
  };

  const createTestItem = (overrides = {}) => {
    return new Item(createTestItemData(overrides));
  };

  describe('create', () => {
    it('deve criar um novo item com sucesso', async () => {
      
      const itemData = createTestItem();
      const repositoryResponse = createTestItemData();
      
      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(itemData);

      
      expect(mockItemRepository.create).toHaveBeenCalledWith(itemData);
      expect(mockItemRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Item);
      expect(result.id).toBe('item-123');
      expect(result.name).toBe('Big Mac');
      expect(result.description).toBe('Hambúrguer delicioso com molho especial');
      expect(result.price).toBe(25.99);
      expect(result.quantity).toBe(10);
      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
    });

    it('deve criar item com categoria BEVERAGE', async () => {
      
      const beverageData = createTestItem({
        name: 'Coca Cola',
        description: 'Refrigerante gelado',
        category: ItemCategoryEnum.BEVERAGE,
      });
      const repositoryResponse = createTestItemData({
        name: 'Coca Cola',
        description: 'Refrigerante gelado',
        category: ItemCategoryEnum.BEVERAGE,
      });

      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(beverageData);

      
      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Coca Cola');
      expect(result.description).toBe('Refrigerante gelado');
    });

    it('deve criar item com categoria SIDE', async () => {
      
      const sideData = createTestItem({
        name: 'Batata Frita',
        description: 'Batatas crocantes',
        category: ItemCategoryEnum.SIDE,
      });
      const repositoryResponse = createTestItemData({
        name: 'Batata Frita',
        description: 'Batatas crocantes',
        category: ItemCategoryEnum.SIDE,
      });

      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(sideData);

      
      expect(result.category).toBe(ItemCategoryEnum.SIDE);
      expect(result.name).toBe('Batata Frita');
      expect(result.description).toBe('Batatas crocantes');
    });

    it('deve criar item com categoria DESSERT', async () => {
      
      const dessertData = createTestItem({
        name: 'Sorvete de Chocolate',
        description: 'Sorvete cremoso',
        category: ItemCategoryEnum.DESSERT,
      });
      const repositoryResponse = createTestItemData({
        name: 'Sorvete de Chocolate',
        description: 'Sorvete cremoso',
        category: ItemCategoryEnum.DESSERT,
      });

      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(dessertData);

      
      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
      expect(result.name).toBe('Sorvete de Chocolate');
      expect(result.description).toBe('Sorvete cremoso');
    });

    it('deve propagar erro do repositório quando criação falha', async () => {
      
      const itemData = createTestItem();
      const repositoryError = new Error('Erro de conexão com banco de dados');

      mockItemRepository.create.mockRejectedValue(repositoryError);

      
      await expect(itemGateway.create(itemData)).rejects.toThrow('Erro de conexão com banco de dados');
      expect(mockItemRepository.create).toHaveBeenCalledWith(itemData);
      expect(mockItemRepository.create).toHaveBeenCalledTimes(1);
    });

    it('deve retornar nova instância de Item com dados do repositório', async () => {
      
      const itemData = createTestItem();
      const repositoryResponse = createTestItemData({
        id: 'new-generated-id',
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-02-01'),
      });

      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(itemData);

      
      expect(result).toBeInstanceOf(Item);
      expect(result.id).toBe('new-generated-id');
      expect(result.createdAt).toEqual(new Date('2023-02-01'));
      expect(result.updatedAt).toEqual(new Date('2023-02-01'));
    });
  });

  describe('findByIdIfNotDeleted', () => {
    it('deve encontrar item por ID quando não está deletado', async () => {
      
      const itemId = 'item-123';
      const isDeleted = false;
      const repositoryResponse = createTestItemData();

      mockItemRepository.findByIdIfNotDeleted.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByIdIfNotDeleted(itemId, isDeleted);

      
      expect(mockItemRepository.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, isDeleted);
      expect(mockItemRepository.findByIdIfNotDeleted).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Item);
      expect(result.id).toBe('item-123');
      expect(result.name).toBe('Big Mac');
      expect(result.isDeleted).toBe(false);
    });

    it('deve buscar com isDeleted = true quando especificado', async () => {
      
      const itemId = 'item-123';
      const isDeleted = true;
      const repositoryResponse = createTestItemData({ isDeleted: true });

      mockItemRepository.findByIdIfNotDeleted.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByIdIfNotDeleted(itemId, isDeleted);

      
      expect(mockItemRepository.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, true);
      expect(result.isDeleted).toBe(true);
    });

    it('deve encontrar item com diferentes categorias', async () => {
      
      const itemId = 'beverage-123';
      const repositoryResponse = createTestItemData({
        id: 'beverage-123',
        name: 'Suco de Laranja',
        category: ItemCategoryEnum.BEVERAGE,
      });

      mockItemRepository.findByIdIfNotDeleted.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByIdIfNotDeleted(itemId, false);

      
      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result.name).toBe('Suco de Laranja');
      expect(result.id).toBe('beverage-123');
    });

    it('deve propagar erro do repositório quando busca falha', async () => {
      
      const itemId = 'item-123';
      const repositoryError = new Error('Item não encontrado no banco');

      mockItemRepository.findByIdIfNotDeleted.mockRejectedValue(repositoryError);

      
      await expect(
        itemGateway.findByIdIfNotDeleted(itemId, false)
      ).rejects.toThrow('Item não encontrado no banco');

      expect(mockItemRepository.findByIdIfNotDeleted).toHaveBeenCalledWith(itemId, false);
    });

    it('deve retornar nova instância de Item mesmo quando o repositório retorna dados brutos', async () => {
      
      const itemId = 'item-123';
      const repositoryResponse = createTestItemData();

      mockItemRepository.findByIdIfNotDeleted.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByIdIfNotDeleted(itemId, false);

      
      expect(result).toBeInstanceOf(Item);
      
      expect(result).not.toBe(repositoryResponse);
    });
  });

  describe('update', () => {
    it('deve atualizar um item com sucesso', async () => {
      
      const itemId = 'item-123';
      const updatedItemData = createTestItem({
        name: 'Big Mac Atualizado',
        price: 29.99,
        updatedAt: new Date('2023-01-15'),
      });
      const repositoryResponse = createTestItemData({
        name: 'Big Mac Atualizado',
        price: 29.99,
        updatedAt: new Date('2023-01-15'),
      });

      mockItemRepository.update.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.update(itemId, updatedItemData);

      
      expect(mockItemRepository.update).toHaveBeenCalledWith(itemId, updatedItemData);
      expect(mockItemRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Item);
      expect(result.name).toBe('Big Mac Atualizado');
      expect(result.price).toBe(29.99);
      expect(result.updatedAt).toEqual(new Date('2023-01-15'));
    });

    it('deve atualizar item com nova categoria', async () => {
      
      const itemId = 'item-123';
      const updatedItemData = createTestItem({
        category: ItemCategoryEnum.DESSERT,
      });
      const repositoryResponse = createTestItemData({
        category: ItemCategoryEnum.DESSERT,
      });

      mockItemRepository.update.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.update(itemId, updatedItemData);

      
      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('deve atualizar item com novas imagens', async () => {
      
      const itemId = 'item-123';
      const newImages = ['nova-imagem1.jpg', 'nova-imagem2.jpg', 'nova-imagem3.jpg'];
      const updatedItemData = createTestItem({
        images: newImages,
      });
      const repositoryResponse = createTestItemData({
        images: newImages,
      });

      mockItemRepository.update.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.update(itemId, updatedItemData);

      
      expect(result.images).toEqual(newImages);
      expect(result.images.length).toBe(3);
    });

    it('deve atualizar quantidade e preço', async () => {
      
      const itemId = 'item-123';
      const updatedItemData = createTestItem({
        quantity: 25,
        price: 35.50,
      });
      const repositoryResponse = createTestItemData({
        quantity: 25,
        price: 35.50,
      });

      mockItemRepository.update.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.update(itemId, updatedItemData);

      
      expect(result.quantity).toBe(25);
      expect(result.price).toBe(35.50);
    });

    it('deve propagar erro do repositório quando atualização falha', async () => {
      
      const itemId = 'item-123';
      const updatedItemData = createTestItem();
      const repositoryError = new Error('Erro ao atualizar no banco');

      mockItemRepository.update.mockRejectedValue(repositoryError);

      
      await expect(
        itemGateway.update(itemId, updatedItemData)
      ).rejects.toThrow('Erro ao atualizar no banco');

      expect(mockItemRepository.update).toHaveBeenCalledWith(itemId, updatedItemData);
    });

    it('deve retornar nova instância de Item após atualização', async () => {
      
      const itemId = 'item-123';
      const updatedItemData = createTestItem();
      const repositoryResponse = createTestItemData();

      mockItemRepository.update.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.update(itemId, updatedItemData);

      
      expect(result).toBeInstanceOf(Item);
      expect(result).not.toBe(repositoryResponse);
    });
  });

  describe('findByCategory', () => {
    it('deve encontrar itens pela categoria SANDWICH', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const repositoryResponse = [
        createTestItemData({
          id: 'sandwich-1',
          name: 'Big Mac',
          category: ItemCategoryEnum.SANDWICH,
        }),
        createTestItemData({
          id: 'sandwich-2',
          name: 'Quarteirão',
          category: ItemCategoryEnum.SANDWICH,
        }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(mockItemRepository.findByCategory).toHaveBeenCalledWith(category);
      expect(mockItemRepository.findByCategory).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Item);
      expect(result[1]).toBeInstanceOf(Item);
      expect(result[0].category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result[1].category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result[0].name).toBe('Big Mac');
      expect(result[1].name).toBe('Quarteirão');
    });

    it('deve encontrar itens pela categoria BEVERAGE', async () => {
      
      const category = ItemCategoryEnum.BEVERAGE;
      const repositoryResponse = [
        createTestItemData({
          id: 'beverage-1',
          name: 'Coca Cola',
          category: ItemCategoryEnum.BEVERAGE,
        }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe(ItemCategoryEnum.BEVERAGE);
      expect(result[0].name).toBe('Coca Cola');
    });

    it('deve encontrar itens pela categoria SIDE', async () => {
      
      const category = ItemCategoryEnum.SIDE;
      const repositoryResponse = [
        createTestItemData({
          id: 'side-1',
          name: 'Batata Frita',
          category: ItemCategoryEnum.SIDE,
        }),
        createTestItemData({
          id: 'side-2',
          name: 'Onion Rings',
          category: ItemCategoryEnum.SIDE,
        }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(2);
      expect(result[0].category).toBe(ItemCategoryEnum.SIDE);
      expect(result[1].category).toBe(ItemCategoryEnum.SIDE);
    });

    it('deve encontrar itens pela categoria DESSERT', async () => {
      
      const category = ItemCategoryEnum.DESSERT;
      const repositoryResponse = [
        createTestItemData({
          id: 'dessert-1',
          name: 'Sorvete de Chocolate',
          category: ItemCategoryEnum.DESSERT,
        }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe(ItemCategoryEnum.DESSERT);
      expect(result[0].name).toBe('Sorvete de Chocolate');
    });

    it('deve retornar array vazio quando não há itens da categoria', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      mockItemRepository.findByCategory.mockResolvedValue([]);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve criar novas instâncias de Item para todos os itens retornados', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const repositoryResponse = [
        createTestItemData({ id: 'item-1' }),
        createTestItemData({ id: 'item-2' }),
        createTestItemData({ id: 'item-3' }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(3);
      result.forEach((item, index) => {
        expect(item).toBeInstanceOf(Item);
        expect(item).not.toBe(repositoryResponse[index]); 
        expect(item.id).toBe(repositoryResponse[index].id);
      });
    });

    it('deve propagar erro do repositório quando busca por categoria falha', async () => {
      
      const category = ItemCategoryEnum.BEVERAGE;
      const repositoryError = new Error('Erro ao buscar itens por categoria');

      mockItemRepository.findByCategory.mockRejectedValue(repositoryError);

      
      await expect(
        itemGateway.findByCategory(category)
      ).rejects.toThrow('Erro ao buscar itens por categoria');

      expect(mockItemRepository.findByCategory).toHaveBeenCalledWith(category);
    });

    it('deve lidar com muitos itens retornados', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const manyItems = Array.from({ length: 50 }, (_, i) =>
        createTestItemData({
          id: `item-${i + 1}`,
          name: `Sandwich ${i + 1}`,
          category: ItemCategoryEnum.SANDWICH,
        })
      );

      mockItemRepository.findByCategory.mockResolvedValue(manyItems);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(50);
      result.forEach((item, index) => {
        expect(item).toBeInstanceOf(Item);
        expect(item.name).toBe(`Sandwich ${index + 1}`);
        expect(item.category).toBe(ItemCategoryEnum.SANDWICH);
      });
    });
  });

  describe('findByNameAndDescription', () => {
    it('deve encontrar item existente por nome e descrição', async () => {
      
      const name = 'Big Mac';
      const description = 'Hambúrguer delicioso';
      mockItemRepository.findByNameAndDescription.mockResolvedValue(true);

      
      const result = await itemGateway.findByNameAndDescription(name, description);

      
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledWith(name, description);
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('deve retornar false quando item não existe', async () => {
      
      const name = 'Item Inexistente';
      const description = 'Descrição inexistente';
      mockItemRepository.findByNameAndDescription.mockResolvedValue(false);

      
      const result = await itemGateway.findByNameAndDescription(name, description);

      
      expect(result).toBe(false);
    });

    it('deve buscar com nomes e descrições diferentes', async () => {
      
      const name1 = 'Hambúrguer';
      const description1 = 'De carne';
      const name2 = 'Hambúrguer';
      const description2 = 'De frango';

      mockItemRepository.findByNameAndDescription
        .mockResolvedValueOnce(false) 
        .mockResolvedValueOnce(true); 

      
      const result1 = await itemGateway.findByNameAndDescription(name1, description1);
      const result2 = await itemGateway.findByNameAndDescription(name2, description2);

      
      expect(result1).toBe(false);
      expect(result2).toBe(true);
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erro do repositório quando busca falha', async () => {
      
      const name = 'Big Mac';
      const description = 'Hambúrguer delicioso';
      const repositoryError = new Error('Erro de conexão com banco');

      mockItemRepository.findByNameAndDescription.mockRejectedValue(repositoryError);

      
      await expect(
        itemGateway.findByNameAndDescription(name, description)
      ).rejects.toThrow('Erro de conexão com banco');

      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledWith(name, description);
    });

    it('deve lidar com strings vazias', async () => {
      
      const emptyName = '';
      const emptyDescription = '';
      mockItemRepository.findByNameAndDescription.mockResolvedValue(false);

      
      const result = await itemGateway.findByNameAndDescription(emptyName, emptyDescription);

      
      expect(result).toBe(false);
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledWith('', '');
    });

    it('deve lidar com strings muito longas', async () => {
      
      const longName = 'N'.repeat(500);
      const longDescription = 'D'.repeat(1000);
      mockItemRepository.findByNameAndDescription.mockResolvedValue(true);

      
      const result = await itemGateway.findByNameAndDescription(longName, longDescription);

      
      expect(result).toBe(true);
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledWith(longName, longDescription);
    });

    it('deve lidar com caracteres especiais no nome e descrição', async () => {
      
      const specialName = 'Big Mac® @#$%';
      const specialDescription = 'Hambúrguer™ com molho especial & ingredientes únicos';
      mockItemRepository.findByNameAndDescription.mockResolvedValue(false);

      
      const result = await itemGateway.findByNameAndDescription(specialName, specialDescription);

      
      expect(result).toBe(false);
      expect(mockItemRepository.findByNameAndDescription).toHaveBeenCalledWith(specialName, specialDescription);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com repositório retornando null em create', async () => {
      
      const itemData = createTestItem();
      mockItemRepository.create.mockResolvedValue(null as any);

      
      await expect(itemGateway.create(itemData)).rejects.toThrow();
    });

    it('deve lidar com repositório retornando null em findByIdIfNotDeleted', async () => {
      
      const itemId = 'item-123';
      mockItemRepository.findByIdIfNotDeleted.mockResolvedValue(null as any);

      
      await expect(itemGateway.findByIdIfNotDeleted(itemId, false)).rejects.toThrow();
    });

    it('deve lidar com repositório retornando null em update', async () => {
      
      const itemId = 'item-123';
      const itemData = createTestItem();
      mockItemRepository.update.mockResolvedValue(null as any);

      
      await expect(itemGateway.update(itemId, itemData)).rejects.toThrow();
    });

    it('deve validar integridade dos dados ao mapear arrays de itens', async () => {
      
      const category = ItemCategoryEnum.SANDWICH;
      const repositoryResponse = [
        createTestItemData({ id: 'item-1', name: 'Item 1' }),
        createTestItemData({ id: 'item-2', name: 'Item 2' }),
      ];

      mockItemRepository.findByCategory.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.findByCategory(category);

      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('item-1');
      expect(result[0].name).toBe('Item 1');
      expect(result[1].id).toBe('item-2');
      expect(result[1].name).toBe('Item 2');
    });

    it('deve manter consistência de tipos ao retornar Item instances', async () => {
      
      const itemData = createTestItem();
      const repositoryResponse = createTestItemData();

      mockItemRepository.create.mockResolvedValue(repositoryResponse);

      
      const result = await itemGateway.create(itemData);

      
      expect(result.constructor.name).toBe('Item');
      expect(typeof result.id).toBe('string');
      expect(typeof result.name).toBe('string');
      expect(typeof result.price).toBe('number');
      expect(typeof result.quantity).toBe('number');
      expect(Array.isArray(result.images)).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(typeof result.isDeleted).toBe('boolean');
    });
  });
});