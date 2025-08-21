// ===== CMS TYPES =====
// Tipos centralizados para todos los componentes del CMS

export interface CMSBlock {
  id: string;
  type: string;
  content: any;
  order: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    responsive?: boolean;
    animation?: string;
    style?: string;
    grid?: string;
    lazy?: boolean;
    [key: string]: any;
  };
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  published: boolean;
  blocks: CMSBlock[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  organizationId?: string;
  publishedAt?: string;
  accessRules?: PageAccessRule[];
}

export interface CMSVersion {
  id: string;
  version: number;
  title: string;
  description?: string;
  blocks: CMSBlock[];
  metadata?: {
    changeNotes?: string;
    author?: string;
    timestamp?: string;
    restoredFrom?: number;
    [key: string]: any;
  };
  createdAt: Date;
  creator?: {
    name: string;
    email: string;
  };
}

export interface PageAccessControl {
  userId: string;
  userRoles: string[];
  organizationId?: string;
}

// ===== ACCESS CONTROL TYPES =====

export interface PageAccessRule {
  id: string;
  pageId: string;
  accessType: 'PUBLIC' | 'PRIVATE' | 'ROLE_BASED' | 'USER_SPECIFIC' | 'ORGANIZATION';
  roleId?: string;
  userId?: string;
  organizationId?: string;
  permissions: ('VIEW' | 'EDIT' | 'PUBLISH' | 'DELETE')[];
  createdAt: string;
  updatedAt: string;
  
  // Relations (populated when fetched)
  role?: {
    id: string;
    name: string;
    description?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface AccessRuleFormData {
  accessType: 'PUBLIC' | 'PRIVATE' | 'ROLE_BASED' | 'USER_SPECIFIC' | 'ORGANIZATION';
  roleId?: string;
  userId?: string;
  organizationId?: string;
  permissions: ('VIEW' | 'EDIT' | 'PUBLISH' | 'DELETE')[];
}

export interface CMSRole {
  id: string;
  name: string;
  description?: string;
  organizationId?: string;
}

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  organizationId?: string;
}

export interface CMSOrganization {
  id: string;
  name: string;
  slug: string;
}

// ===== ACCESS CONTROL RESPONSES =====

export interface AccessControlResponse {
  success: boolean;
  message: string;
  accessRules?: PageAccessRule[];
}

export interface AccessRuleUpdateResponse {
  success: boolean;
  message: string;
  accessRule?: PageAccessRule;
}

export interface CMSBlockContent {
  // Hero Block
  hero: {
    title: string;
    subtitle: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
  };
  
  // Text Block
  text: {
    text: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  };
  
  // Services Block
  services: {
    title: string;
    services: Array<{
      name: string;
      description: string;
    }>;
  };
  
  // Testimonial Block
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  
  // Image Block
  image: {
    src: string;
    alt: string;
    caption?: string;
  };
  
  // Video Block
  video: {
    src: string;
    title: string;
    description?: string;
  };
  
  // Code Block
  code: {
    code: string;
    language: string;
  };
  
  // Chart Block
  chart: {
    type: string;
    data: Array<{
      label: string;
      value: number;
    }>;
    title: string;
  };
}

export type BlockType = keyof CMSBlockContent;

export interface CMSFormData {
  title: string;
  description?: string;
  blocks: CMSBlock[];
  changeNotes?: string;
}

export interface CMSSaveResponse {
  success: boolean;
  message: string;
  version?: number;
  timestamp?: string;
}

export interface CMSPublishResponse {
  success: boolean;
  message: string;
  publishedAt?: string;
}

export interface CMSVersionResponse {
  success: boolean;
  versions?: CMSVersion[];
  message?: string;
}

// ===== VALIDATION SCHEMAS =====

export const BLOCK_TYPES: BlockType[] = [
  'hero',
  'text', 
  'services',
  'testimonial',
  'image',
  'video',
  'code',
  'chart'
];

export const FONT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const;
export const ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;
export const PAGE_STATUSES = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

// ===== UTILITY TYPES =====

export type CMSAction = 'create' | 'read' | 'update' | 'delete' | 'publish';
export type CMSPermission = 'VIEW' | 'EDIT' | 'PUBLISH' | 'DELETE';
