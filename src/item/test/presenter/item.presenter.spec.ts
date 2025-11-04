import { ItemPresenter } from '../../presenter/item.presenter';
import Item, { ItemProps } from '../../entities/item.entity';
import ItemCategoryEnum from '../../entities/itemCategory.enum';

describe('ItemPresenter', () => {
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
    it('deve transformar item para formato de resposta com todas as propriedades', () => {
      const item = createMockItem();

      const result = ItemPresenter.toResponse(item);

      expect(result).toEqual({
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

    it('deve tratar item com id indefinido', () => {
      const item = createMockItem({ id: undefined });

      const result = ItemPresenter.toResponse(item);

      expect(result.id).toBe('');
      expect(result.name).toBe('Big Mac');
    });

    it('deve tratar item sem id (caso null)', () => {
      const itemProps: ItemProps = {
        name: 'Item de Teste',
        description: 'Descrição de teste',
        images: ['test.jpg'],
        quantity: 5,
        price: 15.50,
        category: ItemCategoryEnum.BEVERAGE,
        createdAt: mockDate,
        updatedAt: mockDate,
        isDeleted: false
      };
      
      const item = new Item(itemProps);

      const result = ItemPresenter.toResponse(item);

      expect(result.id).toBe('');
      expect(result.name).toBe('Item de Teste');
      expect(result.description).toBe('Descrição de teste');
    });

    it('deve preservar todas as categorias de item corretamente', () => {
      const categories = Object.values(ItemCategoryEnum);
      
      categories.forEach(category => {
        const item = createMockItem({ category });
        const result = ItemPresenter.toResponse(item);
        
        expect(result.category).toBe(category);
      });
    });

    it('deve tratar categoria SANDWICH', () => {
      const item = createMockItem({ category: ItemCategoryEnum.SANDWICH });

      const result = ItemPresenter.toResponse(item);

      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
    });

    it('deve tratar categoria BEVERAGE', () => {
      const item = createMockItem({ category: ItemCategoryEnum.BEVERAGE });

      const result = ItemPresenter.toResponse(item);

      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve tratar categoria SIDE', () => {
      const item = createMockItem({ category: ItemCategoryEnum.SIDE });

      const result = ItemPresenter.toResponse(item);

      expect(result.category).toBe(ItemCategoryEnum.SIDE);
    });

    it('deve tratar categoria DESSERT', () => {
      const item = createMockItem({ category: ItemCategoryEnum.DESSERT });

      const result = ItemPresenter.toResponse(item);

      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('deve preservar preço com casas decimais', () => {
      const item = createMockItem({ price: 15.75 });

      const result = ItemPresenter.toResponse(item);

      expect(result.price).toBe(15.75);
    });

    it('deve tratar preço muito pequeno', () => {
      const item = createMockItem({ price: 0.01 });

      const result = ItemPresenter.toResponse(item);

      expect(result.price).toBe(0.01);
    });

    it('deve tratar preço grande', () => {
      const item = createMockItem({ price: 999.99 });

      const result = ItemPresenter.toResponse(item);

      expect(result.price).toBe(999.99);
    });

    it('deve preservar quantidade corretamente', () => {
      const item = createMockItem({ quantity: 100 });

      const result = ItemPresenter.toResponse(item);

      expect(result.quantity).toBe(100);
    });

    it('deve tratar imagem única', () => {
      const item = createMockItem({ images: ['single-image.jpg'] });

      const result = ItemPresenter.toResponse(item);

      expect(result.images).toEqual(['single-image.jpg']);
    });

    it('deve tratar múltiplas imagens', () => {
      const images = ['img1.jpg', 'img2.png', 'img3.gif', 'img4.webp'];
      const item = createMockItem({ images });

      const result = ItemPresenter.toResponse(item);

      expect(result.images).toEqual(images);
    });

    it('deve preservar datas corretamente', () => {
      const createdAt = new Date('2023-06-15T08:30:00.000Z');
      const updatedAt = new Date('2023-06-16T14:45:00.000Z');
      
      const item = createMockItem({ createdAt, updatedAt });

      const result = ItemPresenter.toResponse(item);

      expect(result.createdAt).toBe(createdAt);
      expect(result.updatedAt).toBe(updatedAt);
    });

    it('deve tratar isDeleted como true', () => {
      const item = createMockItem({ isDeleted: true });

      const result = ItemPresenter.toResponse(item);

      expect(result.isDeleted).toBe(true);
    });

    it('deve tratar isDeleted como false', () => {
      const item = createMockItem({ isDeleted: false });

      const result = ItemPresenter.toResponse(item);

      expect(result.isDeleted).toBe(false);
    });

    it('deve tratar nome e descrição longos', () => {
      const longName = 'A'.repeat(100);
      const longDescription = 'B'.repeat(500);
      
      const item = createMockItem({ 
        name: longName, 
        description: longDescription 
      });

      const result = ItemPresenter.toResponse(item);

      expect(result.name).toBe(longName);
      expect(result.description).toBe(longDescription);
    });

    it('deve retornar objeto compatível com a interface ItemProps', () => {
      const item = createMockItem();

      const result = ItemPresenter.toResponse(item);

      // Verifica se todas as propriedades obrigatórias existem
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('images');
      expect(result).toHaveProperty('quantity');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('category');
      
      // Verifica se propriedades opcionais existem
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('isDeleted');
      
      // Verifica tipos
      expect(typeof result.name).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(Array.isArray(result.images)).toBe(true);
      expect(typeof result.quantity).toBe('number');
      expect(typeof result.price).toBe('number');
      expect(Object.values(ItemCategoryEnum)).toContain(result.category);
      expect(typeof result.id).toBe('string');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(typeof result.isDeleted).toBe('boolean');
    });

    it('deve criar nova instância de objeto a cada chamada', () => {
      const item = createMockItem();

      const result1 = ItemPresenter.toResponse(item);
      const result2 = ItemPresenter.toResponse(item);

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('deve tratar caso extremo com item válido mínimo', () => {
      const minimalProps: ItemProps = {
        name: 'A',
        description: 'B',
        images: ['c.jpg'],
        quantity: 1,
        price: 0.01,
        category: ItemCategoryEnum.SIDE
      };
      
      const item = new Item(minimalProps);

      const result = ItemPresenter.toResponse(item);

      expect(result.name).toBe('A');
      expect(result.description).toBe('B');
      expect(result.images).toEqual(['c.jpg']);
      expect(result.quantity).toBe(1);
      expect(result.price).toBe(0.01);
      expect(result.category).toBe(ItemCategoryEnum.SIDE);
      expect(result.id).toBe('');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.isDeleted).toBe(false);
    });

    it('deve ser determinístico - mesma entrada produz mesma saída', () => {
      const item = createMockItem();

      const result1 = ItemPresenter.toResponse(item);
      const result2 = ItemPresenter.toResponse(item);

      expect(result1).toEqual(result2);
    });

    it('deve tratar caracteres especiais no nome e descrição', () => {
      const specialName = 'Café & Restaurante - Menu "Especial"!';
      const specialDescription = 'Contém: nozes, laticínios e glúten. Preço: R$ 15,99 (impostos inclusos)';
      
      const item = createMockItem({ 
        name: specialName, 
        description: specialDescription 
      });

      const result = ItemPresenter.toResponse(item);

      expect(result.name).toBe(specialName);
      expect(result.description).toBe(specialDescription);
    });

    it('deve tratar várias extensões de arquivo de imagem', () => {
      const images = [
        'foto.jpg',
        'imagem.jpeg', 
        'pic.png',
        'grafico.gif',
        'moderno.webp',
        'vetor.svg'
      ];
      
      const item = createMockItem({ images });

      const result = ItemPresenter.toResponse(item);

      expect(result.images).toEqual(images);
    });
  });
});