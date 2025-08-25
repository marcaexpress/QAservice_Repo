var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var PrismaClient = require('@prisma/client').PrismaClient;
var bcrypt = require('bcryptjs');
var prisma = new PrismaClient();
var initialData = {
    organizations: [
        { id: 'org_qa_services', name: 'QA Services' }
    ],
    permissions: [
        { id: 'perm_user_create', action: 'create', resource: 'user' },
        { id: 'perm_user_read', action: 'read', resource: 'user' },
        { id: 'perm_user_update', action: 'update', resource: 'user' },
        { id: 'perm_user_delete', action: 'delete', resource: 'user' },
        { id: 'perm_org_create', action: 'create', resource: 'organization' },
        { id: 'perm_org_read', action: 'read', resource: 'organization' },
        { id: 'perm_org_update', action: 'update', resource: 'organization' },
        { id: 'perm_org_delete', action: 'delete', resource: 'organization' },
        { id: 'perm_cms_create', action: 'create', resource: 'cms' },
        { id: 'perm_cms_read', action: 'read', resource: 'cms' },
        { id: 'perm_cms_update', action: 'update', resource: 'cms' },
        { id: 'perm_cms_delete', action: 'delete', resource: 'cms' },
        { id: 'perm_cms_publish', action: 'publish', resource: 'cms' },
        { id: 'perm_admin_access', action: 'access', resource: 'admin' },
        { id: 'perm_system_config', action: 'configure', resource: 'system' }
    ],
    roles: [
        { id: 'role_super_admin', name: 'Super Admin', description: 'Acceso total', organizationId: 'org_qa_services' },
        { id: 'role_admin', name: 'Admin', description: 'Administrador de la organización', organizationId: 'org_qa_services' },
        { id: 'role_editor', name: 'Editor', description: 'Editor de contenido', organizationId: 'org_qa_services' },
        { id: 'role_viewer', name: 'Viewer', description: 'Visualizador', organizationId: 'org_qa_services' }
    ],
    users: [
        { id: 'user_super_admin', email: 'super@qaservices.com', name: 'Super Admin', password: 'super123', organizationId: 'org_qa_services' },
        { id: 'user_admin', email: 'admin@qaservices.com', name: 'Administrador', password: 'admin123', organizationId: 'org_qa_services' },
        { id: 'user_editor', email: 'editor@qaservices.com', name: 'Editor CMS', password: 'editor123', organizationId: 'org_qa_services' },
        { id: 'user_viewer', email: 'viewer@qaservices.com', name: 'Visualizador', password: 'viewer123', organizationId: 'org_qa_services' }
    ]
};
function seedProduction() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, org, _b, _c, perm, _d, _e, role, _f, _g, user, hashedPassword, _h, _j, perm, existing, adminPermissions, _k, adminPermissions_1, permId, existing, editorPermissions, _l, editorPermissions_1, permId, existing, viewerPermissionId, viewerExisting, roleAssignments, _m, roleAssignments_1, ra, existing;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    console.log('🌱 Iniciando Seed de Producción - QA Services');
                    _i = 0, _a = initialData.organizations;
                    _o.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    org = _a[_i];
                    return [4 /*yield*/, prisma.organization.upsert({
                            where: { id: org.id },
                            update: { name: org.name },
                            create: { id: org.id, name: org.name }
                        })];
                case 2:
                    _o.sent();
                    _o.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _b = 0, _c = initialData.permissions;
                    _o.label = 5;
                case 5:
                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                    perm = _c[_b];
                    return [4 /*yield*/, prisma.permission.upsert({
                            where: { id: perm.id },
                            update: { action: perm.action, resource: perm.resource },
                            create: { id: perm.id, action: perm.action, resource: perm.resource }
                        })];
                case 6:
                    _o.sent();
                    _o.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8:
                    _d = 0, _e = initialData.roles;
                    _o.label = 9;
                case 9:
                    if (!(_d < _e.length)) return [3 /*break*/, 12];
                    role = _e[_d];
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { id: role.id },
                            update: { name: role.name, description: role.description, organizationId: role.organizationId },
                            create: { id: role.id, name: role.name, description: role.description, organizationId: role.organizationId }
                        })];
                case 10:
                    _o.sent();
                    _o.label = 11;
                case 11:
                    _d++;
                    return [3 /*break*/, 9];
                case 12:
                    _f = 0, _g = initialData.users;
                    _o.label = 13;
                case 13:
                    if (!(_f < _g.length)) return [3 /*break*/, 17];
                    user = _g[_f];
                    return [4 /*yield*/, bcrypt.hash(user.password, 12)];
                case 14:
                    hashedPassword = _o.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { id: user.id },
                            update: { email: user.email, name: user.name, password: hashedPassword, organizationId: user.organizationId },
                            create: { id: user.id, email: user.email, name: user.name, password: hashedPassword, organizationId: user.organizationId }
                        })];
                case 15:
                    _o.sent();
                    _o.label = 16;
                case 16:
                    _f++;
                    return [3 /*break*/, 13];
                case 17:
                    _h = 0, _j = initialData.permissions;
                    _o.label = 18;
                case 18:
                    if (!(_h < _j.length)) return [3 /*break*/, 22];
                    perm = _j[_h];
                    return [4 /*yield*/, prisma.rolePermission.findFirst({
                            where: { roleId: 'role_super_admin', permissionId: perm.id }
                        })];
                case 19:
                    existing = _o.sent();
                    if (!!existing) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.rolePermission.create({ data: { roleId: 'role_super_admin', permissionId: perm.id } })];
                case 20:
                    _o.sent();
                    _o.label = 21;
                case 21:
                    _h++;
                    return [3 /*break*/, 18];
                case 22:
                    adminPermissions = [
                        'perm_user_create', 'perm_user_read', 'perm_user_update',
                        'perm_org_read', 'perm_org_update',
                        'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete', 'perm_cms_publish',
                        'perm_admin_access'
                    ];
                    _k = 0, adminPermissions_1 = adminPermissions;
                    _o.label = 23;
                case 23:
                    if (!(_k < adminPermissions_1.length)) return [3 /*break*/, 27];
                    permId = adminPermissions_1[_k];
                    return [4 /*yield*/, prisma.rolePermission.findFirst({
                            where: { roleId: 'role_admin', permissionId: permId }
                        })];
                case 24:
                    existing = _o.sent();
                    if (!!existing) return [3 /*break*/, 26];
                    return [4 /*yield*/, prisma.rolePermission.create({ data: { roleId: 'role_admin', permissionId: permId } })];
                case 25:
                    _o.sent();
                    _o.label = 26;
                case 26:
                    _k++;
                    return [3 /*break*/, 23];
                case 27:
                    editorPermissions = [
                        'perm_cms_create', 'perm_cms_read', 'perm_cms_update', 'perm_cms_delete'
                    ];
                    _l = 0, editorPermissions_1 = editorPermissions;
                    _o.label = 28;
                case 28:
                    if (!(_l < editorPermissions_1.length)) return [3 /*break*/, 32];
                    permId = editorPermissions_1[_l];
                    return [4 /*yield*/, prisma.rolePermission.findFirst({
                            where: { roleId: 'role_editor', permissionId: permId }
                        })];
                case 29:
                    existing = _o.sent();
                    if (!!existing) return [3 /*break*/, 31];
                    return [4 /*yield*/, prisma.rolePermission.create({ data: { roleId: 'role_editor', permissionId: permId } })];
                case 30:
                    _o.sent();
                    _o.label = 31;
                case 31:
                    _l++;
                    return [3 /*break*/, 28];
                case 32:
                    viewerPermissionId = 'perm_cms_read';
                    return [4 /*yield*/, prisma.rolePermission.findFirst({
                            where: { roleId: 'role_viewer', permissionId: viewerPermissionId }
                        })];
                case 33:
                    viewerExisting = _o.sent();
                    if (!!viewerExisting) return [3 /*break*/, 35];
                    return [4 /*yield*/, prisma.rolePermission.create({ data: { roleId: 'role_viewer', permissionId: viewerPermissionId } })];
                case 34:
                    _o.sent();
                    _o.label = 35;
                case 35:
                    roleAssignments = [
                        { userId: 'user_super_admin', roleId: 'role_super_admin' },
                        { userId: 'user_admin', roleId: 'role_admin' },
                        { userId: 'user_editor', roleId: 'role_editor' },
                        { userId: 'user_viewer', roleId: 'role_viewer' }
                    ];
                    _m = 0, roleAssignments_1 = roleAssignments;
                    _o.label = 36;
                case 36:
                    if (!(_m < roleAssignments_1.length)) return [3 /*break*/, 40];
                    ra = roleAssignments_1[_m];
                    return [4 /*yield*/, prisma.roleAssignment.findFirst({
                            where: { userId: ra.userId, roleId: ra.roleId }
                        })];
                case 37:
                    existing = _o.sent();
                    if (!!existing) return [3 /*break*/, 39];
                    return [4 /*yield*/, prisma.roleAssignment.create({ data: ra })];
                case 38:
                    _o.sent();
                    _o.label = 39;
                case 39:
                    _m++;
                    return [3 /*break*/, 36];
                case 40:
                    console.log('✅ Seed de producción completado');
                    return [2 /*return*/];
            }
        });
    });
}
seedProduction()
    .catch(function (e) {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
