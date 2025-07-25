
import L from 'leaflet';
import { Warehouse, Chauffeur } from '../../types';
import { warehouseIcon, chauffeurIcon, desktopWarehouseIcon, desktopChauffeurIcon } from './MapIcons';

interface CreateMarkersOptions {
  warehouses: Warehouse[];
  chauffeurs: Chauffeur[];
  map: L.Map;
  t: (key: string) => string;
  onWarehouseClick?: (warehouse: Warehouse) => void;
  onChauffeurClick?: (chauffeur: Chauffeur) => void;
  isMobile?: boolean;
}

// Cache pour éviter la recréation des marqueurs
const markerCache = new Map<string, L.Marker>();

const createGoogleMapsLink = (lat: number, lng: number, name: string) => {
  const encodedName = encodeURIComponent(name);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedName}`;
};

export const createMarkers = ({
  warehouses,
  chauffeurs,
  map,
  t,
  onWarehouseClick,
  onChauffeurClick,
  isMobile = false
}: CreateMarkersOptions): L.Marker[] => {
  const markers: L.Marker[] = [];
  const currentMarkerIds = new Set<string>();

  // Choose appropriate icons based on mobile/desktop
  const warehouseIconToUse = isMobile ? warehouseIcon : desktopWarehouseIcon;
  const chauffeurIconToUse = isMobile ? chauffeurIcon : desktopChauffeurIcon;

  // Popup styling based on mobile/desktop
  const popupPadding = isMobile ? '12px' : '12px';
  const popupMinWidth = isMobile ? '280px' : '200px';
  const popupMaxWidth = isMobile ? '320px' : '250px';
  const popupFontSize = isMobile ? '14px' : '14px';
  const popupTitleSize = isMobile ? '16px' : '16px';
  const popupMargin = isMobile ? '8px' : '8px';
  const popupLineMargin = isMobile ? '6px' : '4px';

  // Add warehouse markers
  warehouses.forEach(warehouse => {
    const markerId = `warehouse-${warehouse.id}`;
    currentMarkerIds.add(markerId);
    
    let marker = markerCache.get(markerId);
    
    if (!marker) {
      marker = L.marker([warehouse.coordinates.lat, warehouse.coordinates.lng], {
        icon: warehouseIconToUse
      });

      const googleMapsUrl = createGoogleMapsLink(
        warehouse.coordinates.lat,
        warehouse.coordinates.lng,
        warehouse.name
      );

      // Create popup content with Google Maps link
      const popupContent = `
        <div style="padding: ${popupPadding}; min-width: ${popupMinWidth}; max-width: ${popupMaxWidth}; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <h3 style="font-weight: 600; font-size: ${popupTitleSize}; margin-bottom: ${popupMargin}; color: #1f2937; word-wrap: break-word;">${warehouse.name}</h3>
          <p style="font-size: ${popupFontSize}; color: #6b7280; margin-bottom: ${popupLineMargin}; word-wrap: break-word;"><strong>${t('warehouses.company')}:</strong> ${warehouse.companyName}</p>
          <p style="font-size: ${popupFontSize}; color: #6b7280; margin-bottom: ${popupLineMargin}; word-wrap: break-word;"><strong>${t('warehouses.address')}:</strong> ${warehouse.address}</p>
          <p style="font-size: ${popupFontSize}; color: #6b7280; margin-bottom: ${popupMargin}; word-wrap: break-word;"><strong>${t('warehouses.phone')}:</strong> ${warehouse.phone.join(', ')}</p>
          <a href="${googleMapsUrl}" target="_blank" style="display: inline-block; background: #4285f4; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; font-size: ${popupFontSize}; font-weight: 500; margin-top: 4px;">📍 Ouvrir dans Google Maps</a>
        </div>
      `;

      // Bind popup with proper configuration
      marker.bindPopup(popupContent, {
        maxWidth: isMobile ? 320 : 250,
        closeButton: true,
        autoClose: false,
        autoPan: true,
        offset: [0, -10],
        className: 'custom-popup'
      });

      // Add click event handler
      marker.on('click', () => {
        marker.openPopup();
        if (onWarehouseClick) {
          onWarehouseClick(warehouse);
        }
      });

      // Cache the marker
      markerCache.set(markerId, marker);
    }

    // Only add to map if not already added
    if (!map.hasLayer(marker)) {
      marker.addTo(map);
    }
    
    markers.push(marker);
  });

  // Add chauffeur markers
  chauffeurs.forEach(chauffeur => {
    if (chauffeur.coordinates) {
      const markerId = `chauffeur-${chauffeur.id}`;
      currentMarkerIds.add(markerId);
      
      let marker = markerCache.get(markerId);
      
      if (!marker) {
        const displayName = chauffeur.employeeType === 'externe' 
          ? `TP - ${chauffeur.fullName}` 
          : chauffeur.fullName;

        marker = L.marker([chauffeur.coordinates.lat, chauffeur.coordinates.lng], {
          icon: chauffeurIconToUse
        });

        // Create popup content
        const popupContent = `
          <div style="padding: ${popupPadding}; min-width: ${popupMinWidth}; max-width: ${popupMaxWidth}; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <h3 style="font-weight: 600; font-size: ${popupTitleSize}; margin-bottom: ${popupMargin}; color: #1f2937; word-wrap: break-word;">${displayName}</h3>
            <p style="font-size: ${popupFontSize}; color: #6b7280; margin-bottom: ${popupLineMargin}; word-wrap: break-word;"><strong>${t('chauffeurs.employeeType')}:</strong> ${chauffeur.employeeType}</p>
            <p style="font-size: ${popupFontSize}; color: #6b7280; margin-bottom: ${popupLineMargin}; word-wrap: break-word;"><strong>${t('chauffeurs.vehicleType')}:</strong> ${chauffeur.vehicleType}</p>
            <p style="font-size: ${popupFontSize}; color: #6b7280; word-wrap: break-word;"><strong>${t('chauffeurs.phone')}:</strong> ${chauffeur.phone.join(', ')}</p>
          </div>
        `;

        // Bind popup with proper configuration
        marker.bindPopup(popupContent, {
          maxWidth: isMobile ? 320 : 250,
          closeButton: true,
          autoClose: false,
          autoPan: true,
          offset: [0, -10],
          className: 'custom-popup'
        });

        // Add click event handler  
        marker.on('click', () => {
          marker.openPopup();
          if (onChauffeurClick) {
            onChauffeurClick(chauffeur);
          }
        });

        // Cache the marker
        markerCache.set(markerId, marker);
      }

      // Only add to map if not already added
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
      
      markers.push(marker);
    }
  });

  // Remove markers that are no longer needed
  markerCache.forEach((marker, markerId) => {
    if (!currentMarkerIds.has(markerId)) {
      map.removeLayer(marker);
      markerCache.delete(markerId);
    }
  });

  return markers;
};

export const fitMapToMarkers = (map: L.Map, markers: L.Marker[], forceRefresh = false) => {
  if (markers.length > 0 && forceRefresh) {
    const group = L.featureGroup(markers);
    const bounds = group.getBounds();
    
    // Add padding and ensure minimum zoom level
    map.fitBounds(bounds, {
      padding: [20, 20],
      maxZoom: 15
    });
  } else if (markers.length > 0) {
    // Only fit if the map hasn't been manually interacted with
    const currentZoom = map.getZoom();
    const defaultZoom = 6;
    
    if (Math.abs(currentZoom - defaultZoom) < 1) {
      const group = L.featureGroup(markers);
      const bounds = group.getBounds();
      
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 15
      });
    }
  } else {
    // Default view if no markers
    map.setView([28.0339, 1.6596], 6);
  }
};
