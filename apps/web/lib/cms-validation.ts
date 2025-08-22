// ===== CMS VALIDATION SYSTEM =====
// Sistema de validación para bloques del CMS

import { CMSBlock, BlockType, CMSBlockContent } from '../components/cms/types';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== BLOCK VALIDATION RULES =====

const BLOCK_VALIDATION_RULES = {
  hero: {
    title: { required: true, minLength: 3, maxLength: 100 },
    subtitle: { required: true, minLength: 10, maxLength: 200 },
    buttonText: { required: false, maxLength: 50 },
    buttonLink: { required: false, pattern: /^(\/|https?:\/\/)/ },
    image: { required: false, pattern: /^(\/|https?:\/\/)/ }
  },
  text: {
    text: { required: true, minLength: 1, maxLength: 2000 },
    alignment: { required: true, enum: ['left', 'center', 'right', 'justify'] },
    fontSize: { required: true, enum: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] }
  },
  services: {
    title: { required: true, minLength: 3, maxLength: 100 },
    services: { 
      required: true, 
      minItems: 1, 
      maxItems: 10,
      itemValidation: {
        name: { required: true, minLength: 2, maxLength: 50 },
        description: { required: true, minLength: 10, maxLength: 200 }
      }
    }
  },
  testimonial: {
    quote: { required: true, minLength: 10, maxLength: 500 },
    author: { required: true, minLength: 2, maxLength: 50 },
    position: { required: true, minLength: 2, maxLength: 50 },
    company: { required: true, minLength: 2, maxLength: 50 }
  },
  image: {
    src: { required: true, pattern: /^(\/|https?:\/\/)/ },
    alt: { required: true, minLength: 3, maxLength: 100 },
    caption: { required: false, maxLength: 200 }
  },
  video: {
    src: { required: true, pattern: /^https?:\/\// },
    title: { required: true, minLength: 3, maxLength: 100 },
    description: { required: false, maxLength: 200 }
  },
  code: {
    code: { required: true, minLength: 1, maxLength: 5000 },
    language: { required: true, minLength: 2, maxLength: 20 }
  },
  chart: {
    type: { required: true, enum: ['bar', 'line', 'pie', 'doughnut'] },
    data: { 
      required: true, 
      minItems: 1, 
      maxItems: 20,
      itemValidation: {
        label: { required: true, minLength: 1, maxLength: 30 },
        value: { required: true, type: 'number', min: 0 }
      }
    },
    title: { required: true, minLength: 3, maxLength: 100 }
  }
};

// ===== VALIDATION FUNCTIONS =====

