import { DeletePresenter } from '../../presenter/Delete.presenter';

describe('DeletePresenter', () => {
  describe('toResponse', () => {
    it('deve retornar mensagem de sucesso quando ID válido é fornecido', () => {
      const id = 'test-id-123';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID test-id-123 deleted successfully'
      });
    });

    it('deve retornar mensagem de sucesso quando ID com espaços é fornecido', () => {
      const id = ' test-id-456 ';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID  test-id-456  deleted successfully'
      });
    });

    it('deve retornar mensagem de falha quando ID indefinido é fornecido', () => {
      const id = undefined;

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID undefined deletion failed'
      });
    });

    it('deve retornar mensagem de falha quando string vazia é fornecida como ID', () => {
      const id = '';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID  deletion failed'
      });
    });

    it('deve retornar mensagem de falha quando string apenas com espaços é fornecida como ID', () => {
      const id = '   ';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID     deletion failed'
      });
    });

    it('deve retornar mensagem de falha quando ID nulo é fornecido', () => {
      const id = null as any;

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID null deletion failed'
      });
    });

    it('deve tratar IDs formato UUID corretamente', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID 550e8400-e29b-41d4-a716-446655440000 deleted successfully'
      });
    });

    it('deve tratar IDs string numérica corretamente', () => {
      const id = '12345';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID 12345 deleted successfully'
      });
    });

    it('deve tratar IDs alfanuméricos corretamente', () => {
      const id = 'abc123xyz';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID abc123xyz deleted successfully'
      });
    });

    it('deve tratar IDs com caracteres especiais corretamente', () => {
      const id = 'item-id_with.special@chars';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID item-id_with.special@chars deleted successfully'
      });
    });

    it('deve tratar IDs muito longos corretamente', () => {
      const id = 'a'.repeat(100);

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: `Item with ID ${id} deleted successfully`
      });
    });

    it('deve tratar IDs de caractere único corretamente', () => {
      const id = 'a';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID a deleted successfully'
      });
    });

    it('deve retornar objeto com propriedade message', () => {
      const id = 'test-id';

      const result = DeletePresenter.toResponse(id);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });

    it('deve retornar formato de resultado consistente para casos de sucesso', () => {
      const testIds = ['id1', 'id2', 'valid-id-123'];

      testIds.forEach(id => {
        const result = DeletePresenter.toResponse(id);
        
        expect(result).toHaveProperty('message');
        expect(result.message).toContain('deleted successfully');
        expect(result.message).toContain(id);
      });
    });

    it('deve retornar formato de resultado consistente para casos de falha', () => {
      const testIds = [undefined, '', '   ', null];

      testIds.forEach(id => {
        const result = DeletePresenter.toResponse(id as any);
        
        expect(result).toHaveProperty('message');
        expect(result.message).toContain('deletion failed');
      });
    });

    it('deve diferenciar entre mensagens de sucesso e falha', () => {
      const successResult = DeletePresenter.toResponse('valid-id');
      const failureResult = DeletePresenter.toResponse('');

      expect(successResult.message).toContain('deleted successfully');
      expect(failureResult.message).toContain('deletion failed');
      expect(successResult.message).not.toContain('deletion failed');
      expect(failureResult.message).not.toContain('deleted successfully');
    });

    it('deve ser determinístico - mesma entrada produz mesma saída', () => {
      const id = 'test-deterministic-id';

      const result1 = DeletePresenter.toResponse(id);
      const result2 = DeletePresenter.toResponse(id);

      expect(result1).toEqual(result2);
      expect(result1.message).toBe(result2.message);
    });

    it('deve tratar caso extremo com apenas caracteres tab', () => {
      const id = '\t\t\t';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID \t\t\t deletion failed'
      });
    });

    it('deve tratar caso extremo com apenas caracteres de nova linha', () => {
      const id = '\n\n';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID \n\n deletion failed'
      });
    });

    it('deve tratar caracteres de espaço em branco misturados', () => {
      const id = ' \t\n ';

      const result = DeletePresenter.toResponse(id);

      expect(result).toEqual({
        message: 'Item with ID  \t\n  deletion failed'
      });
    });
  });
});