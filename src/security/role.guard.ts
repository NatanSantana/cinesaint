import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Injectable } from "@nestjs/common";
import { ROLES_KEY } from "../decorator/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const rolesNecessarias = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!rolesNecessarias) return true;

        const { user } = context.switchToHttp().getRequest();

        return rolesNecessarias.some(role => user?.role === role)
            
    
    }

    



}