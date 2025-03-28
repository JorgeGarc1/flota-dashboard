
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format, isBefore, isAfter, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { eventosCalendario, accionesEjecutivas } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AgendaPage() {
  const [searchParams] = useSearchParams();
  const accionId = searchParams.get("accion");
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [editingAccion, setEditingAccion] = useState<any>(null);
  const [accionNotas, setAccionNotas] = useState("");
  const [accionEstado, setAccionEstado] = useState("");
  
  // Si llega con un parámetro de acción, abrimos el dialog automáticamente
  useEffect(() => {
    if (accionId) {
      const accionIdNum = parseInt(accionId);
      const evento = eventosCalendario.find(e => e.accionId === accionIdNum);
      if (evento) {
        setSelectedEventId(evento.id);
        setIsDialogOpen(true);
      }
    }
  }, [accionId]);

  const getEventsByDate = (date: Date) => {
    return eventosCalendario.filter(evento => 
      isSameDay(new Date(evento.date), date)
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const eventos = getEventsByDate(date);
      
      if (eventos.length > 0) {
        setSelectedEventId(eventos[0].id);
        setIsDialogOpen(true);
      }
    }
  };

  const getSelectedEvent = () => {
    return eventosCalendario.find(evento => evento.id === selectedEventId);
  };

  const getAccionForEvent = (evento: typeof eventosCalendario[0] | undefined) => {
    if (!evento) return null;
    return accionesEjecutivas.find(accion => accion.id === evento.accionId);
  };

  const handleChangeEstado = (estado: string) => {
    toast.success(`Estado cambiado a: ${estado}`);
    setIsDialogOpen(false);
  };

  const handleEditAccion = () => {
    const selectedEvent = getSelectedEvent();
    const selectedAccion = getAccionForEvent(selectedEvent);
    
    if (selectedAccion) {
      setEditingAccion(selectedAccion);
      setAccionNotas(selectedAccion.notas || "");
      setAccionEstado(selectedAccion.estado);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = () => {
    toast.success("Cambios guardados correctamente");
    setIsEditDialogOpen(false);
  };

  // Modificamos el enfoque de renderizado del calendario para evitar errores de TypeScript
  const handleRenderDay = (day: Date, modifiers: any) => {
    const events = getEventsByDate(day);
    if (events.length === 0) return null;
    
    const event = events[0]; // Tomamos el primer evento si hay varios
    let bgColorClass = "";
    
    switch (event.estado) {
      case "completado":
        bgColorClass = "bg-green-500";
        break;
      case "pendiente":
        bgColorClass = "bg-flota-primary";
        break;
      case "vencido":
        bgColorClass = "bg-flota-danger";
        break;
      case "proximo":
        bgColorClass = "bg-amber-500";
        break;
      default:
        bgColorClass = "bg-flota-secondary";
    }
    
    // Usamos classNames para personalizar el aspecto del día
    return {
      className: cn(modifiers.day_today ? "bg-flota-primary/20" : "", 
                   modifiers.day_selected ? "bg-flota-primary text-black" : "",
                   "relative")
    };
  };

  const selectedEvent = getSelectedEvent();
  const selectedAccion = getAccionForEvent(selectedEvent);

  return (
    <div>
      <PageHeader 
        title="Agenda de Evaluación" 
        subtitle="Seguimiento de fechas para evaluación de acciones ejecutivas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-dashboard">
          <div className="bg-black/40 p-6 rounded-lg border border-flota-secondary/20">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={es}
              className="mx-auto bg-black/40 p-4 rounded-lg border border-flota-secondary/20"
              modifiersClassNames={{
                today: "bg-flota-primary/20 text-flota-text",
                selected: "bg-flota-primary text-black",
              }}
              modifiers={{
                eventDay: (date) => getEventsByDate(date).length > 0
              }}
              modifiersStyles={{
                eventDay: {
                  fontWeight: "bold",
                  border: "2px solid var(--flota-primary)",
                  position: "relative"
                }
              }}
              styles={{
                day: { position: "relative" }
              }}
              components={{
                DayContent: (props) => {
                  const events = getEventsByDate(props.date);
                  return (
                    <div>
                      {props.children}
                      {events.length > 0 && (
                        <div className={`absolute h-2 w-2 ${
                          events[0].estado === "completado" ? "bg-green-500" :
                          events[0].estado === "pendiente" ? "bg-flota-primary" :
                          events[0].estado === "vencido" ? "bg-flota-danger" :
                          "bg-amber-500"
                        } rounded-full bottom-0.5 left-1/2 -ml-1`} />
                      )}
                    </div>
                  );
                }
              }}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="font-montserrat text-xl mb-4">Leyenda</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Eventos atendidos</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm">Próximos a vencer</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-flota-danger mr-2"></div>
                <span className="text-sm">Vencidos sin atender</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-flota-primary mr-2"></div>
                <span className="text-sm">Pendientes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de edición de acción */}
        <div className="card-dashboard">
          <h3 className="font-montserrat text-xl mb-4">Editar Acción</h3>
          {selectedAccion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Tipo de acción</h4>
                  <p className="capitalize">{selectedAccion.tipo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Categoría</h4>
                  <p>{selectedAccion.categoria}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Fecha asignación</h4>
                  <p>{format(new Date(selectedAccion.fechaAsignacion), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Fecha evaluación</h4>
                  <p>{format(new Date(selectedAccion.fechaEvaluacion), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Usuario asignado</h4>
                  <p>{selectedAccion.usuarioAsignado}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Estado</h4>
                  <Badge className={`capitalize ${
                    selectedAccion.estado === "completada"
                      ? "bg-green-500"
                      : selectedAccion.estado === "en progreso"
                      ? "bg-flota-primary"
                      : selectedAccion.estado === "pendiente"
                      ? "bg-amber-500"
                      : "bg-flota-danger"
                  }`}>
                    {selectedAccion.estado}
                  </Badge>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-flota-secondary">Descripción</h4>
                  <p>{selectedAccion.descripcion}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-flota-secondary">Notas</h4>
                  <Textarea
                    value={selectedAccion.notas || "Sin notas"}
                    className="min-h-[80px] bg-black/20 border-flota-secondary/30"
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline" 
                  className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-500"
                  onClick={() => handleChangeEstado("completada")}
                >
                  Completada
                </Button>
                <Button
                  size="sm" 
                  variant="outline"
                  className="bg-flota-primary/10 hover:bg-flota-primary/20 border-flota-primary/30 text-flota-primary"
                  onClick={() => handleChangeEstado("en progreso")}
                >
                  En progreso
                </Button>
                <Button
                  size="sm" 
                  variant="outline"
                  className="bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-500"
                  onClick={() => handleChangeEstado("pendiente")}
                >
                  Pendiente
                </Button>
                <Button
                  size="sm" 
                  variant="outline"
                  className="bg-flota-danger/10 hover:bg-flota-danger/20 border-flota-danger/30 text-flota-danger"
                  onClick={() => handleChangeEstado("cancelada")}
                >
                  Cancelada
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-flota-secondary">
              Selecciona una fecha en el calendario para ver o editar acciones
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-flota-background border-flota-secondary/20 text-flota-text max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat">
              {selectedEvent?.title || "Detalle de evento"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAccion && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Tipo de acción</h4>
                  <p className="capitalize">{selectedAccion.tipo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Categoría</h4>
                  <p>{selectedAccion.categoria}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Fecha asignación</h4>
                  <p>{format(new Date(selectedAccion.fechaAsignacion), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Fecha evaluación</h4>
                  <p>{format(new Date(selectedAccion.fechaEvaluacion), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Usuario asignado</h4>
                  <p>{selectedAccion.usuarioAsignado}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary">Estado</h4>
                  <p className={`capitalize ${
                    selectedAccion.estado === "completada"
                      ? "text-green-500"
                      : selectedAccion.estado === "en progreso"
                      ? "text-flota-primary"
                      : selectedAccion.estado === "pendiente"
                      ? "text-amber-500"
                      : "text-flota-danger"
                  }`}>
                    {selectedAccion.estado}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-flota-secondary">Descripción</h4>
                  <p>{selectedAccion.descripcion}</p>
                </div>
                {selectedAccion.notas && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-flota-secondary">Notas</h4>
                    <p>{selectedAccion.notas}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-flota-secondary/20 pt-4 flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary mb-2">Cambiar estado</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline" 
                      className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-500"
                      onClick={() => handleChangeEstado("completada")}
                    >
                      Completada
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline"
                      className="bg-flota-primary/10 hover:bg-flota-primary/20 border-flota-primary/30 text-flota-primary"
                      onClick={() => handleChangeEstado("en progreso")}
                    >
                      En progreso
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline"
                      className="bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-500"
                      onClick={() => handleChangeEstado("pendiente")}
                    >
                      Pendiente
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline"
                      className="bg-flota-danger/10 hover:bg-flota-danger/20 border-flota-danger/30 text-flota-danger"
                      onClick={() => handleChangeEstado("cancelada")}
                    >
                      Cancelada
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-flota-primary text-black hover:bg-flota-primary/90"
                  onClick={handleEditAccion}
                >
                  Editar Acción
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ventana modal de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-flota-background border-flota-secondary/20 text-flota-text max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat">
              Editar Acción
            </DialogTitle>
          </DialogHeader>
          
          {editingAccion && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary mb-1">Notas</h4>
                  <Textarea
                    value={accionNotas}
                    onChange={(e) => setAccionNotas(e.target.value)}
                    className="min-h-[100px] bg-black/20 border-flota-secondary/30"
                    placeholder="Añade notas adicionales..."
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-flota-secondary mb-1">Estado</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={accionEstado === "completada" ? "default" : "outline"}
                      className={accionEstado === "completada" 
                        ? "bg-green-500 text-white" 
                        : "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"}
                      onClick={() => setAccionEstado("completada")}
                    >
                      Completada
                    </Button>
                    <Button
                      size="sm"
                      variant={accionEstado === "en progreso" ? "default" : "outline"}
                      className={accionEstado === "en progreso" 
                        ? "bg-flota-primary text-black" 
                        : "bg-flota-primary/10 border-flota-primary/30 text-flota-primary hover:bg-flota-primary/20"}
                      onClick={() => setAccionEstado("en progreso")}
                    >
                      En progreso
                    </Button>
                    <Button
                      size="sm"
                      variant={accionEstado === "pendiente" ? "default" : "outline"}
                      className={accionEstado === "pendiente" 
                        ? "bg-amber-500 text-white" 
                        : "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"}
                      onClick={() => setAccionEstado("pendiente")}
                    >
                      Pendiente
                    </Button>
                    <Button
                      size="sm"
                      variant={accionEstado === "cancelada" ? "default" : "outline"}
                      className={accionEstado === "cancelada" 
                        ? "bg-flota-danger text-white" 
                        : "bg-flota-danger/10 border-flota-danger/30 text-flota-danger hover:bg-flota-danger/20"}
                      onClick={() => setAccionEstado("cancelada")}
                    >
                      Cancelada
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-flota-secondary/20 text-flota-text hover:bg-flota-secondary/30"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-flota-primary text-black hover:bg-flota-primary/90"
              onClick={handleSaveEdit}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
