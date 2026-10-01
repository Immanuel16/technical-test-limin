import { MachineryRepository } from '../repositories/machinery.repository.js';

export class MachineryService {
  private repo: MachineryRepository;

  constructor() {
    this.repo = new MachineryRepository();
  }

  getMachineryGroups = async () => await this.repo.findAllGroups();

  getMachineries = async (groupId?: number) =>
    await this.repo.findMachineries(groupId);
}
