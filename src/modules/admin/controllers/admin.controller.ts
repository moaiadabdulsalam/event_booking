import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../../common/guard/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminService } from '../services/admin.service';


@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService : AdminService
    ){}

    @Get('state')
    getState(){
        return this.adminService.getState();
    }
    @Get('recent-bookings')
    getRecentBookings(){
        return this.adminService.getRecentBookings();
    }   

    @Get('revenue-analytics')
    getRevenueAnalytics(){
        return this.adminService.getRevenueAnalytics();
    }
}
