import { VesselRepository } from '../repositories/vessel.repository.js';

export class VesselService {
  private repo: VesselRepository;

  constructor() {
    this.repo = new VesselRepository();
  }

  getAllVessels = async () => await this.repo.findAll();

  createVessel = async (name: string) => {
    if (!name || name.trim() === '') {
      throw new Error('Vessel name is required');
    }
    const id = await this.repo.create(name.trim());
    return { id, name: name.trim() };
  };

  updateVessel = async (id: number, name: string) => {
    if (!name || name.trim() === '') {
      throw new Error('Vessel name is required');
    }
    const exists = await this.repo.findById(id);
    if (!exists) throw new Error('Vessel not found');

    await this.repo.update(id, name.trim());
    return { id, name: name.trim() };
  };
}
