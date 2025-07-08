export interface ProductVariation{
  variationId: number;
  productId: number;
  sku: string;
  price: number;
  quantity: number;
  optionInputs: OptionInputs[];
}

export interface OptionInputs{
  optionValue: string;
  optionName: string;
}

