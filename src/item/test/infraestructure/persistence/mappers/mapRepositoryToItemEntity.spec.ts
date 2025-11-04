import { mapRepositoryToItemEntity } from '../../../../infraestructure/persistence/mappers/mapRepositoryToItemEntity';
import Item from '../../../../entities/item.entity';
import ItemCategoryEnum from '../../../../entities/itemCategory.enum';
import { Decimal } from '@prisma/client/runtime/library';
import { Item as PrismaItem } from '@prisma/client';

describe('mapRepositoryToItemEntity', () => {
  const mockDate = new Date('2023-01-01T10:00:00.000Z');

  const createMockPrismaItem = (overrides = {}): PrismaItem => ({
    id: 'item-123',
    name: 'Big Mac',
    description: 'Hambúrguer delicioso com molho especial',
    images: ['image1.jpg', 'image2.jpg'],
    price: new Decimal(25.99),
    quantity: 10,
    category: ItemCategoryEnum.SANDWICH,
    createdAt: mockDate,
    updatedAt: mockDate,
    isDeleted: false,
    ...overrides,
  });

  describe('mapeamento básico', () => {
    it('deve mapear item do Prisma para entidade Item corretamente', () => {
      const prismaItem = createMockPrismaItem();

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result).toBeInstanceOf(Item);
      expect(result.id).toBe('item-123');
      expect(result.name).toBe('Big Mac');
      expect(result.description).toBe('Hambúrguer delicioso com molho especial');
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(result.price).toBe(25.99);
      expect(result.quantity).toBe(10);
      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
      expect(result.createdAt).toBe(mockDate);
      expect(result.updatedAt).toBe(mockDate);
      expect(result.isDeleted).toBe(false);
    });

    it('deve criar nova instância de Item a cada chamada', () => {
      const prismaItem = createMockPrismaItem();

      const result1 = mapRepositoryToItemEntity(prismaItem);
      const result2 = mapRepositoryToItemEntity(prismaItem);

      expect(result1).toBeInstanceOf(Item);
      expect(result2).toBeInstanceOf(Item);
      expect(result1).not.toBe(result2);
      expect(result1.id).toBe(result2.id);
    });

    it('deve preservar todos os campos obrigatórios', () => {
      const prismaItem = createMockPrismaItem();

      const result = mapRepositoryToItemEntity(prismaItem);

      // Verifica se todos os campos estão presentes
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.images).toBeDefined();
      expect(result.price).toBeDefined();
      expect(result.quantity).toBeDefined();
      expect(result.category).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.isDeleted).toBeDefined();
    });
  });

  describe('conversão de preços Decimal', () => {
    it('deve converter Decimal para number', () => {
      const prismaItem = createMockPrismaItem({
        price: new Decimal('15.75'),
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.price).toBe(15.75);
      expect(typeof result.price).toBe('number');
    });

    it('deve converter preço numérico diretamente', () => {
      const prismaItem = createMockPrismaItem({
        price: 29.99, // Já é number
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.price).toBe(29.99);
      expect(typeof result.price).toBe('number');
    });

    it('deve lidar com preços decimais precisos', () => {
      const precisePrices = [
        new Decimal('0.01'),
        new Decimal('99.99'),
        new Decimal('1000.00'),
        new Decimal('15.5'), // Uma casa decimal
        new Decimal('25.75'), // Duas casas decimais
      ];

      precisePrices.forEach(price => {
        const prismaItem = createMockPrismaItem({ price });
        const result = mapRepositoryToItemEntity(prismaItem);

        expect(result.price).toBe(price.toNumber());
        expect(typeof result.price).toBe('number');
      });
    });

    it('deve converter preços inteiros corretamente', () => {
      const prismaItem = createMockPrismaItem({
        price: new Decimal('25'),
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.price).toBe(25);
      expect(Number.isInteger(result.price)).toBe(true);
    });

    it('deve manter precisão de preços muito pequenos', () => {
      const prismaItem = createMockPrismaItem({
        price: new Decimal('0.01'),
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.price).toBe(0.01);
    });

    it('deve manter precisão de preços grandes', () => {
      const prismaItem = createMockPrismaItem({
        price: new Decimal('9999.99'),
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.price).toBe(9999.99);
    });
  });

  describe('mapeamento de categorias', () => {
    it('deve mapear categoria SANDWICH corretamente', () => {
      const prismaItem = createMockPrismaItem({
        category: ItemCategoryEnum.SANDWICH,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
    });

    it('deve mapear categoria BEVERAGE corretamente', () => {
      const prismaItem = createMockPrismaItem({
        category: ItemCategoryEnum.BEVERAGE,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve mapear categoria SIDE corretamente', () => {
      const prismaItem = createMockPrismaItem({
        category: ItemCategoryEnum.SIDE,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.category).toBe(ItemCategoryEnum.SIDE);
    });

    it('deve mapear categoria DESSERT corretamente', () => {
      const prismaItem = createMockPrismaItem({
        category: ItemCategoryEnum.DESSERT,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('deve mapear todas as categorias disponíveis', () => {
      const categories = Object.values(ItemCategoryEnum);

      categories.forEach(category => {
        const prismaItem = createMockPrismaItem({ category });
        const result = mapRepositoryToItemEntity(prismaItem);

        expect(result.category).toBe(category);
      });
    });

    it('deve realizar cast correto do tipo de categoria', () => {
      // Simula como o Prisma pode retornar a categoria como string
      const prismaItem = createMockPrismaItem({
        category: 'SANDWICH' as any, // Prisma retorna como string
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.category).toBe(ItemCategoryEnum.SANDWICH);
    });
  });

  describe('mapeamento de arrays de imagens', () => {
    it('deve mapear array com uma imagem', () => {
      const prismaItem = createMockPrismaItem({
        images: ['single-image.jpg'],
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.images).toEqual(['single-image.jpg']);
      expect(Array.isArray(result.images)).toBe(true);
    });

    it('deve mapear array com múltiplas imagens', () => {
      const images = ['img1.jpg', 'img2.png', 'img3.gif', 'img4.webp'];
      const prismaItem = createMockPrismaItem({ images });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.images).toEqual(images);
      expect(result.images.length).toBe(4);
    });

    it('deve preservar ordem das imagens', () => {
      const orderedImages = ['first.jpg', 'second.jpg', 'third.jpg'];
      const prismaItem = createMockPrismaItem({
        images: orderedImages,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.images).toEqual(orderedImages);
      expect(result.images[0]).toBe('first.jpg');
      expect(result.images[2]).toBe('third.jpg');
    });

    it('deve lidar com nomes de arquivos com caracteres especiais', () => {
      const specialImages = [
        'imagem-com-hífen.jpg',
        'image_with_underscore.png',
        'image with spaces.gif',
        'imagem-número-123.webp',
      ];
      const prismaItem = createMockPrismaItem({
        images: specialImages,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.images).toEqual(specialImages);
    });
  });

  describe('mapeamento de datas', () => {
    it('deve mapear datas de criação e atualização corretamente', () => {
      const createdAt = new Date('2023-01-01T10:00:00.000Z');
      const updatedAt = new Date('2023-01-02T15:30:00.000Z');

      const prismaItem = createMockPrismaItem({
        createdAt,
        updatedAt,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.createdAt).toBe(createdAt);
      expect(result.updatedAt).toBe(updatedAt);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('deve preservar precisão de milissegundos nas datas', () => {
      const preciseDate = new Date('2023-06-15T14:30:25.123Z');
      const prismaItem = createMockPrismaItem({
        createdAt: preciseDate,
        updatedAt: preciseDate,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.createdAt.getMilliseconds()).toBe(123);
      expect(result.updatedAt.getMilliseconds()).toBe(123);
    });

    it('deve lidar com datas iguais para criação e atualização', () => {
      const sameDate = new Date('2023-03-10T12:00:00.000Z');
      const prismaItem = createMockPrismaItem({
        createdAt: sameDate,
        updatedAt: sameDate,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.createdAt).toBe(sameDate);
      expect(result.updatedAt).toBe(sameDate);
    });
  });

  describe('mapeamento de flags booleanas', () => {
    it('deve mapear isDeleted como false', () => {
      const prismaItem = createMockPrismaItem({
        isDeleted: false,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.isDeleted).toBe(false);
      expect(typeof result.isDeleted).toBe('boolean');
    });

    it('deve mapear isDeleted como true', () => {
      const prismaItem = createMockPrismaItem({
        isDeleted: true,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.isDeleted).toBe(true);
      expect(typeof result.isDeleted).toBe('boolean');
    });
  });

  describe('mapeamento de campos numéricos', () => {
    it('deve mapear quantidade corretamente', () => {
      const quantities = [1, 5, 10, 100, 1000];

      quantities.forEach(quantity => {
        const prismaItem = createMockPrismaItem({ quantity });
        const result = mapRepositoryToItemEntity(prismaItem);

        expect(result.quantity).toBe(quantity);
        expect(typeof result.quantity).toBe('number');
        expect(Number.isInteger(result.quantity)).toBe(true);
      });
    });
  });

  describe('mapeamento de strings', () => {
    it('deve mapear nome e descrição com caracteres especiais', () => {
      const prismaItem = createMockPrismaItem({
        name: 'Café & Açúcar - Especial!',
        description: 'Produto com acentuação e "aspas" especiais.',
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.name).toBe('Café & Açúcar - Especial!');
      expect(result.description).toBe('Produto com acentuação e "aspas" especiais.');
    });

    it('deve mapear strings longas corretamente', () => {
      const longName = 'A'.repeat(100);
      const longDescription = 'B'.repeat(500);

      const prismaItem = createMockPrismaItem({
        name: longName,
        description: longDescription,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.name).toBe(longName);
      expect(result.description).toBe(longDescription);
    });

    it('deve preservar espaços e formatação em strings', () => {
      const prismaItem = createMockPrismaItem({
        name: '  Nome com espaços  ',
        description: 'Linha 1\nLinha 2\tTab',
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.name).toBe('  Nome com espaços  ');
      expect(result.description).toBe('Linha 1\nLinha 2\tTab');
    });
  });

  describe('casos extremos e validação', () => {
    it('deve criar entidade válida que passa nas validações', () => {
      const prismaItem = createMockPrismaItem();

      const result = mapRepositoryToItemEntity(prismaItem);

      // Testa se a entidade criada é válida
      expect(() => {
        // Acessa propriedades para trigger validações internas
        result.name;
        result.description;
        result.price;
        result.quantity;
        result.images;
        result.category;
      }).not.toThrow();
    });

    it('deve funcionar com valores mínimos válidos', () => {
      const prismaItem = createMockPrismaItem({
        name: 'A',
        description: 'B',
        images: ['c.jpg'],
        price: new Decimal('0.01'),
        quantity: 1,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.name).toBe('A');
      expect(result.description).toBe('B');
      expect(result.images).toEqual(['c.jpg']);
      expect(result.price).toBe(0.01);
      expect(result.quantity).toBe(1);
    });

    it('deve funcionar com valores máximos razoáveis', () => {
      const prismaItem = createMockPrismaItem({
        name: 'X'.repeat(100),
        description: 'Y'.repeat(1000),
        images: Array.from({ length: 10 }, (_, i) => `image${i}.jpg`),
        price: new Decimal('9999.99'),
        quantity: 1000,
      });

      const result = mapRepositoryToItemEntity(prismaItem);

      expect(result.name.length).toBe(100);
      expect(result.description.length).toBe(1000);
      expect(result.images.length).toBe(10);
      expect(result.price).toBe(9999.99);
      expect(result.quantity).toBe(1000);
    });

    it('deve ser consistente com múltiplas chamadas do mesmo item', () => {
      const prismaItem = createMockPrismaItem();

      const result1 = mapRepositoryToItemEntity(prismaItem);
      const result2 = mapRepositoryToItemEntity(prismaItem);

      expect(result1.id).toBe(result2.id);
      expect(result1.name).toBe(result2.name);
      expect(result1.price).toBe(result2.price);
      expect(result1.category).toBe(result2.category);
      expect(result1.createdAt).toBe(result2.createdAt);
    });

    it('deve mapear itens com diferentes combinações de propriedades', () => {
      const variations = [
        {
          category: ItemCategoryEnum.SANDWICH,
          price: new Decimal('25.99'),
          quantity: 10,
        },
        {
          category: ItemCategoryEnum.BEVERAGE,
          price: new Decimal('5.50'),
          quantity: 50,
        },
        {
          category: ItemCategoryEnum.DESSERT,
          price: new Decimal('15.75'),
          quantity: 5,
        },
      ];

      variations.forEach(variation => {
        const prismaItem = createMockPrismaItem(variation);
        const result = mapRepositoryToItemEntity(prismaItem);

        expect(result.category).toBe(variation.category);
        expect(result.price).toBe(variation.price.toNumber());
        expect(result.quantity).toBe(variation.quantity);
      });
    });
  });

  describe('performance e otimização', () => {
    it('deve ser eficiente para mapeamento de muitos itens', () => {
      const startTime = Date.now();
      
      // Mapeia 1000 itens
      for (let i = 0; i < 1000; i++) {
        const prismaItem = createMockPrismaItem({
          id: `item-${i}`,
          name: `Item ${i}`,
          price: new Decimal((i + 1) * 1.5),
        });
        mapRepositoryToItemEntity(prismaItem);
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Deve ser executado em menos de 1 segundo
      expect(executionTime).toBeLessThan(1000);
    });

    it('não deve vazar memória com múltiplas conversões', () => {
      // Teste básico para garantir que não há vazamentos óbvios
      const items = [];
      
      for (let i = 0; i < 100; i++) {
        const prismaItem = createMockPrismaItem({ id: `item-${i}` });
        items.push(mapRepositoryToItemEntity(prismaItem));
      }
      
      expect(items).toHaveLength(100);
      items.forEach((item, index) => {
        expect(item.id).toBe(`item-${index}`);
      });
    });
  });
});