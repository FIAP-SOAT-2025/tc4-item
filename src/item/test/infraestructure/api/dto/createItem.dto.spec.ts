import { validate } from 'class-validator';
import { CreateItemDto } from '../../../../infraestructure/api/dto/createItem.dto';
import ItemCategoryEnum from '../../../../entities/itemCategory.enum';

describe('CreateItemDto', () => {
  describe('constructor', () => {
    it('deve criar instância com todos os parâmetros válidos', () => {
      const dto = new CreateItemDto(
        'Big Mac',
        'Hambúrguer delicioso com molho especial',
        ['image1.jpg', 'image2.jpg'],
        25.99,
        10,
        ItemCategoryEnum.SANDWICH,
      );

      expect(dto.name).toBe('Big Mac');
      expect(dto.description).toBe('Hambúrguer delicioso com molho especial');
      expect(dto.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(dto.price).toBe(25.99);
      expect(dto.quantity).toBe(10);
      expect(dto.category).toBe(ItemCategoryEnum.SANDWICH);
    });

    it('deve criar instância com categoria BEVERAGE', () => {
      const dto = new CreateItemDto(
        'Coca Cola',
        'Bebida refrescante',
        ['coca.jpg'],
        5.99,
        50,
        ItemCategoryEnum.BEVERAGE,
      );

      expect(dto.category).toBe(ItemCategoryEnum.BEVERAGE);
    });

    it('deve criar instância com múltiplas imagens', () => {
      const images = ['img1.jpg', 'img2.png', 'img3.gif'];
      const dto = new CreateItemDto(
        'Pizza',
        'Pizza deliciosa',
        images,
        35.90,
        5,
        ItemCategoryEnum.SANDWICH,
      );

      expect(dto.images).toEqual(images);
      expect(dto.images.length).toBe(3);
    });
  });

  describe('validações', () => {
    describe('name', () => {
      it('deve validar nome válido', async () => {
        const dto = new CreateItemDto(
          'Nome Válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('deve falhar para nome vazio', async () => {
        const dto = new CreateItemDto(
          '',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors.length).toBeGreaterThan(0);
        expect(nameErrors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('deve falhar para nome que não é string', async () => {
        const dto = new CreateItemDto(
          123 as any,
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors.length).toBeGreaterThan(0);
        expect(nameErrors[0].constraints).toHaveProperty('isString');
      });

      it('deve aceitar nome com caracteres especiais', async () => {
        const dto = new CreateItemDto(
          'Café & Açúcar - Especial!',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.DESSERT,
        );

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });
    });

    describe('description', () => {
      it('deve validar descrição válida', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição detalhada do produto',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors).toHaveLength(0);
      });

      it('deve falhar para descrição vazia', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          '',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors.length).toBeGreaterThan(0);
        expect(descErrors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('deve aceitar descrição longa', async () => {
        const longDescription = 'A'.repeat(500);
        const dto = new CreateItemDto(
          'Nome válido',
          longDescription,
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors).toHaveLength(0);
      });
    });

    describe('price', () => {
      it('deve validar preço válido', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          25.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve falhar para preço que não é número', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          'não é número' as any,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors.length).toBeGreaterThan(0);
        expect(priceErrors[0].constraints).toHaveProperty('isNumber');
      });

      it('deve aceitar preços decimais', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          15.75,
          5,
          ItemCategoryEnum.BEVERAGE,
        );

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve aceitar preços inteiros', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          20,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });
    });

    describe('quantity', () => {
      it('deve validar quantidade válida', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          15,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors).toHaveLength(0);
      });

      it('deve falhar para quantidade que não é número inteiro', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          15.5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors.length).toBeGreaterThan(0);
        expect(quantityErrors[0].constraints).toHaveProperty('isInt');
      });

      it('deve falhar para quantidade que não é número', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          'não é número' as any,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors.length).toBeGreaterThan(0);
      });
    });

    describe('images', () => {
      it('deve validar array de imagens válido', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['img1.jpg', 'img2.png'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors).toHaveLength(0);
      });

      it('deve falhar para array vazio', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          [],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
        expect(imagesErrors[0].constraints).toHaveProperty('arrayNotEmpty');
      });

      it('deve falhar quando não é array', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          'não é array' as any,
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
        expect(imagesErrors[0].constraints).toHaveProperty('isArray');
      });

      it('deve falhar quando contém elementos não-string', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['img1.jpg', 123, 'img3.png'] as any,
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
      });

      it('deve falhar quando contém strings vazias', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['img1.jpg', '', 'img3.png'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
      });

      it('deve aceitar imagem única', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['unica-imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.DESSERT,
        );

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors).toHaveLength(0);
      });
    });

    describe('category', () => {
      it('deve validar categoria SANDWICH', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria BEVERAGE', async () => {
        const dto = new CreateItemDto(
          'Coca Cola',
          'Bebida gelada',
          ['coca.jpg'],
          5.99,
          20,
          ItemCategoryEnum.BEVERAGE,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria SIDE', async () => {
        const dto = new CreateItemDto(
          'Batata Frita',
          'Batata crocante',
          ['batata.jpg'],
          8.99,
          15,
          ItemCategoryEnum.SIDE,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria DESSERT', async () => {
        const dto = new CreateItemDto(
          'Sorvete',
          'Sorvete cremoso',
          ['sorvete.jpg'],
          12.99,
          10,
          ItemCategoryEnum.DESSERT,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve falhar para categoria inválida', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          'CATEGORIA_INVALIDA' as any,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors.length).toBeGreaterThan(0);
        expect(categoryErrors[0].constraints).toHaveProperty('isEnum');
      });

      it('deve falhar quando categoria não é fornecida', async () => {
        const dto = new CreateItemDto(
          'Nome válido',
          'Descrição válida',
          ['imagem.jpg'],
          10.99,
          5,
          undefined as any,
        );

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors.length).toBeGreaterThan(0);
        expect(categoryErrors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('validação completa do objeto', () => {
      it('deve passar na validação com todos os campos válidos', async () => {
        const dto = new CreateItemDto(
          'Big Mac Premium',
          'Hambúrguer gourmet com ingredientes selecionados',
          ['bigmac1.jpg', 'bigmac2.jpg'],
          35.90,
          8,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve falhar com múltiplos campos inválidos', async () => {
        const dto = new CreateItemDto(
          '', // nome vazio
          '', // descrição vazia
          [], // array vazio
          'preço' as any, // preço inválido
          15.5, // quantidade com decimal
          'CATEGORIA_INVALIDA' as any, // categoria inválida
        );

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);

        const fieldErrors = errors.map(error => error.property);
        expect(fieldErrors).toContain('name');
        expect(fieldErrors).toContain('description');
        expect(fieldErrors).toContain('images');
        expect(fieldErrors).toContain('price');
        expect(fieldErrors).toContain('quantity');
        expect(fieldErrors).toContain('category');
      });
    });

    describe('casos extremos', () => {
      it('deve aceitar valores mínimos válidos', async () => {
        const dto = new CreateItemDto(
          'A', // nome mínimo
          'B', // descrição mínima
          ['c.jpg'], // uma imagem
          0.01, // preço mínimo
          1, // quantidade mínima
          ItemCategoryEnum.SIDE,
        );

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve aceitar valores máximos razoáveis', async () => {
        const longName = 'A'.repeat(100);
        const longDescription = 'B'.repeat(1000);
        const manyImages = Array.from({ length: 10 }, (_, i) => `image${i}.jpg`);

        const dto = new CreateItemDto(
          longName,
          longDescription,
          manyImages,
          999.99,
          1000,
          ItemCategoryEnum.SANDWICH,
        );

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });
    });
  });
});