'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Globe, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Eye,
  Edit3,
  Send,
  Trash,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  PageAccessRule, 
  AccessRuleFormData, 
  CMSRole, 
  CMSUser, 
  CMSOrganization,
  AccessControlResponse 
} from './types';

interface CMSAccessControlProps {
  pageId: string;
  onClose: () => void;
}

export function CMSAccessControl({ pageId, onClose }: CMSAccessControlProps) {
  const [accessRules, setAccessRules] = useState<PageAccessRule[]>([]);
  const [roles, setRoles] = useState<CMSRole[]>([]);
  const [users, setUsers] = useState<CMSUser[]>([]);
  const [organizations, setOrganizations] = useState<CMSOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PageAccessRule | null>(null);
  const [formData, setFormData] = useState<AccessRuleFormData>({
    accessType: 'PUBLIC',
    permissions: ['VIEW']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [pageId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadAccessRules(),
        loadRoles(),
        loadUsers(),
        loadOrganizations()
      ]);
    } catch (error) {
      console.error('Error loading access control data:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos de control de acceso' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccessRules = async () => {
    try {
      const response = await fetch(`/api/cms/pages/${pageId}/access-control`);
      if (response.ok) {
        const data: AccessControlResponse = await response.json();
        if (data.success && data.accessRules) {
          setAccessRules(data.accessRules);
        }
      }
    } catch (error) {
      console.error('Error loading access rules:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/cms/roles');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRoles(data.roles);
        }
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/cms/users');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadOrganizations = async () => {
    try {
      const response = await fetch('/api/cms/organizations');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrganizations(data.organizations);
        }
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const handleAddRule = () => {
    setFormData({
      accessType: 'PUBLIC',
      permissions: ['VIEW']
    });
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEditRule = (rule: PageAccessRule) => {
    setFormData({
      accessType: rule.accessType,
      roleId: rule.roleId,
      userId: rule.userId,
      organizationId: rule.organizationId,
      permissions: rule.permissions
    });
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta regla de acceso?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${pageId}/access-control/${ruleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAccessRules(prev => prev.filter(rule => rule.id !== ruleId));
        setMessage({ type: 'success', text: 'Regla de acceso eliminada exitosamente' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Error al eliminar la regla' });
      }
    } catch (error) {
      console.error('Error deleting access rule:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la regla de acceso' });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage(null);

      const url = editingRule 
        ? `/api/cms/pages/${pageId}/access-control/${editingRule.id}`
        : `/api/cms/pages/${pageId}/access-control`;

      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage({ type: 'success', text: data.message });
          setShowForm(false);
          await loadAccessRules();
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Error al guardar la regla' });
      }
    } catch (error) {
      console.error('Error saving access rule:', error);
      setMessage({ type: 'error', text: 'Error al guardar la regla de acceso' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof AccessRuleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset related fields when access type changes
    if (field === 'accessType') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        roleId: undefined,
        userId: undefined,
        organizationId: undefined
      }));
    }
  };

  const handlePermissionToggle = (permission: 'VIEW' | 'EDIT' | 'PUBLISH' | 'DELETE') => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'PUBLIC': return <Globe className="w-4 h-4" />;
      case 'PRIVATE': return <Shield className="w-4 h-4" />;
      case 'ROLE_BASED': return <Users className="w-4 h-4" />;
      case 'USER_SPECIFIC': return <UserCheck className="w-4 h-4" />;
      case 'ORGANIZATION': return <Users className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getAccessTypeLabel = (type: string) => {
    switch (type) {
      case 'PUBLIC': return 'Público';
      case 'PRIVATE': return 'Privado';
      case 'ROLE_BASED': return 'Basado en Rol';
      case 'USER_SPECIFIC': return 'Usuario Específico';
      case 'ORGANIZATION': return 'Organización';
      default: return type;
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'VIEW': return <Eye className="w-4 h-4" />;
      case 'EDIT': return <Edit3 className="w-4 h-4" />;
      case 'PUBLISH': return <Send className="w-4 h-4" />;
      case 'DELETE': return <Trash className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'VIEW': return 'Ver';
      case 'EDIT': return 'Editar';
      case 'PUBLISH': return 'Publicar';
      case 'DELETE': return 'Eliminar';
      default: return permission;
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando control de acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Control de Acceso</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Gestiona quién puede ver y editar esta página
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 mx-4 mt-2 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Add Rule Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleAddRule}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Regla de Acceso</span>
        </button>
      </div>

      {/* Access Rules List */}
      <div className="flex-1 overflow-y-auto p-4">
        {accessRules.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay reglas de acceso configuradas</p>
            <p className="text-sm">Esta página será visible solo para administradores</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accessRules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAccessTypeIcon(rule.accessType)}
                    <span className="font-medium text-sm">
                      {getAccessTypeLabel(rule.accessType)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar regla"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar regla"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Rule Details */}
                <div className="space-y-1 text-xs text-gray-600">
                  {rule.accessType === 'ROLE_BASED' && rule.role && (
                    <p>Rol: <span className="font-medium">{rule.role.name}</span></p>
                  )}
                  {rule.accessType === 'USER_SPECIFIC' && rule.user && (
                    <p>Usuario: <span className="font-medium">{rule.user.name}</span></p>
                  )}
                  {rule.accessType === 'ORGANIZATION' && rule.organization && (
                    <p>Organización: <span className="font-medium">{rule.organization.name}</span></p>
                  )}
                  
                  {/* Permissions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rule.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {getPermissionIcon(permission)}
                        <span>{getPermissionLabel(permission)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Access Rule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingRule ? 'Editar Regla de Acceso' : 'Nueva Regla de Acceso'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              {/* Access Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Acceso
                </label>
                <select
                  value={formData.accessType}
                  onChange={(e) => handleFormChange('accessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PUBLIC">Público</option>
                  <option value="PRIVATE">Privado</option>
                  <option value="ROLE_BASED">Basado en Rol</option>
                  <option value="USER_SPECIFIC">Usuario Específico</option>
                  <option value="ORGANIZATION">Organización</option>
                </select>
              </div>

              {/* Role Selection */}
              {formData.accessType === 'ROLE_BASED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Rol
                  </label>
                  <select
                    value={formData.roleId || ''}
                    onChange={(e) => handleFormChange('roleId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar rol...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* User Selection */}
              {formData.accessType === 'USER_SPECIFIC' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Usuario
                  </label>
                  <select
                    value={formData.userId || ''}
                    onChange={(e) => handleFormChange('userId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Organization Selection */}
              {formData.accessType === 'ORGANIZATION' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Organización
                  </label>
                  <select
                    value={formData.organizationId || ''}
                    onChange={(e) => handleFormChange('organizationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar organización...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permisos
                </label>
                <div className="space-y-2">
                  {(['VIEW', 'EDIT', 'PUBLISH', 'DELETE'] as const).map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {getPermissionLabel(permission)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
