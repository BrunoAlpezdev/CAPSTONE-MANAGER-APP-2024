export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          email: string | null
          id: number
          nombre: string
          telefono: string | null
        }
        Insert: {
          email?: string | null
          id?: never
          nombre: string
          telefono?: string | null
        }
        Update: {
          email?: string | null
          id?: never
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      detalles_pedidos: {
        Row: {
          cantidad: number
          id: number
          pedido_id: number | null
          precio: number
          producto_id: number | null
        }
        Insert: {
          cantidad: number
          id?: never
          pedido_id?: number | null
          precio: number
          producto_id?: number | null
        }
        Update: {
          cantidad?: number
          id?: never
          pedido_id?: number | null
          precio?: number
          producto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_pedidos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_ventas: {
        Row: {
          cantidad: number
          id: number
          precio: number
          producto_id: number | null
          venta_id: number | null
        }
        Insert: {
          cantidad: number
          id?: never
          precio: number
          producto_id?: number | null
          venta_id?: number | null
        }
        Update: {
          cantidad?: number
          id?: never
          precio?: number
          producto_id?: number | null
          venta_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_ventas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_ventas_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          changed_at: string | null
          changed_data: Json | null
          id: number
          operation: string | null
          table_name: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_data?: Json | null
          id?: never
          operation?: string | null
          table_name?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_data?: Json | null
          id?: never
          operation?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          estado: string
          fecha: string | null
          id: number
          proveedor_id: number | null
          tienda_id: number | null
        }
        Insert: {
          estado: string
          fecha?: string | null
          id?: never
          proveedor_id?: number | null
          tienda_id?: number | null
        }
        Update: {
          estado?: string
          fecha?: string | null
          id?: never
          proveedor_id?: number | null
          tienda_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          cantidad: number
          descripcion: string | null
          id: number
          nombre: string
          precio: number
          tienda_id: number | null
        }
        Insert: {
          cantidad: number
          descripcion?: string | null
          id?: never
          nombre: string
          precio: number
          tienda_id?: number | null
        }
        Update: {
          cantidad?: number
          descripcion?: string | null
          id?: never
          nombre?: string
          precio?: number
          tienda_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          contacto: string | null
          id: number
          nombre: string
          telefono: string | null
          tienda_id: number | null
        }
        Insert: {
          contacto?: string | null
          id?: never
          nombre: string
          telefono?: string | null
          tienda_id?: number | null
        }
        Update: {
          contacto?: string | null
          id?: never
          nombre?: string
          telefono?: string | null
          tienda_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedores_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      tiendas: {
        Row: {
          direccion: string
          id: number
          nombre: string
          telefono: string | null
        }
        Insert: {
          direccion: string
          id?: never
          nombre: string
          telefono?: string | null
        }
        Update: {
          direccion?: string
          id?: never
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          auth_user_id: string | null
          email: string
          id: number
          nombre: string
          rol: string
          tienda_id: number | null
        }
        Insert: {
          auth_user_id?: string | null
          email: string
          id?: never
          nombre: string
          rol: string
          tienda_id?: number | null
        }
        Update: {
          auth_user_id?: string | null
          email?: string
          id?: never
          nombre?: string
          rol?: string
          tienda_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_auth_user"
            columns: ["auth_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas: {
        Row: {
          cliente_id: number | null
          estado: string
          fecha: string | null
          id: number
          tienda_id: number | null
          total: number
        }
        Insert: {
          cliente_id?: number | null
          estado?: string
          fecha?: string | null
          id?: never
          tienda_id?: number | null
          total: number
        }
        Update: {
          cliente_id?: number | null
          estado?: string
          fecha?: string | null
          id?: never
          tienda_id?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      total_ventas_por_tienda: {
        Args: {
          tienda_id: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
