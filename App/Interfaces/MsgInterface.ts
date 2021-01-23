import {VariantType} from '../Literals';

export interface IStatusMsg {
  StatusCode: string | null;
  StatusMessage: string | null;
  Variant: VariantType | null;
}
