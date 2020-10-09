import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedinAuthGuard extends AuthGuard('linkedin') {}
