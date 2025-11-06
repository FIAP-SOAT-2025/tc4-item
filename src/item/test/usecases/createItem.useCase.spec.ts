import CreateItemUseCase from '../../useCases/createItem.useCase';  
import Item from '../../entities/item.entity';
import { CreateItemInterface } from '../../interfaces/createItemInterface';
import ItemGatewayInterface from '../../interfaces/itemGatewayInterface';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('CreateItemUseCase', () => {
  let mockItemGateway: jest.Mocked<ItemGatewayInterface>;
  let validCreateItemData: CreateItemInterface;

  beforeEach(() => {
    mockItemGateway = {
      create: jest.fn(),
      findByIdIfNotDeleted: jest.fn(),
      update: jest.fn(),
      findByCategory: jest.fn(),
      findByNameAndDescription: jest.fn(),
    };

    validCreateItemData = {
      name: 'Big Mac',
      description: 'Delicious hamburger with special sauce',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 10,
      price: 25.99,
      category: ItemCategoryEnum.SANDWICH,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo item com sucesso quando o item não existe', async () => {
      const expectedItem = new Item({
        ...validCreateItemData,
        id: 'generated-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);
      const result = await CreateItemUseCase.create(validCreateItemData, mockItemGateway);

      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledWith(
        validCreateItemData.name,
        validCreateItemData.description
      );
      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledTimes(1);
      
      expect(mockItemGateway.create).toHaveBeenCalledTimes(1);
      expect(mockItemGateway.create).toHaveBeenCalledWith(expect.any(Item));
      
      const createdItemArg = mockItemGateway.create.mock.calls[0][0];
      expect(createdItemArg.name).toBe(validCreateItemData.name);
      expect(createdItemArg.description).toBe(validCreateItemData.description);
      expect(createdItemArg.price).toBe(validCreateItemData.price);
      expect(createdItemArg.quantity).toBe(validCreateItemData.quantity);
      expect(createdItemArg.category).toBe(validCreateItemData.category);
      expect(createdItemArg.images).toEqual(validCreateItemData.images);

      expect(result).toBe(expectedItem);
    });

    it('deve lançar BaseException quando o item já existe', async () => {
      mockItemGateway.findByNameAndDescription.mockResolvedValue(true);

      await expect(
        CreateItemUseCase.create(validCreateItemData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      await expect(
        CreateItemUseCase.create(validCreateItemData, mockItemGateway)
      ).rejects.toThrow('Item already exists. To adjust the quantity, use the edit option.');

      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledWith(
        validCreateItemData.name,
        validCreateItemData.description
      );
      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledTimes(2);
      expect(mockItemGateway.create).not.toHaveBeenCalled();
    });

    it('deve lançar BaseException com código de erro correto quando o item já existe', async () => {
      mockItemGateway.findByNameAndDescription.mockResolvedValue(true);

      try {
        await CreateItemUseCase.create(validCreateItemData, mockItemGateway);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).message).toBe('Item already exists. To adjust the quantity, use the edit option.');
        expect((error as BaseException).statusCode).toBe(400);
        expect((error as BaseException).errorCode).toBe('ITEM_ALREADY_EXISTS');
      }
    });

    it('deve criar item com categoria SANDWICH', async () => {
      const sandwichData = { ...validCreateItemData, category: ItemCategoryEnum.SANDWICH };
      const expectedItem = new Item(sandwichData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(sandwichData, mockItemGateway);

      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
    });

    it('deve criar item com categoria BEVERAGE', async () => {

      const beverageData = { 
        ...validCreateItemData, 
        category: ItemCategoryEnum.BEVERAGE,
        name: 'Coca Cola',
        description: 'Refrigerante refrescante'
      };
      const expectedItem = new Item(beverageData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(beverageData, mockItemGateway);

      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve criar item com categoria SIDE', async () => {
      const sideData = { 
        ...validCreateItemData, 
        category: ItemCategoryEnum.SIDE,
        name: 'Batata Frita',
        description: 'Batatas douradas crocantes'
      };
      const expectedItem = new Item(sideData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(sideData, mockItemGateway);

      expect(result.category).toBe(ItemCategoryEnum.SIDE);
    });

    it('deve criar item com categoria DESSERT', async () => {

      const dessertData = { 
        ...validCreateItemData, 
        category: ItemCategoryEnum.DESSERT,
        name: 'Sorvete',
        description: 'Sorvete de baunilha'
      };
      const expectedItem = new Item(dessertData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(dessertData, mockItemGateway);

      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('deve criar item com uma única imagem', async () => {

      const singleImageData = { 
        ...validCreateItemData, 
        images: ['imagem-unica.jpg']
      };
      const expectedItem = new Item(singleImageData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(singleImageData, mockItemGateway);

      expect(result.images).toEqual(['imagem-unica.jpg']);
      expect(result.images.length).toBe(1);
    });

    it('deve criar item com múltiplas imagens', async () => {

      const multipleImagesData = { 
        ...validCreateItemData, 
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']
      };
      const expectedItem = new Item(multipleImagesData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(multipleImagesData, mockItemGateway);

      expect(result.images).toEqual(['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']);
      expect(result.images.length).toBe(4);
    });

    it('deve lidar com preços decimais corretamente', async () => {
      const decimalPriceData = { 
        ...validCreateItemData, 
        price: 15.75
      };
      const expectedItem = new Item(decimalPriceData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(decimalPriceData, mockItemGateway);

      expect(result.price).toBe(15.75);
    });

    it('deve lidar com grandes quantidades corretamente', async () => {
      const largeQuantityData = { 
        ...validCreateItemData, 
        quantity: 1000
      };
      const expectedItem = new Item(largeQuantityData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(largeQuantityData, mockItemGateway);

      expect(result.quantity).toBe(1000);
    });

    it('deve propagar erros do gateway quando findByNameAndDescription falha', async () => {

      const gatewayError = new Error('Falha na conexão com o banco de dados');
      mockItemGateway.findByNameAndDescription.mockRejectedValue(gatewayError);

      await expect(
        CreateItemUseCase.create(validCreateItemData, mockItemGateway)
      ).rejects.toThrow('Falha na conexão com o banco de dados');

      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledTimes(1);
      expect(mockItemGateway.create).not.toHaveBeenCalled();
    });

    it('deve propagar erros do gateway quando create falha', async () => {

      const gatewayError = new BaseException('Falha ao criar item', 500, 'CREATION_ERROR');
      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockRejectedValue(gatewayError);

      await expect(
        CreateItemUseCase.create(validCreateItemData, mockItemGateway)
      ).rejects.toThrow(gatewayError);

      expect(mockItemGateway.findByNameAndDescription).toHaveBeenCalledTimes(1);
      expect(mockItemGateway.create).toHaveBeenCalledTimes(1);
    });

    it('deve validar dados do item através do construtor da entidade Item', async () => {
      const invalidItemData = {
        ...validCreateItemData,
        name: '',
      };

      await expect(
        CreateItemUseCase.create(invalidItemData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      expect(mockItemGateway.findByNameAndDescription).not.toHaveBeenCalled();
      expect(mockItemGateway.create).not.toHaveBeenCalled();
    });

    it('deve validar preço através do construtor da entidade Item', async () => {
      const invalidPriceData = {
        ...validCreateItemData,
        price: -10,
      };

      await expect(
        CreateItemUseCase.create(invalidPriceData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      expect(mockItemGateway.findByNameAndDescription).not.toHaveBeenCalled();
      expect(mockItemGateway.create).not.toHaveBeenCalled();
    });

    it('deve validar quantidade através do construtor da entidade Item', async () => {
      const invalidQuantityData = {
        ...validCreateItemData,
        quantity: 0,
      };

      await expect(
        CreateItemUseCase.create(invalidQuantityData, mockItemGateway)
      ).rejects.toThrow(BaseException);

      expect(mockItemGateway.findByNameAndDescription).not.toHaveBeenCalled();
      expect(mockItemGateway.create).not.toHaveBeenCalled();
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com nomes de itens muito longos', async () => {

      const longNameData = {
        ...validCreateItemData,
        name: 'A'.repeat(255),
      };
      const expectedItem = new Item(longNameData);

      mockItemGateway.findByNameAndDescription.mockResolvedValue(false);
      mockItemGateway.create.mockResolvedValue(expectedItem);

      const result = await CreateItemUseCase.create(longNameData, mockItemGateway);

      expect(result.name).toBe('A'.repeat(255));
    });

    it('deve lidar com itens com mesmo nome mas descrições diferentes', async () => {

      const itemData1 = {
        ...validCreateItemData,
        name: 'Hambúrguer',
        description: 'Hambúrguer de carne',
      };
      const itemData2 = {
        ...validCreateItemData,
        name: 'Hambúrguer',
        description: 'Hambúrguer de frango',
      };

      mockItemGateway.findByNameAndDescription
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);
      
      const expectedItem1 = new Item(itemData1);
      const expectedItem2 = new Item(itemData2);
      
      mockItemGateway.create
        .mockResolvedValueOnce(expectedItem1)
        .mockResolvedValueOnce(expectedItem2);

      const result1 = await CreateItemUseCase.create(itemData1, mockItemGateway);
      const result2 = await CreateItemUseCase.create(itemData2, mockItemGateway);
      
      expect(result1.name).toBe('Hambúrguer');
      expect(result1.description).toBe('Hambúrguer de carne');
      expect(result2.name).toBe('Hambúrguer');
      expect(result2.description).toBe('Hambúrguer de frango');
    });
  });
});