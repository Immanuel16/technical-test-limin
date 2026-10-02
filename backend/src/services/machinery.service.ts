import { MachineryRepository } from '../repositories/machinery.repository.js';

export class MachineryService {
  private repo: MachineryRepository;

  constructor() {
    this.repo = new MachineryRepository();
  }

  getMachineryGroups = async () => await this.repo.findAllGroups();

  getMachineries = async (groupId?: number) =>
    await this.repo.findMachineries(groupId);

  createMachineryGroup = async (name: string) => {
    if (!name || name.trim() === '') {
      throw new Error('Machinery group name is required');
    }
    const insertId = await this.repo.createGroup(name.trim());
    return { id: insertId, name: name.trim() };
  };

  createMachinery = async (payload: {
    machinery_group_id: number;
    name: string;
    code?: string | null;
  }) => {
    if (!payload.machinery_group_id) {
      throw new Error('Machinery group ID is required');
    }
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Machinery name is required');
    }

    const groupExists = await this.repo.findGroupById(
      payload.machinery_group_id,
    );
    if (!groupExists) {
      throw new Error('Machinery group not found');
    }

    const insertId = await this.repo.createMachinery({
      machinery_group_id: payload.machinery_group_id,
      name: payload.name.trim(),
      code: payload.code ? payload.code.trim() : null,
    });

    return { id: insertId, ...payload };
  };
}
