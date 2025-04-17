import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus, FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  accionesEjecutivas,
  tiposDeAccion,
  categoriasComunes,
  resultadosEsperadosComunes,
  usuariosOrganizacion,
} from "@/data/mock-data";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AccionesPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    categoria: "",
    categoriaPersonalizada: "",
    usuarioAsignado: "",
    fechaAsignacion: new Date(),
    resultadoEsperado: "",
    resultadoPersonalizado: "",
    fechaEvaluacion: addDays(new Date(), 7),
    notas: "",
    evidencia: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, evidencia: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    
    // Simular envío exitoso
    toast.success("Acción ejecutiva registrada correctamente");
    setIsDialogOpen(false);
    
    // Resetear formulario
    setFormData({
      tipo: "",
      descripcion: "",
      categoria: "",
      categoriaPersonalizada: "",
      usuarioAsignado: "",
      fechaAsignacion: new Date(),
      resultadoEsperado: "",
      resultadoPersonalizado: "",
      fechaEvaluacion: addDays(new Date(), 7),
      notas: "",
      evidencia: null,
    });
  };
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const handleSendNotification = async () => {
    if (!selectedAction) return;
    
    try {
      // Here you would implement the actual notification sending logic
      // This is a placeholder that shows a success message
      toast.success("Notificación enviada correctamente");
      setOpenConfirmDialog(false);
      setSelectedAction(null);
    } catch (error) {
      toast.error("Error al enviar la notificación");
    }
  };

  // Columnas para la tabla de acciones
  const accionesColumns = [
    { header: "Tipo", accessor: "tipo", 
      cell: (value: string) => (
        <span className={`capitalize ${value === 'preventiva' ? 'text-flota-primary' : 'text-flota-danger'}`}>
          {value}
        </span>
      )
    },
    { header: "Descripción", accessor: "descripcion" },
    { header: "Categoría", accessor: "categoria" },
    { header: "Asignado a", accessor: "usuarioAsignado" },
    { header: "F. Asignación", accessor: "fechaAsignacion",
      cell: (value: string) => format(new Date(value), "dd/MM/yyyy")
    },
    { header: "F. Evaluación", accessor: "fechaEvaluacion",
      cell: (value: string) => format(new Date(value), "dd/MM/yyyy")
    },
    { header: "Estado", accessor: "estado",
      cell: (value: string) => {
        let color = "";
        switch (value) {
          case "completada":
            color = "text-green-500";
            break;
          case "en progreso":
            color = "text-flota-primary";
            break;
          case "pendiente":
            color = "text-flota-secondary";
            break;
          default:
            color = "text-flota-danger";
        }
        return <span className={`capitalize ${color}`}>{value}</span>;
      }
    },
    { 
      header: "Acciones", 
      accessor: "id",
      cell: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/agenda?accion=${row.id}`)}
            className="hover:bg-black/40"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span>Ver</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAction(row);
              setOpenConfirmDialog(true);
            }}
            className="hover:bg-black/40"
          >
            <Mail className="h-4 w-4 mr-1" />
            <span>Enviar</span>
          </Button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Acciones Ejecutivas" 
        subtitle="Registro y seguimiento de acciones preventivas y correctivas"
        actions={
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-flota-primary hover:bg-flota-primary/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Acción
          </Button>
        }
      />

      <div className="card-dashboard">
        <DataTable 
          data={accionesEjecutivas} 
          columns={accionesColumns}
        />
      </div>

      {/* Formulario de registro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-flota-background border-flota-secondary/20 text-flota-text max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat">Registrar Nueva Acción Ejecutiva</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de acción */}
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de acción</label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger className="bg-black/40 border-flota-secondary/30">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-flota-background border-flota-secondary/30">
                    {tiposDeAccion.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="capitalize">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Usuario asignado */}
              <div>
                <label className="block text-sm font-medium mb-1">Usuario asignado</label>
                <Select 
                  value={formData.usuarioAsignado} 
                  onValueChange={(value) => handleSelectChange("usuarioAsignado", value)}
                >
                  <SelectTrigger className="bg-black/40 border-flota-secondary/30">
                    <SelectValue placeholder="Seleccionar usuario" />
                  </SelectTrigger>
                  <SelectContent className="bg-flota-background border-flota-secondary/30">
                    {usuariosOrganizacion.map((usuario) => (
                      <SelectItem key={usuario} value={usuario}>
                        {usuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descripción de la acción</label>
                <Textarea 
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe la acción a realizar..."
                  className="bg-black/40 border-flota-secondary/30 h-20"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => handleSelectChange("categoria", value)}
                >
                  <SelectTrigger className="bg-black/40 border-flota-secondary/30">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-flota-background border-flota-secondary/30">
                    {categoriasComunes.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categoría personalizada (si selecciona "Otro") */}
              {formData.categoria === "Otro" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría personalizada</label>
                  <Input 
                    name="categoriaPersonalizada"
                    value={formData.categoriaPersonalizada}
                    onChange={handleInputChange}
                    placeholder="Especificar categoría..."
                    className="bg-black/40 border-flota-secondary/30"
                  />
                </div>
              )}

              {/* Fecha de asignación */}
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de asignación</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-black/40 border-flota-secondary/30"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaAsignacion ? (
                        format(formData.fechaAsignacion, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-flota-background border-flota-secondary/30">
                    <Calendar
                      mode="single"
                      selected={formData.fechaAsignacion}
                      onSelect={(date) => handleDateChange("fechaAsignacion", date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha de evaluación */}
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de evaluación</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-black/40 border-flota-secondary/30"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaEvaluacion ? (
                        format(formData.fechaEvaluacion, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-flota-background border-flota-secondary/30">
                    <Calendar
                      mode="single"
                      selected={formData.fechaEvaluacion}
                      onSelect={(date) => handleDateChange("fechaEvaluacion", date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Resultado esperado */}
              <div>
                <label className="block text-sm font-medium mb-1">Resultado esperado</label>
                <Select 
                  value={formData.resultadoEsperado} 
                  onValueChange={(value) => handleSelectChange("resultadoEsperado", value)}
                >
                  <SelectTrigger className="bg-black/40 border-flota-secondary/30">
                    <SelectValue placeholder="Seleccionar resultado" />
                  </SelectTrigger>
                  <SelectContent className="bg-flota-background border-flota-secondary/30">
                    {resultadosEsperadosComunes.map((resultado) => (
                      <SelectItem key={resultado} value={resultado}>
                        {resultado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resultado personalizado (si selecciona "Otro") */}
              {formData.resultadoEsperado === "Otro" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Resultado personalizado</label>
                  <Input 
                    name="resultadoPersonalizado"
                    value={formData.resultadoPersonalizado}
                    onChange={handleInputChange}
                    placeholder="Especificar resultado..."
                    className="bg-black/40 border-flota-secondary/30"
                  />
                </div>
              )}

              {/* Notas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
                <Textarea 
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  placeholder="Notas adicionales..."
                  className="bg-black/40 border-flota-secondary/30 h-20"
                />
              </div>

              {/* Carga de evidencia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Carga de evidencia (opcional)</label>
                <Input 
                  type="file"
                  onChange={handleFileChange}
                  className="bg-black/40 border-flota-secondary/30"
                />
                <p className="text-xs text-flota-secondary mt-1">
                  Formatos permitidos: PNG, JPG, PDF (max. 5MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent border-flota-secondary/30 text-flota-text hover:bg-black/40"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-flota-primary hover:bg-flota-primary/90 text-black"
              >
                Guardar Acción
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enviar notificación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas enviar una notificación al usuario asignado?
              La notificación será enviada por correo electrónico, WhatsApp y la aplicación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendNotification}>
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
