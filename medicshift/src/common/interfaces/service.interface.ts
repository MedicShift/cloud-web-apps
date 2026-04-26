export interface ICrudService<T> {
  findAll(options?: any): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(createDto: any): Promise<T>;
  update(id: string, updateDto: any): Promise<T>;
  remove(id: string): Promise<void>;
}
