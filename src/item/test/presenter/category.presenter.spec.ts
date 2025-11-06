import { CategoryPresenter } from '../../presenter/category.presenter';
import Item, { ItemProps } from '../../entities/item.entity';
import ItemCategoryEnum from '../../entities/itemCategory.enum';

describe('CategoryPresenter', () => {
  const mockDate = new Date('2023-01-01T10:00:00.000Z');

  const createMockItem = (overrides: Partial<ItemProps> = {}): Item => {
    const defaultProps: ItemProps = {
      id: 'test-id-1',
      name: 'Big Mac',
      description: 'Hambúrguer delicioso com molho especial',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 10,
      price: 25.99,
      category: ItemCategoryEnum.SANDWICH,
      createdAt: mockDate,
      updatedAt: mockDate,
      isDeleted: false,
      ...overrides
    };

    return new Item(defaultProps);
  };

  describe('toResponse', () => {
    it('deve transformar item único para formato de resposta', () => {
      const item = createMockItem();
      const items = [item];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'test-id-1',
        name: 'Big Mac',
        description: 'Hambúrguer delicioso com molho especial',
        price: 25.99,
        quantity: 10,
        images: ['image1.jpg', 'image2.jpg'],
        category: ItemCategoryEnum.SANDWICH,
        updatedAt: mockDate,
        createdAt: mockDate,
        isDeleted: false
      });
    });

    it('deve transformar múltiplos itens para formato de resposta', () => {
      const item1 = createMockItem({
        id: 'item-1',
        name: 'Big Mac',
        category: ItemCategoryEnum.SANDWICH
      });
      
      const item2 = createMockItem({
        id: 'item-2',
        name: 'Coca Cola',
        description: 'Bebida refrescante',
        category: ItemCategoryEnum.BEVERAGE,
        price: 5.99,
        quantity: 50
      });

      const items = [item1, item2];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        id: 'item-1',
        name: 'Big Mac',
        description: 'Hambúrguer delicioso com molho especial',
        price: 25.99,
        quantity: 10,
        images: ['image1.jpg', 'image2.jpg'],
        category: ItemCategoryEnum.SANDWICH,
        updatedAt: mockDate,
        createdAt: mockDate,
        isDeleted: false
      });

      expect(result[1]).toEqual({
        id: 'item-2',
        name: 'Coca Cola',
        description: 'Bebida refrescante',
        price: 5.99,
        quantity: 50,
        images: ['image1.jpg', 'image2.jpg'],
        category: ItemCategoryEnum.BEVERAGE,
        updatedAt: mockDate,
        createdAt: mockDate,
        isDeleted: false
      });
    });

    it('deve tratar array vazio', () => {
      const result = CategoryPresenter.toResponse([]);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve tratar item com id indefinido', () => {
      const item = createMockItem({ id: undefined });
      const items = [item];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('');
    });

    it('deve tratar item com id nulo', () => {
      const itemProps: ItemProps = {
        name: 'Item de Teste',
        description: 'Descrição de teste',
        images: ['test.jpg'],
        quantity: 1,
        price: 10.00,
        category: ItemCategoryEnum.SIDE,
        createdAt: mockDate,
        updatedAt: mockDate,
        isDeleted: false
      };
      
      const item = new Item(itemProps);
      const items = [item];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('');
    });

    it('deve preservar todas as categorias de item corretamente', () => {
      const categories = Object.values(ItemCategoryEnum);
      const items = categories.map((category, index) => 
        createMockItem({
          id: `item-${index}`,
          name: `Item ${index}`,
          category
        })
      );

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(categories.length);
      categories.forEach((category, index) => {
        expect(result[index].category).toBe(category);
      });
    });

    it('deve tratar itens com diferentes estados isDeleted', () => {
      const activeItem = createMockItem({ id: 'active-item', isDeleted: false });
      const deletedItem = createMockItem({ id: 'deleted-item', isDeleted: true });
      const items = [activeItem, deletedItem];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(2);
      expect(result[0].isDeleted).toBe(false);
      expect(result[1].isDeleted).toBe(true);
    });

    it('deve tratar itens com valores de data diferentes', () => {
      const date1 = new Date('2023-01-01T10:00:00.000Z');
      const date2 = new Date('2023-02-01T15:30:00.000Z');
      
      const item1 = createMockItem({ 
        id: 'item-1', 
        createdAt: date1, 
        updatedAt: date1 
      });
      
      const item2 = createMockItem({ 
        id: 'item-2', 
        createdAt: date2, 
        updatedAt: date2 
      });

      const items = [item1, item2];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(2);
      expect(result[0].createdAt).toBe(date1);
      expect(result[0].updatedAt).toBe(date1);
      expect(result[1].createdAt).toBe(date2);
      expect(result[1].updatedAt).toBe(date2);
    });

    it('deve tratar itens com vários valores de preço e quantidade', () => {
      const expensiveItem = createMockItem({ 
        id: 'expensive', 
        price: 999.99, 
        quantity: 1 
      });
      
      const cheapItem = createMockItem({ 
        id: 'cheap', 
        price: 0.01, 
        quantity: 1000 
      });

      const items = [expensiveItem, cheapItem];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(999.99);
      expect(result[0].quantity).toBe(1);
      expect(result[1].price).toBe(0.01);
      expect(result[1].quantity).toBe(1000);
    });

    it('deve tratar itens com diferentes arrays de imagens', () => {
      const singleImageItem = createMockItem({ 
        id: 'single-image', 
        images: ['unica.jpg'] 
      });
      
      const multipleImagesItem = createMockItem({ 
        id: 'multiple-images', 
        images: ['imagem1.jpg', 'imagem2.jpg', 'imagem3.jpg', 'imagem4.jpg'] 
      });

      const items = [singleImageItem, multipleImagesItem];

      const result = CategoryPresenter.toResponse(items);

      expect(result).toHaveLength(2);
      expect(result[0].images).toEqual(['unica.jpg']);
      expect(result[1].images).toEqual(['imagem1.jpg', 'imagem2.jpg', 'imagem3.jpg', 'imagem4.jpg']);
    });

    it('deve manter imutabilidade do objeto', () => {
      const originalItem = createMockItem();
      const items = [originalItem];

      const result = CategoryPresenter.toResponse(items);

      // Modifica o resultado
      result[0].name = 'Nome Modificado';
      result[0].price = 999.99;

      // Item original deve permanecer inalterado
      expect(originalItem.name).toBe('Big Mac');
      expect(originalItem.price).toBe(25.99);
    });

    it('deve retornar nova instância de array', () => {
      const items = [createMockItem()];

      const result1 = CategoryPresenter.toResponse(items);
      const result2 = CategoryPresenter.toResponse(items);

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('deve tratar arrays grandes eficientemente', () => {
      const largeItemArray = Array.from({ length: 100 }, (_, index) => 
        createMockItem({ 
          id: `item-${index}`,
          name: `Item ${index}`,
          price: index + 1
        })
      );

      const result = CategoryPresenter.toResponse(largeItemArray);

      expect(result).toHaveLength(100);
      expect(result[0].name).toBe('Item 0');
      expect(result[99].name).toBe('Item 99');
      expect(result[0].price).toBe(1);
      expect(result[99].price).toBe(100);
    });
  });
});