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
      acciones: {
        Row: {
          categoria: string
          descripcion: string
          estado: string
          fecha_asignacion: string
          fecha_creacion: string | null
          fecha_evaluacion: string | null
          id: string
          notas: string | null
          resultado_esperado: string | null
          tipo: string
          ultima_actualizacion: string | null
          usuario_asignado_id: string | null
          vehículo_id: string | null
        }
        Insert: {
          categoria: string
          descripcion: string
          estado: string
          fecha_asignacion: string
          fecha_creacion?: string | null
          fecha_evaluacion?: string | null
          id?: string
          notas?: string | null
          resultado_esperado?: string | null
          tipo: string
          ultima_actualizacion?: string | null
          usuario_asignado_id?: string | null
          vehículo_id?: string | null
        }
        Update: {
          categoria?: string
          descripcion?: string
          estado?: string
          fecha_asignacion?: string
          fecha_creacion?: string | null
          fecha_evaluacion?: string | null
          id?: string
          notas?: string | null
          resultado_esperado?: string | null
          tipo?: string
          ultima_actualizacion?: string | null
          usuario_asignado_id?: string | null
          vehículo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acciones_usuario_asignado_id_fkey"
            columns: ["usuario_asignado_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acciones_vehículo_id_fkey"
            columns: ["vehículo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_gastos: {
        Row: {
          activo: boolean | null
          color: string | null
          descripcion: string | null
          es_deducible: boolean | null
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          color?: string | null
          descripcion?: string | null
          es_deducible?: boolean | null
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean | null
          color?: string | null
          descripcion?: string | null
          es_deducible?: boolean | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          activo: boolean | null
          contacto: string | null
          direccion: string | null
          email: string | null
          fecha_creacion: string | null
          id: string
          nombre: string
          telefono: string | null
        }
        Insert: {
          activo?: boolean | null
          contacto?: string | null
          direccion?: string | null
          email?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre: string
          telefono?: string | null
        }
        Update: {
          activo?: boolean | null
          contacto?: string | null
          direccion?: string | null
          email?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      cuentas: {
        Row: {
          activo: boolean | null
          banco: string | null
          fecha_creacion: string | null
          id: string
          nombre: string
          numero_cuenta: string | null
          presupuesto: number | null
          saldo: number | null
          tipo: string | null
          ultima_actualizacion: string | null
        }
        Insert: {
          activo?: boolean | null
          banco?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre: string
          numero_cuenta?: string | null
          presupuesto?: number | null
          saldo?: number | null
          tipo?: string | null
          ultima_actualizacion?: string | null
        }
        Update: {
          activo?: boolean | null
          banco?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre?: string
          numero_cuenta?: string | null
          presupuesto?: number | null
          saldo?: number | null
          tipo?: string | null
          ultima_actualizacion?: string | null
        }
        Relationships: []
      }
      destinos: {
        Row: {
          activo: boolean | null
          ciudad: string | null
          cliente_id: string | null
          codigo_postal: string | null
          direccion: string
          estado: string | null
          fecha_creacion: string | null
          id: string
          nombre: string
          tiempo_descarga_promedio: unknown | null
        }
        Insert: {
          activo?: boolean | null
          ciudad?: string | null
          cliente_id?: string | null
          codigo_postal?: string | null
          direccion: string
          estado?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre: string
          tiempo_descarga_promedio?: unknown | null
        }
        Update: {
          activo?: boolean | null
          ciudad?: string | null
          cliente_id?: string | null
          codigo_postal?: string | null
          direccion?: string
          estado?: string | null
          fecha_creacion?: string | null
          id?: string
          nombre?: string
          tiempo_descarga_promedio?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "destinos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_calendario: {
        Row: {
          accion_id: string | null
          descripcion: string | null
          estado: string
          fecha: string
          fecha_creacion: string | null
          id: string
          titulo: string
          usuario_id: string | null
        }
        Insert: {
          accion_id?: string | null
          descripcion?: string | null
          estado: string
          fecha: string
          fecha_creacion?: string | null
          id?: string
          titulo: string
          usuario_id?: string | null
        }
        Update: {
          accion_id?: string | null
          descripcion?: string | null
          estado?: string
          fecha?: string
          fecha_creacion?: string | null
          id?: string
          titulo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_calendario_accion_id_fkey"
            columns: ["accion_id"]
            isOneToOne: false
            referencedRelation: "acciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_calendario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos: {
        Row: {
          archivo_url: string | null
          categoria_id: string | null
          comprobante: boolean | null
          descripcion: string | null
          es_deducible: boolean | null
          fecha: string
          fecha_creacion: string | null
          id: string
          monto: number
          usuario_id: string | null
          vehiculo_id: string | null
          viaje_id: string | null
        }
        Insert: {
          archivo_url?: string | null
          categoria_id?: string | null
          comprobante?: boolean | null
          descripcion?: string | null
          es_deducible?: boolean | null
          fecha: string
          fecha_creacion?: string | null
          id?: string
          monto: number
          usuario_id?: string | null
          vehiculo_id?: string | null
          viaje_id?: string | null
        }
        Update: {
          archivo_url?: string | null
          categoria_id?: string | null
          comprobante?: boolean | null
          descripcion?: string | null
          es_deducible?: boolean | null
          fecha?: string
          fecha_creacion?: string | null
          id?: string
          monto?: number
          usuario_id?: string | null
          vehiculo_id?: string | null
          viaje_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_gastos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      mantenimientos: {
        Row: {
          accion_id: string | null
          costo: number
          descripcion: string
          estado: string
          fecha: string
          fecha_creacion: string | null
          gasto_id: string | null
          id: string
          kilometraje: number
          responsable_id: string | null
          taller: string | null
          tipo: string
          ultima_actualizacion: string | null
          vehiculo_id: string
        }
        Insert: {
          accion_id?: string | null
          costo: number
          descripcion: string
          estado: string
          fecha: string
          fecha_creacion?: string | null
          gasto_id?: string | null
          id?: string
          kilometraje: number
          responsable_id?: string | null
          taller?: string | null
          tipo: string
          ultima_actualizacion?: string | null
          vehiculo_id: string
        }
        Update: {
          accion_id?: string | null
          costo?: number
          descripcion?: string
          estado?: string
          fecha?: string
          fecha_creacion?: string | null
          gasto_id?: string | null
          id?: string
          kilometraje?: number
          responsable_id?: string | null
          taller?: string | null
          tipo?: string
          ultima_actualizacion?: string | null
          vehiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mantenimientos_accion_id_fkey"
            columns: ["accion_id"]
            isOneToOne: false
            referencedRelation: "acciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_gasto_id_fkey"
            columns: ["gasto_id"]
            isOneToOne: false
            referencedRelation: "gastos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activo: boolean | null
          apellido: string | null
          created_at: string | null
          id: string
          nombre: string | null
          rol: string | null
          ultima_sesion: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          apellido?: string | null
          created_at?: string | null
          id: string
          nombre?: string | null
          rol?: string | null
          ultima_sesion?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          apellido?: string | null
          created_at?: string | null
          id?: string
          nombre?: string | null
          rol?: string | null
          ultima_sesion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          comprobante_url: string | null
          concepto: string
          cuenta_id: string | null
          fecha: string
          fecha_creacion: string | null
          gasto_id: string | null
          id: string
          monto: number
          tipo: string
          usuario_id: string | null
          viaje_id: string | null
        }
        Insert: {
          comprobante_url?: string | null
          concepto: string
          cuenta_id?: string | null
          fecha: string
          fecha_creacion?: string | null
          gasto_id?: string | null
          id?: string
          monto: number
          tipo: string
          usuario_id?: string | null
          viaje_id?: string | null
        }
        Update: {
          comprobante_url?: string | null
          concepto?: string
          cuenta_id?: string | null
          fecha?: string
          fecha_creacion?: string | null
          gasto_id?: string | null
          id?: string
          monto?: number
          tipo?: string
          usuario_id?: string | null
          viaje_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_cuenta_id_fkey"
            columns: ["cuenta_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_gasto_id_fkey"
            columns: ["gasto_id"]
            isOneToOne: false
            referencedRelation: "gastos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias: {
        Row: {
          concepto: string | null
          cuenta_destino_id: string
          cuenta_origen_id: string
          fecha: string
          fecha_creacion: string | null
          id: string
          monto: number
          usuario_id: string | null
        }
        Insert: {
          concepto?: string | null
          cuenta_destino_id: string
          cuenta_origen_id: string
          fecha: string
          fecha_creacion?: string | null
          id?: string
          monto: number
          usuario_id?: string | null
        }
        Update: {
          concepto?: string | null
          cuenta_destino_id?: string
          cuenta_origen_id?: string
          fecha?: string
          fecha_creacion?: string | null
          id?: string
          monto?: number
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_cuenta_destino_id_fkey"
            columns: ["cuenta_destino_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_cuenta_origen_id_fkey"
            columns: ["cuenta_origen_id"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          activo: boolean | null
          apellido: string
          email: string
          fecha_creacion: string | null
          id: string
          nombre: string
          password: string
          rol: string
          ultima_sesion: string | null
        }
        Insert: {
          activo?: boolean | null
          apellido: string
          email: string
          fecha_creacion?: string | null
          id?: string
          nombre: string
          password: string
          rol: string
          ultima_sesion?: string | null
        }
        Update: {
          activo?: boolean | null
          apellido?: string
          email?: string
          fecha_creacion?: string | null
          id?: string
          nombre?: string
          password?: string
          rol?: string
          ultima_sesion?: string | null
        }
        Relationships: []
      }
      vehiculos: {
        Row: {
          activo: boolean | null
          anio: number
          costo_mantenimiento: number | null
          costo_por_km: number | null
          estatus: string | null
          fecha_creacion: string | null
          fecha_vencimiento_poliza: string | null
          id: string
          incidencias: number | null
          km_acumulados: number
          km_para_servicio: number | null
          marca: string
          modelo: string
          nivel_servicio: number | null
          numero_eco: string
          operador_id: string | null
          poliza_seguro: string | null
          rendimiento_promedio: number | null
          saldo_casetas: number | null
          ultima_actualizacion: string | null
        }
        Insert: {
          activo?: boolean | null
          anio: number
          costo_mantenimiento?: number | null
          costo_por_km?: number | null
          estatus?: string | null
          fecha_creacion?: string | null
          fecha_vencimiento_poliza?: string | null
          id?: string
          incidencias?: number | null
          km_acumulados?: number
          km_para_servicio?: number | null
          marca: string
          modelo: string
          nivel_servicio?: number | null
          numero_eco: string
          operador_id?: string | null
          poliza_seguro?: string | null
          rendimiento_promedio?: number | null
          saldo_casetas?: number | null
          ultima_actualizacion?: string | null
        }
        Update: {
          activo?: boolean | null
          anio?: number
          costo_mantenimiento?: number | null
          costo_por_km?: number | null
          estatus?: string | null
          fecha_creacion?: string | null
          fecha_vencimiento_poliza?: string | null
          id?: string
          incidencias?: number | null
          km_acumulados?: number
          km_para_servicio?: number | null
          marca?: string
          modelo?: string
          nivel_servicio?: number | null
          numero_eco?: string
          operador_id?: string | null
          poliza_seguro?: string | null
          rendimiento_promedio?: number | null
          saldo_casetas?: number | null
          ultima_actualizacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      viajes: {
        Row: {
          casetas_costo: number | null
          cliente_id: string | null
          combustible_costo: number | null
          combustible_litros: number | null
          destino_id: string | null
          estado: string | null
          fecha_creacion: string | null
          fecha_llegada: string | null
          fecha_retorno: string | null
          fecha_salida: string
          gastos_no_deducibles: number | null
          id: string
          ingresos: number | null
          km_recorridos: number | null
          notas: string | null
          numero_entregas: number | null
          operador_id: string | null
          otros_gastos: number | null
          otros_gastos_detalles: string | null
          tiempo_descarga: unknown | null
          ultima_actualizacion: string | null
          vehiculo_id: string | null
        }
        Insert: {
          casetas_costo?: number | null
          cliente_id?: string | null
          combustible_costo?: number | null
          combustible_litros?: number | null
          destino_id?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_llegada?: string | null
          fecha_retorno?: string | null
          fecha_salida: string
          gastos_no_deducibles?: number | null
          id?: string
          ingresos?: number | null
          km_recorridos?: number | null
          notas?: string | null
          numero_entregas?: number | null
          operador_id?: string | null
          otros_gastos?: number | null
          otros_gastos_detalles?: string | null
          tiempo_descarga?: unknown | null
          ultima_actualizacion?: string | null
          vehiculo_id?: string | null
        }
        Update: {
          casetas_costo?: number | null
          cliente_id?: string | null
          combustible_costo?: number | null
          combustible_litros?: number | null
          destino_id?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_llegada?: string | null
          fecha_retorno?: string | null
          fecha_salida?: string
          gastos_no_deducibles?: number | null
          id?: string
          ingresos?: number | null
          km_recorridos?: number | null
          notas?: string | null
          numero_entregas?: number | null
          operador_id?: string | null
          otros_gastos?: number | null
          otros_gastos_detalles?: string | null
          tiempo_descarga?: unknown | null
          ultima_actualizacion?: string | null
          vehiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "viajes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "destinos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      kpis_operativos: {
        Row: {
          asistencias: number | null
          combustible: number | null
          combustible_presupuestado: number | null
          kilometros: number | null
          pedidos_entregados: number | null
          pedidos_programados: number | null
        }
        Relationships: []
      }
      resumen_financiero: {
        Row: {
          gastos: number | null
          ingresos: number | null
          mes: string | null
          saldo: number | null
        }
        Relationships: []
      }
      resumen_financiero_semanal: {
        Row: {
          gastos: number | null
          ingresos: number | null
          saldo: number | null
          semana: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
