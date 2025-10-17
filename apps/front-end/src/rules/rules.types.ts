import { AttributeTypes } from '../attributes/attributes.types';
import { FeatureFlagTypes } from '../feature_flags/feature_flags.types';
import { OperatorTypes } from '../operators/operators.types';
import { AppFormDialogTypes } from '../shared/types/app.types';

interface RuleTypes {
  id: number;
  value: string;
  uuid: string;
  attribute: AttributeTypes;
  operator: OperatorTypes;
  featureFlag: FeatureFlagTypes;
  createdBy?: string;
  createdDate?: string;
}

type RuleDefaultTypes = AppFormDialogTypes;

const AppFormDialogDefaultValues: RuleDefaultTypes = {
  isUpdate: false,
  title: 'New rule',
  btnText: 'Save',
};

export type { RuleTypes, RuleDefaultTypes };
export { AppFormDialogDefaultValues };

export type CreateRuleDto = {
  featureFlagId: number;
  attributeId: number;
  operatorId: number;
  value: string | number;
};

export type UpdateRuleDto = Partial<CreateRuleDto>;
