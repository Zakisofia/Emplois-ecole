import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Settings, 
  AlertTriangle, 
  Download,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { DAYS, SLOTS, Room, ClassGroup, Professor, ProfessorAssignment, ScheduleEntry, RoomType, Conflict, POLES, YEARS, VACATION_TYPES, StudyYear, PoleType, VacationType, FILIERES_BY_POLE, Week, WeekStatus } from './types';

// Sub-components will be defined here or in separate files
// For brevity and to ensure a complete working app in one go, I'll put them in logical sections below.

export default function App() {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<'schedule' | 'professors' | 'settings' | 'history' | 'conflicts'>('schedule');

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">ChronoPlan</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Pro Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
            icon={<Calendar size={20} />} 
            label="Emploi du Temps" 
          />
          <NavItem 
            active={activeTab === 'professors'} 
            onClick={() => setActiveTab('professors')}
            icon={<Users size={20} />} 
            label="Professeurs" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<Clock size={20} />} 
            label="Semaines & Historique" 
          />
          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings size={20} />} 
            label="Paramètres" 
          />
          <NavItem 
            active={activeTab === 'conflicts'} 
            onClick={() => setActiveTab('conflicts')}
            icon={<AlertTriangle size={20} />} 
            label="Conflits" 
            badge={state.conflicts.length > 0 ? state.conflicts.length : undefined}
          />
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Admin Dashboard</p>
              <p className="text-xs text-slate-500 truncate">Saison 2026/2027</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'schedule' && "Grille de Planification"}
              {activeTab === 'professors' && "Gestion du Corps Enseignant"}
              {activeTab === 'history' && "Gestion des Semaines"}
              {activeTab === 'settings' && "Configuration des Salles & Classes"}
              {activeTab === 'conflicts' && "Rapport de Validation"}
            </h2>
            <p className="text-sm text-slate-500">
              {state.currentWeek?.label || "Aucune semaine sélectionnée"}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download size={16} />
              Exporter PDF
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>
            <select 
              value={state.currentWeekId}
              onChange={(e) => state.setCurrentWeekId(e.target.value)}
              className="bg-indigo-50 border-none text-indigo-700 text-sm font-semibold rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer pr-8"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%234f46e5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              {state.weeks.map(w => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'schedule' && <ScheduleView state={state} />}
              {activeTab === 'professors' && <ProfessorView state={state} />}
              {activeTab === 'settings' && <SettingsView state={state} />}
              {activeTab === 'history' && <HistoryView state={state} />}
              {activeTab === 'conflicts' && <ConflictsView state={state} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {badge !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-indigo-200 text-indigo-800' : 'bg-red-100 text-red-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// --- Views ---

function ScheduleView({ state }: { state: any }) {
  const [viewMode, setViewMode] = useState<'class' | 'professor'>('class');
  const [selectedEntityId, setSelectedEntityId] = useState(
    viewMode === 'class' ? (state.classes[0]?.id || '') : (state.professors[0]?.id || '')
  );
  const [editSlot, setEditSlot] = useState<{ day: string, slotIndex: number } | null>(null);

  const entries = state.currentWeek?.schedule || [];
  
  const getEntry = (day: string, slotIndex: number) => {
    if (viewMode === 'class') {
      const entry = entries.find((e: ScheduleEntry) => e.day === day && e.slotIndex === slotIndex && e.classId === selectedEntityId);
      if (entry) return entry;
      
      // Check if any room occupied for this class at this time (fixed slots in rooms)
      const fixedRoomEntry = state.rooms.find((r: Room) => 
        r.fixedSlots?.some((fs: any) => fs.day === day && fs.slotIndex === slotIndex && fs.classIds?.includes(selectedEntityId))
      );

      if (fixedRoomEntry) {
        const fs = fixedRoomEntry.fixedSlots.find((fs: any) => fs.day === day && fs.slotIndex === slotIndex);
        return {
          id: `fixed-${selectedEntityId}-${day}-${slotIndex}`,
          subject: fs.subject,
          classId: selectedEntityId,
          profId: 'fixed',
          roomId: fixedRoomEntry.id,
          day,
          slotIndex
        };
      }
      return undefined;
    } else {
      return entries.find((e: ScheduleEntry) => e.day === day && e.slotIndex === slotIndex && e.profId === selectedEntityId);
    }
  };

  const handleSaveEntry = (profId: string, roomId: string, subject: string) => {
    if (!editSlot) return;
    
    // When editing in prof view, the "classId" needs to be selectable or fixed if we are in class view
    // Since the current EditModal is designed for class view (it fixes the classId), I'll make sure it handles both.
    // However, the prompt says "bidirectional sync", so editing in one should reflect in other.
    // For now, I'll keep the EditModal primarily for the class view or update it to handle both.
    
    const targetClassId = viewMode === 'class' ? selectedEntityId : ''; // If in prof view, we'd need to select the class.
    // I'll adjust the EditModal call below to handle this.
  };

  const handleUpdateSchedule = (newEntry: ScheduleEntry | null, day: string, slotIndex: number, classId: string) => {
    let newSchedule = entries.filter((e: ScheduleEntry) => 
      !(e.day === day && e.slotIndex === slotIndex && e.classId === classId)
    );
    
    if (newEntry) {
      newSchedule.push(newEntry);
    }
    
    state.updateSchedule(newSchedule);
    setEditSlot(null);
  };

  const smartFill = () => {
    // Fresh start for a clean generation
    const newSchedule: ScheduleEntry[] = [];
    
    // Track professor hours during generation
    const profHoursSpent: Record<string, number> = {};
    
    // Create a pool of sessions to schedule
    const sessionsToSchedule: any[] = [];
    state.professors.forEach((p: Professor) => {
      p.assignments?.forEach(assignment => {
        for (let i = 0; i < assignment.sessionsPerWeek; i++) {
          sessionsToSchedule.push({
            profId: p.id,
            classId: assignment.classId,
            subject: assignment.subject,
            duration: assignment.durationPerSession || 1.5
          });
        }
      });
    });

    // Shuffle for better distribution
    sessionsToSchedule.sort(() => Math.random() - 0.5);

    sessionsToSchedule.forEach(session => {
      let scheduled = false;
      const sessionDuration = session.duration;
      
      // Check if prof has room in their target weekly hours
      const currentProfHours = profHoursSpent[session.profId] || 0;
      const prof = state.professors.find((p: Professor) => p.id === session.profId);
      if (prof && currentProfHours + sessionDuration > prof.targetWeeklyHours) {
        return; // Skip this session as it would exceed prof's limit
      }

      // Try to find a slot
      for (const day of DAYS) {
        if (scheduled) break;
        for (let slotIdx = 0; slotIdx < SLOTS.length; slotIdx++) {
          if (scheduled) break;

          // 1. Professor Availability
          const isProfBusy = newSchedule.some(e => e.profId === session.profId && e.day === day && e.slotIndex === slotIdx);
          const isProfUnavailable = prof?.unavailabilities.some(u => u.day === day && u.slotIndex === slotIdx);
          if (isProfBusy || isProfUnavailable) continue;

          // 2. Class Availability
          const classGroup = state.classes.find((c: ClassGroup) => c.id === session.classId);
          if (!classGroup) continue;

          // Vacation Type check
          const isSlotMatchingVacation = (idx: number, type: VacationType) => {
            if (type === 'Jour') return idx < 4;
            if (type === 'Soir') return idx >= 4;
            return true; // Week-end can be any for now
          };

          if (!isSlotMatchingVacation(slotIdx, classGroup.vacationType)) continue;

          const isClassBusy = newSchedule.some(e => e.classId === session.classId && e.day === day && e.slotIndex === slotIdx);
          const isClassInFixedRoom = state.rooms.some((r: Room) => 
            r.fixedSlots?.some(fs => fs.day === day && fs.slotIndex === slotIdx && fs.classIds?.includes(session.classId))
          );
          if (isClassBusy || isClassInFixedRoom) continue;

          // 3. Room Availability
          const availableRoom = state.rooms.find((r: Room) => {
            const isRoomBusy = newSchedule.some(e => e.roomId === r.id && e.day === day && e.slotIndex === slotIdx);
            const isRoomOccupiedByFixedSlot = r.fixedSlots?.some(fs => fs.day === day && fs.slotIndex === slotIdx);
            
            const matchesCapacity = classGroup ? r.capacity >= classGroup.studentCount : true;
            const isTPSubject = session.subject.toLowerCase().includes('tp') || session.subject.toLowerCase().includes('informatique');
            const matchesType = isTPSubject ? (r.type === 'TP Informatique') : (r.type === 'Normal');
            
            return !isRoomBusy && !isRoomOccupiedByFixedSlot && matchesCapacity && matchesType;
          }) || state.rooms.find((r: Room) => {
            // Fallback for non-TP or if no perfect match found
            const isRoomBusy = newSchedule.some(e => e.roomId === r.id && e.day === day && e.slotIndex === slotIdx);
            const isRoomOccupiedByFixedSlot = r.fixedSlots?.some(fs => fs.day === day && fs.slotIndex === slotIdx);
            const matchesCapacity = classGroup ? r.capacity >= classGroup.studentCount : true;
            return !isRoomBusy && !isRoomOccupiedByFixedSlot && matchesCapacity;
          });

          if (availableRoom) {
            newSchedule.push({
              id: Math.random().toString(36).substr(2, 9),
              classId: session.classId,
              profId: session.profId,
              roomId: availableRoom.id,
              day,
              slotIndex: slotIdx,
              subject: session.subject
            });
            profHoursSpent[session.profId] = (profHoursSpent[session.profId] || 0) + sessionDuration;
            scheduled = true;
          }
        }
      }
    });
    
    state.updateSchedule(newSchedule);
  };

  const selectedClass = state.classes.find((c: ClassGroup) => c.id === selectedEntityId);
  const selectedProf = state.professors.find((p: Professor) => p.id === selectedEntityId);

  const currentHours = viewMode === 'professor' && selectedProf 
    ? entries.filter((e: any) => e.profId === selectedProf.id).length * 1.5 
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button 
                onClick={() => { setViewMode('class'); setSelectedEntityId(state.classes[0]?.id || ''); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'class' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Vue Étudiant
              </button>
              <button 
                onClick={() => { setViewMode('professor'); setSelectedEntityId(state.professors[0]?.id || ''); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'professor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Vue Enseignant
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {viewMode === 'class' ? 'Sélectionner Classe' : 'Sélectionner Enseignant'}
              </label>
              <select 
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                {viewMode === 'class' ? (
                  state.classes.map((c: ClassGroup) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))
                ) : (
                  state.professors.map((p: Professor) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={smartFill}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Calendar className="animate-pulse" size={18} />
              Génération Automatique
            </button>
          </div>
        </div>

        {/* Dynamic Header Section */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {viewMode === 'class' && selectedClass ? (
              <>
                <h3 className="text-2xl font-black text-slate-800">Filière : {selectedClass.pole}</h3>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Classe : {selectedClass.label} ({selectedClass.year})</p>
              </>
            ) : viewMode === 'professor' && selectedProf ? (
              <>
                <h3 className="text-2xl font-black text-slate-800">Tableau de Service : M. {selectedProf.name}</h3>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Année Académique : 2025-2026</p>
              </>
            ) : null}
          </div>

          <div className="flex gap-4">
            {viewMode === 'professor' && selectedProf && (
              <StatCard 
                label="Masse Horaire" 
                value={`${currentHours}h / ${selectedProf.targetWeeklyHours}h`} 
                color={currentHours > selectedProf.targetWeeklyHours ? 'slate' : 'indigo'} 
              />
            )}
            <StatCard label="Cours Planifiés" value={entries.filter(e => viewMode === 'class' ? e.classId === selectedEntityId : e.profId === selectedEntityId).length.toString()} color="slate" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest w-48">Horaires</th>
              {DAYS.map(day => (
                <th key={day} className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-100">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, slotIdx) => (
              <tr key={slot} className="border-b border-slate-50 last:border-0 group">
                <td className="p-6 bg-slate-50/20">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="text-slate-300" />
                    <span className="text-sm font-bold tracking-tighter whitespace-nowrap">{slot}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const entry = getEntry(day, slotIdx);
                  const prof = state.professors.find((p: Professor) => p.id === entry?.profId);
                  const room = state.rooms.find((r: Room) => r.id === entry?.roomId);
                  const classGroup = state.classes.find((c: ClassGroup) => c.id === entry?.classId);
                  const hasConflict = state.conflicts.some((c: Conflict) => c.relatedIds.includes(entry?.id || ''));

                  return (
                    <td 
                      key={day} 
                      className="p-3 border-l border-slate-50 align-top group-hover:bg-slate-50/30 transition-colors"
                    >
                      {entry ? (
                        <div 
                          onClick={() => {
                            if (viewMode === 'class') setEditSlot({ day, slotIndex: slotIdx });
                          }}
                          className={`p-4 rounded-2xl border transition-all ${viewMode === 'class' ? 'cursor-pointer hover:shadow-md' : ''} ${
                            hasConflict 
                              ? 'bg-red-50 border-red-200 shadow-red-100/50' 
                              : 'bg-indigo-50/40 border-indigo-100 shadow-indigo-100/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded-full shadow-sm">
                              {entry.subject}
                            </span>
                            {hasConflict && <AlertTriangle size={14} className="text-red-500 animate-bounce" />}
                          </div>
                          
                          <p className="text-sm font-bold text-slate-800 mb-1">
                            {viewMode === 'class' ? (prof?.name || 'Inconnu') : (classGroup?.label || 'Inconnu')}
                          </p>
                          
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin size={12} className="text-slate-300" />
                            <span className="text-[11px] font-semibold">{room?.label || 'Salle ?'}</span>
                          </div>
                        </div>
                      ) : (
                        viewMode === 'class' ? (
                          <button 
                            onClick={() => setEditSlot({ day, slotIndex: slotIdx })}
                            className="w-full h-24 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-indigo-300 hover:text-indigo-400 hover:bg-indigo-50/20 transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <div className="w-full h-24 rounded-2xl border border-dashed border-slate-100 flex items-center justify-center text-slate-100">
                            <Clock size={20} />
                          </div>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editSlot && (
        <EditModal 
          slot={editSlot} 
          state={state} 
          onClose={() => setEditSlot(null)} 
          onSave={(p: string, r: string, s: string) => {
            const newEntry: ScheduleEntry = {
              id: Math.random().toString(36).substr(2, 9),
              classId: selectedEntityId,
              profId: p,
              roomId: r,
              day: editSlot.day,
              slotIndex: editSlot.slotIndex,
              subject: s
            };
            handleUpdateSchedule(p && r ? newEntry : null, editSlot.day, editSlot.slotIndex, selectedEntityId);
          }}
          currentEntry={getEntry(editSlot.day, editSlot.slotIndex)}
          classId={selectedEntityId}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: 'indigo' | 'slate' }) {
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50',
    slate: 'text-slate-600 bg-slate-100'
  };
  return (
    <div className={`px-4 py-2 rounded-xl ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</p>
      <p className="text-lg font-black tracking-tight">{value}</p>
    </div>
  );
}

function EditModal({ slot, state, onClose, onSave, currentEntry, classId }: any) {
  const [profId, setProfId] = useState(currentEntry?.profId || '');
  const [roomId, setRoomId] = useState(currentEntry?.roomId || '');
  const [subject, setSubject] = useState(currentEntry?.subject || '');

  // Filter available rooms and profs
  const availableProfs = state.professors.map((p: Professor) => {
    const isBusy = state.currentWeek.schedule.some((e: ScheduleEntry) => 
      e.day === slot.day && e.slotIndex === slot.slotIndex && e.profId === p.id && e.classId !== classId
    );
    const isUnavailable = p.unavailabilities.some(u => u.day === slot.day && u.slotIndex === slot.slotIndex);
    return { ...p, isBusy, isUnavailable };
  });

  const availableRooms = state.rooms.map((r: Room) => {
    const isBusy = state.currentWeek.schedule.some((e: ScheduleEntry) => 
      e.day === slot.day && e.slotIndex === slot.slotIndex && e.roomId === r.id && e.classId !== classId
    );
    const group = state.classes.find((c: ClassGroup) => c.id === classId);
    const isTooSmall = group && group.studentCount > r.capacity;
    return { ...r, isBusy, isTooSmall };
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800">Assigner un cours</h3>
            <p className="text-sm text-slate-500 font-medium">{slot.day} à {SLOTS[slot.slotIndex]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <Trash2 size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professeur</label>
            <select 
              value={profId}
              onChange={(e) => setProfId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Choisir un professeur</option>
              {availableProfs.map((p: any) => (
                <option key={p.id} value={p.id} disabled={p.isBusy || p.isUnavailable}>
                  {p.name} {p.isBusy ? '(Occupé)' : p.isUnavailable ? '(Indisponible)' : `(${p.specialty})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salle de classe</label>
            <select 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Choisir une salle</option>
              {availableRooms.map((r: any) => (
                <option key={r.id} value={r.id} disabled={r.isBusy || r.isTooSmall}>
                  {r.label} - Cap. {r.capacity} {r.isBusy ? '(Occupée)' : r.isTooSmall ? '(Trop petite)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Matière / Sujet</label>
            <input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="ex: Mathématiques"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
          >
            Annuler
          </button>
          <button 
            onClick={() => onSave(profId, roomId, subject)}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProfessorView({ state }: { state: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProf, setNewProf] = useState<Partial<Professor>>({
    name: '', specialty: '', targetWeeklyHours: 15, unavailabilities: [], subjects: [], assignments: []
  });
  const [newSubject, setNewSubject] = useState('');
  
  // Assignment state for the form
  const [assignSubject, setAssignSubject] = useState('');
  const [assignClassId, setAssignClassId] = useState('');
  const [assignFreq, setAssignFreq] = useState(1);
  const [assignDuration, setAssignDuration] = useState(1.5);

  const [unavailDay, setUnavailDay] = useState(DAYS[0]);
  const [unavailSlot, setUnavailSlot] = useState<string>('all');

  const handleAdd = () => {
    if (newProf.name && newProf.specialty) {
      state.setProfessors([...state.professors, { ...newProf, id: Math.random().toString(36).substr(2, 9) }]);
      setNewProf({ name: '', specialty: '', targetWeeklyHours: 15, unavailabilities: [], subjects: [], assignments: [] });
      setUnavailDay(DAYS[0]);
      setUnavailSlot('all');
      setIsAdding(false);
    }
  };

  const addAssignmentToNewProf = () => {
    if (assignSubject.trim() && assignClassId) {
      const assignment: ProfessorAssignment = {
        subject: assignSubject.trim(),
        classId: assignClassId,
        sessionsPerWeek: assignFreq,
        durationPerSession: assignDuration
      };
      
      setNewProf(prev => ({
        ...prev,
        assignments: [...(prev.assignments || []), assignment],
        subjects: Array.from(new Set([...(prev.subjects || []), assignSubject.trim()]))
      }));

      // Reset specific fields for next entry
      setAssignSubject('');
      setAssignClassId('');
      setAssignFreq(1);
      setAssignDuration(1.5);
    }
  };

  const addUnavailabilityToNewProf = () => {
    if (unavailSlot === 'all') {
      const newSlots = SLOTS.map((_, i) => ({ day: unavailDay, slotIndex: i }));
      setNewProf(prev => {
        const current = prev.unavailabilities || [];
        const filtered = current.filter(u => u.day !== unavailDay);
        return { ...prev, unavailabilities: [...filtered, ...newSlots] };
      });
    } else {
      const slotIdx = parseInt(unavailSlot);
      setNewProf(prev => {
        if (!prev.unavailabilities?.some(u => u.day === unavailDay && u.slotIndex === slotIdx)) {
          return {
            ...prev,
            unavailabilities: [...(prev.unavailabilities || []), { day: unavailDay, slotIndex: slotIdx }]
          };
        }
        return prev;
      });
    }
  };

  const calculateTotalWeeklyHours = (p: Partial<Professor>) => {
    return (p.assignments || []).reduce((acc, curr) => acc + (curr.sessionsPerWeek * curr.durationPerSession), 0);
  };

  const removeProf = (id: string) => {
    state.setProfessors(state.professors.filter((p: Professor) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-black text-slate-800">Corps Enseignant</h3>
          <p className="text-sm text-slate-500">Gérez vos professeurs, leurs modules et leurs affectations par classe.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          Ajouter un Professeur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.professors.map((p: Professor) => {
          const scheduledHours = (state.currentWeek?.schedule.filter((e: any) => e.profId === p.id).length || 0) * 1.5;
          const assignedHours = calculateTotalWeeklyHours(p);
          const isOverloaded = assignedHours > p.targetWeeklyHours;
          
          return (
            <motion.div 
              layout
              key={p.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group"
            >
              <button 
                onClick={() => removeProf(p.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="text-lg font-black text-slate-800">{p.name}</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{p.specialty}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                    <span className="text-slate-400">Charge Totale Affectée</span>
                    <span className={isOverloaded ? 'text-red-500' : 'text-indigo-600'}>
                      {assignedHours}h / {p.targetWeeklyHours}h
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p.targetWeeklyHours > 0 ? Math.min((assignedHours / p.targetWeeklyHours) * 100, 100) : 0}%` }}
                      className={`h-full ${isOverloaded ? 'bg-red-500' : 'bg-indigo-500'}`}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affectations par Classe</p>
                  {p.assignments && p.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {p.assignments.map((a, i) => {
                        const cls = state.classes.find((c: any) => c.id === a.classId);
                        return (
                          <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-700">{a.subject} ({cls?.label})</span>
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{a.sessionsPerWeek}x{a.durationPerSession}h</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] italic text-slate-400">Aucune affectation</p>
                  )}
                </div>
                
                <div className="flex gap-2 items-center text-[10px] font-bold text-slate-400">
                  <Clock size={12} />
                  Planifié cette semaine: <span className="text-slate-800">{scheduledHours}h</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 mb-6">Nouveau Professeur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">Informations Générales</p>
                <input 
                  placeholder="Nom complet"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
                />
                <input 
                  placeholder="Spécialité Principale"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setNewProf({ ...newProf, specialty: e.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Masse horaire max (hebdo)</label>
                  <input 
                    type="number"
                    placeholder="ex: 18"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={(e) => setNewProf({ ...newProf, targetWeeklyHours: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total calculé</p>
                    <span className={`text-sm font-black ${calculateTotalWeeklyHours(newProf) > (newProf.targetWeeklyHours || 0) ? 'text-red-500' : 'text-indigo-600'}`}>
                      {calculateTotalWeeklyHours(newProf)}h / {newProf.targetWeeklyHours || 0}h
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">Affectations (Module/Classe)</p>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <input 
                    placeholder="Matière (ex: Python)"
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                  />
                  <select 
                    value={assignClassId}
                    onChange={(e) => setAssignClassId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                  >
                    <option value="">Choisir la Classe</option>
                    {state.classes.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Fréq. (séance/sem)</label>
                      <input 
                        type="number" 
                        value={assignFreq}
                        onChange={(e) => setAssignFreq(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Durée (h/séance)</label>
                      <select 
                        value={assignDuration}
                        onChange={(e) => setAssignDuration(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                      >
                        <option value={1.5}>1h30</option>
                        <option value={3}>3h00</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={addAssignmentToNewProf}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 cursor-pointer"
                  >
                    Ajouter l'Affectation
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {newProf.assignments?.map((a, i) => {
                    const cls = state.classes.find((c: any) => c.id === a.classId);
                    return (
                      <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{a.subject}</p>
                          <p className="text-slate-400 font-medium">{cls?.label}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-600">{a.sessionsPerWeek}x{a.durationPerSession}h</p>
                          <button 
                            type="button"
                            onClick={() => setNewProf(prev => ({ ...prev, assignments: prev.assignments?.filter((_, idx) => idx !== i) }))}
                            className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section Indisponibilités */}
            <div className="pt-8 mt-8 border-t border-slate-100">
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2 mb-4">Contraintes d'Indisponibilité / Préférences Horaires</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Jour</label>
                      <select 
                        value={unavailDay}
                        onChange={(e) => setUnavailDay(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                      >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Période / Créneau</label>
                      <select 
                        value={unavailSlot}
                        onChange={(e) => setUnavailSlot(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                      >
                        <option value="all">Toute la journée</option>
                        {SLOTS.map((s, i) => <option key={i} value={i.toString()}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={addUnavailabilityToNewProf}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    Ajouter l'Indisponibilité
                  </button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl max-h-[150px] overflow-y-auto border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={12} className="text-indigo-400" />
                    Créneaux d'exclusion planifiés
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(!newProf.unavailabilities || newProf.unavailabilities.length === 0) ? (
                      <p className="text-[10px] italic text-slate-400 py-2">Aucune contrainte saisie pour le moment.</p>
                    ) : (
                      newProf.unavailabilities.map((u, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm group/tag hover:border-indigo-200 transition-all">
                          <span className="text-indigo-600">{u.day}</span>
                          <span className="text-slate-300">•</span>
                          <span>{SLOTS[u.slotIndex]}</span>
                          <button 
                            onClick={() => setNewProf({ ...newProf, unavailabilities: newProf.unavailabilities?.filter((_, idx) => idx !== i) })}
                            className="text-slate-300 hover:text-red-500 transition-colors ml-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Annuler</button>
              <button 
                type="button"
                onClick={handleAdd} 
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Créer le Profil Enseignant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsView({ state }: { state: any }) {
  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'classes'>('rooms');
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newClass, setNewClass] = useState<Partial<ClassGroup>>({ label: '', studentCount: 0, year: '1ère année', pole: 'Informatique & IA', vacationType: 'Jour' });
  const [newRoom, setNewRoom] = useState<Partial<Room>>({ label: '', capacity: 0, type: 'Normal', fixedSlots: [] });

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-slate-200 pb-px">
        <button 
          onClick={() => setActiveSubTab('rooms')}
          className={`pb-4 px-4 text-sm font-bold transition-all relative ${activeSubTab === 'rooms' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Salles de cours
          {activeSubTab === 'rooms' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveSubTab('classes')}
          className={`pb-4 px-4 text-sm font-bold transition-all relative ${activeSubTab === 'classes' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Classes / Filières
          {activeSubTab === 'classes' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
        </button>
      </div>

      {activeSubTab === 'rooms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.rooms.map((r: Room) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 group transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{r.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.type} • {r.capacity} Places</p>
                  </div>
                </div>
                <button onClick={() => state.setRooms(state.rooms.filter((x: Room) => x.id !== r.id))} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              {r.fixedSlots && r.fixedSlots.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-slate-50 pt-2">
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 opacity-70">Occupations Fixes</p>
                  <div className="grid grid-cols-1 gap-1">
                    {r.fixedSlots.map((fs, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-500 text-[9px] font-bold bg-slate-50/50 p-1.5 rounded-lg border border-slate-100/50">
                        <Clock size={10} className="text-indigo-400" />
                        <span className="truncate">{fs.subject} • {fs.day} ({SLOTS[fs.slotIndex]})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={() => setIsAddingRoom(true)}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-5 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/20 transition-all"
          >
            <Plus size={20} className="mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Ajouter une salle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.classes.map((c: ClassGroup) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{c.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.studentCount} Étudiants</p>
                  </div>
                </div>
                <button onClick={() => state.setClasses(state.classes.filter((x: ClassGroup) => x.id !== c.id))} className="opacity-0 group-hover:opacity-100 text-red-400 p-2 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-wider">{c.pole}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">{c.year}</span>
                <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase tracking-wider">{c.vacationType}</span>
              </div>
            </div>
          ))}
          <button 
             onClick={() => setIsAddingClass(true)}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-5 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/20 transition-all min-h-[120px]"
          >
            <Plus size={20} className="mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Ajouter une classe</span>
          </button>
        </div>
      )}

      {/* Modals for Settings */}
      {isAddingRoom && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-6">Nouvelle Salle</h3>
            <div className="space-y-4">
              <input 
                placeholder="Nom (ex: Salle 2)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                onChange={(e) => setNewRoom({ ...newRoom, label: e.target.value })}
              />
              <input 
                type="number"
                placeholder="Capacité"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
              />
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as RoomType })}
              >
                <option value="Normal">Normal</option>
                <option value="TP Informatique">TP Informatique</option>
              </select>
            </div>

            {/* Fixed Slots Section (Relocated to Room) */}
            <div className="pt-6 border-t border-slate-100 overflow-y-auto max-h-[40vh] pr-2">
              <label className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 block">Occupation Fixe / Cours Partagés</label>
              <div className="bg-indigo-50/50 rounded-2xl p-4 space-y-3">
                <input 
                  id="room-fixed-subject"
                  placeholder="Libellé du cours (ex: Langues)"
                  className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm font-semibold outline-none"
                />
                <div className="flex gap-2">
                  <select id="room-fixed-day" className="flex-1 bg-white border border-indigo-100 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select id="room-fixed-slot" className="flex-1 bg-white border border-indigo-100 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                    {SLOTS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Classes concernées (Ctrl+clic)</label>
                  <select 
                    id="room-fixed-classes" 
                    multiple 
                    className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-xs font-bold outline-none min-h-[80px]"
                  >
                    {state.classes.map((c: ClassGroup) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    const subject = (document.getElementById('room-fixed-subject') as HTMLInputElement).value;
                    const day = (document.getElementById('room-fixed-day') as HTMLSelectElement).value;
                    const slotIndex = parseInt((document.getElementById('room-fixed-slot') as HTMLSelectElement).value);
                    const classSelect = document.getElementById('room-fixed-classes') as HTMLSelectElement;
                    const classIds = Array.from(classSelect.selectedOptions).map(opt => opt.value);

                    if (subject) {
                      setNewRoom({
                        ...newRoom,
                        fixedSlots: [...(newRoom.fixedSlots || []), { subject, day, slotIndex, classIds }]
                      } as any);
                      (document.getElementById('room-fixed-subject') as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-sm hover:bg-indigo-700 transition-all"
                >
                  Bloquer ce créneau pour la salle
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {newRoom.fixedSlots?.map((fs: any, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Clock size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{fs.subject}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {fs.day} • {SLOTS[fs.slotIndex]}
                          {fs.classIds?.length > 0 && ` • ${fs.classIds.length} Classes`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNewRoom({ ...newRoom, fixedSlots: newRoom.fixedSlots?.filter((_, i) => i !== idx) })}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsAddingRoom(false)} className="flex-1 py-3 font-bold text-slate-500">Annuler</button>
              <button onClick={() => {
                if(newRoom.label) state.setRooms([...state.rooms, { ...newRoom, id: Date.now().toString() }]);
                setIsAddingRoom(false);
              }} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {isAddingClass && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-6">Nouvelle Classe</h3>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Libellé</label>
                <input 
                  placeholder="ex: DI2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  value={newClass.label}
                  onChange={(e) => setNewClass({ ...newClass, label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pôle</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  value={newClass.pole}
                  onChange={(e) => {
                    const pole = e.target.value as PoleType;
                    setNewClass({ 
                      ...newClass, 
                      pole
                    });
                  }}
                >
                  {POLES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aide : Sélectionner Filière</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  onChange={(e) => {
                    const filiere = e.target.value;
                    const abbr = filiere.match(/\((.*?)\)/)?.[1] || filiere;
                    const yearNum = newClass.year === '1ère année' ? '1' : '2';
                    setNewClass({ ...newClass, label: `${abbr}${yearNum}` });
                  }}
                >
                  <option value="">(Optionnel) Préréglage par filière</option>
                  {(FILIERES_BY_POLE[newClass.pole as PoleType] || []).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <input 
                type="number"
                placeholder="Effectif (étudiants)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                onChange={(e) => setNewClass({ ...newClass, studentCount: parseInt(e.target.value) || 0 })}
              />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Année</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  value={newClass.year}
                  onChange={(e) => setNewClass({ ...newClass, year: e.target.value as StudyYear })}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vacation</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  onChange={(e) => setNewClass({ ...newClass, vacationType: e.target.value as VacationType })}
                >
                  {VACATION_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsAddingClass(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Annuler</button>
              <button onClick={() => {
                if(newClass.label && newClass.pole) {
                  state.setClasses([...state.classes, { ...newClass, id: Date.now().toString() }]);
                  setIsAddingClass(false);
                }
              }} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryView({ state }: { state: any }) {
  const [newLabel, setNewLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Brouillon' | 'Archivée'>('Brouillon');
  const [duplicateFrom, setDuplicateFrom] = useState('');
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newLabel || !startDate || !endDate) return;

    let initialSchedule = [];
    if (duplicateFrom) {
      const source = state.weeks.find((w: any) => w.id === duplicateFrom);
      if (source) initialSchedule = [...source.schedule];
    }

    const newWeek: Week = {
      id: `week-${Date.now()}`,
      label: newLabel,
      startDate,
      endDate,
      status,
      schedule: initialSchedule
    };

    state.setWeeks([...state.weeks, newWeek]);
    setNewLabel('');
    setStartDate('');
    setEndDate('');
    setDuplicateFrom('');
  };

  const handleDuplicate = (week: Week) => {
    const label = `${week.label} (Copie)`;
    state.duplicateWeek(week.id, `week-${Date.now()}`, label, week.startDate, week.endDate);
  };

  const handleUpdate = (id: string, metadata: Partial<Week>) => {
    state.updateWeekMetadata(id, metadata);
    setEditingId(null);
  };

  const filteredWeeks = state.weeks
    .filter((w: Week) => filterStatus === 'all' || w.status === filterStatus)
    .sort((a: Week, b: Week) => {
      if (sortBy === 'date') return b.startDate.localeCompare(a.startDate);
      return a.label.localeCompare(b.label);
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Archivée': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Creation Header */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-100/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Plus size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">Nouveau Cycle de Planification</h3>
            <p className="text-sm text-slate-500 font-medium">Définissez une nouvelle période académique et commencez à planifier.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de la Semaine</label>
            <input 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="ex: Semaine 12 - MIAGE"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de début</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de fin</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut Initial</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Active">Active</option>
              <option value="Archivée">Archivée</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Importer de :</span>
            <select 
              value={duplicateFrom}
              onChange={(e) => setDuplicateFrom(e.target.value)}
              className="flex-1 md:w-64 bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none"
            >
              <option value="">Aucun (Semaine vide)</option>
              {state.weeks.map((w: Week) => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleCreate}
            className="w-full md:w-auto px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
          >
            Créer la Semaine
          </button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
          {['all', 'Active', 'Brouillon', 'Archivée'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {s === 'all' ? 'Toutes' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Trier par :</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option value="date">Date la plus récente</option>
              <option value="name">Nom alphabétique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Week Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWeeks.map((w: Week) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={w.id} 
              className={`group bg-white p-6 rounded-[32px] border transition-all duration-300 relative ${state.currentWeekId === w.id ? 'ring-2 ring-indigo-500 border-transparent shadow-xl' : 'border-slate-200 hover:border-indigo-200 shadow-sm'}`}
            >
              {editingId === w.id ? (
                <div className="space-y-4">
                  <input 
                    defaultValue={w.label}
                    id={`edit-label-${w.id}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                  />
                  <div className="flex gap-2">
                    <input type="date" defaultValue={w.startDate} id={`edit-start-${w.id}`} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" />
                    <input type="date" defaultValue={w.endDate} id={`edit-end-${w.id}`} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" />
                  </div>
                  <select id={`edit-status-${w.id}`} defaultValue={w.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold">
                    <option value="Brouillon">Brouillon</option>
                    <option value="Active">Active</option>
                    <option value="Archivée">Archivée</option>
                  </select>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        const label = (document.getElementById(`edit-label-${w.id}`) as HTMLInputElement).value;
                        const startDate = (document.getElementById(`edit-start-${w.id}`) as HTMLInputElement).value;
                        const endDate = (document.getElementById(`edit-end-${w.id}`) as HTMLInputElement).value;
                        const status = (document.getElementById(`edit-status-${w.id}`) as HTMLSelectElement).value as WeekStatus;
                        handleUpdate(w.id, { label, startDate, endDate, status });
                      }}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                    >
                      Sauver
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(w.status)}`}>
                      {w.status}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingId(w.id)}
                        title="Modifier"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(w)}
                        title="Dupliquer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => state.deleteWeek(w.id)}
                        title="Supprimer"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{w.label}</h4>
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                      <Calendar size={14} />
                      <p className="text-xs font-bold uppercase tracking-tight">
                        {formatDate(w.startDate)} — {formatDate(w.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-50">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cours</p>
                      <p className="text-sm font-black text-slate-800">{w.schedule.length}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Taux</p>
                      <p className="text-sm font-black text-slate-800">{Math.round((w.schedule.length / (DAYS.length * SLOTS.length)) * 100)}%</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      state.setCurrentWeekId(w.id);
                    }}
                    className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                      state.currentWeekId === w.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    {state.currentWeekId === w.id ? 'Semaine Active' : 'Utiliser cette Semaine'}
                    <ChevronRight size={14} />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWeeks.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
            <Filter size={32} />
          </div>
          <p className="text-slate-500 font-bold">Aucune semaine ne correspond à vos filtres.</p>
        </div>
      )}
    </div>
  );
}

function ConflictsView({ state }: { state: any }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-3xl mb-4">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-3xl font-black text-slate-800">Rapport d'Intégrité</h3>
        <p className="text-slate-500 font-medium">Analyse en temps réel de votre emploi du temps.</p>
      </div>

      {state.conflicts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[40px] text-center">
          <p className="text-emerald-700 font-black text-xl mb-2">Aucun conflit détecté !</p>
          <p className="text-emerald-600 font-medium opacity-80">Votre planning respecte toutes les contraintes de salles, de professeurs et d'horaires.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.conflicts.map((c: Conflict, i: number) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className={`p-6 rounded-3xl border flex gap-6 items-center shadow-sm ${
                c.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-amber-50 border-amber-100 text-amber-800'
              }`}
            >
              <div className={`p-4 rounded-2xl ${c.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {c.type === 'danger' ? <AlertTriangle size={24} /> : <Filter size={24} />}
              </div>
              <div>
                <p className="font-black leading-tight text-lg">{c.message}</p>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1">Action requise</p>
              </div>
              <div className="ml-auto">
                <ChevronRight size={20} className="opacity-30" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
