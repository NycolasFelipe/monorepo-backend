import { Model, ModelStatic, WhereOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

/** Classe abstrata base para repositórios com operações CRUD comuns */
abstract class BaseRepository<T extends Model> {
  /** Cria uma nova instância do BaseRepository */
  constructor(protected model: ModelStatic<T>) { }

  /** Obtém todos os registros */
  async getAll(): Promise<T[]> {
    return this.model.findAll();
  }

  /** Busca um registro pela chave primária */
  async getById(id: number | bigint): Promise<T | null> {
    return this.model.findByPk(id);
  }

  /** Cria um novo registro */
  async create(data: Omit<MakeNullishOptional<T['_creationAttributes']>, 'id'>): Promise<T> {
    return this.model.create(data as MakeNullishOptional<T['_creationAttributes']>);
  }

  /** Atualiza registros por ID */
  async update(id: number | bigint, data: Partial<T>): Promise<[number]> {
    return this.model.update(data, {
      where: { id } as unknown as WhereOptions<T>
    });
  }

  /** Exclui registros por ID */
  async delete(id: number | bigint): Promise<number> {
    return this.model.destroy({
      where: { id } as unknown as WhereOptions<T>
    });
  }
}

export default BaseRepository;