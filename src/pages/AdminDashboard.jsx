import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { fetchSemesters, fetchHolidays, createSemester, createHoliday, deleteHoliday, updateHoliday, deleteSemester, updateSemester } from '../lib/api'
import { AddSemesterModal, AddHolidayModal, ConfirmModal } from '../components/Modal'
import Navbar from '../components/Navbar'

// Helper function to capitalize first letter of each word
function toTitleCase(str){
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function formatCalendarDisplay(value){
  if(typeof value === 'string'){
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(m){
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString();
    }
  }
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString();
}

export default function AdminDashboard(){
  const { isSignedIn, user } = useUser() || {};
  const [semesters, setSemesters] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);
  const [showSemesterDeleteConfirm, setShowSemesterDeleteConfirm] = useState(false);
  const [semesterDeleteTarget, setSemesterDeleteTarget] = useState(null);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try{
      const s = await fetchSemesters();
      setSemesters(s);
    }catch(err){ }
    try{
      const h = await fetchHolidays();
      setHolidays(h);
    }catch(err){
      setHolidays([]);
    }
    setLoading(false);
  }

  async function handleAddSemester(payload){
    try{
      if(editingSemester){
        await updateSemester(editingSemester._id, payload);
        setMessage('Semester updated!');
        setEditingSemester(null);
      }else{
        await createSemester(payload);
        setMessage('Semester created!');
      }
      setShowSemesterModal(false);
      setTimeout(()=>setMessage(''), 2000);
      await load();
    }catch(err){
      setMessage('Failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      setTimeout(()=>setMessage(''), 2000);
      setShowSemesterModal(false);
      setEditingSemester(null);
    }
  }

  async function handleAddHoliday(payload){
    try{
      if(editingHoliday){
        await updateHoliday(editingHoliday._id, payload);
        setMessage('Holiday updated!');
        setEditingHoliday(null);
      }else{
        await createHoliday(payload);
        setMessage('Holiday added!');
      }
      setShowHolidayModal(false);
      setTimeout(()=>setMessage(''), 2000);
      const list = await fetchHolidays();
      setHolidays(list);
    }catch(err){
      setMessage('Failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      setTimeout(()=>setMessage(''), 2000);
      setShowHolidayModal(false);
    }
  }

  async function handleDeleteHoliday(){
    if(!deleteTarget) return;
    try{
      await deleteHoliday(deleteTarget);
      setHolidays(prev=>prev.filter(h=>h._id!==deleteTarget));
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
      setMessage('Holiday deleted!');
      setTimeout(()=>setMessage(''), 2000);
    }catch(err){
      setMessage('Failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      setTimeout(()=>setMessage(''), 2000);
    }
  }

  function openDeleteConfirm(id){
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  }

  function openSemesterDeleteConfirm(id){
    setSemesterDeleteTarget(id);
    setShowSemesterDeleteConfirm(true);
  }

  function handleEditHoliday(holiday){
    setEditingHoliday(holiday);
    setShowHolidayModal(true);
  }

  function closeHolidayModal(){
    setShowHolidayModal(false);
    setEditingHoliday(null);
  }

  function handleEditSemester(semester){
    setEditingSemester(semester);
    setShowSemesterModal(true);
  }

  async function handleDeleteSemester(){
    if(!semesterDeleteTarget) return;
    try{
      await deleteSemester(semesterDeleteTarget);
      setSemesters(prev=>prev.filter(s=>s._id!==semesterDeleteTarget));
      if(selectedSemester === semesterDeleteTarget){
        setSelectedSemester('');
        setHolidays([]);
      }
      setSemesterDeleteTarget(null);
      setShowSemesterDeleteConfirm(false);
      setMessage('Semester deleted!');
      setTimeout(()=>setMessage(''), 2000);
    }catch(err){
      setMessage('Failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      setTimeout(()=>setMessage(''), 2000);
    }
  }

  if(!isSignedIn) {
    return (
      <div className="bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Admin Access Required</h2>
            <p className="text-slate-600 mt-2">Please sign in with an admin account</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 flex flex-col">
      <Navbar showProfile={true} />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          
          {/* Page Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage semesters and holidays</p>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-sm md:text-base">
              {message}
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6 md:space-y-8">

          {/* Section 2: Manage Semesters */}
          <div className="pb-6 md:pb-8 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Semesters</h2>
              <button 
                onClick={()=>setShowSemesterModal(true)} 
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">
                <span>+</span> New Semester
              </button>
            </div>

            {loading ? (
              <div className="text-slate-500">Loading...</div>
            ) : semesters.length === 0 ? (
              <div className="text-slate-500 p-4 bg-slate-50 rounded-lg text-sm md:text-base">No semesters yet. Create one to get started.</div>
            ) : (
              <div className="space-y-2">
                {semesters.map(s => (
                  <div 
                    key={s._id} 
                    onClick={()=>setSelectedSemester(s._id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all text-sm md:text-base flex items-start justify-between gap-3 ${
                      selectedSemester === s._id 
                        ? 'bg-blue-50 border-2 border-blue-600' 
                        : 'bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
                    }`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      {(s.mid1Date || s.mid2Date) && (
                        <div className="text-xs md:text-sm text-slate-600 mt-1">
                          {s.mid1Date && s.mid2Date && (
                            <><span className="text-blue-600 font-medium">Mid 1:</span> {new Date(s.mid1Date).toLocaleDateString()} | <span className="text-blue-600 font-medium">Mid 2:</span> {new Date(s.mid2Date).toLocaleDateString()}</>
                          )}
                          {s.mid1Date && !s.mid2Date && <><span className="text-blue-600 font-medium">Mid 1:</span> {new Date(s.mid1Date).toLocaleDateString()}</>}
                          {!s.mid1Date && s.mid2Date && <><span className="text-blue-600 font-medium">Mid 2:</span> {new Date(s.mid2Date).toLocaleDateString()}</>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={e=>{ e.stopPropagation(); handleEditSemester(s); }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-blue-50 rounded transition-colors whitespace-nowrap">
                        Edit
                      </button>
                      <button
                        onClick={e=>{ e.stopPropagation(); openSemesterDeleteConfirm(s._id); }}
                        className="text-red-600 hover:text-red-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-red-50 rounded transition-colors whitespace-nowrap">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Manage Holidays */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Official Holidays (All Semesters)</h2>
              <button 
                onClick={()=>{ setEditingHoliday(null); setShowHolidayModal(true); }} 
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base">
                <span>+</span> Add Holiday
              </button>
            </div>

            {holidays.length === 0 ? (
              <div className="text-slate-500 p-4 bg-slate-50 rounded-lg text-sm md:text-base">No official holidays yet.</div>
            ) : (
              <div className="space-y-3">
                {holidays.map(h => (
                  <div key={h._id} className="flex items-start justify-between gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-sm md:text-base">{toTitleCase(h.name)}</div>
                        <div className="text-xs md:text-sm text-slate-600 mt-1">
                          {formatCalendarDisplay(h.startDate)} to {formatCalendarDisplay(h.endDate)}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={()=>handleEditHoliday(h)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-blue-50 rounded transition-colors whitespace-nowrap">
                        Edit
                      </button>
                      <button 
                        onClick={()=>openDeleteConfirm(h._id)}
                        className="text-red-600 hover:text-red-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-red-50 rounded transition-colors whitespace-nowrap">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Modals */}
      <AddSemesterModal 
        isOpen={showSemesterModal} 
        onClose={()=>{ setShowSemesterModal(false); setEditingSemester(null); }} 
        onSubmit={handleAddSemester}
        initialData={editingSemester} 
      />
      <AddHolidayModal 
        isOpen={showHolidayModal}
        initialData={editingHoliday}
        onClose={closeHolidayModal}
        onSubmit={handleAddHoliday} 
      />
      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        title="Delete Holiday" 
        message="Are you sure you want to delete this holiday?" 
        onConfirm={handleDeleteHoliday} 
        onCancel={()=>setShowDeleteConfirm(false)} 
      />
      <ConfirmModal 
        isOpen={showSemesterDeleteConfirm} 
        title="Delete Semester" 
        message="Are you sure you want to delete this semester?" 
        onConfirm={handleDeleteSemester} 
        onCancel={()=>setShowSemesterDeleteConfirm(false)} 
      />
    </div>
  )
}
