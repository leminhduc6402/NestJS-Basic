import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/customDecorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Token không hợp lệ hoặc không tồn tại')
      );
    }

    //check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path as string;

    const permissions = user?.permissions ?? [];

    // const permissions = [
    //   {
    //     _id: '648ad640dafdb9754f40b8ab',
    //     name: 'Update Role',
    //     apiPath: '/api/v1/roles/:id',
    //     method: 'PATCH',
    //     module: 'ROLES',
    //   },
    //   {
    //     _id: '648ad650dafdb9754f40b8b0',
    //     name: 'Delete a Role',
    //     apiPath: '/api/v1/roles/:id',
    //     method: 'DELETE',
    //     module: 'ROLES',
    //   },
    // ];

    let isExist = permissions.find((permission) => {
      return (
        targetMethod === permission.method &&
        targetEndpoint === permission.apiPath
      );
    });
    if (targetEndpoint.startsWith('/api/v1/auth')) {
      isExist = true;
    }

    if (!isExist) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào đường dẫn này',
      );
    }

    return user;
  }
}
