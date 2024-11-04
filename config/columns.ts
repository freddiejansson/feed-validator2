export type ColumnNecessity = 'required' | 'preferred' | 'optional';

export interface ColumnValidation {
  min?: number;
  max?: number;
}

export interface ColumnDefinition {
  name: string;
  necessity: ColumnNecessity;
  type: 'string' | 'float' | 'integer';
  description: string;
  validation?: ColumnValidation;
  aliases: string[];
}

export const columnDefinitions: ColumnDefinition[] = [
    {
        name: 'sku',
        necessity: 'required',
        type: 'string',
        description: 'The sku of the product or variant if applicable',
        aliases: ['productId', 'article_number', 'item_sku']
      },
      {
        name: 'costPrice',
        necessity: 'required',
        type: 'float',
        description: 'The purchase price (COGS)',
        validation: {
          min: 0
        },
        aliases: ['cost', 'purchase_price', 'buying_price']
      },
      {
        name: 'title',
        necessity: 'optional',
        type: 'string',
        description: 'The name of the product',
        aliases: ['name', 'product_name', 'product_title']
      },
      {
        name: 'salesPrice',
        necessity: 'optional',
        type: 'float',
        description: 'The net price the picture is sold for',
        validation: {
          min: 0
        },
        aliases: ['price', 'selling_price', 'retail_price']
      },
      {
        name: 'shippingCost',
        necessity: 'optional',
        type: 'float',
        description: 'The actual/ average shipping cost per product',
        validation: {
          min: 0
        },
        aliases: ['shipping', 'delivery_cost']
      },
      {
        name: 'kickback',
        necessity: 'optional',
        type: 'float',
        description: 'The kickback for that product, in percent of purchase price, times 100',
        validation: {
          min: 0,
          max: 100
        },
        aliases: ['cashback', 'rebate']
      },
      {
        name: 'vat',
        necessity: 'optional',
        type: 'integer',
        description: 'The VAT times 100 (25 for Sweden)',
        validation: {
          min: 0,
          max: 100
        },
        aliases: ['tax', 'vat_rate', 'tax_rate']
      },
      {
        name: 'brand',
        necessity: 'preferred',
        type: 'string',
        description: 'The brand of the product',
        aliases: ['manufacturer', 'make']
      },
      {
        name: 'category',
        necessity: 'preferred',
        type: 'string',
        description: 'The category of the product',
        aliases: ['product_category', 'product_type']
      },
      {
        name: 'returns',
        necessity: 'optional',
        type: 'float',
        description: 'The return rate for that product, in percent of purchase price, times 100',
        validation: {
          min: 0,
          max: 100
        },
        aliases: ['return_rate', 'returns_rate', 'return_percentage']
      },
      {
        name: 'custom_1',
        necessity: 'optional',
        type: 'string',
        description: 'Custom dimension for reporting',
        aliases: ['customField1', 'custom1']
      },
      {
        name: 'custom_2',
        necessity: 'optional',
        type: 'string',
        description: 'Custom dimension for reporting',
        aliases: ['customField2', 'custom2']
      },
      {
        name: 'custom_3',
        necessity: 'optional',
        type: 'string',
        description: 'Custom dimension for reporting',
        aliases: ['customField3', 'custom3']
      },
      {
        name: 'custom_4',
        necessity: 'optional',
        type: 'string',
        description: 'Custom dimension for reporting',
        aliases: ['customField4', 'custom4']
      }

];
