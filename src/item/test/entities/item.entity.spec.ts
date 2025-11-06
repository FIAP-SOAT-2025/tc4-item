import Item, { ItemProps } from '../../entities/item.entity';
import ItemCategoryEnum from '../../entities/itemCategory.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('Item Entity', () => {
  const validItemProps: ItemProps = {
    name: 'Big Mac',
    description: 'Delicious hamburger with special sauce',
    images: ['image1.jpg', 'image2.jpg'],
    quantity: 10,
    price: 25.99,
    category: ItemCategoryEnum.SANDWICH,
  };

  describe('Constructor', () => {
    it('should create an item with valid properties', () => {
      const item = new Item(validItemProps);

      expect(item.name).toBe(validItemProps.name);
      expect(item.description).toBe(validItemProps.description);
      expect(item.images).toEqual(validItemProps.images);
      expect(item.quantity).toBe(validItemProps.quantity);
      expect(item.price).toBe(validItemProps.price);
      expect(item.category).toBe(validItemProps.category);
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
      expect(item.isDeleted).toBe(false);
      expect(item.id).toBeUndefined();
    });

    it('should create an item with provided id, createdAt, updatedAt and isDeleted', () => {
      const id = 'test-id';
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      const isDeleted = true;

      const props: ItemProps = {
        ...validItemProps,
        id,
        createdAt,
        updatedAt,
        isDeleted,
      };

      const item = new Item(props);

      expect(item.id).toBe(id);
      expect(item.createdAt).toBe(createdAt);
      expect(item.updatedAt).toBe(updatedAt);
      expect(item.isDeleted).toBe(isDeleted);
    });
  });

  describe('Name validation', () => {
    it('should throw error when name is empty string', () => {
      const props = { ...validItemProps, name: '' };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Name cannot be empty');
    });

    it('should throw error when name is only whitespace', () => {
      const props = { ...validItemProps, name: '   ' };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Name cannot be empty');
    });

    it('should throw error when name is null or undefined', () => {
      const propsWithNull = { ...validItemProps, name: null as any };
      const propsWithUndefined = { ...validItemProps, name: undefined as any };
      
      expect(() => new Item(propsWithNull)).toThrow(BaseException);
      expect(() => new Item(propsWithUndefined)).toThrow(BaseException);
    });

    it('should set name when valid', () => {
      const item = new Item(validItemProps);
      const newName = 'New Item Name';
      
      item.name = newName;
      
      expect(item.name).toBe(newName);
    });

    it('should throw BaseException with correct error code for empty name', () => {
      const props = { ...validItemProps, name: '' };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_NAME_EMPTY');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('Description validation', () => {
    it('should throw error when description is empty string', () => {
      const props = { ...validItemProps, description: '' };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Description cannot be empty');
    });

    it('should throw error when description is only whitespace', () => {
      const props = { ...validItemProps, description: '   ' };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Description cannot be empty');
    });

    it('should throw error when description is null or undefined', () => {
      const propsWithNull = { ...validItemProps, description: null as any };
      const propsWithUndefined = { ...validItemProps, description: undefined as any };
      
      expect(() => new Item(propsWithNull)).toThrow(BaseException);
      expect(() => new Item(propsWithUndefined)).toThrow(BaseException);
    });

    it('should set description when valid', () => {
      const item = new Item(validItemProps);
      const newDescription = 'New description';
      
      item.description = newDescription;
      
      expect(item.description).toBe(newDescription);
    });

    it('should throw BaseException with correct error code for empty description', () => {
      const props = { ...validItemProps, description: '' };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_DESCRIPTION_EMPTY');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('Images validation', () => {
    it('should throw error when images array is empty', () => {
      const props = { ...validItemProps, images: [] };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Images must be a non-empty');
    });

    it('should throw error when images is not an array', () => {
      const props = { ...validItemProps, images: 'not-an-array' as any };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Images must be a non-empty');
    });

    it('should throw error when images is null or undefined', () => {
      const propsWithNull = { ...validItemProps, images: null as any };
      const propsWithUndefined = { ...validItemProps, images: undefined as any };
      
      expect(() => new Item(propsWithNull)).toThrow(BaseException);
      expect(() => new Item(propsWithUndefined)).toThrow(BaseException);
    });

    it('should set images when valid array is provided', () => {
      const item = new Item(validItemProps);
      const newImages = ['new-image1.jpg', 'new-image2.jpg', 'new-image3.jpg'];
      
      item.images = newImages;
      
      expect(item.images).toEqual(newImages);
    });

    it('should accept single image in array', () => {
      const props = { ...validItemProps, images: ['single-image.jpg'] };
      const item = new Item(props);
      
      expect(item.images).toEqual(['single-image.jpg']);
    });

    it('should throw BaseException with correct error code for invalid images', () => {
      const props = { ...validItemProps, images: [] };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_IMAGES_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('Price validation', () => {
    it('should throw error when price is 0', () => {
      const props = { ...validItemProps, price: 0 };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Price cannot be 0 or less');
    });

    it('should throw error when price is negative', () => {
      const props = { ...validItemProps, price: -10.50 };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Price cannot be 0 or less');
    });

    it('should set price when positive value is provided', () => {
      const item = new Item(validItemProps);
      const newPrice = 99.99;
      
      item.price = newPrice;
      
      expect(item.price).toBe(newPrice);
    });

    it('should accept decimal prices', () => {
      const props = { ...validItemProps, price: 15.75 };
      const item = new Item(props);
      
      expect(item.price).toBe(15.75);
    });

    it('should throw BaseException with correct error code for invalid price', () => {
      const props = { ...validItemProps, price: -5 };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_PRICE_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('Quantity validation', () => {
    it('should throw error when quantity is 0', () => {
      const props = { ...validItemProps, quantity: 0 };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Quantity cannot be 0 or less');
    });

    it('should throw error when quantity is negative', () => {
      const props = { ...validItemProps, quantity: -5 };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Quantity cannot be 0 or less');
    });

    it('should set quantity when positive value is provided', () => {
      const item = new Item(validItemProps);
      const newQuantity = 100;
      
      item.quantity = newQuantity;
      
      expect(item.quantity).toBe(newQuantity);
    });

    it('should throw BaseException with correct error code for invalid quantity', () => {
      const props = { ...validItemProps, quantity: -1 };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_QUANTITY_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('updateItemQuantity method', () => {
    it('should reduce quantity when valid value is provided', () => {
      const item = new Item({ ...validItemProps, quantity: 20 });
      
      item.updateItemQuantity(5);
      
      expect(item.quantity).toBe(15);
    });

    it('should set quantity to 0 when reducing by exact amount', () => {
      const item = new Item({ ...validItemProps, quantity: 10 });
      
      item.updateItemQuantity(10);
      
      expect(item.quantity).toBe(0);
    });

    it('should throw error when trying to reduce by more than available quantity', () => {
      const item = new Item({ ...validItemProps, quantity: 5 });
      
      expect(() => item.updateItemQuantity(10)).toThrow(BaseException);
      expect(() => item.updateItemQuantity(10)).toThrow('Quantity cannot be less than current quantity');
    });

    it('should throw error when negative value is provided', () => {
      const item = new Item(validItemProps);
      
      expect(() => item.updateItemQuantity(-5)).toThrow(BaseException);
      expect(() => item.updateItemQuantity(-5)).toThrow('Quantity cannot be less than current quantity');
    });

    it('should not change quantity when 0 is provided', () => {
      const item = new Item({ ...validItemProps, quantity: 10 });
      const originalQuantity = item.quantity;
      
      item.updateItemQuantity(0);
      
      expect(item.quantity).toBe(originalQuantity);
    });

    it('should throw BaseException with correct error code when reducing by negative value', () => {
      const item = new Item(validItemProps);
      
      try {
        item.updateItemQuantity(-1);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_QUANTITY_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });

    it('should throw BaseException with correct error code when result would be negative', () => {
      const item = new Item({ ...validItemProps, quantity: 5 });
      
      try {
        item.updateItemQuantity(10);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_QUANTITY_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('Category validation', () => {
    it('should throw error for invalid category', () => {
      const props = { ...validItemProps, category: 'INVALID_CATEGORY' as any };
      
      expect(() => new Item(props)).toThrow(BaseException);
      expect(() => new Item(props)).toThrow('Invalid category value');
    });

    it('should accept all valid categories', () => {
      const categories = Object.values(ItemCategoryEnum);
      
      categories.forEach(category => {
        const props = { ...validItemProps, category };
        const item = new Item(props);
        expect(item.category).toBe(category);
      });
    });

    it('should set category when valid enum value is provided', () => {
      const item = new Item(validItemProps);
      
      item.category = ItemCategoryEnum.DESSERT;
      
      expect(item.category).toBe(ItemCategoryEnum.DESSERT);
    });

    it('should throw BaseException with correct error code for invalid category', () => {
      const props = { ...validItemProps, category: 'PIZZA' as any };
      
      try {
        new Item(props);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_CATEGORY_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('UpdatedAt validation', () => {
    it('should throw error when updatedAt is before createdAt', () => {
      const createdAt = new Date('2023-01-02');
      const updatedAt = new Date('2023-01-01'); // Before createdAt
      
      const item = new Item({ ...validItemProps, createdAt });
      
      expect(() => { item.updatedAt = updatedAt; }).toThrow(BaseException);
      expect(() => { item.updatedAt = updatedAt; }).toThrow('UpdatedAt cannot be before CreatedAt');
    });

    it('should accept updatedAt equal to createdAt', () => {
      const sameDate = new Date('2023-01-01');
      
      const item = new Item({ ...validItemProps, createdAt: sameDate });
      
      expect(() => { item.updatedAt = sameDate; }).not.toThrow();
      expect(item.updatedAt).toBe(sameDate);
    });

    it('should accept updatedAt after createdAt', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');
      
      const item = new Item({ ...validItemProps, createdAt });
      
      item.updatedAt = updatedAt;
      
      expect(item.updatedAt).toBe(updatedAt);
    });

    it('should throw BaseException with correct error code for invalid updatedAt', () => {
      const createdAt = new Date('2023-01-02');
      const updatedAt = new Date('2023-01-01');
      
      const item = new Item({ ...validItemProps, createdAt });
      
      try {
        item.updatedAt = updatedAt;
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ITEM_UPDATED_AT_INVALID');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('ID management', () => {
    it('should allow setting and getting id', () => {
      const item = new Item(validItemProps);
      const testId = 'test-id-123';
      
      item.id = testId;
      
      expect(item.id).toBe(testId);
    });

    it('should allow setting id to undefined', () => {
      const item = new Item({ ...validItemProps, id: 'some-id' });
      
      item.id = undefined;
      
      expect(item.id).toBeUndefined();
    });
  });

  describe('CreatedAt management', () => {
    it('should allow setting createdAt', () => {
      const item = new Item(validItemProps);
      const newCreatedAt = new Date('2023-06-15');
      
      item.createdAt = newCreatedAt;
      
      expect(item.createdAt).toBe(newCreatedAt);
    });
  });

  describe('IsDeleted property', () => {
    it('should return isDeleted value', () => {
      const item = new Item({ ...validItemProps, isDeleted: true });
      
      expect(item.isDeleted).toBe(true);
    });

    it('should default isDeleted to false', () => {
      const item = new Item(validItemProps);
      
      expect(item.isDeleted).toBe(false);
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle very small positive price', () => {
      const props = { ...validItemProps, price: 0.01 };
      const item = new Item(props);
      
      expect(item.price).toBe(0.01);
    });

    it('should handle very large price', () => {
      const props = { ...validItemProps, price: 999999.99 };
      const item = new Item(props);
      
      expect(item.price).toBe(999999.99);
    });

    it('should handle very large quantity', () => {
      const props = { ...validItemProps, quantity: 1000000 };
      const item = new Item(props);
      
      expect(item.quantity).toBe(1000000);
    });

    it('should handle multiple images', () => {
      const manyImages = Array.from({ length: 10 }, (_, i) => `image${i + 1}.jpg`);
      const props = { ...validItemProps, images: manyImages };
      const item = new Item(props);
      
      expect(item.images).toEqual(manyImages);
      expect(item.images.length).toBe(10);
    });

    it('should handle very long name and description', () => {
      const longText = 'A'.repeat(1000);
      const props = { 
        ...validItemProps, 
        name: longText, 
        description: longText 
      };
      const item = new Item(props);
      
      expect(item.name).toBe(longText);
      expect(item.description).toBe(longText);
    });

    it('should handle updateItemQuantity with decimal values', () => {
      const item = new Item({ ...validItemProps, quantity: 10.5 });
      
      item.updateItemQuantity(5.2);
      
      expect(item.quantity).toBeCloseTo(5.3, 1);
    });
  });
});