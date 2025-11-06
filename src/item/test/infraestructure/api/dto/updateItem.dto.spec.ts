import { validate } from 'class-validator';
import { UpdateItemDto } from '../../../../infraestructure/api/dto/updateItem.dto';
import ItemCategoryEnum from '../../../../entities/itemCategory.enum';

describe('UpdateItemDto', () => {
  describe('criação de instância', () => {
    it('deve criar instância vazia', () => {
      const dto = new UpdateItemDto();

      expect(dto.name).toBeUndefined();
      expect(dto.description).toBeUndefined();
      expect(dto.images).toBeUndefined();
      expect(dto.price).toBeUndefined();
      expect(dto.quantity).toBeUndefined();
      expect(dto.category).toBeUndefined();
    });

    it('deve permitir definir propriedades individualmente', () => {
      const dto = new UpdateItemDto();
      dto.name = 'Nome Atualizado';
      dto.price = 29.99;

      expect(dto.name).toBe('Nome Atualizado');
      expect(dto.price).toBe(29.99);
      expect(dto.description).toBeUndefined();
    });

    it('deve permitir definir todas as propriedades', () => {
      const dto = new UpdateItemDto();
      dto.name = 'Big Mac Atualizado';
      dto.description = 'Descrição atualizada';
      dto.images = ['nova-imagem1.jpg', 'nova-imagem2.jpg'];
      dto.price = 35.99;
      dto.quantity = 15;
      dto.category = ItemCategoryEnum.SANDWICH;

      expect(dto.name).toBe('Big Mac Atualizado');
      expect(dto.description).toBe('Descrição atualizada');
      expect(dto.images).toEqual(['nova-imagem1.jpg', 'nova-imagem2.jpg']);
      expect(dto.price).toBe(35.99);
      expect(dto.quantity).toBe(15);
      expect(dto.category).toBe(ItemCategoryEnum.SANDWICH);
    });
  });

  describe('validações', () => {
    describe('name (opcional)', () => {
      it('deve validar nome válido quando fornecido', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'Nome Válido Atualizado';

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('deve passar validação quando nome não é fornecido', async () => {
        const dto = new UpdateItemDto();
        // name não definido

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('deve falhar para nome que não é string', async () => {
        const dto = new UpdateItemDto();
        dto.name = 123 as any;

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors.length).toBeGreaterThan(0);
        expect(nameErrors[0].constraints).toHaveProperty('isString');
      });

      it('deve aceitar nome com caracteres especiais', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'Café & Açúcar - Edição Especial!';

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });

      it('deve aceitar string vazia (diferente do CreateItemDto)', async () => {
        const dto = new UpdateItemDto();
        dto.name = '';

        const errors = await validate(dto);
        const nameErrors = errors.filter(error => error.property === 'name');
        expect(nameErrors).toHaveLength(0);
      });
    });

    describe('description (opcional)', () => {
      it('deve validar descrição válida quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.description = 'Nova descrição detalhada do produto';

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors).toHaveLength(0);
      });

      it('deve passar validação quando descrição não é fornecida', async () => {
        const dto = new UpdateItemDto();
        // description não definido

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors).toHaveLength(0);
      });

      it('deve falhar para descrição que não é string', async () => {
        const dto = new UpdateItemDto();
        dto.description = 456 as any;

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors.length).toBeGreaterThan(0);
        expect(descErrors[0].constraints).toHaveProperty('isString');
      });

      it('deve aceitar descrição longa', async () => {
        const dto = new UpdateItemDto();
        dto.description = 'A'.repeat(1000);

        const errors = await validate(dto);
        const descErrors = errors.filter(error => error.property === 'description');
        expect(descErrors).toHaveLength(0);
      });
    });

    describe('images (opcional)', () => {
      it('deve validar array de imagens válido quando fornecido', async () => {
        const dto = new UpdateItemDto();
        dto.images = ['nova-img1.jpg', 'nova-img2.png'];

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors).toHaveLength(0);
      });

      it('deve passar validação quando imagens não são fornecidas', async () => {
        const dto = new UpdateItemDto();
        // images não definido

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors).toHaveLength(0);
      });

      it('deve falhar para array vazio quando fornecido', async () => {
        const dto = new UpdateItemDto();
        dto.images = [];

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
        expect(imagesErrors[0].constraints).toHaveProperty('arrayNotEmpty');
      });

      it('deve falhar quando não é array', async () => {
        const dto = new UpdateItemDto();
        dto.images = 'não é array' as any;

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
        expect(imagesErrors[0].constraints).toHaveProperty('isArray');
      });

      it('deve falhar quando contém elementos não-string', async () => {
        const dto = new UpdateItemDto();
        dto.images = ['img1.jpg', 123, 'img3.png'] as any;

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
      });

      it('deve falhar quando contém strings vazias', async () => {
        const dto = new UpdateItemDto();
        dto.images = ['img1.jpg', '', 'img3.png'];

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors.length).toBeGreaterThan(0);
      });

      it('deve aceitar imagem única', async () => {
        const dto = new UpdateItemDto();
        dto.images = ['unica-nova-imagem.jpg'];

        const errors = await validate(dto);
        const imagesErrors = errors.filter(error => error.property === 'images');
        expect(imagesErrors).toHaveLength(0);
      });
    });

    describe('price (opcional)', () => {
      it('deve validar preço válido quando fornecido', async () => {
        const dto = new UpdateItemDto();
        dto.price = 29.99;

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve passar validação quando preço não é fornecido', async () => {
        const dto = new UpdateItemDto();
        // price não definido

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve falhar para preço que não é número', async () => {
        const dto = new UpdateItemDto();
        dto.price = 'não é número' as any;

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors.length).toBeGreaterThan(0);
        expect(priceErrors[0].constraints).toHaveProperty('isNumber');
      });

      it('deve validar configuração de máximo 2 casas decimais', async () => {
        const dto = new UpdateItemDto();
        dto.price = 25.99; // 2 casas decimais

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve aceitar preços inteiros', async () => {
        const dto = new UpdateItemDto();
        dto.price = 30;

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });

      it('deve aceitar preços com uma casa decimal', async () => {
        const dto = new UpdateItemDto();
        dto.price = 25.5;

        const errors = await validate(dto);
        const priceErrors = errors.filter(error => error.property === 'price');
        expect(priceErrors).toHaveLength(0);
      });
    });

    describe('quantity (opcional)', () => {
      it('deve validar quantidade válida quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = 20;

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors).toHaveLength(0);
      });

      it('deve passar validação quando quantidade não é fornecida', async () => {
        const dto = new UpdateItemDto();
        // quantity não definido

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors).toHaveLength(0);
      });

      it('deve falhar para quantidade que não é número inteiro', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = 15.5;

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors.length).toBeGreaterThan(0);
        expect(quantityErrors[0].constraints).toHaveProperty('isInt');
      });

      it('deve falhar para quantidade que não é número', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = 'não é número' as any;

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors.length).toBeGreaterThan(0);
      });

      it('deve aceitar quantidade zero', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = 0;

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors).toHaveLength(0);
      });

      it('deve aceitar quantidade negativa (validação de negócio pode ser feita em outro lugar)', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = -1;

        const errors = await validate(dto);
        const quantityErrors = errors.filter(error => error.property === 'quantity');
        expect(quantityErrors).toHaveLength(0);
      });
    });

    describe('category (opcional)', () => {
      it('deve validar categoria SANDWICH quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.category = ItemCategoryEnum.SANDWICH;

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria BEVERAGE quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.category = ItemCategoryEnum.BEVERAGE;

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria SIDE quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.category = ItemCategoryEnum.SIDE;

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve validar categoria DESSERT quando fornecida', async () => {
        const dto = new UpdateItemDto();
        dto.category = ItemCategoryEnum.DESSERT;

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve passar validação quando categoria não é fornecida', async () => {
        const dto = new UpdateItemDto();
        // category não definido

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors).toHaveLength(0);
      });

      it('deve falhar para categoria inválida', async () => {
        const dto = new UpdateItemDto();
        dto.category = 'CATEGORIA_INVALIDA' as any;

        const errors = await validate(dto);
        const categoryErrors = errors.filter(error => error.property === 'category');
        expect(categoryErrors.length).toBeGreaterThan(0);
        expect(categoryErrors[0].constraints).toHaveProperty('isEnum');
      });
    });

    describe('validação completa do objeto', () => {
      it('deve passar na validação com todos os campos válidos', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'Big Mac Premium Atualizado';
        dto.description = 'Nova descrição do hambúrguer gourmet';
        dto.images = ['bigmac-new1.jpg', 'bigmac-new2.jpg'];
        dto.price = 39.90;
        dto.quantity = 12;
        dto.category = ItemCategoryEnum.SANDWICH;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve passar na validação com apenas alguns campos fornecidos', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'Apenas Nome Atualizado';
        dto.price = 25.50;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve passar na validação com objeto completamente vazio', async () => {
        const dto = new UpdateItemDto();

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve falhar com múltiplos campos inválidos', async () => {
        const dto = new UpdateItemDto();
        dto.name = 123 as any; // nome inválido
        dto.images = []; // array vazio
        dto.price = 'preço' as any; // preço inválido
        dto.quantity = 15.5; // quantidade com decimal
        dto.category = 'CATEGORIA_INVALIDA' as any; // categoria inválida

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);

        const fieldErrors = errors.map(error => error.property);
        expect(fieldErrors).toContain('name');
        expect(fieldErrors).toContain('images');
        expect(fieldErrors).toContain('price');
        expect(fieldErrors).toContain('quantity');
        expect(fieldErrors).toContain('category');
      });
    });

    describe('atualizações parciais específicas', () => {
      it('deve permitir atualizar apenas nome', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'Novo Nome do Produto';

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.name).toBe('Novo Nome do Produto');
        expect(dto.price).toBeUndefined();
      });

      it('deve permitir atualizar apenas preço', async () => {
        const dto = new UpdateItemDto();
        dto.price = 45.99;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.price).toBe(45.99);
        expect(dto.name).toBeUndefined();
      });

      it('deve permitir atualizar apenas categoria', async () => {
        const dto = new UpdateItemDto();
        dto.category = ItemCategoryEnum.DESSERT;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.category).toBe(ItemCategoryEnum.DESSERT);
        expect(dto.name).toBeUndefined();
      });

      it('deve permitir atualizar apenas quantidade', async () => {
        const dto = new UpdateItemDto();
        dto.quantity = 100;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.quantity).toBe(100);
        expect(dto.price).toBeUndefined();
      });

      it('deve permitir atualizar apenas imagens', async () => {
        const dto = new UpdateItemDto();
        dto.images = ['nova-foto1.jpg', 'nova-foto2.jpg'];

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.images).toEqual(['nova-foto1.jpg', 'nova-foto2.jpg']);
        expect(dto.name).toBeUndefined();
      });
    });

    describe('casos extremos', () => {
      it('deve aceitar valores mínimos válidos quando fornecidos', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'A'; // nome mínimo
        dto.description = 'B'; // descrição mínima
        dto.images = ['c.jpg']; // uma imagem
        dto.price = 0.01; // preço mínimo
        dto.quantity = 1; // quantidade mínima
        dto.category = ItemCategoryEnum.SIDE;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });

      it('deve aceitar valores máximos razoáveis quando fornecidos', async () => {
        const dto = new UpdateItemDto();
        dto.name = 'A'.repeat(100);
        dto.description = 'B'.repeat(1000);
        dto.images = Array.from({ length: 10 }, (_, i) => `image${i}.jpg`);
        dto.price = 999.99;
        dto.quantity = 1000;
        dto.category = ItemCategoryEnum.SANDWICH;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      });
    });
  });
});