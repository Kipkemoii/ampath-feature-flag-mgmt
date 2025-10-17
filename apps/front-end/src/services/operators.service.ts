import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {
  CreateOperatorDto,
  OperatorTypes,
  UpdateOperatorDto,
} from '../operators/operators.types';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Injectable({ providedIn: 'root' })
export class OperatorsService extends BaseService {
  private endPoint = '/operators';

  private getEndpoint(endPoint: string = this.endPoint) {
    return this.getUrl('FEATURE_FLAG') + endPoint;
  }

  public fetch() {
    const url = this.getEndpoint();
    return this.http.get<OperatorTypes[]>(url);
  }

  public create(createOperatorDto: CreateOperatorDto) {
    const url = this.getEndpoint();
    return this.http.post(url, createOperatorDto);
  }

  public update(id: number, updateOperatorDto: UpdateOperatorDto) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.patch(url, updateOperatorDto);
  }

  public delete(id: number, voidDto: VoidDto) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.delete(url, {
      body: {
        ...voidDto,
      },
    });
  }
}
