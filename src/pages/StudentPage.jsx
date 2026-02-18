import { useEffect, useState } from 'react'
import { fetchSemesters, fetchHolidays } from '../lib/api'
import { calculateNetWorkingDays, computeProjection } from '../utils/calculations'
import { AddExtraModal, AddHolidayModal } from '../components/Modal'
import Navbar from '../components/Navbar'

// Helper function to capitalize first letter of each word
function toTitleCase(str){
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function toLocalDateInputValue(date = new Date()){
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function normalizeCalendarDate(value){
  if(value instanceof Date){
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  if(typeof value === 'string'){
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatCalendarDisplay(value){
  return normalizeCalendarDate(value).toLocaleDateString();
}

export default function StudentPage(){
  const [semesters, setSemesters] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [semesterId, setSemesterId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasCustomEndDate, setHasCustomEndDate] = useState(false);
  const [currentPresent, setCurrentPresent] = useState('');
  const [currentTotal, setCurrentTotal] = useState('');
  const [desiredPercent, setDesiredPercent] = useState('');
  const [extraHolidays, setExtraHolidays] = useState([]);
  const [extraWorkingDays, setExtraWorkingDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHolidayEditModal, setShowHolidayEditModal] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState(null);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [result, setResult] = useState(null);
  const periodsPerDay = 6;

  useEffect(() => {
    const today = toLocalDateInputValue();
    if(!startDate){
      setStartDate(today);
    }
  }, [startDate]);

  function calculateDays(start, end){
    const d1 = normalizeCalendarDate(start);
    const d2 = normalizeCalendarDate(end);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
  }

  useEffect(()=>{ 
    fetchSemesters().then(setSemesters).catch(()=>setSemesters([]));
  }, []);

  useEffect(()=>{
    if(!semesterId){
      if(holidays.length){
        setHolidays([]);
      }
      return;
    }
    fetchHolidays().then(setHolidays).catch(()=>setHolidays([]));
  }, [semesterId]);

  useEffect(() => {
    if(!semesterId || !semesters.length || !startDate || hasCustomEndDate) return;
    const semester = semesters.find(s => s._id === semesterId);
    if(!semester) return;
    const today = normalizeCalendarDate(startDate);
    let defaultEndDate = null;
    if(semester.mid1Date){
      const mid1 = normalizeCalendarDate(semester.mid1Date);
      if(mid1 >= today){
        defaultEndDate = toLocalDateInputValue(mid1);
      }
    }
    if(!defaultEndDate && semester.mid2Date){
      const mid2 = normalizeCalendarDate(semester.mid2Date);
      if(mid2 >= today){
        defaultEndDate = toLocalDateInputValue(mid2);
      }
    }
    if(!defaultEndDate){
      const nextMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      defaultEndDate = toLocalDateInputValue(nextMonth);
    }
    setEndDate(defaultEndDate);
  }, [semesterId, semesters, startDate, hasCustomEndDate]);

  useEffect(() => {
    // Reset custom selection when semester changes
    setHasCustomEndDate(false);
  }, [semesterId]);


  function getFilteredHolidays(){
    if(!startDate || !endDate) return [];
    const start = normalizeCalendarDate(startDate);
    const end = normalizeCalendarDate(endDate);
    return holidays.filter(h=>{
      const hStart = normalizeCalendarDate(h.startDate);
      const hEnd = normalizeCalendarDate(h.endDate);
      return hStart <= end && hEnd >= start;
    });
  }

  function calculate(){
    if(!semesterId || !startDate || !endDate || !currentTotal || !periodsPerDay) return;
    const filteredHolidays = getFilteredHolidays();
    
    // Convert adjustments to flat arrays for calculation
    const extraHolArray = extraHolidays.map(h => ({ startDate: h.startDate, endDate: h.endDate }));
    const extraWorkArray = extraWorkingDays.map(w => ({ startDate: w.startDate, endDate: w.endDate }));
    
    const net = calculateNetWorkingDays({
      startDate,
      endDate,
      officialHolidays: filteredHolidays,
      extraHolidays: extraHolArray,
      extraWorkingDays: extraWorkArray
    });
    const proj = computeProjection({
      currentPresent: Number(currentPresent) || 0,
      currentTotal: Number(currentTotal),
      desiredPercent: Number(desiredPercent),
      netWorkingDays: net.net,
      periodsPerDay: Number(periodsPerDay)
    });
    setResult(proj);
  }

  function handleRemoveOfficialHoliday(id){
    // Local-only removal for student view. Do NOT call API.
    if(!id) return;
    setHolidays(prev => prev.filter(h => h._id !== id));
  }

  const filteredHolidays = getFilteredHolidays();
  const canShowHolidays = startDate && endDate;

  return (
    <div className="bg-slate-50 flex flex-col">
      <Navbar showProfile={false} />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Attendance Projection</h1>
            <p className="text-slate-600 mt-2">Plan your attendance to achieve your target</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-8">

        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Select Semester</h2>
            <select 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
              value={semesterId} 
              onChange={e => setSemesterId(e.target.value)}>
              <option value="">Choose a semester</option>
              {semesters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          {semesterId && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Date Range</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date <span className="text-red-600">*</span></label>
                  <input 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-600" 
                    type="date" 
                    value={startDate}
                    disabled
                  />
                  <p className="text-xs text-slate-500 mt-1">Today's date (read-only)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date <span className="text-red-600">*</span></label>
                  <input 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    type="date" 
                    value={endDate} 
                    onChange={e => { setEndDate(e.target.value); setHasCustomEndDate(true); }}
                    onFocus={e => e.target.showPicker?.()}
                  />
                  <p className="text-xs text-slate-500 mt-1">End date is excluded from the calculation window.</p>
                  
                  {semesterId && semesters.length > 0 && (() => {
                    const semester = semesters.find(s => s._id === semesterId);
                    const today = normalizeCalendarDate(startDate);
                    
                    // Helper to format date as YYYY-MM-DD
                    const formatDate = (dateStr) => {
                      if (!dateStr) return null;
                      const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
                      if (m) return `${m[1]}-${m[2]}-${m[3]}`;
                      return toLocalDateInputValue(new Date(dateStr));
                    };
                    
                    const mid1DateFormatted = formatDate(semester?.mid1Date);
                    const mid2DateFormatted = formatDate(semester?.mid2Date);
                    const mid1Valid = mid1DateFormatted && normalizeCalendarDate(mid1DateFormatted) >= today;
                    const mid2Valid = mid2DateFormatted && normalizeCalendarDate(mid2DateFormatted) >= today;
                    
                    return (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => { if (mid1DateFormatted) { setEndDate(mid1DateFormatted); setHasCustomEndDate(true); } }}
                          disabled={!mid1Valid}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            mid1Valid 
                              ? endDate === mid1DateFormatted
                                ? 'bg-blue-600 text-white cursor-pointer' 
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 border border-gray-300 line-through cursor-not-allowed'
                          }`}
                        >
                          Mid 1
                        </button>
                        
                        <button
                          onClick={() => { if (mid2DateFormatted) { setEndDate(mid2DateFormatted); setHasCustomEndDate(true); } }}
                          disabled={!mid2Valid}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            mid2Valid 
                              ? endDate === mid2DateFormatted
                                ? 'bg-blue-600 text-white cursor-pointer' 
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 border border-gray-300 line-through cursor-not-allowed'
                          }`}
                        >
                          Mid 2
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {canShowHolidays && filteredHolidays.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Official Holidays ({filteredHolidays.length})</h2>
              <div className="space-y-3">
                {filteredHolidays.map(h=>{
                  const days = calculateDays(h.startDate, h.endDate);
                  return (
                    <div key={h._id} className="flex items-start justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900">{toTitleCase(h.name)}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {formatCalendarDisplay(h.startDate)} to {formatCalendarDisplay(h.endDate)}
                        </div>
                        <div className="text-xs font-medium text-blue-700 mt-1">{days}-day{days !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={()=>{ setEditingHoliday(h); setShowHolidayEditModal(true); }}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-100 rounded transition-colors">
                          Edit
                        </button>
                        <button 
                          onClick={()=>{ handleRemoveOfficialHoliday(h._id); }}
                          className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {canShowHolidays && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Adjustments</h2>
              <button 
                onClick={()=>{ setEditingAdjustment(null); setShowModal(true); }} 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors">
                <span className="text-lg">+</span> Add Extra Holidays or Working Days
              </button>
              
              {(extraHolidays.length > 0 || extraWorkingDays.length > 0) && (
                <div className="mt-4 space-y-2">
                  {extraHolidays.map((h, i)=>{
                    const days = calculateDays(h.startDate, h.endDate);
                    const dateStr = `${formatCalendarDisplay(h.startDate)} to ${formatCalendarDisplay(h.endDate)}`;
                    return (
                      <div key={`h-${i}`} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-slate-700">🟢 Extra Holiday</div>
                          <div className="flex gap-2">
                            <button 
                              onClick={()=>{ setEditingAdjustment({index: i, type: 'holiday', ...h}); setShowModal(true); }}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors">
                              Edit
                            </button>
                            <button 
                              onClick={()=>setExtraHolidays(extraHolidays.filter((_, idx) => idx !== i))}
                              className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-1">{dateStr}</div>
                        <div className="text-xs font-medium text-slate-500">{days}-day{days !== 1 ? 's' : ''}</div>
                      </div>
                    );
                  })}
                  {extraWorkingDays.map((w, i)=>{
                    const days = calculateDays(w.startDate, w.endDate);
                    const dateStr = `${formatCalendarDisplay(w.startDate)} to ${formatCalendarDisplay(w.endDate)}`;
                    return (
                      <div key={`w-${i}`} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-slate-700">🔴 Extra Working Day</div>
                          <div className="flex gap-2">
                            <button 
                              onClick={()=>{ setEditingAdjustment({index: i, type: 'working', ...w}); setShowModal(true); }}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors">
                              Edit
                            </button>
                            <button 
                              onClick={()=>setExtraWorkingDays(extraWorkingDays.filter((_, idx) => idx !== i))}
                              className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-1">{dateStr}</div>
                        <div className="text-xs font-medium text-slate-500">{days}-day{days !== 1 ? 's' : ''}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {canShowHolidays && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Your Attendance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Present <span className="text-red-600">*</span></label>
                  <input 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 45"
                    value={currentPresent} 
                    onChange={e=>setCurrentPresent(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Lectures <span className="text-red-600">*</span></label>
                  <input 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 60"
                    value={currentTotal} 
                    onChange={e=>setCurrentTotal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Attendance % <span className="text-red-600">*</span></label>
                  <input 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="e.g. 75"
                    value={desiredPercent} 
                    onChange={e=>setDesiredPercent(e.target.value)}
                  />
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[75, 70, 65, 60].map(p => (
                      <button 
                        key={p} 
                        onClick={()=>setDesiredPercent(p)}
                        className={`py-1.5 rounded-lg font-semibold text-sm transition-all ${desiredPercent == p ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}>
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={calculate} 
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Calculate Projection
              </button>
            </div>
          )}

          {result && (
            <div className="border-t pt-8 bg-blue-50 border-blue-200 rounded-lg p-6 -mx-8 -mb-8 px-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">Your Results</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm font-medium text-slate-600">Must Attend (remaining)</div>
                  <div className="text-3xl font-bold text-blue-600 mt-1">
                    {(() => {
                      const total = result.mustAttend || 0;
                      const days = Math.floor(total / periodsPerDay);
                      const periods = total % periodsPerDay;
                      return `${days} day${days !== 1 ? 's' : ''} and ${periods} period${periods !== 1 ? 's' : ''}`;
                    })()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm font-medium text-slate-600">Can Miss (remaining)</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">
                    {(() => {
                      const total = result.canMiss || 0;
                      const days = Math.floor(total / periodsPerDay);
                      const periods = total % periodsPerDay;
                      return `${days} day${days !== 1 ? 's' : ''} and ${periods} period${periods !== 1 ? 's' : ''}`;
                    })()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm font-medium text-slate-600">Maximum Possible</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">{result.maxPossiblePercent.toFixed(1)}%</div>
                </div>
                <div className={`rounded-lg p-4 font-semibold text-center text-white ${result.achievable ? 'bg-green-600' : 'bg-red-600'}`}>
                  {result.achievable ? '✓ Goal is achievable' : '✗ Goal may not be achievable'}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <AddExtraModal 
        isOpen={showModal} 
        onClose={()=>{ setShowModal(false); setEditingAdjustment(null); }} 
        onSubmit={(holidays, working)=>{ 
          setExtraHolidays(holidays); 
          setExtraWorkingDays(working); 
          setShowModal(false);
          setEditingAdjustment(null);
        }}
        editingAdjustment={editingAdjustment}
        currentHolidays={extraHolidays}
        currentWorking={extraWorkingDays}
      />

      <AddHolidayModal
        isOpen={showHolidayEditModal}
        onClose={()=>{ setShowHolidayEditModal(false); setEditingHoliday(null); }}
        initialData={editingHoliday}
        onSubmit={(payload) => {
          // Local-only edit for student view. Do not update database.
          if(!editingHoliday) return;
          setHolidays(prev => prev.map(h => h._id === editingHoliday._id ? { ...h, ...payload } : h));
          setShowHolidayEditModal(false);
          setEditingHoliday(null);
        }}
      />
    </div>
  )
}
