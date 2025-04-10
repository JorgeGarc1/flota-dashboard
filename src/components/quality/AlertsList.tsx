
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';

type Alert = {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
  severity: string;
  value: number;
  timestamp: string;
  status: string;
  location: {
    zone: string;
    address: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
};

type AlertsListProps = {
  alerts: Alert[];
};

export default function AlertsList({ alerts }: AlertsListProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Filter alerts based on the selected tab
  const filteredAlerts = selectedTab === 'all' 
    ? alerts 
    : alerts.filter(alert => 
        selectedTab === 'high' 
          ? alert.severity === 'high'
          : selectedTab === 'medium'
            ? alert.severity === 'medium'
            : alert.severity === 'low'
      );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas e Incidentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Todas ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-red-500">
              Críticas ({alerts.filter(a => a.severity === 'high').length})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-amber-500">
              Advertencias ({alerts.filter(a => a.severity === 'medium').length})
            </TabsTrigger>
            <TabsTrigger value="low" className="text-blue-500">
              Informativas ({alerts.filter(a => a.severity === 'low').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No hay alertas en esta categoría
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          {alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : alert.severity === 'medium' ? (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-500" />
                          )}
                        </TableCell>
                        <TableCell>{alert.vehicleName}</TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>
                          {alert.type.includes('Temperatura') 
                            ? `${alert.value}°C` 
                            : alert.value}
                        </TableCell>
                        <TableCell>{alert.location.zone}</TableCell>
                        <TableCell>
                          {new Date(alert.timestamp).toLocaleTimeString('es-MX', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={
                            alert.status === 'Nueva' 
                              ? 'text-red-500' 
                              : alert.status === 'En revisión' 
                                ? 'text-amber-500' 
                                : 'text-green-500'
                          }>
                            {alert.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">Ver</Button>
                            <Button variant="outline" size="sm">Atender</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
