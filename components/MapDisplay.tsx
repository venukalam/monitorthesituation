import React, { useRef, useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import { MissileLaunch, MissileStatus } from '../types';

// Leaflet CSS is now imported in index.html

interface MapDisplayProps {
  missiles: MissileLaunch[];
  className?: string;
}

interface ActiveImpact {
  id: string;
  marker: L.CircleMarker;
  startTime: number;
  color: string;
  maxRadius: number;
  duration: number; // ms
}

const MAP_ID = 'global-war-map-leaflet';

const getMissileStatusColor = (status: MissileStatus): string => {
  switch (status) {
    case MissileStatus.EN_ROUTE: return '#FF00FF'; // Magenta
    case MissileStatus.LAUNCH_DETECTED: return '#FFFF00'; // Yellow
    case MissileStatus.INTERCEPTED: return '#00FFFF'; // Cyan
    case MissileStatus.IMPACTED: return '#FF0000'; // Red (though impacts have their own color)
    default: return '#FF0000'; // Default Red
  }
};

const MapDisplay: React.FC<MapDisplayProps> = ({ missiles, className }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const missileLayersRef = useRef<L.FeatureGroup>(L.featureGroup()); // Group to hold all missile polylines
  const missilePolylineRefs = useRef<Map<string, L.Polyline>>(new Map()); // Refs to individual polylines by missile ID
  const impactLayersRef = useRef<L.FeatureGroup>(L.featureGroup());
  
  const [activeImpacts, setActiveImpacts] = useState<ActiveImpact[]>([]);
  const activeImpactsMapRef = useRef<Map<string, ActiveImpact>>(new Map());
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    console.log('[MapDisplay] Attempting to initialize Leaflet map.');
    if (typeof L === 'undefined' || !L || typeof L.map !== 'function') {
      console.error("[MapDisplay] CRITICAL: Leaflet JS module not loaded correctly or 'L.map' is missing. Leaflet object:", L);
      return;
    }

    const mapInstance = L.map(mapContainerRef.current, {
        preferCanvas: true,
    }).setView([33, 45], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(mapInstance);

    mapRef.current = mapInstance;
    missileLayersRef.current.addTo(mapInstance); // Add the main missile container group
    impactLayersRef.current.addTo(mapInstance);
    
    console.log('[MapDisplay] Leaflet map instance created successfully for Iran-Israel theater.');

    return () => {
      console.log("[MapDisplay] Cleanup: Removing Leaflet map instance.");
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      activeImpactsMapRef.current.clear();
      setActiveImpacts([]);
      
      // Clear individual polylines and the group
      missilePolylineRefs.current.forEach(polyline => polyline.remove());
      missilePolylineRefs.current.clear();
      if (missileLayersRef.current) {
        missileLayersRef.current.clearLayers(); // Ensure group is empty
        missileLayersRef.current.remove(); // Remove group from map
      }

      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, []);

  const animateImpacts = useCallback(() => {
    if (!mapRef.current) return;

    const currentTime = Date.now();
    let stillAnimating = false;
    
    activeImpactsMapRef.current.forEach((impact, id) => {
      const elapsedTime = currentTime - impact.startTime;
      const progress = Math.min(elapsedTime / impact.duration, 1);

      if (progress < 1) {
        const currentRadius = impact.maxRadius * Math.sin(progress * Math.PI / 2);
        const currentOpacity = 0.8 * (1 - progress);

        impact.marker.setRadius(currentRadius);
        impact.marker.setStyle({ opacity: currentOpacity, fillOpacity: currentOpacity * 0.5 });
        stillAnimating = true;
      } else {
        impactLayersRef.current.removeLayer(impact.marker);
        activeImpactsMapRef.current.delete(id);
      }
    });
    
    const currentActiveImpactArray = Array.from(activeImpactsMapRef.current.values());
    if (activeImpacts.length !== currentActiveImpactArray.length) {
         setActiveImpacts(currentActiveImpactArray);
    }

    if (stillAnimating) {
      animationFrameIdRef.current = requestAnimationFrame(animateImpacts);
    } else {
      animationFrameIdRef.current = null;
    }
  }, [activeImpacts]);


  useEffect(() => {
    if (!mapRef.current || !missileLayersRef.current) return;

    const currentMissilePolylines = missilePolylineRefs.current;
    const activeMissileIds = new Set<string>();

    // Update or add missile polylines
    missiles.forEach(missile => {
      const shouldBeVisible = missile.status !== MissileStatus.IMPACTED && missile.status !== MissileStatus.INTERCEPTED;
      activeMissileIds.add(missile.id);

      if (shouldBeVisible) {
        const existingPolyline = currentMissilePolylines.get(missile.id);
        const latLngs: L.LatLngExpression[] = [
          [missile.origin.lat, missile.origin.lng],
          [missile.destination.lat, missile.destination.lng]
        ];
        const color = getMissileStatusColor(missile.status);

        if (existingPolyline) {
          // Update existing polyline (e.g., color if status changed)
          existingPolyline.setLatLngs(latLngs); // Redundant if path doesn't change, but safe
          existingPolyline.setStyle({ color: color, weight: 1, dashArray: '5, 5' }); // Ensure style is consistent
        } else {
          // Create new polyline
          const newPolyline = L.polyline(latLngs, {
            color: color,
            weight: 1, // Thinner line
            opacity: 0.8,
            dashArray: '5, 5' // Dotted line: 5px dash, 5px gap
          }).addTo(missileLayersRef.current); // Add to the main group
          currentMissilePolylines.set(missile.id, newPolyline);
        }
      } else {
        // If missile should not be visible, ensure it's removed
        const existingPolyline = currentMissilePolylines.get(missile.id);
        if (existingPolyline) {
          missileLayersRef.current.removeLayer(existingPolyline); // Remove from the group
          currentMissilePolylines.delete(missile.id);
        }
      }
    });

    // Remove polylines for missiles that are no longer in the 'missiles' prop
    currentMissilePolylines.forEach((polyline, missileId) => {
      if (!missiles.find(m => m.id === missileId)) { // If missile is gone from prop
         missileLayersRef.current.removeLayer(polyline);
         currentMissilePolylines.delete(missileId);
      } else {
         // Additional check: if it's still in props but its status means it shouldn't be visible
         const missileInData = missiles.find(m => m.id === missileId);
         if (missileInData && (missileInData.status === MissileStatus.IMPACTED || missileInData.status === MissileStatus.INTERCEPTED)) {
            missileLayersRef.current.removeLayer(polyline);
            currentMissilePolylines.delete(missileId);
         }
      }
    });


    // Handle new impacts
    let newImpactsAdded = false;
    missiles.forEach(missile => {
      const impactId = missile.id + '_impact';
      if (
        (missile.status === MissileStatus.IMPACTED || missile.status === MissileStatus.INTERCEPTED) &&
        missile.impactTime &&
        Date.now() - missile.impactTime < 2500 && // Sync with impact animation duration
        !activeImpactsMapRef.current.has(impactId)
      ) {
        const color = missile.status === MissileStatus.INTERCEPTED ? '#00FFFF' : '#FF0000';
        const impactMarker = L.circleMarker([missile.destination.lat, missile.destination.lng], {
          radius: 0,
          color: color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.4,
        }).addTo(impactLayersRef.current);

        const newImpact: ActiveImpact = {
          id: impactId,
          marker: impactMarker,
          startTime: missile.impactTime,
          color: color,
          maxRadius: missile.status === MissileStatus.INTERCEPTED ? 15 : 25,
          duration: 1200, // Reduced impact animation duration
        };
        activeImpactsMapRef.current.set(impactId, newImpact);
        newImpactsAdded = true;
      }
    });

    if (newImpactsAdded) {
      setActiveImpacts(Array.from(activeImpactsMapRef.current.values()));
      if (!animationFrameIdRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animateImpacts);
      }
    }
  }, [missiles, animateImpacts]);


  useEffect(() => {
    if (activeImpactsMapRef.current.size > 0 && !animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(animateImpacts);
    }
    return () => {
      if (animationFrameIdRef.current && activeImpactsMapRef.current.size === 0) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [animateImpacts]);

  return <div ref={mapContainerRef} id={MAP_ID} className={`w-full h-full ${className}`} />;
};

export default MapDisplay;