
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

type Vehicle = {
  id: string;
  name: string;
  status: string;
  currentTemp: number;
  location: {
    lat: number;
    lng: number;
  };
};

type QualityMapProps = {
  vehicles: Vehicle[];
};

export default function QualityMap({ vehicles }: QualityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a production environment, you would use a library like Mapbox, Google Maps, or Leaflet
    if (mapRef.current) {
      const mapContainer = mapRef.current;
      
      // Clear previous content
      mapContainer.innerHTML = '';
      
      // Create a placeholder map with vehicle markers
      const mapDiv = document.createElement('div');
      mapDiv.className = 'relative w-full h-full bg-muted rounded-md overflow-hidden';
      
      // Add some texture to simulate a map
      mapDiv.style.backgroundImage = theme === 'dark' 
        ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23222222\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
      
      // Add city names
      const cities = [
        { name: 'Ciudad de México', x: '50%', y: '50%' },
        { name: 'Toluca', x: '30%', y: '60%' },
        { name: 'Cuernavaca', x: '55%', y: '70%' },
        { name: 'Pachuca', x: '60%', y: '30%' },
        { name: 'Puebla', x: '75%', y: '60%' }
      ];
      
      cities.forEach(city => {
        const cityLabel = document.createElement('div');
        cityLabel.className = 'absolute text-xs text-muted-foreground';
        cityLabel.textContent = city.name;
        cityLabel.style.left = city.x;
        cityLabel.style.top = city.y;
        cityLabel.style.transform = 'translate(-50%, -50%)';
        mapDiv.appendChild(cityLabel);
      });
      
      // Add roads
      const roads = [
        { from: { x: '50%', y: '50%' }, to: { x: '30%', y: '60%' } },
        { from: { x: '50%', y: '50%' }, to: { x: '55%', y: '70%' } },
        { from: { x: '50%', y: '50%' }, to: { x: '60%', y: '30%' } },
        { from: { x: '50%', y: '50%' }, to: { x: '75%', y: '60%' } }
      ];
      
      roads.forEach(road => {
        const roadLine = document.createElement('div');
        roadLine.className = 'absolute bg-muted-foreground/30';
        
        // Calculate road length and angle
        const fromX = parseFloat(road.from.x) / 100 * mapDiv.clientWidth;
        const fromY = parseFloat(road.from.y) / 100 * mapDiv.clientHeight;
        const toX = parseFloat(road.to.x) / 100 * mapDiv.clientWidth;
        const toY = parseFloat(road.to.y) / 100 * mapDiv.clientHeight;
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        roadLine.style.width = `${length}px`;
        roadLine.style.height = '1px';
        roadLine.style.left = `${fromX}px`;
        roadLine.style.top = `${fromY}px`;
        roadLine.style.transformOrigin = '0 0';
        roadLine.style.transform = `rotate(${angle}deg)`;
        
        mapDiv.appendChild(roadLine);
      });
      
      // Add vehicle markers
      vehicles.forEach(vehicle => {
        // Convert lat/lng to x/y positions for our simple map
        // This is just a placeholder calculation - in a real map you'd use proper projection
        const posX = ((vehicle.location.lng + 99.4) / 0.4) * 100; // Scale to 0-100% range
        const posY = ((vehicle.location.lat - 19.2) / 0.4) * 100; // Scale to 0-100% range
        
        const marker = document.createElement('div');
        marker.className = 'absolute';
        marker.style.left = `${posX}%`;
        marker.style.top = `${posY}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        
        // Marker style based on status
        const color = vehicle.status === 'Óptimo' ? 'text-green-500' 
                    : vehicle.status === 'Advertencia' ? 'text-amber-500' 
                    : 'text-red-500';
        
        marker.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="w-4 h-4 rounded-full ${color} bg-current shadow-md"></div>
            <div class="text-xs font-semibold mt-1">${vehicle.name}</div>
            <div class="text-xs ${color}">${vehicle.currentTemp}°C</div>
          </div>
        `;
        
        // Add click event for details
        marker.addEventListener('click', () => {
          alert(`Vehículo: ${vehicle.name}\nTemperatura: ${vehicle.currentTemp}°C\nEstado: ${vehicle.status}`);
        });
        
        mapDiv.appendChild(marker);
      });
      
      mapContainer.appendChild(mapDiv);
      
      // Add placeholder zoom controls
      const zoomControls = document.createElement('div');
      zoomControls.className = 'absolute top-2 right-2 bg-background/80 rounded-md shadow-md flex flex-col';
      
      const zoomIn = document.createElement('button');
      zoomIn.className = 'p-1 text-xl hover:bg-muted';
      zoomIn.textContent = '+';
      
      const zoomOut = document.createElement('button');
      zoomOut.className = 'p-1 text-xl hover:bg-muted';
      zoomOut.textContent = '−';
      
      zoomControls.appendChild(zoomIn);
      zoomControls.appendChild(zoomOut);
      
      mapDiv.appendChild(zoomControls);
    }
  }, [vehicles, theme]);
  
  return (
    <div ref={mapRef} className="w-full h-full">
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground">Cargando mapa...</span>
      </div>
    </div>
  );
}
