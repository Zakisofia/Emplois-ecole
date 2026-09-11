import { useState, useEffect, useCallback } from 'react';
import { Room, ClassGroup, Professor, Week, ScheduleEntry, Conflict, DAYS, SLOTS } from '../types';

export function useAppState() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [currentWeekId, setCurrentWeekId] = useState<string>('');

  // Initial load
  useEffect(() => {
    const savedRooms = localStorage.getItem('cp_rooms');
    const savedClasses = localStorage.getItem('cp_classes');
    const savedProfs = localStorage.getItem('cp_profs');
    const savedWeeks = localStorage.getItem('cp_weeks');

    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      setRooms([
        { id: '1', label: 'Salle 2', capacity: 46, type: 'Normal' },
        { id: '2', label: 'Salle 3', capacity: 29, type: 'Normal' },
        { id: '3', label: 'Salle 4', capacity: 19, type: 'Normal' },
        { id: '4', label: 'Salle 5', capacity: 15, type: 'Normal' },
        { id: '5', label: 'NV APP 1', capacity: 30, type: 'TP Informatique' },
        { id: '6', label: 'NV APP 2', capacity: 30, type: 'TP Informatique' },
      ]);
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      setClasses([
        { id: 'c1', label: 'GE2', studentCount: 12, year: '2ème année', pole: 'Management & Commerce', vacationType: 'Jour' },
        { id: 'c2', label: 'DI2', studentCount: 16, year: '2ème année', pole: 'Informatique & IA', vacationType: 'Jour' },
        { id: 'c3', label: 'CYB2', studentCount: 15, year: '2ème année', pole: 'Informatique & IA', vacationType: 'Jour' },
      ]);
    }

    if (savedProfs) {
      setProfessors(JSON.parse(savedProfs));
    } else {
      setProfessors([
        { 
          id: 'p1', 
          name: 'M. Dubois', 
          specialty: 'Algorithmique', 
          subjects: ['Algorithmique', 'Python'], 
          targetWeeklyHours: 18, 
          unavailabilities: [],
          assignments: [
            { subject: 'Algorithmique', classId: 'c2', sessionsPerWeek: 2, durationPerSession: 1.5 }
          ]
        },
        { 
          id: 'p2', 
          name: 'Mme. Lefebvre', 
          specialty: 'Réseaux', 
          subjects: ['Cisco', 'TCP/IP'], 
          targetWeeklyHours: 15, 
          unavailabilities: [],
          assignments: [
            { subject: 'Cisco', classId: 'c3', sessionsPerWeek: 2, durationPerSession: 1.5 }
          ]
        },
      ]);
    }
    
    if (savedWeeks) {
      const parsedWeeks = JSON.parse(savedWeeks);
      setWeeks(parsedWeeks);
      if (parsedWeeks.length > 0) {
        setCurrentWeekId(parsedWeeks[0].id);
      }
    } else {
      // Default first week
      const firstWeek: Week = { 
        id: '2026-W01', 
        label: 'Semaine 1', 
        startDate: '2026-09-14',
        endDate: '2026-09-19',
        status: 'Active',
        schedule: [] 
      };
      setWeeks([firstWeek]);
      setCurrentWeekId(firstWeek.id);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cp_rooms', JSON.stringify(rooms));
    localStorage.setItem('cp_classes', JSON.stringify(classes));
    localStorage.setItem('cp_profs', JSON.stringify(professors));
    localStorage.setItem('cp_weeks', JSON.stringify(weeks));
  }, [rooms, classes, professors, weeks]);

  const currentWeek = weeks.find(w => w.id === currentWeekId);

  const updateSchedule = useCallback((entries: ScheduleEntry[]) => {
    setWeeks(prev => prev.map(w => w.id === currentWeekId ? { ...w, schedule: entries } : w));
  }, [currentWeekId]);

  const updateWeekMetadata = useCallback((id: string, metadata: Partial<Week>) => {
    setWeeks(prev => prev.map(w => w.id === id ? { ...w, ...metadata } : w));
  }, []);

  const deleteWeek = useCallback((id: string) => {
    setWeeks(prev => {
      const filtered = prev.filter(w => w.id !== id);
      if (currentWeekId === id && filtered.length > 0) {
        setCurrentWeekId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentWeekId]);

  const duplicateWeek = useCallback((sourceId: string, newId: string, newLabel: string, startDate: string, endDate: string) => {
    const source = weeks.find(w => w.id === sourceId);
    if (source) {
      const newWeek: Week = {
        ...source,
        id: newId,
        label: newLabel,
        startDate,
        endDate,
        status: 'Brouillon'
      };
      setWeeks(prev => [...prev, newWeek]);
      setCurrentWeekId(newId);
    }
  }, [weeks]);

  // Conflict detection
  const conflicts: Conflict[] = [];
  if (currentWeek) {
    const schedule = currentWeek.schedule;
    
    // Check Room Double Booking
    const roomUsage: Record<string, string[]> = {}; // day-slot-room -> [classIds]
    // Check Prof Double Booking
    const profUsage: Record<string, string[]> = {}; // day-slot-prof -> [classIds]
    // Prof Hours
    const profHours: Record<string, number> = {};

    schedule.forEach(entry => {
      const timeKey = `${entry.day}-${entry.slotIndex}`;
      
      // Room
      const rKey = `${timeKey}-${entry.roomId}`;
      roomUsage[rKey] = [...(roomUsage[rKey] || []), entry.classId];
      
      // Prof
      const pKey = `${timeKey}-${entry.profId}`;
      profUsage[pKey] = [...(profUsage[pKey] || []), entry.classId];

      // Hours (assuming each slot is 1.5h)
      profHours[entry.profId] = (profHours[entry.profId] || 0) + 1.5;

      // Room Capacity
      const room = rooms.find(r => r.id === entry.roomId);
      const group = classes.find(c => c.id === entry.classId);
      if (room && group && group.studentCount > room.capacity) {
        conflicts.push({
          type: 'danger',
          message: `Capacité insuffisante : ${room.label} (${room.capacity}) pour ${group.label} (${group.studentCount})`,
          relatedIds: [entry.id]
        });
      }

      // Prof Unavailability
      const prof = professors.find(p => p.id === entry.profId);
      if (prof && prof.unavailabilities.some(u => u.day === entry.day && u.slotIndex === entry.slotIndex)) {
        conflicts.push({
          type: 'warning',
          message: `Indisponibilité : ${prof.name} n'est pas disponible le ${entry.day} à ${SLOTS[entry.slotIndex]}`,
          relatedIds: [entry.id]
        });
      }
    });

    Object.entries(roomUsage).forEach(([key, ids]) => {
      if (ids.length > 1) {
        const [day, slotIdx, roomId] = key.split('-');
        const room = rooms.find(r => r.id === roomId);
        conflicts.push({
          type: 'danger',
          message: `Conflit de salle : ${room?.label} est occupée par plusieurs classes le ${day} à ${SLOTS[parseInt(slotIdx)]}`,
          relatedIds: []
        });
      }
    });

    Object.entries(profUsage).forEach(([key, ids]) => {
      if (ids.length > 1) {
        const [day, slotIdx, profId] = key.split('-');
        const prof = professors.find(p => p.id === profId);
        conflicts.push({
          type: 'danger',
          message: `Conflit de professeur : ${prof?.name} est assigné à plusieurs classes le ${day} à ${SLOTS[parseInt(slotIdx)]}`,
          relatedIds: []
        });
      }
    });

    professors.forEach(p => {
      const hours = profHours[p.id] || 0;
      if (hours > p.targetWeeklyHours) {
        conflicts.push({
          type: 'warning',
          message: `Surcharge : ${p.name} dépasse sa masse horaire (${hours}h / ${p.targetWeeklyHours}h)`,
          relatedIds: []
        });
      }
    });
  }

  return {
    rooms, setRooms,
    classes, setClasses,
    professors, setProfessors,
    weeks, setWeeks,
    currentWeekId, setCurrentWeekId,
    currentWeek,
    updateSchedule,
    updateWeekMetadata,
    deleteWeek,
    duplicateWeek,
    conflicts
  };
}
