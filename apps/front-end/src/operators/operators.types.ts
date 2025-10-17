import { AppFormDialogTypes } from '../shared/types/app.types';

interface OperatorTypes {
  id: number;
  name: string;
  description: string;
  dateCreated: string;
}

type OperatorDefaultTypes = OperatorTypes & AppFormDialogTypes;

const OperatorDefaultValues: OperatorDefaultTypes = {
  id: 0,
  name: '',
  description: '',
  dateCreated: '',
  isUpdate: false,
  title: 'New operator',
  btnText: 'Save',
};

export type { OperatorTypes, OperatorDefaultTypes };

export { OperatorDefaultValues };

export enum Operator {
  In = 'IN',
  NotIn = 'NOT IN',
  Equals = 'EQUALS',
  NotEqual = 'NOT EQUAL',
  GreaterThan = 'GREATER THAN',
  LessThan = 'LESS THAN',
}

export type CreateOperatorDto = {
  name: string;
  description: string;
};

export type UpdateOperatorDto = Partial<CreateOperatorDto>;
