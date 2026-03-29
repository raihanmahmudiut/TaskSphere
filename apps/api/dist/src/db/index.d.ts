export declare const users: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        uuid: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "users";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
            name: "hashed_password";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const tasks: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "tasks";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "tasks";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "tasks";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        description: import("drizzle-orm/pg-core").PgColumn<{
            name: "description";
            tableName: "tasks";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "tasks";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "TODO" | "IN_PROGRESS" | "DONE";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: ["TODO", "IN_PROGRESS", "DONE"];
            baseColumn: never;
        }, {}, {}>;
        priority: import("drizzle-orm/pg-core").PgColumn<{
            name: "priority";
            tableName: "tasks";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "LOW" | "MEDIUM" | "HIGH";
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: ["LOW", "MEDIUM", "HIGH"];
            baseColumn: never;
        }, {}, {}>;
        dueDate: import("drizzle-orm/pg-core").PgColumn<{
            name: "due_date";
            tableName: "tasks";
            dataType: "date";
            columnType: "PgDate";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        todoAppId: import("drizzle-orm/pg-core").PgColumn<{
            name: "todo_app_id";
            tableName: "tasks";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "tasks";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "tasks";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const todoApps: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "todo_apps";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "todo_apps";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "todo_apps";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        ownerId: import("drizzle-orm/pg-core").PgColumn<{
            name: "owner_id";
            tableName: "todo_apps";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "todo_apps";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "todo_apps";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const todoAppCollaborators: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "todo_app_collaborators";
    schema: undefined;
    columns: {
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "todo_app_collaborators";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        todoAppId: import("drizzle-orm/pg-core").PgColumn<{
            name: "todo_app_id";
            tableName: "todo_app_collaborators";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        role: import("drizzle-orm/pg-core").PgColumn<{
            name: "role";
            tableName: "todo_app_collaborators";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "VIEWER" | "EDITOR";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: ["VIEWER", "EDITOR"];
            baseColumn: never;
        }, {}, {}>;
        assignedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "assigned_at";
            tableName: "todo_app_collaborators";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const taskStatusEnum: import("drizzle-orm/pg-core").PgEnum<["TODO", "IN_PROGRESS", "DONE"]>;
export declare const taskPriorityEnum: import("drizzle-orm/pg-core").PgEnum<["LOW", "MEDIUM", "HIGH"]>;
export declare const collaboratorRoleEnum: import("drizzle-orm/pg-core").PgEnum<["VIEWER", "EDITOR"]>;
export declare const schema: {
    taskStatusEnum: import("drizzle-orm/pg-core").PgEnum<["TODO", "IN_PROGRESS", "DONE"]>;
    taskPriorityEnum: import("drizzle-orm/pg-core").PgEnum<["LOW", "MEDIUM", "HIGH"]>;
    collaboratorRoleEnum: import("drizzle-orm/pg-core").PgEnum<["VIEWER", "EDITOR"]>;
    todoAppCollaborators: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "todo_app_collaborators";
        schema: undefined;
        columns: {
            userId: import("drizzle-orm/pg-core").PgColumn<{
                name: "user_id";
                tableName: "todo_app_collaborators";
                dataType: "string";
                columnType: "PgUUID";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            todoAppId: import("drizzle-orm/pg-core").PgColumn<{
                name: "todo_app_id";
                tableName: "todo_app_collaborators";
                dataType: "number";
                columnType: "PgInteger";
                data: number;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            role: import("drizzle-orm/pg-core").PgColumn<{
                name: "role";
                tableName: "todo_app_collaborators";
                dataType: "string";
                columnType: "PgEnumColumn";
                data: "VIEWER" | "EDITOR";
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: ["VIEWER", "EDITOR"];
                baseColumn: never;
            }, {}, {}>;
            assignedAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "assigned_at";
                tableName: "todo_app_collaborators";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    todoAppCollaboratorsRelations: import("drizzle-orm").Relations<"todo_app_collaborators", {
        user: import("drizzle-orm").One<"users", true>;
        todoApp: import("drizzle-orm").One<"todo_apps", true>;
    }>;
    tasks: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "tasks";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/pg-core").PgColumn<{
                name: "id";
                tableName: "tasks";
                dataType: "number";
                columnType: "PgSerial";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            title: import("drizzle-orm/pg-core").PgColumn<{
                name: "title";
                tableName: "tasks";
                dataType: "string";
                columnType: "PgVarchar";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            description: import("drizzle-orm/pg-core").PgColumn<{
                name: "description";
                tableName: "tasks";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            status: import("drizzle-orm/pg-core").PgColumn<{
                name: "status";
                tableName: "tasks";
                dataType: "string";
                columnType: "PgEnumColumn";
                data: "TODO" | "IN_PROGRESS" | "DONE";
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: ["TODO", "IN_PROGRESS", "DONE"];
                baseColumn: never;
            }, {}, {}>;
            priority: import("drizzle-orm/pg-core").PgColumn<{
                name: "priority";
                tableName: "tasks";
                dataType: "string";
                columnType: "PgEnumColumn";
                data: "LOW" | "MEDIUM" | "HIGH";
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: ["LOW", "MEDIUM", "HIGH"];
                baseColumn: never;
            }, {}, {}>;
            dueDate: import("drizzle-orm/pg-core").PgColumn<{
                name: "due_date";
                tableName: "tasks";
                dataType: "date";
                columnType: "PgDate";
                data: Date;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            todoAppId: import("drizzle-orm/pg-core").PgColumn<{
                name: "todo_app_id";
                tableName: "tasks";
                dataType: "number";
                columnType: "PgInteger";
                data: number;
                driverParam: string | number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            createdAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "created_at";
                tableName: "tasks";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            updatedAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "updated_at";
                tableName: "tasks";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    tasksRelations: import("drizzle-orm").Relations<"tasks", {
        todoApp: import("drizzle-orm").One<"todo_apps", true>;
    }>;
    todoApps: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "todo_apps";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/pg-core").PgColumn<{
                name: "id";
                tableName: "todo_apps";
                dataType: "number";
                columnType: "PgSerial";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            name: import("drizzle-orm/pg-core").PgColumn<{
                name: "name";
                tableName: "todo_apps";
                dataType: "string";
                columnType: "PgVarchar";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            ownerId: import("drizzle-orm/pg-core").PgColumn<{
                name: "owner_id";
                tableName: "todo_apps";
                dataType: "string";
                columnType: "PgUUID";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            createdAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "created_at";
                tableName: "todo_apps";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            updatedAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "updated_at";
                tableName: "todo_apps";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    todoAppsRelations: import("drizzle-orm").Relations<"todo_apps", {
        owner: import("drizzle-orm").One<"users", true>;
        tasks: import("drizzle-orm").Many<"tasks">;
        collaborators: import("drizzle-orm").Many<"todo_app_collaborators">;
    }>;
    users: import("drizzle-orm/pg-core").PgTableWithColumns<{
        name: "users";
        schema: undefined;
        columns: {
            uuid: import("drizzle-orm/pg-core").PgColumn<{
                name: "id";
                tableName: "users";
                dataType: "string";
                columnType: "PgUUID";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            name: import("drizzle-orm/pg-core").PgColumn<{
                name: "name";
                tableName: "users";
                dataType: "string";
                columnType: "PgVarchar";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            email: import("drizzle-orm/pg-core").PgColumn<{
                name: "email";
                tableName: "users";
                dataType: "string";
                columnType: "PgVarchar";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                name: "hashed_password";
                tableName: "users";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, {}, {}>;
            createdAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "created_at";
                tableName: "users";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
            updatedAt: import("drizzle-orm/pg-core").PgColumn<{
                name: "updated_at";
                tableName: "users";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, {}, {}>;
        };
        dialect: "pg";
    }>;
    usersRelations: import("drizzle-orm").Relations<"users", {
        ownedTodoApps: import("drizzle-orm").Many<"todo_apps">;
        collaborations: import("drizzle-orm").Many<"todo_app_collaborators">;
    }>;
};
export default schema;
