import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('IS_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRole === 0) {
        const permissions = await this.permissionModel.find().select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin có toàn quyền sử dụng hệ thống',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng sử dụng hệ thống',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });

        await this.userModel.insertMany([
          {
            name: 'Lê Huỳnh Đức',
            email: 'admin@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 21,
            gender: 'MALE',
            address:
              'Chung cư Gia Phú, Phường Bình Hưng Hoà, Quận Bình Tân, Thành phố Hồ Chí Minh',
            role: adminRole?._id,
          },

          {
            name: 'Lê Minh Đức',
            email: 'leminhduc6402@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 21,
            gender: 'MALE',
            address:
              'Chung cư Gia Phú, Phường Bình Hưng Hoà, Quận Bình Tân, Thành phố Hồ Chí Minh',
            role: adminRole?._id,
          },

          {
            name: 'Nguyễn Văn A',
            email: 'user@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 21,
            gender: 'MALE',
            address:
              'Chung cư Gia Phú, Phường Bình Hưng Hoà, Quận Bình Tân, Thành phố Hồ Chí Minh',
            role: userRole?._id,
          },
        ]);
      }
      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log('>> ALREADY INIT DATA...');
      }
    }
  }
}