export function validateBlock(block: CMSBlock): ValidationResult {
  const errors: ValidationError[] = [];
  const rules = BLOCK_VALIDATION_RULES[block.type as BlockType];
  
  if (!rules) {
    errors.push({
      field: 'type',
      message: `Tipo de bloque no soportado: ${block.type}`,
      code: 'INVALID_BLOCK_TYPE'
    });
    return { isValid: false, errors };
  }

  // Validate each field according to rules
  Object.entries(rules).forEach(([field, rule]) => {
    const value = block.content[field];
    
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `El campo ${field} es requerido`,
        code: 'REQUIRED_FIELD'
      });
      return;
    }

    if (value !== undefined && value !== null && value !== '') {
      // Min length validation
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push({
          field,
          message: `El campo ${field} debe tener al menos ${rule.minLength} caracteres`,
          code: 'MIN_LENGTH'
        });
      }

      // Max length validation
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push({
          field,
          message: `El campo ${field} debe tener máximo ${rule.maxLength} caracteres`,
          code: 'MAX_LENGTH'
        });
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push({
          field,
          message: `El campo ${field} tiene un formato inválido`,
          code: 'INVALID_FORMAT'
        });
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({
          field,
          message: `El campo ${field} debe ser uno de: ${rule.enum.join(', ')}`,
          code: 'INVALID_VALUE'
        });
      }

      // Type validation
      if (rule.type === 'number' && typeof value !== 'number') {
        errors.push({
          field,
          message: `El campo ${field} debe ser un número`,
          code: 'INVALID_TYPE'
        });
      }

      // Min value validation
      if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
        errors.push({
          field,
          message: `El campo ${field} debe ser mayor o igual a ${rule.min}`,
          code: 'MIN_VALUE'
        });
      }

      // Array validation
      if (rule.minItems && Array.isArray(value) && value.length < rule.minItems) {
        errors.push({
          field,
          message: `El campo ${field} debe tener al menos ${rule.minItems} elementos`,
          code: 'MIN_ITEMS'
        });
      }

      if (rule.maxItems && Array.isArray(value) && value.length > rule.maxItems) {
        errors.push({
          field,
          message: `El campo ${field} debe tener máximo ${rule.maxItems} elementos`,
          code: 'MAX_ITEMS'
        });
      }

      // Nested item validation
      if (rule.itemValidation && Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.entries(rule.itemValidation).forEach(([itemField, itemRule]) => {
            const itemValue = item[itemField];
            
            const rule = itemRule as any;
            if (rule.required && (itemValue === undefined || itemValue === null || itemValue === '')) {
              errors.push({
                field: `${field}[${index}].${itemField}`,
                message: `El campo ${itemField} del elemento ${index + 1} es requerido`,
                code: 'REQUIRED_FIELD'
              });
            }

            if (itemValue !== undefined && itemValue !== null && itemValue !== '') {
              if (rule.minLength && typeof itemValue === 'string' && itemValue.length < rule.minLength) {
                errors.push({
                  field: `${field}[${index}].${itemField}`,
                  message: `El campo ${itemField} del elemento ${index + 1} debe tener al menos ${rule.minLength} caracteres`,
                  code: 'MIN_LENGTH'
                });
              }

              if (rule.maxLength && typeof itemValue === 'string' && itemValue.length > rule.maxLength) {
                errors.push({
                  field: `${field}[${index}].${itemField}`,
                  message: `El campo ${itemField} del elemento ${index + 1} debe tener máximo ${rule.maxLength} caracteres`,
                  code: 'MAX_LENGTH'
                });
              }
            }
          });
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePage(page: Partial<CMSPage>): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!page.title || page.title.trim().length < 3) {
    errors.push({
      field: 'title',
      message: 'El título debe tener al menos 3 caracteres',
      code: 'INVALID_TITLE'
    });
  }

  if (page.title && page.title.length > 100) {
    errors.push({
      field: 'title',
      message: 'El título debe tener máximo 100 caracteres',
      code: 'TITLE_TOO_LONG'
    });
  }

  // Slug validation
  if (!page.slug || !/^[a-z0-9-]+$/.test(page.slug)) {
    errors.push({
      field: 'slug',
      message: 'El slug solo puede contener letras minúsculas, números y guiones',
      code: 'INVALID_SLUG'
    });
  }

  // Blocks validation
  if (!page.blocks || page.blocks.length === 0) {
    errors.push({
      field: 'blocks',
      message: 'La página debe tener al menos un bloque',
      code: 'NO_BLOCKS'
    });
  }

  if (page.blocks && page.blocks.length > 50) {
    errors.push({
      field: 'blocks',
      message: 'La página no puede tener más de 50 bloques',
      code: 'TOO_MANY_BLOCKS'
    });
  }

  // Validate each block
  if (page.blocks) {
    page.blocks.forEach((block, index) => {
      const blockValidation = validateBlock(block);
      if (!blockValidation.isValid) {
        blockValidation.errors.forEach(error => {
          errors.push({
            field: `blocks[${index}].${error.field}`,
            message: error.message,
            code: error.code
          });
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ===== UTILITY FUNCTIONS =====

export function getFieldError(errors: ValidationError[], field: string): ValidationError | undefined {
  return errors.find(error => error.field === field);
}

export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some(error => error.field === field);
}

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => `${error.field}: ${error.message}`).join('\n');
}

// ===== SANITIZATION FUNCTIONS =====

export function sanitizeBlockContent(block: CMSBlock): CMSBlock {
  const sanitized = { ...block };
  
  // Sanitize text content
  if (block.content.text) {
    sanitized.content.text = block.content.text.trim();
  }
  
  // Sanitize URLs
  if (block.content.src) {
    sanitized.content.src = block.content.src.trim();
  }
  
  if (block.content.buttonLink) {
    sanitized.content.buttonLink = block.content.buttonLink.trim();
  }
  
  // Sanitize strings
  Object.keys(block.content).forEach(key => {
    if (typeof block.content[key] === 'string') {
      sanitized.content[key] = block.content[key].trim();
    }
  });
  
  return sanitized;
}

export function sanitizePageData(page: Partial<CMSPage>): Partial<CMSPage> {
  const sanitized = { ...page };
  
  if (sanitized.title) {
    sanitized.title = sanitized.title.trim();
  }
  
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim();
  }
  
  if (sanitized.slug) {
    sanitized.slug = sanitized.slug.trim().toLowerCase();
  }
  
  if (sanitized.blocks) {
    sanitized.blocks = sanitized.blocks.map(sanitizeBlockContent);
  }
  
  return sanitized;
}
