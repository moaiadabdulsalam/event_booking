import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '../interfaces/admin-repository.interface';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getState() {
    const [totalBooking, totalRevenue, totalEvents, totalUsers] =
      await Promise.all([
        this.prisma.booking.count(),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'PAID',
          },
        }),

        this.prisma.event.count(),
        this.prisma.user.count(),
      ]);

    return {
      totalBooking,
      totalEvents,
      totalUsers,
      totalRevenue: Number(totalRevenue._sum.amount || 0),
    };
  }

  async getRecentBookings(){
    return this.prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: true,
        user: true,
        seat: true,
      },
      take: 10,
    });
  }
  async getRevenueAnalytics() {
    return this.prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: { amount: true },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        status: 'PAID',
      },
    });
  }
}
