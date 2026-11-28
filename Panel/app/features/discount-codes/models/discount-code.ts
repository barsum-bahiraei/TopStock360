export enum PaymentMethod {
  Cash = 0,
  Online = 1,
  Check = 2,
}

export interface DiscountCodeUpsertInput {
  code: string;
  maxDiscountAmount: number | null;
  discountPercentage: number | null;
  minimumPurchaseAmount: number;
  paymentMethod?: PaymentMethod | null;
  expireAt?: string | null;
  isActive: boolean;
}

export interface DiscountCodeListOutput {
  id: number;
  code: string;
  maxDiscountAmount: number | null;
  discountPercentage: number | null;
  minimumPurchaseAmount: number;
  paymentMethod: PaymentMethod | null;
  expireAt: string | null;
  isActive: boolean;
}

export interface DiscountCodeOutput {
  id: number;
  code: string;
  maxDiscountAmount: number | null;
  discountPercentage: number | null;
  minimumPurchaseAmount: number;
  paymentMethod: PaymentMethod | null;
  expireAt: string | null;
  isActive: boolean;
}
