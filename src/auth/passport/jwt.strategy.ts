import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
    });
  }

  async validate(payload: IUser) {
    const { _id, email, name, role } = payload;
    // Logic check permissions
    const userRole = role as unknown as { _id: string; name: string };
    const temp = (await this.rolesService.findOne(userRole._id)).toObject()
    
    return {
      _id,
      email,
      name,
      role,
      permissions: (await temp).permissions ?? [],
    };
  }
}
