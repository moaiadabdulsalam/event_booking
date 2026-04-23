import { Inject, Injectable } from '@nestjs/common';
import type { IAdminRepository } from '../interfaces/admin-repository.interface';
import { ADMIN_REPOSITORY } from '../../../common/constants/injection-tokens';

@Injectable()
export class AdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async getState(){
    return this.adminRepository.getState();
  }
  async getRecentBookings(){
    return this.adminRepository.getRecentBookings();
  }

  async getRevenueAnalytics(){
    return this.adminRepository.getRevenueAnalytics();
  }
}
